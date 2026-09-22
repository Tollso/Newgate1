import React, { useState } from 'react';
import { InventoryItem, Category, CartItem, Employee, DiscountCode, PaymentSplit, GlobalTaxConfig, TipConfig, KitchenTicket, Customer } from '../../types';
import MenuGrid from './Register/MenuGrid';
import OrderSidebar from './Register/OrderSidebar';
import { Loader2, Check, Search, UserPlus } from 'lucide-react';
import { ItemDetailModal } from './register_modals/ItemDetailModal';
import { RemovalReasonModal } from './register_modals/RemovalReasonModal';
import { CustomerModal } from './register_modals/CustomerModal';
import { DiscountModal } from './register_modals/DiscountModal';
import { PaymentModal } from './register_modals/PaymentModal';
import { getDefaultRemovalReasons } from './register_modals/registerHelpers';
import { useRegisterState } from './Register/useRegisterState';
import { ReceiptPromptModal } from '../receipt/ReceiptPromptModal';
import { ReceiptDeliveryOption } from '../receipt/receiptTypes';

interface RegisterProps {
  inventory: InventoryItem[];
  categories: Category[];
  discounts: DiscountCode[];
  activeCart: CartItem[];
  onUpdateCart: (cart: CartItem[]) => void;
  onFinish: (cart: CartItem[], total: number, payments: PaymentSplit[], tipAmount?: number, discountAmount?: number) => void;
  currentUser?: Employee;
  taxConfig?: GlobalTaxConfig;
  tipConfig?: TipConfig;
  onFireToKitchen?: (ticket: KitchenTicket) => void;
  onAddCustomer?: (customer: Customer) => void;
  onSaveItem?: (item: InventoryItem) => void;
  currentOrderId?: string | null;
  removalReasons?: string[];
  giftCards?: any[];
  setGiftCards?: any;
}

export const Register: React.FC<RegisterProps> = (props) => {
  const [orderType, setOrderType] = useState('Dine-in');
  const [isLoading, setIsLoading] = useState(false);

  const state = useRegisterState({
    inventory: props.inventory,
    activeCart: props.activeCart,
    onUpdateCart: props.onUpdateCart,
    discounts: props.discounts,
    currentUser: props.currentUser,
    currentOrderId: props.currentOrderId,
    orderType,
    taxConfig: props.taxConfig
  });

  const { subtotal, tax, total } = state.calculateTotals();

  const handlePaymentApproved = (method: string, tipAmount: number = 0) => {
    state.setShowPaymentModal(false);
    state.setIsSplitPaymentRequested(false);
    const finalTotal = total + tipAmount;

    state.setReceiptContext({
      orderId: props.currentOrderId || `ORD-${Date.now().toString().slice(-6)}`,
      orderNumber: (props.currentOrderId || Date.now().toString()).slice(-4),
      total: finalTotal,
      subtotal,
      tax,
      tip: tipAmount,
      paymentMethod: method,
      customerName: state.activeCustomer || undefined,
      appName: 'Register',
      items: state.currentCart.map(i => ({ name: i.name, qty: i.quantity, price: i.price }))
    });
    state.setShowReceiptModal(true);
  };

  const handleReceiptOptionComplete = (_option: ReceiptDeliveryOption) => {
    state.setShowReceiptModal(false);
    setIsLoading(true);

    setTimeout(() => {
      const discountAmt = state.activeDiscount ? (state.activeDiscount.type === 'Percentage' ? subtotal * (state.activeDiscount.value / 100) : state.activeDiscount.value) : 0;
      const finalTotal = total + (state.receiptContext?.tip || 0);
      props.onFinish(state.currentCart, finalTotal, [{ method: state.receiptContext?.paymentMethod || 'Card', amount: finalTotal, status: 'Paid' }], state.receiptContext?.tip || 0, discountAmt);
      state.setActiveCustomer(null);
      state.setReceiptContext(null);
      setIsLoading(false);
    }, 400);
  };

  const handleFire = () => {
    const unfiredItems = state.currentCart.filter(i => !i.isFired && !i.isVoided);
    if (unfiredItems.length > 0 && props.onFireToKitchen) {
      props.onFireToKitchen({
        id: `TKT-${Date.now()}`,
        orderId: props.currentOrderId || `ORD-${Date.now()}`,
        type: orderType as any,
        status: 'Pending',
        timeIn: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        items: unfiredItems.map(i => ({ name: i.name, qty: i.quantity, modifiers: i.modifiers || [] })),
        server: props.currentUser?.name || 'Cashier',
        table: orderType
      });
      state.safeUpdateCart(state.currentCart.map(i => ({ ...i, isFired: true })));
    }
  };

  return (
    <div className="flex h-full bg-white rounded-[2rem] overflow-hidden shadow-2xl border border-slate-200 relative">
      {state.selectedItemForEdit && (
        <ItemDetailModal item={state.selectedItemForEdit} discounts={props.discounts} onClose={() => state.setSelectedItemForEdit(null)} onSave={(item) => state.safeUpdateCart(state.currentCart.map(i => i.cartId === item.cartId ? item : i))} onVoid={(item) => state.setRemovalItemPending({ cartId: item.cartId || item.id, item, isVoidOnly: true })} />
      )}
      {state.removalItemPending && (
        <RemovalReasonModal itemName={state.removalItemPending.item.name} reasons={getDefaultRemovalReasons(props.removalReasons)} onClose={() => state.setRemovalItemPending(null)} onConfirm={state.handleConfirmRemoval} />
      )}
      {state.showCustomerModal && <CustomerModal onClose={() => state.setShowCustomerModal(false)} onSelect={state.setActiveCustomer} onAdd={props.onAddCustomer} />}
      {state.showDiscountModal && <DiscountModal discounts={props.discounts} onClose={() => state.setShowDiscountModal(false)} onApply={state.setActiveDiscount} />}
      {state.showPaymentModal && (
        <PaymentModal total={total} cart={state.currentCart} onClose={() => { state.setShowPaymentModal(false); state.setIsSplitPaymentRequested(false); }} onPay={handlePaymentApproved} giftCards={props.giftCards} setGiftCards={props.setGiftCards} initialSplitMode={state.isSplitPaymentRequested} />
      )}
      {state.showReceiptModal && state.receiptContext && (
        <ReceiptPromptModal isOpen={state.showReceiptModal} orderContext={state.receiptContext} onComplete={handleReceiptOptionComplete} onClose={() => handleReceiptOptionComplete('NONE')} />
      )}
      
      <div className="flex-1 flex flex-col bg-slate-50/50 relative">
        <div className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => state.setShowCustomerModal(true)} className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-200 transition-colors">
              {state.activeCustomer ? <><Check size={16} className="text-emerald-500" /> {state.activeCustomer}</> : <><UserPlus size={16} /> Add Customer</>}
            </button>
            <select value={orderType} onChange={(e) => setOrderType(e.target.value)} className="bg-slate-100 border-none rounded-lg px-3 py-1.5 text-sm font-bold text-slate-600 focus:ring-0 cursor-pointer hover:bg-slate-200 transition-colors">
              <option>Dine-in</option>
              <option>Takeout</option>
              <option>Delivery</option>
            </select>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input type="text" placeholder="Search..." value={state.searchTerm} onChange={e => state.setSearchTerm(e.target.value)} className="w-full bg-slate-100 rounded-lg pl-9 pr-3 py-1.5 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
        </div>

        <MenuGrid items={state.filteredItems} categories={props.categories} activeCategory={state.activeCategory} onCategoryChange={state.setActiveCategory} onItemSelect={state.handleAddToCart} searchTerm={state.searchTerm} onSearchChange={state.setSearchTerm} onSaveItem={props.onSaveItem} />
      </div>

      <OrderSidebar cart={state.currentCart} onUpdateQty={state.handleUpdateQty} onRemoveItem={state.handleRemoveItem} onEditItem={state.setSelectedItemForEdit} onCheckout={() => { state.setIsSplitPaymentRequested(false); state.setShowPaymentModal(true); }} onSplit={() => { state.setIsSplitPaymentRequested(true); state.setShowPaymentModal(true); }} onDiscount={() => state.setShowDiscountModal(true)} onFire={handleFire} subtotal={subtotal} tax={tax} total={total} orderType={orderType} activeCustomer={state.activeCustomer} activeDiscount={state.activeDiscount} taxConfig={props.taxConfig} currentOrderId={props.currentOrderId} />
      
      {isLoading && (
        <div className="absolute inset-0 z-[100] bg-white/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl shadow-xl flex items-center gap-4">
            <Loader2 className="animate-spin text-indigo-600" />
            <span className="font-bold text-slate-800">Processing Transaction...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
