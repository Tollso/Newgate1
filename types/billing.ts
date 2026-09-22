/**
 * Billing Core Types
 * Shared billing engine for recurring donations, memberships, and invoices (Section 10).
 */

export interface CustomerBillingProfile {
  id: string;
  merchantId: string;
  customerId: string; // or donorId
  email: string;
  name: string;
  defaultPaymentTokenId?: string;
  savedPaymentTokens: PaymentMethodToken[];
  createdAt: string;
}

export interface PaymentMethodToken {
  id: string;
  merchantId: string;
  customerProfileId: string;
  processor: 'STRIPE' | 'CLOVER' | 'SQUARE' | 'TSYS' | 'FIRST_DATA';
  token: string; // Vault token reference
  cardBrand: 'VISA' | 'MASTERCARD' | 'AMEX' | 'DISCOVER';
  last4: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
  createdAt: string;
}

export interface BillingSubscription {
  id: string;
  merchantId: string;
  customerProfileId: string;
  customerName: string;
  planName: string;
  amount: number;
  interval: 'MONTHLY' | 'QUARTERLY' | 'ANNUAL';
  paymentTokenId: string;
  status: 'ACTIVE' | 'PAST_DUE' | 'CANCELLED' | 'PAUSED';
  nextBillingDate: string;
  retryAttempts: number;
  lastBilledDate?: string;
  metadata?: Record<string, any>;
}

export interface BillingInvoice {
  id: string;
  invoiceNumber: string;
  merchantId: string;
  customerProfileId: string;
  customerName: string;
  customerEmail: string;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  dueDate: string;
  paidAt?: string;
  paymentReference?: string;
  notes?: string;
  createdAt: string;
}
