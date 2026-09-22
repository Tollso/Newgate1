import { RolePermissionMatrixState } from '../components/staff/permissions/types';
import { getDefaultRolePermissionState } from '../components/staff/permissions/permissionDefaults';
import { useState, useEffect } from 'react';
import {
  Role, RolePermission,
  UserRole, Employee, DetailedOrder, Transaction, Customer, InventoryItem, Category, ModifierGroup,
  Reservation, Schedule, DiningTable, KDSSettings, AppIntegrationConfig, DiscountCode, WaitlistEntry,
  GlobalTaxConfig, TipConfig, KioskConfig, KitchenTicket, Notification, Business, DiningOrderItem, CartItem,
  CashLogEntry, Invoice, RecurringPlan, Feedback, FeedbackSettings, GiftCard, PrinterLabel
} from '../types';
import {
  MOCK_EMPLOYEES, MOCK_DETAILED_ORDERS, MOCK_TRANSACTIONS, MOCK_CUSTOMERS,
  MOCK_INVENTORY_ITEMS, MOCK_CATEGORIES, MOCK_RESERVATIONS, MOCK_SCHEDULES,
  MOCK_FLOOR_TABLES, MOCK_KDS_SETTINGS, MOCK_DISCOUNTS, MOCK_CASH_LOGS,
  MOCK_BUSINESSES, MOCK_INVOICES, MOCK_RECURRING_PLANS, MOCK_MODIFIER_GROUPS,
  MOCK_RECEIPT_SETTINGS, MOCK_TIP_CONFIG, MOCK_KITCHEN_TICKETS,
  initialFeedbackSettings, initialTaxConfig, getInitialRemovalReasons
} from './appStateInitial';
import { MOCK_PRINTER_LABELS, MOCK_ROLES, MOCK_ROLE_PERMISSIONS } from '../constants';
import { KitchenRoutingService } from '../services/kitchenRoutingService';
import { KDSTicket } from '../types/kds';
import { loadSavedFloorPlan, saveFloorPlan } from '../components/dining/floorPlanStorage';
import { LocalDbService } from '../services/localDbService';

const getUrlPath = () => window.location.pathname;

function mapKDSToKitchenTicket(t: KDSTicket): KitchenTicket {
  return {
    id: t.id,
    orderId: t.orderId,
    type: t.orderType === 'DINE_IN' ? 'Dine-in' : 'Takeout',
    items: t.items.map(i => ({
      name: i.name,
      qty: i.quantity,
      modifiers: i.modifiers || [],
      status: i.status === 'READY' ? 'Ready' : (i.status === 'PREPARING' ? 'Prep' : 'Pending'),
      printerLabels: [t.station],
    })),
    status: t.status === 'COMPLETED' ? 'Delivered' : (t.status === 'READY' ? 'Ready' : (t.status === 'PREPARING' ? 'Prep' : 'Pending')),
    timeIn: t.createdAt,
    table: t.tableNumber,
    server: t.serverName,
  };
}

const generateOrderId = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 10; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const useAppState = () => {
  const [currentPath, setCurrentPath] = useState(getUrlPath());
  const [currentUser, setCurrentUser] = useState<Employee | null>(MOCK_EMPLOYEES[0]);
  const [businesses, setBusinesses] = useState<Business[]>(MOCK_BUSINESSES);
  const [orders, setOrders] = useState<DetailedOrder[]>(MOCK_DETAILED_ORDERS);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [roles, setRoles] = useState<Role[]>(MOCK_ROLES);
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>(MOCK_ROLE_PERMISSIONS);
  const [matrixState, setMatrixState] = useState<RolePermissionMatrixState>(getDefaultRolePermissionState());
  const [employeesState, setEmployeesState] = useState<Employee[]>(MOCK_EMPLOYEES);
  const [inventory, setInventory] = useState<InventoryItem[]>(MOCK_INVENTORY_ITEMS);
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [modifierGroups, setModifierGroups] = useState<ModifierGroup[]>(MOCK_MODIFIER_GROUPS);
  const [discounts, setDiscounts] = useState<DiscountCode[]>(MOCK_DISCOUNTS);
  const [reservations, setReservations] = useState<Reservation[]>(MOCK_RESERVATIONS);
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>(MOCK_SCHEDULES);
  const [cashLogs, setCashLogs] = useState<CashLogEntry[]>(MOCK_CASH_LOGS);
  const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES);
  const [recurringPlans, setRecurringPlans] = useState<RecurringPlan[]>(MOCK_RECURRING_PLANS);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [feedbackSettings, setFeedbackSettings] = useState<FeedbackSettings>(initialFeedbackSettings);
  const [printerLabels, setPrinterLabels] = useState<PrinterLabel[]>(MOCK_PRINTER_LABELS);
  const [activeTickets, setActiveTickets] = useState<KitchenTicket[]>(MOCK_KITCHEN_TICKETS);
  const [serverNotifications, setServerNotifications] = useState<Notification[]>([]);
  const [giftCards, setGiftCards] = useState<GiftCard[]>([
    {
      id: 'gc-default-1',
      code: '4832-9102-7482-1029',
      securityCode: '742',
      type: 'Digital',
      balance: 50.00,
      initialBalance: 50.00,
      issuedDate: new Date().toISOString(),
      expirationDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'Active',
      customerName: 'Valued Customer',
      customerEmail: 'customer@example.com'
    },
    {
      id: 'gc-default-2',
      code: '9102-8374-6102-4912',
      securityCode: '389',
      type: 'Physical',
      balance: 100.00,
      initialBalance: 100.00,
      issuedDate: new Date().toISOString(),
      expirationDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'Active',
      customerName: 'Store VIP'
    }
  ]);
  const [floorPlanTables, setFloorPlanTables] = useState<DiningTable[]>(() => loadSavedFloorPlan(MOCK_FLOOR_TABLES));
  const [activeTableOrders, setActiveTableOrders] = useState<Record<string, { items: DiningOrderItem[], guests: { id: number, name?: string }[], orderType?: 'Dine In' | 'To Go' | 'Delivery', payments?: {amount: number, method: string}[] }>>({});
  const [registerCart, setRegisterCart] = useState<CartItem[]>([]);
  const [currentRegisterOrderId, setCurrentRegisterOrderId] = useState<string | null>(null);
  const [isImpersonating, setIsImpersonating] = useState(false);
  const [originalUser, setOriginalUser] = useState<Employee | null>(null);
  const [kdsSettings, setKdsSettings] = useState<KDSSettings>(MOCK_KDS_SETTINGS);
  const [integrationConfig, setIntegrationConfig] = useState<AppIntegrationConfig>({
    reservation_pos: true,
    scheduling_pos: false,
    scheduling_reservation: false,
    kdsEnabled: MOCK_KDS_SETTINGS.isEnabled,
  });
  const [receiptSettings, setReceiptSettings] = useState(MOCK_RECEIPT_SETTINGS);
  
  const [kioskConfig, setKioskConfig] = useState<KioskConfig>({
    operatingMode: 'Hybrid (Both)',
    welcomeMessage: 'Welcome! What are you craving?',
    themeColor: 'indigo',
    layout: 'sidebar-right',
    requireCustomerName: false,
    showItemImages: true,
    timeoutSeconds: 60
  });

  const [taxConfig, setTaxConfig] = useState<GlobalTaxConfig>(initialTaxConfig);
  const [tipConfig, setTipConfig] = useState<TipConfig>(MOCK_TIP_CONFIG);
  const [removalReasons, setRemovalReasons] = useState<string[]>(getInitialRemovalReasons);

  const [activeTab, setActiveTab] = useState('POS Shell');
  const [requestedPosApp, setRequestedPosApp] = useState<string | null>(null);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  useEffect(() => {
    localStorage.setItem('omni_removal_reasons', JSON.stringify(removalReasons));
  }, [removalReasons]);

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    setIntegrationConfig(prev => ({ ...prev, kdsEnabled: kdsSettings.isEnabled }));
  }, [kdsSettings.isEnabled]);

  useEffect(() => {
    KitchenRoutingService.initialize();
    const unsubscribe = KitchenRoutingService.subscribe((kdsTickets) => {
      if (kdsTickets.length > 0) {
        const mapped = kdsTickets.map(mapKDSToKitchenTicket);
        setActiveTickets(mapped);
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (registerCart.length > 0 && !currentRegisterOrderId) {
      setCurrentRegisterOrderId(generateOrderId());
    } else if (registerCart.length === 0) {
      setCurrentRegisterOrderId(null);
    }
  }, [registerCart, currentRegisterOrderId]);

  const handleLogin = (user: Employee) => {
    setCurrentUser(user);
    if (user.role === UserRole.SUPER_ADMIN) {
      setActiveTab('SuperAdmin');
    } else {
      // Default to POS Shell / App Hub for all operational and store personnel
      setActiveTab('POS Shell');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('Login');
    setIsProfileMenuOpen(false);
  };

  const handleSwitchRole = (roleName: string) => {
    const user = employeesState.find(u => u.role === roleName) || MOCK_EMPLOYEES.find(u => u.role === roleName);
    const userToLogin = user || (roleName === UserRole.SUPER_ADMIN ? MOCK_EMPLOYEES.find(u => u.role === UserRole.SUPER_ADMIN) : null);
    if (userToLogin) {
      handleLogin(userToLogin);
      setShowRoleSwitcher(false);
      setIsProfileMenuOpen(false);
    }
  };

  const handleProcessSale = (cart: any[], total: number, paymentMethod: string = 'Card', existingOrderId?: string, tip: number = 0, discount: number = 0) => {
    const newOrder: DetailedOrder = {
      id: existingOrderId || currentRegisterOrderId || generateOrderId(),
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      total, status: 'Paid', paymentMethod: paymentMethod as any,
      employeeName: currentUser?.name || 'Staff', device: 'Main Register',
      type: 'Dine-in', items: cart, tip, discount
    };
    setOrders([newOrder, ...orders]);
    setTransactions([{
      id: `TRX-${Date.now()}`, date: new Date().toLocaleDateString(),
      amount: total, type: 'Sale', method: paymentMethod as any,
      employeeId: currentUser?.id || 'E001'
    }, ...transactions]);
    setRegisterCart([]);
  };

  const handleUpdateTableOrder = (tableId: string, data: any) => {
    setActiveTableOrders(prev => {
      if (data === undefined) { const next = { ...prev }; delete next[tableId]; return next; }
      return { ...prev, [tableId]: data };
    });
  };

  const handleUpdateTableStatus = (updatedTable: DiningTable) => {
    setFloorPlanTables(prev => prev.map(t => t.id === updatedTable.id ? updatedTable : t));
  };

  const handleSaveItem = (item: InventoryItem) => {
    const itemWithBiz: InventoryItem = { ...item, businessId: item.businessId || currentUser?.businessId || 'B-001' };
    setInventory(prev => {
      const index = prev.findIndex(i => i.id === itemWithBiz.id);
      if (index >= 0) {
        const newItems = [...prev];
        newItems[index] = itemWithBiz;
        return newItems;
      }
      return [itemWithBiz, ...prev];
    });
  };

  const handleDeleteItem = (id: string) => setInventory(prev => prev.filter(i => i.id !== id));
  const handleAddCustomer = (customer: Customer) => setCustomers(prev => [customer, ...prev]);
  const handleUpdateCustomer = (customer: Customer) => setCustomers(prev => prev.map(c => c.id === customer.id ? customer : c));
  const handleDeleteCustomer = (id: string) => setCustomers(prev => prev.filter(c => c.id !== id));
  const handleAddInvoice = (invoice: any) => setInvoices(prev => [invoice, ...prev]);
  const handleAddRecurringPlan = (plan: any) => setRecurringPlans(prev => [plan, ...prev]);
  const handleAddCashLog = (log: CashLogEntry) => setCashLogs(prev => [log, ...prev]);
  const handleUpdateReservation = (updatedRes: Reservation) => setReservations(prev => prev.map(r => r.id === updatedRes.id ? updatedRes : r));
  const handleAddSchedule = (schedule: Schedule) => setSchedules(prev => [...prev, schedule]);
  const handleSyncSchedules = (newSchedules: Schedule[]) => setSchedules(prev => [...prev, ...newSchedules]);

  const handleAddEmployee = (emp: Employee) => {
    setEmployeesState([...employeesState, { ...emp, businessId: currentUser?.businessId }]);
  };

  const handleUpdateEmployee = (updatedEmp: Employee) => {
    setEmployeesState(prev => prev.map(emp => emp.id === updatedEmp.id ? updatedEmp : emp));
  };

  const handleDeleteEmployee = (id: string) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      setEmployeesState(prev => prev.filter(emp => emp.id !== id));
    }
  };

  const handleAddBusiness = (biz: Business, owner: Partial<Employee>) => {
    const newBusiness = { ...biz, id: `B-${Date.now()}` };
    setBusinesses(prev => [...prev, newBusiness]);
    const newOwner: Employee = {
      id: `E-${Date.now()}`, name: owner.name || 'Admin', email: owner.email || '',
      passcode: owner.passcode || '1234', role: UserRole.BUSINESS_ADMIN,
      businessId: newBusiness.id, status: 'Active', hourlyRate: 0, hoursWorked: 0, deviceAccess: true
    };
    setEmployeesState(prev => [...prev, newOwner]);
  };

  const handleSwitchMerchant = (business: Business) => {
    if (!currentUser) return;
    if (!isImpersonating) setOriginalUser(currentUser);
    setIsImpersonating(true);
    setCurrentUser({ ...currentUser, businessId: business.id, role: UserRole.BUSINESS_ADMIN });
    setActiveTab('Home');
  };

  const handleStopImpersonating = () => {
    if (originalUser) {
      setCurrentUser(originalUser);
      setIsImpersonating(false);
      setOriginalUser(null);
      setActiveTab('SuperAdmin');
    }
  };

  useEffect(() => {
    try {
      localStorage.setItem('newgate_floor_plan_tables', JSON.stringify(floorPlanTables));
      LocalDbService.saveTableState(floorPlanTables, {});
    } catch (e) {
      console.warn('Failed to sync floorPlanTables to localStorage', e);
    }
  }, [floorPlanTables]);

  useEffect(() => {
    const handleSavedEvent = (e: any) => {
      if (e.detail && Array.isArray(e.detail)) {
        setFloorPlanTables(e.detail);
      }
    };
    window.addEventListener('floor_plan_saved', handleSavedEvent);
    return () => window.removeEventListener('floor_plan_saved', handleSavedEvent);
  }, []);

  const handleSaveFloorPlan = (tables: DiningTable[]) => {
    const bizId = currentUser?.businessId || 'B001';
    const persisted = saveFloorPlan(tables, bizId);
    setFloorPlanTables(persisted);
  };
  const handleFireToKitchen = (ticket: any) => {
    setActiveTickets(prev => [...prev, ticket]);
    // Dispatch to KitchenRoutingService canonical engine
    try {
      KitchenRoutingService.dispatchOrder({
        id: ticket.orderId || `ORD-${Date.now()}`,
        orderNumber: ticket.orderNumber || `${Date.now().toString().slice(-4)}`,
        orderType: ticket.type === 'Dine-in' ? 'DINE_IN' : 'TAKEOUT',
        status: 'OPEN',
        tableName: ticket.table || ticket.tableNumber,
        employeeName: ticket.server || currentUser?.name || 'Server',
        merchantId: currentUser?.businessId || 'M001',
        locationId: 'LOC-1',
        employeeId: currentUser?.id || 'E001',
        items: (ticket.items || []).map((i: any, idx: number) => ({
          id: `item-${Date.now()}-${idx}`,
          productId: i.productId || `prod-${idx}`,
          name: i.name,
          category: i.category,
          quantity: i.qty || i.quantity || 1,
          unitPrice: i.price || 0,
          totalPrice: (i.price || 0) * (i.qty || i.quantity || 1),
          modifiers: (i.modifiers || []).map((m: any) => typeof m === 'string' ? { id: m, name: m, priceDelta: 0 } : m),
          discountsTotal: 0,
          taxAmount: 0,
          status: 'SENT',
          kitchenStation: i.printerLabels?.[0],
        })),
        appliedChargeRules: [],
        subtotal: 0,
        discountTotal: 0,
        taxTotal: 0,
        tipTotal: 0,
        serviceChargeTotal: 0,
        totalAmount: 0,
        totalPaid: 0,
        balanceDue: 0,
        payments: [],
        discounts: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('[handleFireToKitchen] Routing dispatch error:', e);
    }
  };

  const handleTicketStatusChange = (ticketId: string, status: KitchenTicket['status']) => {
    // Notify KitchenRoutingService
    if (status === 'Prep' || status === 'Ready' || status === 'Delivered') {
      KitchenRoutingService.bumpTicket(ticketId).catch(err => {
        console.warn('[handleTicketStatusChange] Bump ticket warning:', err);
      });
    }

    setActiveTickets(prev => {
      const newTickets = prev.map(t => t.id === ticketId ? { ...t, status } : t);
      
      if (status === 'Ready') {
        const ticket = prev.find(t => t.id === ticketId);
        if (ticket && ticket.status !== 'Ready') {
          // Add notification asynchronously to avoid state update cycle issues
          setTimeout(() => {
            setServerNotifications(notifs => [
              {
                id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                type: 'OrderReady',
                message: `Order #${ticket.orderId}${ticket.table ? ' (Table ' + ticket.table + ')' : ''} is ready in the kitchen!`,
                targetEmployeeId: 'all',
                timestamp: new Date().toISOString(),
                read: false
              },
              ...notifs
            ]);
          }, 0);
        }
      }
      
      return newTickets;
    });
  };

  const handleDismissNotification = (id: string) => setServerNotifications(prev => prev.filter(n => n.id !== id));

  const getMergedOrders = () => {
    const openTableOrders: DetailedOrder[] = floorPlanTables
      .filter(t => (t.status === 'Occupied' || t.status === 'Payment') && activeTableOrders[t.id])
      .map(t => ({
        id: t.orderId || `TEMP-${t.id}`, date: new Date().toLocaleDateString(),
        time: t.timeSeated ? new Date(t.timeSeated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
        total: activeTableOrders[t.id].items.reduce((s, i) => s + (i.price * i.quantity), 0) * (1 + taxConfig.rate / 100),
        status: 'Open', paymentMethod: 'Card', employeeName: t.assignedToName || 'Server',
        device: 'Table Service', type: 'Dine-in', items: activeTableOrders[t.id].items
      } as DetailedOrder));

    return [...openTableOrders, ...orders];
  };

  return {
    currentPath, currentUser, setCurrentUser, businesses, setBusinesses,
    orders, setOrders, transactions, setTransactions, customers, setCustomers,
    roles, setRoles, rolePermissions, setRolePermissions, matrixState, setMatrixState,
    employeesState, setEmployeesState, inventory, setInventory, categories, setCategories,
    modifierGroups, setModifierGroups, discounts, setDiscounts, reservations, setReservations, waitlist, setWaitlist,
    schedules, setSchedules, cashLogs, setCashLogs, invoices, setInvoices,
    recurringPlans, setRecurringPlans, feedbacks, setFeedbacks, feedbackSettings, setFeedbackSettings, giftCards, setGiftCards,
    printerLabels, setPrinterLabels,
    activeTickets, setActiveTickets, serverNotifications, setServerNotifications,
    floorPlanTables, setFloorPlanTables, activeTableOrders, setActiveTableOrders,
    registerCart, setRegisterCart, currentRegisterOrderId, setCurrentRegisterOrderId,
    isImpersonating, setIsImpersonating, originalUser, setOriginalUser,
    kdsSettings, setKdsSettings, integrationConfig, setIntegrationConfig,
    receiptSettings, setReceiptSettings, taxConfig, setTaxConfig, tipConfig, setTipConfig, kioskConfig, setKioskConfig,
    removalReasons, setRemovalReasons, activeTab, setActiveTab, requestedPosApp, setRequestedPosApp,
    expandedMenu, setExpandedMenu, isSidebarOpen, setIsSidebarOpen, isProfileMenuOpen, setIsProfileMenuOpen,
    showRoleSwitcher, setShowRoleSwitcher,
    handleLogin, handleLogout, handleSwitchRole, handleProcessSale, handleUpdateTableOrder,
    handleUpdateTableStatus, handleSaveItem, handleDeleteItem, handleAddCustomer, handleUpdateCustomer,
    handleDeleteCustomer, handleAddInvoice, handleAddRecurringPlan, handleAddCashLog, handleUpdateReservation,
    handleAddSchedule, handleSyncSchedules, handleAddEmployee, handleUpdateEmployee, handleDeleteEmployee,
    handleAddBusiness, handleSwitchMerchant, handleStopImpersonating, handleSaveFloorPlan, handleFireToKitchen,
    handleTicketStatusChange, handleDismissNotification, getMergedOrders
  };
};
