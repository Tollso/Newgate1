import React from 'react';
import { DiningTable, InventoryItem, Category, DiningOrderItem } from '../../../types';
import { TableServiceOrderPanel } from '../TableServiceOrderPanel';
import { TableServicePaymentModal } from '../TableServicePaymentModal';
import { ActiveTableOrderData } from './tableServiceTypes';

interface ActiveTableOrderScreenProps {
  activeTable: DiningTable;
  orderItems: DiningOrderItem[];
  guests: { id: number; name?: string }[];
  activeSeat: number;
  setActiveSeat: (seat: number) => void;
  inventory: InventoryItem[];
  categories: Category[];
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onBackToFloor: () => void;
  onAddToOrder: (item: InventoryItem) => void;
  onFire: () => void;
  onOpenPayment: (initialMode?: 'SELECT' | 'SPLIT_EVEN' | 'SPLIT_GUEST' | 'SPLIT_ITEM') => void;
  totals: any;
  updateOrderItems: (items: DiningOrderItem[]) => void;
  safeTables: DiningTable[];
  handleMoveOrder: (sourceId: string, targetId: string) => void;
  handleCombineOrders: (targetId: string) => void;
  onTransferServer: (serverName: string) => void;
  onDeleteOrder: () => void;
  onAddGuest: () => void;
  currentOrderData: ActiveTableOrderData | undefined;
  onSavePreAuth: (data: any) => void;
  autoGratuityApplied: boolean;
  handleToggleAutoGratuity: () => void;
  autoGratuityRate: number;
  serviceFeeApplied: boolean;
  handleToggleServiceFee: () => void;
  serviceFeeName: string;
  serviceFeeValue: number;
  serviceFeeType: 'Percentage' | 'Fixed';
  onOpenSettings?: () => void;
  showPayment: boolean;
  setShowPayment: (val: boolean) => void;
  tableCardPaymentStep: 'NONE' | 'TAP' | 'TIP' | 'GIFT_CARD';
  setTableCardPaymentStep: (val: 'NONE' | 'TAP' | 'TIP' | 'GIFT_CARD') => void;
  tableSelectedTip: number;
  setTableSelectedTip: (val: number) => void;
  tableCustomTipInput: string;
  setTableCustomTipInput: (val: string) => void;
  billDiscount: any;
  setShowDiscountModal: (val: boolean) => void;
  handleCloseCheck: (method: string, tip?: number, paid?: number) => void;
  giftCards?: any[];
  setGiftCards?: any;
  effectiveTaxRate: number;
  initialPaymentMode: 'SELECT' | 'SPLIT_EVEN' | 'SPLIT_GUEST' | 'SPLIT_ITEM';
}

export const ActiveTableOrderScreen: React.FC<ActiveTableOrderScreenProps> = (props) => {
  const {
    activeTable, orderItems, guests, activeSeat, setActiveSeat, inventory, categories,
    activeCategory, setActiveCategory, searchTerm, setSearchTerm, onBackToFloor,
    onAddToOrder, onFire, onOpenPayment, totals, updateOrderItems, safeTables,
    handleMoveOrder, handleCombineOrders, onTransferServer, onDeleteOrder, onAddGuest,
    currentOrderData, onSavePreAuth, autoGratuityApplied, handleToggleAutoGratuity,
    autoGratuityRate, serviceFeeApplied, handleToggleServiceFee, serviceFeeName,
    serviceFeeValue, serviceFeeType, onOpenSettings, showPayment, setShowPayment,
    tableCardPaymentStep, setTableCardPaymentStep, tableSelectedTip, setTableSelectedTip,
    tableCustomTipInput, setTableCustomTipInput, billDiscount, setShowDiscountModal,
    handleCloseCheck, giftCards, setGiftCards, effectiveTaxRate, initialPaymentMode
  } = props;

  return (
    <div className="h-full relative">
      <TableServiceOrderPanel
        table={activeTable} orderItems={orderItems} guests={guests} activeSeat={activeSeat}
        setActiveSeat={setActiveSeat} inventory={inventory} categories={categories}
        activeCategory={activeCategory} setActiveCategory={setActiveCategory}
        searchTerm={searchTerm} setSearchTerm={setSearchTerm}
        onBackToFloor={onBackToFloor} onAddToOrder={onAddToOrder}
        onFire={onFire} onOpenPayment={onOpenPayment}
        subtotal={totals.subtotal} discountedSubtotal={totals.subtotal}
        tax={totals.tax} total={totals.total} onUpdateOrderItems={updateOrderItems}
        allTables={safeTables} onMoveOrder={handleMoveOrder}
        onCombineOrders={handleCombineOrders}
        onTransferServer={onTransferServer}
        onDeleteOrder={onDeleteOrder}
        onAddGuest={onAddGuest}
        preAuthInfo={currentOrderData?.preAuthInfo}
        onSavePreAuth={onSavePreAuth}
        autoGratuityApplied={autoGratuityApplied}
        onToggleAutoGratuity={handleToggleAutoGratuity}
        autoGratuityRate={autoGratuityRate}
        autoGratuityAmount={totals.autoGratuityAmount}
        serviceFeeApplied={serviceFeeApplied}
        onToggleServiceFee={handleToggleServiceFee}
        serviceFeeName={serviceFeeName}
        serviceFeeValue={serviceFeeValue}
        serviceFeeType={serviceFeeType}
        serviceFeeAmount={totals.serviceFeeAmount}
        onOpenSettings={onOpenSettings}
      />

      {showPayment && (
        <TableServicePaymentModal
          showPayment={showPayment} setShowPayment={setShowPayment}
          tableCardPaymentStep={tableCardPaymentStep} setTableCardPaymentStep={setTableCardPaymentStep}
          tableSelectedTip={tableSelectedTip} setTableSelectedTip={setTableSelectedTip}
          tableCustomTipInput={tableCustomTipInput} setTableCustomTipInput={setTableCustomTipInput}
          total={totals.remainingTotal} activeTable={activeTable} billDiscount={billDiscount}
          setShowDiscountModal={setShowDiscountModal} handleCloseCheck={handleCloseCheck}
          handleSplitCheck={() => {}} giftCards={giftCards} setGiftCards={setGiftCards}
          orderItems={orderItems} guests={guests} preAuthInfo={currentOrderData?.preAuthInfo}
          totals={totals}
          serviceFeeName={serviceFeeName}
          taxRate={effectiveTaxRate}
          initialPaymentMode={initialPaymentMode}
        />
      )}
    </div>
  );
};
