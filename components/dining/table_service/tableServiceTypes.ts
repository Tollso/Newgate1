import { DiningTable, DiningOrderItem, KitchenTicket, Employee, TipConfig, GlobalTaxConfig } from '../../../types';
import { PreAuthData } from '../PreAuthModal';

export interface ActiveTableOrderData {
  items: DiningOrderItem[];
  guests: { id: number; name?: string }[];
  orderType?: 'Dine In' | 'To Go' | 'Delivery';
  payments?: { amount: number; method: string }[];
  preAuthInfo?: PreAuthData;
  autoGratuityApplied?: boolean;
  serviceFeeApplied?: boolean;
}

export interface UseTableServiceProps {
  tables: DiningTable[];
  currentUser: Employee;
  onExit: () => void;
  onFireToKitchen?: (ticket: KitchenTicket) => void;
  activeTableOrders: Record<string, ActiveTableOrderData>;
  onUpdateTableOrder: (tableId: string, data: ActiveTableOrderData | undefined) => void;
  onUpdateTableStatus: (table: DiningTable) => void;
  onProcessSale?: (cart: any[], total: number, paymentMethod: string, existingOrderId?: string, tip?: number, discount?: number) => void;
  kitchenTickets?: KitchenTicket[];
  onTicketStatusChange?: (ticketId: string, status: 'Pending' | 'Prep' | 'Ready' | 'Delivered') => void;
  tipConfig?: TipConfig;
  taxConfig?: GlobalTaxConfig;
}
