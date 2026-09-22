/**
 * Payment Processor Adapter Interface
 * Decouples core payment orchestration from any specific processor (Finix, Stripe, Local/Simulator).
 */

export interface ProcessorPaymentRequest {
  amountCents: number;
  currency: string;
  paymentMethod: 'CREDIT_CARD' | 'DEBIT_CARD' | 'GIFT_CARD' | 'MOBILE_PAY';
  cardToken?: string;
  tipAmountCents?: number;
  idempotencyKey: string;
  metadata?: Record<string, any>;
}

export interface ProcessorPaymentResponse {
  success: boolean;
  transactionId: string;
  authCode?: string;
  cardBrand?: string;
  cardLast4?: string;
  processorName: string;
  errorMessage?: string;
  rawResponse?: any;
}

export interface ProcessorRefundRequest {
  transactionId: string;
  amountCents: number;
  currency: string;
  reason?: string;
  idempotencyKey: string;
}

export interface ProcessorRefundResponse {
  success: boolean;
  refundId: string;
  processorName: string;
  errorMessage?: string;
}

export interface IPaymentProcessorAdapter {
  readonly name: string;
  charge(request: ProcessorPaymentRequest): Promise<ProcessorPaymentResponse>;
  refund(request: ProcessorRefundRequest): Promise<ProcessorRefundResponse>;
  void(transactionId: string): Promise<boolean>;
}

/**
 * Standard Simulated Hardware Terminal / EMV PinPad Adapter
 */
export class SimulatedTerminalAdapter implements IPaymentProcessorAdapter {
  readonly name = 'SimulatedTerminal';

  async charge(request: ProcessorPaymentRequest): Promise<ProcessorPaymentResponse> {
    // Simulate brief card dip/tap latency
    await new Promise(resolve => setTimeout(resolve, 300));

    const brands = ['VISA', 'MASTERCARD', 'AMEX', 'DISCOVER'];
    const cardBrand = brands[Math.floor(Math.random() * brands.length)];
    const cardLast4 = Math.floor(1000 + Math.random() * 9000).toString();
    const authCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    return {
      success: true,
      transactionId,
      authCode,
      cardBrand,
      cardLast4,
      processorName: this.name,
    };
  }

  async refund(request: ProcessorRefundRequest): Promise<ProcessorRefundResponse> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return {
      success: true,
      refundId: `ref_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      processorName: this.name,
    };
  }

  async void(transactionId: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 150));
    return true;
  }
}
