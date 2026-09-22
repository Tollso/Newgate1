import { useState } from 'react';
import { InventoryItem, CartItem, DiscountCode, Employee, GlobalTaxConfig, getEffectiveTaxRate } from '../../../types';
import { logRemovedItem } from '../register_modals/registerHelpers';
import { ReceiptOrderContext } from '../../receipt/receiptTypes';

interface UseRegisterStateProps {
  inventory: InventoryItem[];
  activeCart: CartItem[];
  onUpdateCart: (cart: CartItem[]) => void;
  discounts: DiscountCode[];
  currentUser?: Employee;
  currentOrderId?: string | null;
  orderType: string;
  taxConfig?: GlobalTaxConfig;
}

export function useRegisterState({
  inventory,
  activeCart,
  onUpdateCart,
  currentUser,
  currentOrderId,
  orderType,
  taxConfig
}: UseRegisterStateProps) {
  const [internalCart, setInternalCart] = useState<CartItem[]>([]);
  const [activeCustomer, setActiveCustomer] = useState<string | null>(null);
  const [activeDiscount, setActiveDiscount] = useState<DiscountCode | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItemForEdit, setSelectedItemForEdit] = useState<CartItem | null>(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isSplitPaymentRequested, setIsSplitPaymentRequested] = useState(false);
  const [removalItemPending, setRemovalItemPending] = useState<{ cartId: string; item: CartItem; isVoidOnly?: boolean } | null>(null);
  const [receiptContext, setReceiptContext] = useState<ReceiptOrderContext | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const safeUpdateCart = (newCart: CartItem[]) => {
    if (typeof onUpdateCart === 'function') onUpdateCart(newCart);
    else setInternalCart(newCart);
  };

  const currentCart = activeCart && activeCart.length > 0 ? activeCart : (onUpdateCart ? activeCart : internalCart);

  const filteredItems = inventory.filter(i => 
    i.showOnPos && 
    (activeCategory === 'All' || i.category === activeCategory) &&
    i.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddToCart = (item: InventoryItem) => {
    if (!item.inStock) {
      alert(`${item.name} is currently out of stock.`);
      return;
    }
    const updatedCart = [...currentCart];
    const existing = updatedCart.find(i => i.id === item.id && (!i.modifiers || i.modifiers.length === 0));
    if (existing) existing.quantity += 1;
    else {
      updatedCart.push({ 
        ...item, 
        cartId: `cart-${Date.now()}-${Math.random()}`,
        quantity: 1, 
        modifiers: [], 
        color: 'bg-white' 
      });
    }
    safeUpdateCart(updatedCart);
  };

  const handleConfirmRemoval = (reason: string) => {
    if (!removalItemPending) return;
    const { cartId, item, isVoidOnly } = removalItemPending;
    logRemovedItem(item, reason, currentUser, currentOrderId, orderType);
    if (isVoidOnly) {
      safeUpdateCart(currentCart.map(i => (i.cartId || i.id) === cartId ? { ...i, isVoided: true, voidReason: reason } : i));
      setSelectedItemForEdit(null);
    } else {
      safeUpdateCart(currentCart.filter(i => (i.cartId || i.id) !== cartId));
    }
    setRemovalItemPending(null);
  };

  const handleUpdateQty = (cartId: string, delta: number) => {
    const item = currentCart.find(i => (i.cartId || i.id) === cartId);
    if (item && item.quantity + delta <= 0) {
      setRemovalItemPending({ cartId, item, isVoidOnly: false });
      return;
    }
    safeUpdateCart(currentCart.map(i => (i.cartId || i.id) === cartId ? { ...i, quantity: i.quantity + delta } : i).filter(i => i.quantity > 0));
  };

  const handleRemoveItem = (cartId: string) => {
    const item = currentCart.find(i => (i.cartId || i.id) === cartId);
    if (item) setRemovalItemPending({ cartId, item, isVoidOnly: false });
  };

  const calculateTotals = () => {
    const subtotal = currentCart.reduce((acc, item) => {
      if (item.isVoided) return acc;
      let itemTotal = item.price * item.quantity;
      if (item.discount) {
        itemTotal -= item.discount.type === 'Percentage' ? itemTotal * (item.discount.value / 100) : item.discount.value;
      }
      return acc + Math.max(0, itemTotal);
    }, 0);

    const discountAmt = activeDiscount ? (activeDiscount.type === 'Percentage' ? subtotal * (activeDiscount.value / 100) : activeDiscount.value) : 0;
    const taxable = Math.max(0, subtotal - discountAmt);
    const rate = getEffectiveTaxRate(taxConfig) / 100;
    const tax = taxable * rate;
    return { subtotal, tax, total: taxable + tax };
  };

  return {
    activeCustomer, setActiveCustomer, activeDiscount, setActiveDiscount,
    activeCategory, setActiveCategory, searchTerm, setSearchTerm,
    selectedItemForEdit, setSelectedItemForEdit, showCustomerModal, setShowCustomerModal,
    showDiscountModal, setShowDiscountModal, showPaymentModal, setShowPaymentModal,
    isSplitPaymentRequested, setIsSplitPaymentRequested, removalItemPending, setRemovalItemPending,
    receiptContext, setReceiptContext, showReceiptModal, setShowReceiptModal,
    currentCart, filteredItems, safeUpdateCart, handleAddToCart, handleConfirmRemoval,
    handleUpdateQty, handleRemoveItem, calculateTotals
  };
}
