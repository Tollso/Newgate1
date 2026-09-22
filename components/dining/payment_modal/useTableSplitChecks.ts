import { useState } from 'react';
import { DiningOrderItem } from '../../../types';
import { SplitCheckItem } from './TablePaymentModalTypes';

interface UseTableSplitChecksParams {
  orderItems: DiningOrderItem[];
  totals?: {
    subtotal: number;
    tax: number;
    discountAmount: number;
    autoGratuityAmount: number;
    serviceFeeAmount: number;
  };
  taxRate?: number;
}

export const useTableSplitChecks = ({ orderItems, totals, taxRate = 8.25 }: UseTableSplitChecksParams) => {
  const [splitChecks, setSplitChecks] = useState<SplitCheckItem[]>([
    { id: 'check-1', name: 'Check 1', items: [], paid: false }
  ]);
  const [activeSplitCheckId, setActiveSplitCheckId] = useState('check-1');

  const activeSplitCheck = splitChecks.find(c => c.id === activeSplitCheckId);
  const activeSplitCheckSubtotal = activeSplitCheck?.items.reduce((sum, ci) => {
    const originalItem = orderItems.find(i => i.cartId === ci.cartId);
    return sum + ((originalItem ? originalItem.price : 0) * ci.qty);
  }, 0) || 0;

  const orderSubtotal = totals?.subtotal ?? orderItems.filter(i => !i.isVoided).reduce((sum, i) => sum + (i.price * i.quantity), 0);
  const orderServiceFee = totals?.serviceFeeAmount ?? 0;
  const orderTax = totals?.tax ?? (orderSubtotal * (taxRate / 100));
  const orderAutoGratuity = totals?.autoGratuityAmount ?? 0;
  const orderDiscount = totals?.discountAmount ?? 0;

  const activeRatio = orderSubtotal > 0 ? (activeSplitCheckSubtotal / orderSubtotal) : 0;
  const activeSplitCheckServiceFee = activeRatio * orderServiceFee;
  const activeSplitCheckTax = activeRatio * orderTax;
  const activeSplitCheckAutoGratuity = activeRatio * orderAutoGratuity;
  const activeSplitCheckDiscount = activeRatio * orderDiscount;

  const activeSplitCheckTotal = Math.max(0, activeSplitCheckSubtotal - activeSplitCheckDiscount + activeSplitCheckTax + activeSplitCheckAutoGratuity + activeSplitCheckServiceFee);

  const addSplitCheck = () => {
    const id = `check-${splitChecks.length + 1}`;
    setSplitChecks([...splitChecks, { id, name: `Check ${splitChecks.length + 1}`, items: [], paid: false }]);
    setActiveSplitCheckId(id);
  };

  const assignItemToCheck = (cartId: string, qty: number) => {
    if (activeSplitCheck?.paid) return;
    setSplitChecks(checks => checks.map(c => {
      if (c.id === activeSplitCheckId) {
        const existing = c.items.find(i => i.cartId === cartId);
        if (existing) {
          return { ...c, items: c.items.map(i => i.cartId === cartId ? { ...i, qty: i.qty + qty } : i) };
        }
        return { ...c, items: [...c.items, { cartId, qty }] };
      }
      return c;
    }));
  };

  const unassignItemFromCheck = (cartId: string, qty: number) => {
    if (activeSplitCheck?.paid) return;
    setSplitChecks(checks => checks.map(c => {
      if (c.id === activeSplitCheckId) {
        const existing = c.items.find(i => i.cartId === cartId);
        if (existing) {
          if (existing.qty <= qty) {
            return { ...c, items: c.items.filter(i => i.cartId !== cartId) };
          }
          return { ...c, items: c.items.map(i => i.cartId === cartId ? { ...i, qty: i.qty - qty } : i) };
        }
      }
      return c;
    }));
  };

  return {
    splitChecks,
    setSplitChecks,
    activeSplitCheckId,
    setActiveSplitCheckId,
    activeSplitCheck,
    activeSplitCheckTotal,
    addSplitCheck,
    assignItemToCheck,
    unassignItemFromCheck,
  };
};
