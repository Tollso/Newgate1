import React from 'react';
import { TableGuestSection } from './TableGuestSection';
import { MoveItemModal } from './MoveItemModal';
import { TableMenuGrid } from './TableMenuGrid';
import { OrderOptionsModals } from './OrderOptionsModals';
import { TableTicketHeader } from './TableTicketHeader';
import { TableOrderFooter } from './TableOrderFooter';
import { AdminDiscountModal } from './AdminDiscountModal';
import { Check } from 'lucide-react';
import { TableServiceOrderPanelProps } from './order_panel/orderPanelTypes';
import { useOrderPanelState } from './order_panel/useOrderPanelState';

export const TableServiceOrderPanel: React.FC<TableServiceOrderPanelProps> = ({
  table, orderItems, guests, activeSeat, setActiveSeat, inventory = [], categories = [],
  activeCategory, setActiveCategory, searchTerm, setSearchTerm, onBackToFloor, onAddToOrder,
  onFire, onOpenPayment, subtotal, tax, total, onUpdateOrderItems, onAddGuest, onPrintBill,
  allTables = [], onMoveOrder, onCombineOrders, onTransferServer, onDeleteOrder,
  preAuthInfo, onSavePreAuth, autoGratuityApplied = false, onToggleAutoGratuity,
  autoGratuityRate = 18, autoGratuityAmount = 0, serviceFeeApplied = false,
  onToggleServiceFee, serviceFeeName = 'Service Fee', serviceFeeValue = 3.5,
  serviceFeeType = 'Percentage', serviceFeeAmount = 0, onOpenSettings
}) => {
  const state = useOrderPanelState({ orderItems, preAuthInfo, onUpdateOrderItems, onPrintBill });

  const filteredMenu = inventory.filter(i => 
    (activeCategory === 'All' || i.category === activeCategory) &&
    i.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col lg:flex-row bg-slate-900 text-white animate-fade-in font-sans overflow-hidden">
      <div className="w-full lg:w-[320px] xl:w-[400px] h-[45vh] lg:h-auto border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col bg-slate-900 shrink-0 relative">
        {state.noticeMessage && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-50 bg-indigo-600 text-white px-4 py-2 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold border border-indigo-400 animate-fade-in-down whitespace-nowrap">
            <Check size={16} /> {state.noticeMessage}
          </div>
        )}
        <TableTicketHeader
          table={table} onBackToFloor={onBackToFloor} onAddGuest={onAddGuest}
          preAuthInfo={state.localPreAuthInfo} onOpenSettings={onOpenSettings}
        />

        <TableGuestSection
          orderItems={orderItems} guests={guests} activeSeat={activeSeat}
          setActiveSeat={setActiveSeat} activeGuestActions={state.activeGuestActions}
          setActiveGuestActions={state.setActiveGuestActions}
          onVoidGuest={state.handleVoidGuest} onDiscountGuest={state.handleDiscountGuest}
          onMoveGuest={state.handleMoveGuest} onVoidItem={state.handleVoidItem}
          onDiscountItem={state.handleDiscountItem} onMoveItem={state.setItemToMove}
          orderSubtotal={subtotal} orderTotal={total}
          onMoveTable={() => state.setActiveModal('MOVE_ORDER')}
          onPayGuest={() => onOpenPayment('SPLIT_GUEST')}
        />

        <TableOrderFooter
          onOpenPayment={onOpenPayment} onFire={onFire} subtotal={subtotal} tax={tax} total={total}
          isAllFired={state.isAllFired} handlePrintBill={state.handlePrintBill}
          autoGratuityApplied={autoGratuityApplied} autoGratuityAmount={autoGratuityAmount}
          serviceFeeApplied={serviceFeeApplied} serviceFeeAmount={serviceFeeAmount}
          showOrderOptions={state.showOrderOptions} setShowOrderOptions={state.setShowOrderOptions}
          setActiveModal={state.setActiveModal} onUpdateOrderItems={onUpdateOrderItems}
          orderItems={orderItems} showNotice={state.showNotice}
          onToggleAutoGratuity={onToggleAutoGratuity} autoGratuityRate={autoGratuityRate}
          onToggleServiceFee={onToggleServiceFee} serviceFeeName={serviceFeeName}
          serviceFeeValue={serviceFeeValue} serviceFeeType={serviceFeeType}
          onOpenSettings={onOpenSettings}
        />
      </div>

      <TableMenuGrid 
        searchTerm={searchTerm} setSearchTerm={setSearchTerm}
        activeCategory={activeCategory} setActiveCategory={setActiveCategory}
        categories={categories} filteredMenu={filteredMenu} onAddToOrder={onAddToOrder}
      />

      {(state.itemToMove || state.guestToMove !== null) && (
        <MoveItemModal 
          itemToMove={state.itemToMove} guestToMove={state.guestToMove}
          guests={guests} orderItems={orderItems} onUpdateOrderItems={onUpdateOrderItems}
          onClose={() => { state.setItemToMove(null); state.setGuestToMove(null); }}
        />
      )}

      {state.discountTarget && (
        <AdminDiscountModal
          title={state.discountTarget.type === 'GUEST' ? `Guest ${state.discountTarget.seatNumber === 0 ? 'Shared' : state.discountTarget.seatNumber} Discount` : 'Item Discount'}
          subtitle="Select an admin discount rate to apply"
          onApplyDiscount={(d) => {
            if (state.discountTarget?.type === 'ITEM') {
              onUpdateOrderItems(orderItems.map(i => i.cartId === (state.discountTarget as any).cartId ? { ...i, discount: d ? { type: d.type, value: d.value, name: d.name } : undefined } : i));
              state.showNotice(d ? `Applied ${d.name}` : 'Discount cleared');
            } else if (state.discountTarget?.type === 'GUEST') {
              onUpdateOrderItems(orderItems.map(i => i.seatNumber === (state.discountTarget as any).seatNumber ? { ...i, discount: d ? { type: d.type, value: d.value, name: d.name } : undefined } : i));
              state.showNotice(d ? `Applied ${d.name} to Guest items` : 'Guest discounts cleared');
            }
          }}
          onClose={() => state.setDiscountTarget(null)}
        />
      )}

      <OrderOptionsModals
        activeModal={state.activeModal} onCloseModal={() => state.setActiveModal(null)}
        table={table} orderItems={orderItems} guests={guests}
        subtotal={subtotal} tax={tax} total={total}
        autoGratuityAmount={autoGratuityAmount} serviceFeeAmount={serviceFeeAmount}
        serviceFeeName={serviceFeeName} allTables={allTables}
        onAddPreAuth={(data) => { state.setLocalPreAuthInfo(data); if (onSavePreAuth) onSavePreAuth(data); }}
        onMoveOrder={(src, tgt) => { if (onMoveOrder) onMoveOrder(src, tgt); else onBackToFloor(); }}
        onCombineOrders={(tgt) => { if (onCombineOrders) onCombineOrders(tgt); }}
        onTransferServer={(srv) => { if (onTransferServer) onTransferServer(srv); }}
        onDeleteOrder={() => { if (onDeleteOrder) onDeleteOrder(); else onUpdateOrderItems(orderItems.map(i => ({ ...i, isVoided: true }))); }}
        showNotice={state.showNotice}
      />
    </div>
  );
};
