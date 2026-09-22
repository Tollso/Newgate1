import { Employee } from '../../../types/business';

export interface RetailCartItem {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  variantLabel?: string;
  sku: string;
  barcode: string;
  price: number;
  quantity: number;
}

export interface RetailPOSProps {
  currentUser: Employee;
  onExit: () => void;
  onOpenReturns?: () => void;
  onRequireManagerPin?: (action: string, callback: () => void) => void;
}
