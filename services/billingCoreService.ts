/**
 * BillingCoreService
 * Shared billing engine for recurring donations, memberships, subscriptions, and invoicing (Section 10).
 * Enforces: NO RAW CARD DATA STORED; only token references.
 */

import {
  CustomerBillingProfile,
  PaymentMethodToken,
  BillingSubscription,
  BillingInvoice,
} from '../types/billing';
import { DataRepository } from '../src/repositories/persistence/DataRepository';
import { AuditService } from './auditService';
import { Money } from '../src/domain/money';

export class BillingCoreService {
  private static profileRepo = new DataRepository<CustomerBillingProfile & { id: string }>('billing_profiles');
  private static subRepo = new DataRepository<BillingSubscription & { id: string }>('billing_subscriptions');
  private static invoiceRepo = new DataRepository<BillingInvoice & { id: string }>('billing_invoices');

  /**
   * Save a vaulted payment token (NO raw card data stored)
   */
  static async addPaymentToken(params: {
    merchantId: string;
    customerProfileId: string;
    tokenReference: string;
    cardBrand: 'VISA' | 'MASTERCARD' | 'AMEX' | 'DISCOVER';
    last4: string;
    expiryMonth: number;
    expiryYear: number;
  }): Promise<PaymentMethodToken> {
    const tokenObj: PaymentMethodToken = {
      id: `tok-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      merchantId: params.merchantId,
      customerProfileId: params.customerProfileId,
      processor: 'TSYS',
      token: params.tokenReference,
      cardBrand: params.cardBrand,
      last4: params.last4,
      expiryMonth: params.expiryMonth,
      expiryYear: params.expiryYear,
      isDefault: true,
      createdAt: new Date().toISOString(),
    };

    let profile = await this.profileRepo.findById(params.customerProfileId);
    if (!profile) {
      profile = {
        id: params.customerProfileId,
        merchantId: params.merchantId,
        customerId: params.customerProfileId,
        email: '',
        name: 'Customer/Donor',
        savedPaymentTokens: [],
        createdAt: new Date().toISOString(),
      };
    }

    profile.savedPaymentTokens.push(tokenObj);
    profile.defaultPaymentTokenId = tokenObj.id;
    await this.profileRepo.upsert(profile);

    return tokenObj;
  }

  /**
   * Create a recurring subscription / recurring giving schedule
   */
  static async createSubscription(params: {
    merchantId: string;
    customerProfileId: string;
    customerName: string;
    planName: string;
    amount: number;
    interval: 'MONTHLY' | 'QUARTERLY' | 'ANNUAL';
    paymentTokenId: string;
  }): Promise<BillingSubscription> {
    const sub: BillingSubscription = {
      id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      merchantId: params.merchantId,
      customerProfileId: params.customerProfileId,
      customerName: params.customerName,
      planName: params.planName,
      amount: params.amount,
      interval: params.interval,
      paymentTokenId: params.paymentTokenId,
      status: 'ACTIVE',
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      retryAttempts: 0,
    };

    await this.subRepo.upsert(sub);

    await AuditService.log({
      actorId: params.customerProfileId,
      actorName: params.customerName,
      action: 'SUBSCRIPTION_CREATED',
      targetType: 'SUBSCRIPTION',
      targetId: sub.id,
      details: { amount: sub.amount, interval: sub.interval, plan: sub.planName },
    });

    return sub;
  }

  /**
   * Create and send an invoice
   */
  static async createInvoice(invoiceData: Omit<BillingInvoice, 'id' | 'invoiceNumber' | 'createdAt'>): Promise<BillingInvoice> {
    const invNum = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const invoice: BillingInvoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: invNum,
      ...invoiceData,
      createdAt: new Date().toISOString(),
    };

    await this.invoiceRepo.upsert(invoice);
    return invoice;
  }

  static async listInvoices(merchantId: string = 'M001'): Promise<BillingInvoice[]> {
    return this.invoiceRepo.find();
  }

  static async listSubscriptions(merchantId: string = 'M001'): Promise<BillingSubscription[]> {
    return this.subRepo.find();
  }
}
