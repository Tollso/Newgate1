import { useState } from 'react';
import { InventoryItem, CartItem, GlobalTaxConfig } from '../../../types';

export function useKioskCart(taxConfig: GlobalTaxConfig) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * (taxConfig.rate / 100);
  const total = subtotal + tax;

  const handleSelectItem = (item: InventoryItem) => setSelectedItem(item);

  const handleConfirmModifierItem = (item: InventoryItem, modifiers: string[], finalPrice: number) => {
    setCart(prev => [
      ...prev,
      { ...item, price: item.price, quantity: 1, subtotal: finalPrice, modifiers }
    ]);
  };

  const updateQuantity = (cartIndex: number, delta: number) => {
    setCart(prev => {
      const newCart = [...prev];
      const item = newCart[cartIndex];
      const newQty = item.quantity + delta;
      if (newQty <= 0) return newCart.filter((_, idx) => idx !== cartIndex);
      newCart[cartIndex] = { ...item, quantity: newQty };
      return newCart;
    });
  };

  const handleAddCrossSellItem = (suggested: { id: string; name: string; price: number; category: string }) => {
    setCart(prev => [
      ...prev,
      { id: suggested.id, name: suggested.name, price: suggested.price, quantity: 1, subtotal: suggested.price, category: suggested.category, inStock: true }
    ]);
  };

  return {
    cart,
    setCart,
    selectedItem,
    setSelectedItem,
    subtotal,
    tax,
    total,
    handleSelectItem,
    handleConfirmModifierItem,
    updateQuantity,
    handleAddCrossSellItem
  };
}
