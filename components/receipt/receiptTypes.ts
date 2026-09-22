export type ReceiptDeliveryOption = 'PRINT' | 'EMAIL' | 'SMS' | 'NONE';

export interface ReceiptItemSummary {
  name: string;
  qty: number;
  price: number;
}

export interface ReceiptOrderContext {
  orderNumber?: string;
  orderId?: string;
  total: number;
  subtotal?: number;
  tax?: number;
  tip?: number;
  paymentMethod: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  items?: ReceiptItemSummary[];
  tableTentOrName?: string;
  appName: 'Kiosk' | 'Register' | 'Dining App' | string;
}

export interface ReceiptPromptModalProps {
  isOpen: boolean;
  orderContext: ReceiptOrderContext;
  onComplete: (option: ReceiptDeliveryOption, destination?: string) => void;
  onClose?: () => void;
}
