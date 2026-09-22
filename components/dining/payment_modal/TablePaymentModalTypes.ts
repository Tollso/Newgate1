import { DiningTable, DiningOrderItem } from '../../../types';
import { PreAuthData } from '../PreAuthModal';

export interface TableServicePaymentModalProps {
  showPayment: boolean;
  setShowPayment: (val: boolean) => void;
  tableCardPaymentStep: 'NONE' | 'TAP' | 'TIP' | 'GIFT_CARD';
  setTableCardPaymentStep: (val: 'NONE' | 'TAP' | 'TIP' | 'GIFT_CARD') => void;
  tableSelectedTip: number;
  setTableSelectedTip: (val: number) => void;
  tableCustomTipInput: string;
  setTableCustomTipInput: (val: string) => void;
  total: number;
  activeTable: DiningTable | undefined;
  billDiscount: { type: 'Percentage' | 'Fixed'; value: number; name: string } | null;
  setShowDiscountModal: (val: boolean) => void;
  handleCloseCheck: (paymentMethod: string, tipAmount?: number, amountPaid?: number) => void;
  handleSplitCheck: () => void;
  giftCards?: any[];
  setGiftCards?: any;
  orderItems: DiningOrderItem[];
  guests: { id: number; name?: string }[];
  preAuthInfo?: PreAuthData | null;
  totals?: {
    subtotal: number;
    tax: number;
    discountAmount: number;
    autoGratuityAmount: number;
    serviceFeeAmount: number;
    total: number;
    totalPaidSoFar: number;
    remainingTotal: number;
  };
  serviceFeeName?: string;
  taxRate?: number;
  initialPaymentMode?: 'SELECT' | 'SPLIT_EVEN' | 'SPLIT_GUEST' | 'SPLIT_ITEM';
}

export interface SplitCheckItem {
  id: string;
  name: string;
  items: { cartId: string; qty: number }[];
  paid: boolean;
}
