import { CartItem } from '../../../../types';

export interface SplitPart {
  partNumber: number;
  amount: number;
  method?: string;
  tip?: number;
  status: 'Pending' | 'Paid';
}

export interface PartialPaymentRecord {
  id: string;
  method: string;
  amount: number;
  tip?: number;
  timestamp: string;
}

export type PaymentViewMode = 'METHODS' | 'SPLIT_SETUP' | 'CARD_TAP' | 'TIP_PROMPT' | 'GIFT_CARD';

export interface PaymentModalProps {
  total: number;
  cart: CartItem[];
  onClose: () => void;
  onPay: (method: string, tipAmount?: number) => void;
  giftCards?: any[];
  setGiftCards?: any;
  initialSplitMode?: boolean;
}

