import { DiningTable, InventoryItem, Category, DiningOrderItem } from '../../../types';
import { PreAuthData } from '../PreAuthModal';

export interface TableServiceOrderPanelProps {
  table: DiningTable;
  orderItems: DiningOrderItem[];
  guests: { id: number; name?: string }[];
  activeSeat: number;
  setActiveSeat: (seat: number) => void;
  inventory: InventoryItem[];
  categories: Category[];
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  searchTerm: string;
  setSearchTerm: (s: string) => void;
  onBackToFloor: () => void;
  onAddToOrder: (item: InventoryItem) => void;
  onFire: () => void;
  onOpenPayment: (initialMode?: 'SELECT' | 'SPLIT_EVEN' | 'SPLIT_GUEST' | 'SPLIT_ITEM') => void;
  subtotal: number;
  discountedSubtotal?: number;
  tax: number;
  total: number;
  onUpdateOrderItems: (items: DiningOrderItem[]) => void;
  onAddGuest?: () => void;
  onPrintBill?: () => void;
  allTables?: DiningTable[];
  onMoveOrder?: (sourceTableId: string, targetTableId: string) => void;
  onCombineOrders?: (targetTable: string) => void;
  onTransferServer?: (serverName: string) => void;
  onDeleteOrder?: () => void;
  preAuthInfo?: PreAuthData | null;
  onSavePreAuth?: (data: PreAuthData) => void;
  autoGratuityApplied?: boolean;
  onToggleAutoGratuity?: () => void;
  autoGratuityRate?: number;
  autoGratuityAmount?: number;
  serviceFeeApplied?: boolean;
  onToggleServiceFee?: () => void;
  serviceFeeName?: string;
  serviceFeeValue?: number;
  serviceFeeType?: 'Percentage' | 'Fixed';
  serviceFeeAmount?: number;
  onOpenSettings?: () => void;
}

export type DiscountTarget = 
  | { type: 'ITEM'; cartId: string } 
  | { type: 'GUEST'; seatNumber: number } 
  | null;

export type ActiveOrderModal = 
  | 'PRE_AUTH' 
  | 'QR_CODE' 
  | 'PRINT_BILL' 
  | 'PRINT_INDIVIDUAL' 
  | 'MOVE_ORDER' 
  | 'COMBINE_ORDERS' 
  | 'TRANSFER_SERVER' 
  | 'DELETE_ORDER' 
  | null;
