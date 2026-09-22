import React, { useState } from 'react';
import { 
    DetailedOrder, Transaction, Customer, Employee, InventoryItem, 
    Table, Reservation, Schedule, Category, DiscountCode, DiningTable, KDSSettings,
    CartItem, GlobalTaxConfig, TipConfig, KitchenTicket, Notification, DiningOrderItem, CashLogEntry
} from '../../types';
import PosLauncher, { PosAppType } from './PosLauncher';
import PosRegister from './PosRegister';
import TableServiceApp from '../dining/TableServiceApp';
import PasscodeLock from '../auth/PasscodeLock';
import { CashierPOSHeader } from './CashierPOSHeader';
import { OrderReadyToastContainer } from './OrderReadyToastContainer';
import { CashierPOSAuxViews } from './CashierPOSAuxViews';

interface CashierPOSProps {
  onTicketStatusChange?: (ticketId: string, status: string) => void;
  onLogout: () => void;
  onProcessSale: (cart: CartItem[], total: number, paymentMethod: string, existingOrderId?: string, tip?: number, discount?: number) => void;
  currentUser: Employee;
  sharedOrders: DetailedOrder[];
  sharedTransactions: Transaction[];
  sharedCustomers: Customer[];
  sharedEmployees: Employee[];
  sharedInventory: InventoryItem[];
  sharedCategories: Category[];
  sharedModifierGroups?: any[];
  sharedDiscounts?: DiscountCode[];
  sharedTables: Table[];
  sharedReservations: Reservation[];
  sharedSchedules: Schedule[];
  onSeatReservation: (resId: string, tableId: string) => void;
  integrationConfig: { reservation_pos: boolean; scheduling_pos: boolean; kdsEnabled: boolean };
  floorPlanTables?: DiningTable[];
  onUpdateFloorPlan?: (tables: DiningTable[]) => void;
  kdsSettings?: KDSSettings;
  receiptSettings?: any;
  kioskConfig?: any;
  onFireToKitchen?: (ticket: KitchenTicket) => void;
  taxConfig?: GlobalTaxConfig;
  tipConfig?: TipConfig;
  onNavigate?: (tab: string) => void;
  notifications?: Notification[];
  onDismissNotification?: (id: string) => void;
  kitchenTickets?: KitchenTicket[];
  onKitchenStatusChange?: (id: string, status: KitchenTicket['status']) => void;
  onAddCashLog?: (log: CashLogEntry) => void;
  onUpdateReservation?: (res: Reservation) => void;
  onUpdateInventory?: (item: InventoryItem) => void;
  requestedApp?: string | null;
  onRequestedAppConsumed?: () => void;
  activeTableOrders: Record<string, { items: DiningOrderItem[], guests: {id: number, name?: string}[], orderType?: 'Dine In' | 'To Go' | 'Delivery', payments?: {amount: number, method: string}[] }>;
  onUpdateTableOrder: (tableId: string, data: { items: DiningOrderItem[], guests: {id: number, name?: string}[], orderType?: 'Dine In' | 'To Go' | 'Delivery', payments?: {amount: number, method: string}[] } | undefined) => void;
  onUpdateTableStatus: (table: DiningTable) => void;
  activeRegisterCart: CartItem[];
  onUpdateRegisterCart: (cart: CartItem[]) => void;
  onAddCustomer?: (customer: Customer) => void;
  onUpdateCustomer?: (customer: Customer) => void;
  onDeleteCustomer?: (id: string) => void;
  currentRegisterOrderId?: string | null;
  removalReasons?: string[];
  giftCards?: any[];
  setGiftCards?: any;
  businesses?: any[];
}

const CashierPOS: React.FC<CashierPOSProps> = (props) => {
  const [currentApp, setCurrentApp] = useState<PosAppType>('LAUNCHER');
  const [authenticatedPosUser, setAuthenticatedPosUser] = useState<Employee | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const { requestedApp, onRequestedAppConsumed } = props;
  React.useEffect(() => {
    if (requestedApp && authenticatedPosUser) {
      setCurrentApp(requestedApp as PosAppType);
      onRequestedAppConsumed?.();
    }
  }, [requestedApp, authenticatedPosUser, onRequestedAppConsumed]);

  if (!authenticatedPosUser) {
    return (
      <PasscodeLock 
        employees={props.sharedEmployees} 
        onAuthenticated={(user) => setAuthenticatedPosUser(user)}
        onCancel={props.onLogout}
      />
    );
  }

  const myNotifications = props.notifications?.filter(n => n.targetEmployeeId === authenticatedPosUser.id || n.targetEmployeeId === 'all') || [];

  return (
    <div className="h-full flex flex-col overflow-hidden bg-slate-50 font-sans text-slate-900 relative">
      <OrderReadyToastContainer 
        notifications={myNotifications} 
        onDismiss={(id) => props.onDismissNotification && props.onDismissNotification(id)} 
      />

      {currentApp !== 'KIOSK' && (
        <CashierPOSHeader
          currentApp={currentApp}
          setCurrentApp={setCurrentApp}
          authenticatedPosUser={authenticatedPosUser}
          setAuthenticatedPosUser={setAuthenticatedPosUser}
          myNotifications={myNotifications}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isSearchFocused={isSearchFocused}
          setIsSearchFocused={setIsSearchFocused}
          onNavigate={props.onNavigate}
        />
      )}

      <main className="flex-1 overflow-hidden flex flex-col relative">
        {currentApp === 'LAUNCHER' && <PosLauncher user={authenticatedPosUser} onAppSelect={setCurrentApp} />}
        {currentApp === 'REGISTER' && (
          <PosRegister 
            inventory={props.sharedInventory} categories={props.sharedCategories}
            modifierGroups={props.sharedModifierGroups} discounts={props.sharedDiscounts || []} activeCart={props.activeRegisterCart || []}
            onUpdateCart={props.onUpdateRegisterCart || (() => {})}
            giftCards={props.giftCards || []}
            setGiftCards={props.setGiftCards}
            onFinish={(cart, total, payments, tip, discount) => {
              props.onProcessSale(cart, total, payments[0]?.method || 'Card', props.currentRegisterOrderId || undefined, tip, discount);
              if (props.onUpdateRegisterCart) props.onUpdateRegisterCart([]);
              setCurrentApp('REGISTER');
            }}
            currentUser={authenticatedPosUser} kioskConfig={props.kioskConfig}
            taxConfig={props.taxConfig} tipConfig={props.tipConfig}
            onFireToKitchen={(ticket) => props.onFireToKitchen && props.onFireToKitchen({...ticket, serverEmployeeId: authenticatedPosUser.id})}
            onAddCustomer={props.onAddCustomer} currentOrderId={props.currentRegisterOrderId} removalReasons={props.removalReasons}
          />
        )}
        {currentApp === 'TABLE_SERVICE' && (
          <TableServiceApp 
            tables={props.floorPlanTables || []} inventory={props.sharedInventory} categories={props.sharedCategories} currentUser={authenticatedPosUser}
            activeTableOrders={props.activeTableOrders} onUpdateTableOrder={props.onUpdateTableOrder} onUpdateTableStatus={props.onUpdateTableStatus}
            onExit={() => setCurrentApp('LAUNCHER')} onFireToKitchen={(ticket) => props.onFireToKitchen && props.onFireToKitchen(ticket)}
            onProcessSale={props.onProcessSale} kitchenTickets={props.kitchenTickets} onTicketStatusChange={props.onTicketStatusChange} onOpenDesigner={() => setCurrentApp('FLOOR_PLANNER')} onOpenSettings={() => props.onNavigate && props.onNavigate('Settings')}
            giftCards={props.giftCards || []}
            setGiftCards={props.setGiftCards}
            tipConfig={props.tipConfig}
            taxConfig={props.taxConfig}
          />
        )}
        <CashierPOSAuxViews 
          currentApp={currentApp}
          setCurrentApp={setCurrentApp}
          authenticatedPosUser={authenticatedPosUser}
          props={props}
        />
      </main>
    </div>
  );
};

export default CashierPOS;
