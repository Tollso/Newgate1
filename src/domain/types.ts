/**
 * Canonical Domain Types for Newgate POS
 * Core domain abstractions for orders, payments, inventory movements, and system states.
 */

export type CanonicalOrderStatus = 
  | 'DRAFT'
  | 'OPEN'
  | 'SENT_TO_KITCHEN'
  | 'PREPARING'
  | 'READY'
  | 'SERVED'
  | 'PAID'
  | 'COMPLETED'
  | 'VOIDED'
  | 'REFUNDED';

export type CanonicalOrderType = 'DINE_IN' | 'TAKEOUT' | 'DELIVERY' | 'DRIVE_THRU' | 'KIOSK' | 'BAR' | 'RETAIL';

export interface CanonicalModifier {
  id: string;
  name: string;
  priceDelta: number; // in dollars
  category?: string;
}

export interface CanonicalOrderItem {
  id: string;
  productId: string;
  name: string;
  category?: string;
  sku?: string;
  quantity: number;
  unitPrice: number;
  modifiers: CanonicalModifier[];
  discountsTotal: number;
  taxAmount: number;
  totalPrice: number;
  seatNumber?: number | string;
  notes?: string;
  status: 'PENDING' | 'SENT' | 'PREPARING' | 'READY' | 'SERVED' | 'VOIDED';
  kitchenStation?: string;
  stationIds?: string[];
  deliveryPolicy?: 'KDS_ONLY' | 'PRINTER_ONLY' | 'BOTH';
  sentAt?: string;
}

export interface CanonicalDiscount {
  id: string;
  name: string;
  type: 'PERCENTAGE' | 'FIXED' | 'BOGO' | 'CUSTOM';
  value: number;
  amountApplied: number;
  requiresManagerApproval?: boolean;
  approvedBy?: string;
  reason?: string;
}

export type PaymentMethodType = 
  | 'CASH' 
  | 'CREDIT_CARD' 
  | 'DEBIT_CARD' 
  | 'GIFT_CARD' 
  | 'CARD'
  | 'CHECK'
  | 'INVOICE'
  | 'STORE_CREDIT'
  | 'CUSTOM'
  | 'SPLIT' 
  | 'HOUSE_ACCOUNT' 
  | 'EXTERNAL_GATEWAY' 
  | 'MOBILE_PAY';

export type PaymentStatus = 'PENDING' | 'AUTHORIZED' | 'CAPTURED' | 'REFUNDED' | 'VOIDED' | 'FAILED';

export interface CanonicalPayment {
  id: string;
  orderId: string;
  method: PaymentMethodType;
  amount: number; // Principal amount
  tipAmount: number;
  creditCardFee?: number; // Distinct credit-card fee if applicable
  totalAmount: number; // Principal + Tip + Fee
  status: PaymentStatus;
  cashTendered?: number;
  cashChange?: number;
  cardBrand?: string;
  cardLast4?: string;
  authCode?: string;
  transactionRef?: string;
  processorName?: string;
  isOffline?: boolean;
  idempotencyKey: string;
  createdAt: string;
  employeeId: string;
  locationId?: string;
  merchantId?: string;
  deviceId?: string;
}

export interface CanonicalOrderSplit {
  splitId: string;
  name: string;
  itemIds: string[];
  subtotal: number;
  tax: number;
  discounts: number;
  total: number;
  isPaid: boolean;
  payments: CanonicalPayment[];
}

export interface CanonicalOrder {
  id: string;
  orderNumber: string;
  merchantId: string;
  locationId: string;
  deviceId?: string;
  employeeId: string;
  employeeName?: string;
  status: CanonicalOrderStatus;
  orderType: CanonicalOrderType;
  tableId?: string;
  tableName?: string;
  guestCount?: number;
  customerId?: string;
  customerName?: string;
  items: CanonicalOrderItem[];
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  tipTotal: number;
  serviceChargeTotal?: number;
  gratuityTotal?: number;
  creditCardFeeTotal?: number;
  appliedChargeRules?: string[];
  totalAmount: number;
  totalPaid: number;
  balanceDue: number;
  payments: CanonicalPayment[];
  discounts: CanonicalDiscount[];
  splits?: CanonicalOrderSplit[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
}

export type StockMovementType = 
  | 'SALE' 
  | 'SALE_RETURN' 
  | 'RETURN'
  | 'PURCHASE_RECEIPT' 
  | 'PURCHASE_RECEIVE'
  | 'WASTE_SPOILAGE' 
  | 'ADJUSTMENT' 
  | 'AUDIT' 
  | 'TRANSFER_IN' 
  | 'TRANSFER_OUT';

export interface CanonicalStockMovement {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  type: StockMovementType;
  quantityChange: number; // positive or negative
  previousStock: number;
  newStock: number;
  reason?: string;
  orderId?: string;
  employeeId: string;
  employeeName?: string;
  locationId: string;
  merchantId: string;
  timestamp: string;
}

export interface CanonicalAuditLog {
  id: string;
  merchantId: string;
  locationId: string;
  actorId: string;
  actorName: string;
  action: string;
  targetType: string;
  targetId?: string;
  details?: Record<string, any>;
  requiresApproval?: boolean;
  approvedByManagerId?: string;
  approvedByManagerName?: string;
  approvalReason?: string;
  timestamp: string;
  status: 'EXECUTED' | 'REJECTED' | 'PENDING_APPROVAL';
}
