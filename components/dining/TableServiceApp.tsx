import React from 'react';
import { DiningTable, InventoryItem, Category, Employee, KitchenTicket, TipConfig, GlobalTaxConfig } from '../../types';
import { TableFloorView } from './TableFloorView';
import { executeTableAction } from './tableActionHelpers';
import { useTableServiceState } from './table_service/useTableServiceState';
import { ActiveTableOrderScreen } from './table_service/ActiveTableOrderScreen';
import { combineOrdersWithTargetTable } from './table_service/tableOrderOperations';
import { ActiveTableOrderData } from './table_service/tableServiceTypes';

interface TableServiceAppProps {
  tables: DiningTable[];
  inventory: InventoryItem[];
  categories: Category[];
  currentUser: Employee;
  onExit: () => void;
  onFireToKitchen?: (ticket: KitchenTicket) => void;
  activeTableOrders: Record<string, ActiveTableOrderData>;
  onUpdateTableOrder: (tableId: string, data: ActiveTableOrderData | undefined) => void;
  onUpdateTableStatus: (table: DiningTable) => void;
  onProcessSale?: (cart: any[], total: number, paymentMethod: string, existingOrderId?: string, tip?: number, discount?: number) => void;
  kitchenTickets?: KitchenTicket[];
  giftCards?: any[];
  setGiftCards?: any;
  onOpenDesigner?: () => void;
  onOpenSettings?: () => void;
  onTicketStatusChange?: (ticketId: string, status: 'Pending' | 'Prep' | 'Ready' | 'Delivered') => void;
  tipConfig?: TipConfig;
  taxConfig?: GlobalTaxConfig;
}

const TableServiceApp: React.FC<TableServiceAppProps> = (props) => {
  const {
    tables, inventory = [], categories = [], currentUser, onExit, onFireToKitchen,
    activeTableOrders = {}, onUpdateTableOrder, onUpdateTableStatus, onProcessSale,
    kitchenTickets, onTicketStatusChange, giftCards, setGiftCards, tipConfig, taxConfig,
    onOpenDesigner, onOpenSettings
  } = props;

  const state = useTableServiceState({
    tables, currentUser, onExit, onFireToKitchen, activeTableOrders,
    onUpdateTableOrder, onUpdateTableStatus, onProcessSale, kitchenTickets,
    onTicketStatusChange, tipConfig, taxConfig
  });

  const handleCombine = (tgtTable: string) => {
    if (!state.activeTable) return;
    const targetObj = combineOrdersWithTargetTable(
      tgtTable, state.activeTable, state.safeTables, activeTableOrders,
      state.orderItems, state.guests, currentUser, onUpdateTableOrder, onUpdateTableStatus
    );
    if (targetObj) state.setActiveTableId(targetObj.id);
  };

  const handleAddGuest = () => {
    const maxId = state.guests.reduce((max, g) => Math.max(max, g.id), 0);
    const newGuests = [...state.guests, { id: maxId + 1 }];
    if (state.activeTableId) {
      onUpdateTableOrder(state.activeTableId, {
        items: state.orderItems,
        guests: newGuests,
        orderType: state.orderType,
        preAuthInfo: state.currentOrderData?.preAuthInfo
      });
      state.setActiveSeat(maxId + 1);
    }
  };

  if (state.activeTableId && state.activeTable) {
    return (
      <ActiveTableOrderScreen
        activeTable={state.activeTable} orderItems={state.orderItems} guests={state.guests}
        activeSeat={state.activeSeat} setActiveSeat={state.setActiveSeat} inventory={inventory}
        categories={categories} activeCategory={state.activeCategory} setActiveCategory={state.setActiveCategory}
        searchTerm={state.searchTerm} setSearchTerm={state.setSearchTerm} onBackToFloor={state.handleBackToFloor}
        onAddToOrder={state.addToOrder} onFire={state.handleFire} onOpenPayment={state.handleOpenPayment}
        totals={state.totals} updateOrderItems={state.updateOrderItems} safeTables={state.safeTables}
        handleMoveOrder={state.handleMoveOrder} handleCombineOrders={handleCombine}
        onTransferServer={(srv) => {
          if (state.activeTable) onUpdateTableStatus({ ...state.activeTable, assignedToName: srv });
        }}
        onDeleteOrder={() => {
          if (state.activeTableId) {
            onUpdateTableOrder(state.activeTableId, undefined);
            if (state.activeTable) onUpdateTableStatus({ ...state.activeTable, status: 'Available', assignedToName: undefined, timeSeated: undefined, orderId: undefined });
            state.setActiveTableId(null);
          }
        }}
        onAddGuest={handleAddGuest}
        currentOrderData={state.currentOrderData}
        onSavePreAuth={(data) => {
          if (state.activeTableId) {
            onUpdateTableOrder(state.activeTableId, {
              items: state.orderItems, guests: state.guests, orderType: state.orderType,
              payments: state.currentOrderData?.payments, preAuthInfo: data
            });
          }
        }}
        autoGratuityApplied={state.autoGratuityApplied}
        handleToggleAutoGratuity={state.handleToggleAutoGratuity}
        autoGratuityRate={tipConfig?.autoGratuityRate ?? 18}
        serviceFeeApplied={state.serviceFeeApplied}
        handleToggleServiceFee={state.handleToggleServiceFee}
        serviceFeeName={tipConfig?.serviceFeeName ?? 'Service Fee'}
        serviceFeeValue={tipConfig?.serviceFeeValue ?? 3.5}
        serviceFeeType={tipConfig?.serviceFeeType ?? 'Percentage'}
        onOpenSettings={onOpenSettings}
        showPayment={state.showPayment}
        setShowPayment={state.setShowPayment}
        tableCardPaymentStep={state.tableCardPaymentStep}
        setTableCardPaymentStep={state.setTableCardPaymentStep}
        tableSelectedTip={state.tableSelectedTip}
        setTableSelectedTip={state.setTableSelectedTip}
        tableCustomTipInput={state.tableCustomTipInput}
        setTableCustomTipInput={state.setTableCustomTipInput}
        billDiscount={state.billDiscount}
        setShowDiscountModal={state.setShowDiscountModal}
        handleCloseCheck={state.handleCloseCheck}
        giftCards={giftCards} setGiftCards={setGiftCards}
        effectiveTaxRate={state.effectiveTaxRate}
        initialPaymentMode={state.initialPaymentMode}
      />
    );
  }

  return (
    <TableFloorView
      tables={tables} onExit={state.handleExit} floorSections={state.floorSections}
      activeSection={state.activeSection} setActiveSection={state.setActiveSection}
      onTableClick={state.handleTableClick} kitchenTickets={kitchenTickets}
      actionTable={state.actionTable} currentUser={currentUser}
      onCloseActionModal={() => state.setActionTable(null)}
      onOpenSettings={onOpenSettings} onOpenDesigner={onOpenDesigner}
      onSeatGuests={(guestCount, serverName, serverId) => {
        if (!state.actionTable) return;
        const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
        onUpdateTableStatus({
          ...state.actionTable, status: 'Occupied', employeeId: serverId,
          assignedToName: serverName, timeSeated: new Date().toISOString(), orderId
        });
        const newGuests = Array.from({ length: guestCount }).map((_, i) => ({ id: i + 1 }));
        onUpdateTableOrder(state.actionTable.id, { items: [], guests: newGuests, orderType: 'Dine In' });
        state.setActiveTableId(state.actionTable.id);
        state.setActionTable(null);
      }}
      onTableAction={(act) => executeTableAction(
        act, state.actionTable, currentUser, activeTableOrders,
        onUpdateTableStatus, onUpdateTableOrder, state.setActiveTableId,
        state.setShowPayment, state.setActionTable
      )}
    />
  );
};

export default TableServiceApp;
