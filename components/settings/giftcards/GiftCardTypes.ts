export interface GiftCard {
  id: string;
  code: string;
  securityCode?: string;
  type: 'Digital' | 'Physical';
  balance: number;
  initialBalance: number;
  issuedDate: string;
  expirationDate?: string;
  status: 'Active' | 'Redeemed' | 'Expired';
  businessId: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  _sendViaEmail?: boolean;
  _sendViaSms?: boolean;
}

export interface GiftCardsSettingsSectionProps {
  businesses?: any[];
  giftCards?: GiftCard[];
  setGiftCards?: (cards: GiftCard[]) => void;
}

export interface NewGiftCardForm {
  type: string;
  balance: number;
  businessId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  sendViaEmail: boolean;
  sendViaSms: boolean;
  manualCode: string;
  manualSecurityCode: string;
  expirationMode: string;
  customExpirationDate: string;
}
