import React from 'react';
import { PosAppType } from './PosLauncher';
import FloorPlanDesignerApp from '../dining/FloorPlanDesignerApp';
import KitchenDisplay from './KitchenDisplay';
import ExpeditorScreen from './ExpeditorScreen';
import InventoryScanner from './InventoryScanner';
import CashierCloseout from './CashierCloseout';
import ReservationsApp from '../reservations/ReservationsApp';
import SchedulingApp from '../staff/SchedulingApp';
import Orders from '../orders/Orders';
import Customers from '../crm/Customers';
import { GiftCardsSettingsSection } from '../settings/GiftCardsSettingsSection';
import KioskApp from './KioskApp';
import { X } from 'lucide-react';

interface CashierPOSAuxViewsProps {
  currentApp: PosAppType;
  setCurrentApp: (app: PosAppType) => void;
  authenticatedPosUser: any;
  props: any;
}

export const CashierPOSAuxViews: React.FC<CashierPOSAuxViewsProps> = ({
  currentApp,
  setCurrentApp,
  authenticatedPosUser,
  props
}) => {
  return (
    <>
      {currentApp === 'FLOOR_PLANNER' && (
        <FloorPlanDesignerApp tables={props.floorPlanTables || []} onSave={(newTables) => { if (props.onUpdateFloorPlan) props.onUpdateFloorPlan(newTables); }} onExit={() => setCurrentApp('LAUNCHER')} />
      )}
      {currentApp === 'KITCHEN' && <KitchenDisplay settings={props.kdsSettings} liveTickets={props.kitchenTickets} onUpdateStatus={props.onKitchenStatusChange} />}
      {currentApp === 'EXPEDITOR' && <ExpeditorScreen tickets={props.kitchenTickets} onUpdateStatus={props.onKitchenStatusChange} />}
      {currentApp === 'INVENTORY_SCANNER' && <InventoryScanner items={props.sharedInventory} onUpdateItem={props.onUpdateInventory} />}
      {currentApp === 'CLOSEOUT' && (
        <CashierCloseout 
          onCloseout={(data) => {
            if (props.onAddCashLog) {
              props.onAddCashLog({ id: `CL-${Date.now()}`, date: new Date().toLocaleDateString(), openingAmount: 200, cashSales: 3042.83, cashDrops: 0, closingAmount: data.actual, variance: data.variance, employeeId: authenticatedPosUser.name });
            }
            setCurrentApp('LAUNCHER');
          }}
        />
      )}
      {currentApp === 'RESERVATIONS' && <ReservationsApp reservations={props.sharedReservations} tables={[]} floorPlanTables={props.floorPlanTables || []} onSeatReservation={props.onSeatReservation} isConnectedToPos={props.integrationConfig.reservation_pos} onUpdateReservation={props.onUpdateReservation} kitchenTickets={props.kitchenTickets} onTicketStatusChange={props.onTicketStatusChange} />}
      {currentApp === 'SCHEDULING' && <SchedulingApp schedules={props.sharedSchedules} />}
      {currentApp === 'ORDERS' && <Orders orders={props.sharedOrders} />}
      {currentApp === 'CUSTOMERS' && <Customers customers={props.sharedCustomers} onAddCustomer={props.onAddCustomer} onUpdateCustomer={props.onUpdateCustomer} onDeleteCustomer={props.onDeleteCustomer} />}
      {currentApp === 'GIFT_CARDS' && (
        <div className="p-8 overflow-y-auto h-full bg-white">
          <GiftCardsSettingsSection 
            businesses={props.businesses || []} 
            giftCards={props.giftCards || []} 
            setGiftCards={props.setGiftCards} 
          />
        </div>
      )}
      {currentApp === 'KIOSK' && (
        <div className="absolute inset-0 z-50">
          <KioskApp 
            items={props.sharedInventory} 
            categories={props.sharedCategories} 
            kioskConfig={props.kioskConfig}
            taxConfig={props.taxConfig || { rate: 7.25, name: 'Sales Tax', enabled: true }} 
            onProcessSale={(cart, total, paymentMethod, orderId) => {
              props.onProcessSale(cart, total, paymentMethod, orderId);
            }} 
          />
          <button 
            onClick={() => setCurrentApp('LAUNCHER')}
            className="absolute top-6 left-6 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-800 hover:bg-slate-100 z-[100]"
          >
            <X size={24} />
          </button>
        </div>
      )}
    </>
  );
};
