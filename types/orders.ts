export interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: 'Sale' | 'Refund' | 'Deposit';
  method: 'Card' | 'Cash' | 'Gift Card';
  employeeId: string;
  businessId?: string;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  modifiers?: string[];
  totalPrice?: number;
  productId?: string;
  seatNumber?: number;
  notes?: string;
  status?: string;
  kitchenStation?: string;
  sentAt?: string;
}

export interface Order {
  id: string;
  orderNumber?: string;
  tableId?: string;
  tableName?: string;
  guestCount?: number;
  customerId?: string;
  customerName?: string;
  items: OrderItem[];
  subtotal?: number;
  tax?: number;
  discountAmount?: number;
  tipAmount?: number;
  total: number;
  diningOption?: 'dine-in' | 'takeout' | 'delivery' | 'kiosk';
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  paymentStatus?: 'PENDING' | 'PARTIALLY_PAID' | 'PAID' | 'REFUNDED';
  paymentMethod?: string;
  createdAt?: string;
}

export interface DetailedOrder {
  id: string;
  date: string;
  time: string;
  total: number;
  status: 'Paid' | 'Refunded' | 'Void' | 'Partially Refunded' | 'Open';
  paymentMethod: 'Visa' | 'MasterCard' | 'AmEx' | 'Discover' | 'Cash' | 'Gift Card' | 'Card';
  cardLast4?: string;
  employeeName: string;
  device: string;
  type: 'Dine-in' | 'Takeout' | 'Delivery';
  items: OrderItem[];
  fees?: number;
  tip?: number;
  discount?: number;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  color: string;
}

export type CourseType = 'Appetizer' | 'Entree' | 'Dessert' | 'Beverage';

export interface CartItem extends MenuItem {
  cartId?: string;
  quantity: number;
  modifiers?: string[];
  discount?: { type: 'Percentage' | 'Fixed'; value: number; name: string };
  specialRequest?: string;
  seatId?: number;
  course?: CourseType;
  isFired?: boolean;
  isVoided?: boolean;
  voidReason?: string;
  printerLabels?: string[];
}

export interface PaymentSplit {
  method: string;
  amount: number;
  status: string;
  tip?: number;
}

export interface Receipt {
  id: string;
  orderId: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  payments: PaymentSplit[];
  timestamp: string;
  merchantName: string;
  merchantAddress: string;
  orderType?: 'Dine-in' | 'Takeout';
}

export interface ReceiptSettings {
  showTax: boolean;
  headerText?: string;
  footerText?: string;
}

export interface DigitalReceiptConfig {
  emailEnabled: boolean;
  smsEnabled: boolean;
  qrEnabled: boolean;
  includeFeedback: boolean;
}

export interface Feedback {
  id: string;
  customerId?: string;
  customerName?: string;
  rating: number;
  comment: string;
  tags?: string[];
  timestamp: string;
}

export interface FeedbackSettings {
  enabled?: boolean;
  googleReviewUrl?: string;
  publicReviewUrl?: string;
  minRatingForPublic?: number;
  autoSendSms?: boolean;
  fiveStarMessage?: string;
  lowStarMessage?: string;
}

export interface SmartTipSuggestion {
  percentage: number;
  amount: number;
}

export interface TipConfig {
  enabled: boolean;
  defaultPercentage: number;
  suggestedPercentages: number[];
  allowCustom: boolean;
  autoGratuityEnabled?: boolean;
  autoGratuityRate?: number;
  autoGratuityMinPartySize?: number;
  serviceFeeEnabled?: boolean;
  serviceFeeName?: string;
  serviceFeeType?: 'Percentage' | 'Fixed';
  serviceFeeValue?: number;
}

export interface PostPaymentTipRequest {
  transactionId: string;
  amount: number;
}
