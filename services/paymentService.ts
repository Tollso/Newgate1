/**
 * PaymentService
 * Processor-agnostic payment orchestration, capture, split payments, refunds, tips, and reconciliation.
 */

import { CanonicalPayment, PaymentMethodType, PaymentStatus } from '../src/domain/types';
import { Money } from '../src/domain/money';
import { IPaymentProcessorAdapter, SimulatedTerminalAdapter } from './paymentProcessorAdapter';
import { AuditService } from './auditService';
import { DataRepository } from '../src/repositories/persistence/DataRepository';
import { ChargesEngine } from './chargesEngine';

export interface ProcessPaymentParams {
  orderId: string;
  method: PaymentMethodType;
  amount: number; // Dollars
  tipAmount?: number;
  cashTendered?: number;
  cardToken?: string;
  employeeId: string;
  employeeName?: string;
  merchantId?: string;
  locationId?: string;
  deviceId?: string;
  idempotencyKey?: string;
}

export interface RefundPaymentParams {
  paymentId: string;
  amount?: number; // Dollars. If omitted, full refund
  reason?: string;
  employeeId: string;
  employeeName?: string;
  authorizedByManagerId?: string;
}

export class PaymentService {
  private static processor: IPaymentProcessorAdapter = new SimulatedTerminalAdapter();
  private static paymentRepo = new DataRepository<CanonicalPayment & { id: string }>('payments');
  private static processedIdempotencyKeys = new Set<string>();

  /**
   * Configure custom processor adapter (e.g. Finix, Stripe)
   */
  static setProcessor(adapter: IPaymentProcessorAdapter) {
    this.processor = adapter;
  }

  static getProcessorName(): string {
    return this.processor.name;
  }

  /**
   * Process a payment tender on an order
   */
  static async processPayment(params: ProcessPaymentParams): Promise<CanonicalPayment> {
    const idempotencyKey = params.idempotencyKey || `${params.deviceId || 'DEV'}:${params.orderId}:${Date.now()}`;

    if (this.processedIdempotencyKeys.has(idempotencyKey)) {
      const existing = await this.paymentRepo.find({
        where: { idempotencyKey: idempotencyKey } as any,
      });
      if (existing.length > 0) {
        return existing[0];
      }
    }

    const principal = Money.fromDollars(params.amount);
    const tip = Money.fromDollars(params.tipAmount || 0);

    // Calculate Credit Card Fee only for credit card tenders (P0 requirement)
    let creditCardFee = Money.zero();
    if (params.method === 'CREDIT_CARD' || params.method === 'CARD') {
      try {
        const feeConfig = await ChargesEngine.getCreditCardFeeConfig(params.merchantId || 'M001');
        if (feeConfig && feeConfig.enabled) {
          creditCardFee = ChargesEngine.calculatePaymentCardFee(principal.toDollars(), 'CARD', feeConfig);
        }
      } catch (e) {
        console.warn('[PaymentService] Error calculating card fee:', e);
      }
    }

    const total = principal.add(tip).add(creditCardFee);

    let status: PaymentStatus = 'CAPTURED';
    let cardBrand: string | undefined;
    let cardLast4: string | undefined;
    let authCode: string | undefined;
    let transactionRef: string | undefined;
    let cashChange: number | undefined;

    // Cash transaction handling
    if (params.method === 'CASH') {
      const tendered = params.cashTendered ? Money.fromDollars(params.cashTendered) : total;
      if (tendered.cents < total.cents) {
        throw new Error(`Insufficient cash tendered: ${tendered.format()} tendered for ${total.format()} total.`);
      }
      cashChange = tendered.subtract(total).toDollars();
      transactionRef = `CASH-${Date.now()}`;
    } else if (params.method === 'CREDIT_CARD' || params.method === 'DEBIT_CARD' || params.method === 'MOBILE_PAY') {
      // Delegate to processor adapter
      const chargeRes = await this.processor.charge({
        amountCents: principal.cents,
        currency: 'USD',
        paymentMethod: params.method,
        cardToken: params.cardToken,
        tipAmountCents: tip.cents,
        idempotencyKey,
        metadata: { orderId: params.orderId, employeeId: params.employeeId },
      });

      if (!chargeRes.success) {
        status = 'FAILED';
        throw new Error(chargeRes.errorMessage || 'Card transaction was declined by processor.');
      }

      transactionRef = chargeRes.transactionId;
      authCode = chargeRes.authCode;
      cardBrand = chargeRes.cardBrand;
      cardLast4 = chargeRes.cardLast4;
    } else {
      transactionRef = `REF-${Date.now()}`;
    }

    const payment: CanonicalPayment = {
      id: `pay-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      orderId: params.orderId,
      method: params.method,
      amount: principal.toDollars(),
      tipAmount: tip.toDollars(),
      creditCardFee: creditCardFee.toDollars(),
      totalAmount: total.toDollars(),
      status: status,
      cashTendered: params.cashTendered,
      cashChange: cashChange,
      cardBrand: cardBrand,
      cardLast4: cardLast4,
      authCode: authCode,
      transactionRef: transactionRef,
      processorName: this.processor.name,
      idempotencyKey: idempotencyKey,
      createdAt: new Date().toISOString(),
      employeeId: params.employeeId,
      merchantId: params.merchantId || 'M001',
      locationId: params.locationId || 'LOC-1',
      deviceId: params.deviceId,
    };

    this.processedIdempotencyKeys.add(idempotencyKey);
    await this.paymentRepo.upsert(payment);

    await AuditService.log({
      actorId: params.employeeId,
      actorName: params.employeeName || 'Staff',
      action: 'PAYMENT_CAPTURED',
      targetType: 'PAYMENT',
      targetId: payment.id,
      details: {
        orderId: params.orderId,
        method: params.method,
        amount: payment.amount,
        tip: payment.tipAmount,
        creditCardFee: payment.creditCardFee,
        total: payment.totalAmount,
      },
      merchantId: params.merchantId,
      locationId: params.locationId,
    });

    return payment;
  }

  /**
   * Refund an existing payment (full or partial)
   */
  static async refundPayment(params: RefundPaymentParams): Promise<CanonicalPayment> {
    const payment = await this.paymentRepo.findById(params.paymentId);
    if (!payment) {
      throw new Error(`Payment with ID ${params.paymentId} not found.`);
    }

    const refundAmountDollars = params.amount || payment.amount;
    const refundMoney = Money.fromDollars(refundAmountDollars);

    if (refundMoney.cents > Money.fromDollars(payment.amount).cents) {
      throw new Error(`Refund amount cannot exceed captured amount of ${payment.amount}.`);
    }

    if (payment.method === 'CREDIT_CARD' || payment.method === 'DEBIT_CARD' || payment.method === 'MOBILE_PAY') {
      if (payment.transactionRef) {
        await this.processor.refund({
          transactionId: payment.transactionRef,
          amountCents: refundMoney.cents,
          currency: 'USD',
          reason: params.reason,
          idempotencyKey: `ref-${payment.id}-${Date.now()}`,
        });
      }
    }

    payment.status = 'REFUNDED';
    await this.paymentRepo.upsert(payment);

    await AuditService.log({
      actorId: params.employeeId,
      actorName: params.employeeName || 'Staff',
      action: 'PAYMENT_REFUNDED',
      targetType: 'PAYMENT',
      targetId: payment.id,
      approvedByManagerId: params.authorizedByManagerId,
      approvalReason: params.reason,
      requiresApproval: !!params.authorizedByManagerId,
      details: {
        orderId: payment.orderId,
        refundAmount: refundAmountDollars,
        reason: params.reason,
      },
      merchantId: payment.merchantId,
      locationId: payment.locationId,
    });

    return payment;
  }

  /**
   * Get payments by Order ID
   */
  static async getPaymentsForOrder(orderId: string): Promise<CanonicalPayment[]> {
    return this.paymentRepo.find({
      where: { orderId } as any,
    });
  }

  /**
   * Reconcile payments on an order and calculate totals
   */
  static reconcileOrderPayments(orderTotalDollars: number, payments: CanonicalPayment[]) {
    const orderTotal = Money.fromDollars(orderTotalDollars);
    let totalPaid = Money.zero();
    let totalTips = Money.zero();

    for (const p of payments) {
      if (p.status === 'CAPTURED') {
        totalPaid = totalPaid.add(Money.fromDollars(p.amount));
        totalTips = totalTips.add(Money.fromDollars(p.tipAmount || 0));
      }
    }

    const balanceDue = orderTotal.subtract(totalPaid);

    return {
      orderTotal: orderTotal.toDollars(),
      totalPaid: totalPaid.toDollars(),
      totalTips: totalTips.toDollars(),
      balanceDue: Math.max(0, balanceDue.toDollars()),
      isFullyPaid: balanceDue.cents <= 0,
    };
  }
}
