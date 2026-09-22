/**
 * ChargesEngine
 * Handles Restaurant Charges, Tips, Service Charges, Gratuities, and Super-Admin controlled Credit Card Fees.
 * Implements Section 7 of the Newgate Platform Architecture.
 */

import { Money } from '../src/domain/money';
import { CanonicalOrder, CanonicalPayment } from '../src/domain/types';
import { AuditService } from './auditService';
import { DataRepository } from '../src/repositories/persistence/DataRepository';
import { JurisdictionComplianceService, ComplianceStatus } from './jurisdictionComplianceService';

export interface CreditCardFeeConfig {
  merchantId: string;
  enabled: boolean;
  ratePercentage: number; // e.g. 2.85%
  fixedAmountDollars: number; // e.g. $0.30
  labelOnReceipt: string; // e.g. "Credit Card Surcharge"
  lastUpdatedBySuperAdminId: string;
  lastUpdatedDate: string;
  notes?: string;
  reviewStatus: ComplianceStatus | 'APPROVED' | 'PENDING_REVIEW' | 'FLAGGED';
  jurisdictionWarning?: string;
  stateCode?: string;
}

export interface ServiceChargeRule {
  id: string;
  name: string;
  type: 'PERCENTAGE' | 'FIXED';
  value: number;
  condition: {
    minPartySize?: number;
    orderTypes?: ('DINE_IN' | 'TAKEOUT' | 'DELIVERY' | 'KIOSK')[];
    minSubtotal?: number;
    isAutoGratuity?: boolean;
  };
  enabled: boolean;
}

export interface CalculatedCharges {
  subtotal: Money;
  tax: Money;
  gratuity: Money;
  serviceCharge: Money;
  creditCardFee: Money;
  totalWithCharges: Money;
  appliedRules: string[];
}

export class ChargesEngine {
  private static ccFeeRepo = new DataRepository<CreditCardFeeConfig & { id: string }>('credit_card_fee_config');
  private static serviceRulesRepo = new DataRepository<ServiceChargeRule & { id: string }>('service_charge_rules');

  private static defaultServiceRules: ServiceChargeRule[] = [
    {
      id: 'rule-autograt-6',
      name: 'Auto Gratuity (Party >= 6)',
      type: 'PERCENTAGE',
      value: 18.0,
      condition: { minPartySize: 6, isAutoGratuity: true, orderTypes: ['DINE_IN'] },
      enabled: true,
    },
    {
      id: 'rule-dinein-service',
      name: 'Hospitality Service Fee',
      type: 'PERCENTAGE',
      value: 3.0,
      condition: { minSubtotal: 0, orderTypes: ['DINE_IN'] },
      enabled: false,
    },
  ];

  /**
   * Evaluates operational charges (Gratuity, Service Charge) on an order
   */
  static async evaluateOrderCharges(order: Partial<CanonicalOrder> & { guestCount?: number; subtotal: number; orderType: any }): Promise<CalculatedCharges> {
    const subtotal = Money.fromDollars(order.subtotal || 0);
    const tax = Money.fromDollars(order.taxTotal || 0);

    let gratuity = Money.zero();
    let serviceCharge = Money.zero();
    const appliedRules: string[] = [];

    const partySize = order.guestCount || 1;
    const rules = await this.getServiceChargeRules();

    for (const rule of rules) {
      if (!rule.enabled) continue;

      let matches = true;
      if (rule.condition.minPartySize && partySize < rule.condition.minPartySize) {
        matches = false;
      }
      if (rule.condition.orderTypes && !rule.condition.orderTypes.includes(order.orderType)) {
        matches = false;
      }
      if (rule.condition.minSubtotal && subtotal.toDollars() < rule.condition.minSubtotal) {
        matches = false;
      }

      if (matches) {
        const feeAmount = rule.type === 'PERCENTAGE'
          ? subtotal.multiply(rule.value / 100)
          : Money.fromDollars(rule.value);

        if (rule.condition.isAutoGratuity) {
          gratuity = gratuity.add(feeAmount);
        } else {
          serviceCharge = serviceCharge.add(feeAmount);
        }
        appliedRules.push(`${rule.name}: $${feeAmount.toDollars().toFixed(2)}`);
      }
    }

    const totalWithCharges = subtotal.add(tax).add(gratuity).add(serviceCharge);

    return {
      subtotal,
      tax,
      gratuity,
      serviceCharge,
      creditCardFee: Money.zero(), // CC Fee evaluated on payment tender
      totalWithCharges,
      appliedRules,
    };
  }

  /**
   * Authority Rule: Super Admin alone can configure the Credit Card Fee.
   */
  static async setCreditCardFeeConfig(
    config: CreditCardFeeConfig,
    actorRole: string,
    actorId: string
  ): Promise<CreditCardFeeConfig> {
    if (actorRole !== 'SUPER_ADMIN') {
      throw new Error('AUTHORITY VIOLATION: Only Newgate Super Admin can configure Credit Card Fee policy.');
    }

    // Jurisdiction compliance check
    const compliance = JurisdictionComplianceService.evaluateSurcharge(
      config.ratePercentage,
      config.stateCode || 'DEFAULT'
    );

    const warnings = compliance.warnings.join(' | ');

    const updatedConfig: CreditCardFeeConfig = {
      ...config,
      jurisdictionWarning: warnings,
      lastUpdatedBySuperAdminId: actorId,
      lastUpdatedDate: new Date().toISOString(),
      reviewStatus: compliance.status,
    };

    await this.ccFeeRepo.upsert({ id: `cc_fee_${config.merchantId}`, ...updatedConfig });

    await AuditService.log({
      actorId,
      actorName: 'Super Admin',
      action: 'CREDIT_CARD_FEE_CONFIGURED',
      targetType: 'MERCHANT_POLICY',
      targetId: config.merchantId,
      details: {
        rate: config.ratePercentage,
        enabled: config.enabled,
        complianceStatus: compliance.status,
        warnings: compliance.warnings,
      },
    });

    return updatedConfig;
  }

  static async getCreditCardFeeConfig(merchantId: string = 'M001'): Promise<CreditCardFeeConfig> {
    const res = await this.ccFeeRepo.findById(`cc_fee_${merchantId}`);
    if (res) return res;

    return {
      merchantId,
      enabled: false,
      ratePercentage: 2.75,
      fixedAmountDollars: 0.15,
      labelOnReceipt: 'Card Processing Surcharge',
      lastUpdatedBySuperAdminId: 'SUPER_ADMIN',
      lastUpdatedDate: new Date().toISOString(),
      reviewStatus: 'APPROVED',
      jurisdictionWarning: 'Disclosure required on all card payments.',
    };
  }

  /**
   * Split-tender aware Credit Card Fee calculation.
   * Cash/GiftCard portions never inherit the card fee!
   */
  static calculatePaymentCardFee(
    paymentAmountDollars: number,
    paymentMethod: 'CASH' | 'CARD' | 'GIFT_CARD' | 'OTHER',
    config: CreditCardFeeConfig
  ): Money {
    if (!config.enabled || paymentMethod !== 'CARD') {
      return Money.zero();
    }

    const base = Money.fromDollars(paymentAmountDollars);
    const percentFee = base.multiply(config.ratePercentage / 100);
    const fixedFee = Money.fromDollars(config.fixedAmountDollars || 0);

    return percentFee.add(fixedFee);
  }

  static async getServiceChargeRules(): Promise<ServiceChargeRule[]> {
    const list = await this.serviceRulesRepo.find();
    if (list.length === 0) {
      for (const r of this.defaultServiceRules) {
        await this.serviceRulesRepo.upsert(r);
      }
      return this.defaultServiceRules;
    }
    return list;
  }
}
