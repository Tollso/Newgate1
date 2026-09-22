import React from 'react';
import { MerchantMode } from '../../../types/device';
import {
  Employee, InventoryItem, Category, DetailedOrder,
  Transaction, Customer, DiscountCode, Table, Reservation,
  KitchenTicket, GlobalTaxConfig, TipConfig, CashLogEntry, CartItem
} from '../../../types';

export type PosInternalRoute =
  | 'HUB'
  | 'REGISTER'
  | 'TABLES'
  | 'KDS'
  | 'ORDERS'
  | 'RESERVATIONS'
  | 'CASH_DRAWER'
  | 'END_OF_DAY'
  | '86_AVAILABILITY'
  | 'SHIFT_CLOCK'
  | 'MANAGER_TOOLS'
  | 'POS_SETTINGS'
  | 'RETAIL_REGISTER'
  | 'RETAIL_INVENTORY'
  | 'RETAIL_RETURNS'
  | 'CUSTOMERS'
  | 'GIVING_REGISTER'
  | 'GIVING_KIOSK'
  | 'DONOR_CRM'
  | 'KIOSK';

export interface AppTileConfig {
  id: PosInternalRoute;
  name: string;
  description: string;
  icon: React.ReactNode;
  bgGradient: string;
  badge?: string | number;
  badgeColor?: string;
  permissionRequired?: string;
  page: 0 | 1;
}

export interface PosShellProps {
  currentUser: Employee;
  merchantMode?: MerchantMode;
  inventory?: InventoryItem[];
  categories?: Category[];
  modifierGroups?: any[];
  discounts?: DiscountCode[];
  orders?: DetailedOrder[];
  transactions?: Transaction[];
  customers?: Customer[];
  floorPlanTables?: Table[];
  setFloorPlanTables?: React.Dispatch<React.SetStateAction<Table[]>>;
  onUpdateFloorPlan?: (tables: any[]) => void;
  activeTableOrders?: Record<string, any>;
  onUpdateTableOrder?: (tableId: string, orderData: any) => void;
  onUpdateTableStatus?: (table: Table) => void;
  onProcessSale?: (cart: any[], total: number, paymentMethod?: string, existingOrderId?: string, tip?: number, discount?: number) => void;
  onFireToKitchen?: (ticket: KitchenTicket) => void;
  activeTickets?: KitchenTicket[];
  onTicketStatusChange?: (ticketId: string, status: KitchenTicket['status']) => void;
  kdsSettings?: any;
  taxConfig?: GlobalTaxConfig;
  tipConfig?: TipConfig;
  cashLogs?: CashLogEntry[];
  onAddCashLog?: (log: CashLogEntry) => void;
  reservations?: Reservation[];
  waitlist?: any[];
  onUpdateReservation?: (res: Reservation) => void;
  onSaveItem?: (item: InventoryItem) => void;
  printerLabels?: any[];
  schedules?: any[];
  filteredEmployees?: Employee[];
  businesses?: any[];
  onUpdateEmployee?: (employee: Employee) => void;
  onNavigate?: (tab: string) => void;
  onSwitchToAdmin?: () => void;
  onExit?: () => void;
  onLogout?: () => void;
  onOpenGlobalSearch?: () => void;
  onOpenManagerPin?: (action: string, callback: () => void) => void;
}

export interface PosShellPropsState {
  posRoute: PosInternalRoute;
  setPosRoute: (r: PosInternalRoute) => void;
  registerCart: CartItem[];
  setRegisterCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  currentMode: MerchantMode;
  drawerBalance: string;
  businessDate: string;
  isClockedIn: boolean;
  setIsClockedIn: (val: boolean) => void;
  onBreak: boolean;
  setOnBreak: (val: boolean) => void;
  clockInTime: string;
  setClockInTime: (t: string) => void;
  shiftHours: string;
  activeUser?: Employee | null;
}
