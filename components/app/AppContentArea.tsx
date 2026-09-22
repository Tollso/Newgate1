import React from 'react';
import { Role, RolePermission } from '../../types';
import { RolePermissionMatrixState } from '../staff/permissions/types';
import {
  Employee, DetailedOrder, Transaction, Customer, InventoryItem, Category,
  ModifierGroup, DiscountCode, Reservation, Schedule, DiningTable, KDSSettings,
  AppIntegrationConfig, GlobalTaxConfig, TipConfig, KitchenTicket, Notification,
  CartItem, CashLogEntry, Invoice, RecurringPlan, Feedback, FeedbackSettings, DiningOrderItem, Business, PrinterLabel
} from '../../types';
import { renderActiveTabContent } from './ContentAreaRoutes';

interface AppContentAreaProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  getMergedOrders: () => DetailedOrder[];
  handleProcessSale: (cart: any[], total: number, paymentMethod?: string, existingOrderId?: string, tip?: number, discount?: number) => void;
  currentUser: Employee;
  orders: DetailedOrder[];
  transactions: Transaction[];
  customers: Customer[];
  roles: Role[];
  setRoles: React.Dispatch<React.SetStateAction<Role[]>>;
  rolePermissions: RolePermission[];
  setRolePermissions: React.Dispatch<React.SetStateAction<RolePermission[]>>;
  matrixState: RolePermissionMatrixState;
  setMatrixState: React.Dispatch<React.SetStateAction<RolePermissionMatrixState>>;
  filteredEmployees: Employee[];
  filteredInventory: InventoryItem[];
  filteredCategories: Category[];
  discounts: DiscountCode[];
  reservations: Reservation[];
  integrationConfig: AppIntegrationConfig;
  filteredFloorPlanTables: DiningTable[];
  setFloorPlanTables: React.Dispatch<React.SetStateAction<DiningTable[]>>;
  activeTableOrders: Record<string, { items: DiningOrderItem[]; guests: { id: number; name?: string }[]; orderType?: 'Dine In' | 'To Go' | 'Delivery'; payments?: {amount: number, method: string}[] }>;
  handleUpdateTableOrder: (tableId: string, orderData: { items: DiningOrderItem[]; guests: { id: number; name?: string }[]; orderType?: 'Dine In' | 'To Go' | 'Delivery'; payments?: {amount: number, method: string}[] }) => void;
  handleUpdateTableStatus: (tableId: string, status: DiningTable['status'], orderItems?: DiningOrderItem[]) => void;
  registerCart: CartItem[];
  setRegisterCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  handleAddCustomer: (c: Customer) => void;
  handleUpdateCustomer: (c: Customer) => void;
  handleDeleteCustomer: (id: string) => void;
  kdsSettings: KDSSettings;
  receiptSettings: any;
  handleFireToKitchen: (items: DiningOrderItem[], orderId: string, tableName?: string) => void;
  taxConfig: GlobalTaxConfig;
  tipConfig: TipConfig;
  removalReasons: string[];
  serverNotifications: Notification[];
  handleDismissNotification: (id: string) => void;
  activeTickets: KitchenTicket[];
  handleTicketStatusChange: (id: string, status: KitchenTicket['status']) => void;
  handleAddCashLog: (entry: CashLogEntry) => void;
  handleUpdateReservation: (res: Reservation) => void;
  handleSaveItem: (item: InventoryItem) => void;
  currentRegisterOrderId: string | null;
  requestedPosApp: string | null;
  setRequestedPosApp: (app: string | null) => void;
  invoices: Invoice[];
  handleAddInvoice: (inv: Invoice) => void;
  recurringPlans: RecurringPlan[];
  handleAddRecurringPlan: (plan: RecurringPlan) => void;
  cashLogs: CashLogEntry[];
  inventory: InventoryItem[];
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  modifierGroups: ModifierGroup[];
  setModifierGroups: React.Dispatch<React.SetStateAction<ModifierGroup[]>>;
  handleDeleteItem: (id: string) => void;
  setDiscounts: React.Dispatch<React.SetStateAction<DiscountCode[]>>;
  handleAddEmployee: (emp: Employee) => void;
  handleUpdateEmployee: (emp: Employee) => void;
  handleDeleteEmployee: (id: string) => void;
  schedules: Schedule[];
  handleAddSchedule: (sched: Schedule) => void;
  handleSyncSchedules: (newSchedules: Schedule[]) => void;
  feedbacks: Feedback[];
  feedbackSettings: FeedbackSettings;
  setFeedbackSettings: React.Dispatch<React.SetStateAction<FeedbackSettings>>;
  setFeedbacks: React.Dispatch<React.SetStateAction<Feedback[]>>;
  handleSaveFloorPlan: (tables: DiningTable[]) => void;
  setKdsSettings?: React.Dispatch<React.SetStateAction<KDSSettings>>;
  setIntegrationConfig?: React.Dispatch<React.SetStateAction<AppIntegrationConfig>>;
  setTaxConfig?: React.Dispatch<React.SetStateAction<GlobalTaxConfig>>;
  setTipConfig?: React.Dispatch<React.SetStateAction<TipConfig>>;
  setRemovalReasons?: React.Dispatch<React.SetStateAction<string[]>>;
  businesses?: Business[];
  handleAddBusiness?: (biz: Business, owner: Partial<Employee>) => void;
  handleSwitchMerchant?: (business: Business) => void;
  currentBizId?: string;
  waitlist?: any[];
  setWaitlist?: React.Dispatch<React.SetStateAction<any[]>>;
  giftCards?: any[];
  setGiftCards?: React.Dispatch<React.SetStateAction<any[]>>;
  printerLabels?: PrinterLabel[];
  setPrinterLabels?: React.Dispatch<React.SetStateAction<PrinterLabel[]>>;
}

export const AppContentArea: React.FC<AppContentAreaProps> = (props) => {
  return renderActiveTabContent(props.activeTab, props);
};
