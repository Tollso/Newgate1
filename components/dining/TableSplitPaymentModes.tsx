import React from 'react';
import { DiningOrderItem } from '../../types';
import { SplitEvenMode } from './SplitEvenMode';
import { SplitGuestMode } from './SplitGuestMode';
import { SplitItemMode } from './SplitItemMode';

interface TableSplitPaymentModesProps {
  paymentMode: 'SPLIT_EVEN' | 'SPLIT_GUEST' | 'SPLIT_ITEM';
  setPaymentMode: (mode: 'SELECT' | 'SPLIT_EVEN' | 'SPLIT_GUEST' | 'SPLIT_ITEM') => void;
  splitWays: number;
  setSplitWays: (val: number | ((prev: number) => number)) => void;
  finalTotal: number;
  setAmountToPay: (val: number) => void;
  setTableCardPaymentStep: (step: 'NONE' | 'TAP' | 'TIP' | 'GIFT_CARD') => void;
  guests: { id: number; name?: string }[];
  orderItems: DiningOrderItem[];
  splitChecks: { id: string; name: string; items: { cartId: string; qty: number }[]; paid: boolean }[];
  setSplitChecks: React.Dispatch<React.SetStateAction<any[]>>;
  activeSplitCheckId: string;
  setActiveSplitCheckId: (id: string) => void;
  assignItemToCheck: (cartId: string, qty: number) => void;
  unassignItemFromCheck: (cartId: string, qty: number) => void;
  addSplitCheck: () => void;
  activeSplitCheckTotal: number;
  activeSplitCheck: { id: string; name: string; items: { cartId: string; qty: number }[]; paid: boolean } | undefined;
  totals?: {
    subtotal: number;
    tax: number;
    discountAmount: number;
    autoGratuityAmount: number;
    serviceFeeAmount: number;
    total: number;
    totalPaidSoFar: number;
    remainingTotal: number;
  };
  serviceFeeName?: string;
  taxRate?: number;
  onApplySplit?: (mode: 'SPLIT_EVEN' | 'SPLIT_GUEST' | 'SPLIT_ITEM', count: number) => void;
}

export const TableSplitPaymentModes: React.FC<TableSplitPaymentModesProps> = ({
  paymentMode,
  setPaymentMode,
  splitWays,
  setSplitWays,
  finalTotal,
  setAmountToPay,
  setTableCardPaymentStep,
  guests,
  orderItems,
  splitChecks,
  activeSplitCheckId,
  setActiveSplitCheckId,
  assignItemToCheck,
  unassignItemFromCheck,
  addSplitCheck,
  activeSplitCheck,
  totals,
  serviceFeeName = 'Service Fee',
  taxRate = 8.25,
  onApplySplit
}) => {
  const orderSubtotal = totals?.subtotal ?? orderItems.filter(i => !i.isVoided).reduce((sum, i) => sum + (i.price * i.quantity), 0);
  const orderServiceFee = totals?.serviceFeeAmount ?? 0;
  const orderTax = totals?.tax ?? (orderSubtotal * (taxRate / 100));
  const orderAutoGratuity = totals?.autoGratuityAmount ?? 0;
  const orderDiscount = totals?.discountAmount ?? 0;

  const getCheckBreakdown = (checkSubtotal: number) => {
    const ratio = orderSubtotal > 0 ? (checkSubtotal / orderSubtotal) : 0;
    const serviceFeeShare = ratio * orderServiceFee;
    const taxShare = ratio * orderTax;
    const autoGratuityShare = ratio * orderAutoGratuity;
    const discountShare = ratio * orderDiscount;
    const checkTotal = Math.max(0, checkSubtotal - discountShare + taxShare + autoGratuityShare + serviceFeeShare);

    return {
      subtotal: checkSubtotal,
      serviceFee: serviceFeeShare,
      tax: taxShare,
      autoGratuity: autoGratuityShare,
      discount: discountShare,
      total: checkTotal
    };
  };

  if (paymentMode === 'SPLIT_EVEN') {
    return (
      <SplitEvenMode
        splitWays={splitWays}
        setSplitWays={setSplitWays}
        finalTotal={finalTotal}
        setAmountToPay={setAmountToPay}
        setTableCardPaymentStep={setTableCardPaymentStep}
        setPaymentMode={setPaymentMode}
        onApplySplit={onApplySplit}
        totals={totals}
      />
    );
  }

  if (paymentMode === 'SPLIT_GUEST') {
    return (
      <SplitGuestMode
        guests={guests}
        orderItems={orderItems}
        getCheckBreakdown={getCheckBreakdown}
        serviceFeeName={serviceFeeName}
        setAmountToPay={setAmountToPay}
        setTableCardPaymentStep={setTableCardPaymentStep}
        setPaymentMode={setPaymentMode}
        onApplySplit={onApplySplit}
      />
    );
  }

  if (paymentMode === 'SPLIT_ITEM') {
    return (
      <SplitItemMode
        orderItems={orderItems}
        splitChecks={splitChecks}
        activeSplitCheckId={activeSplitCheckId}
        setActiveSplitCheckId={setActiveSplitCheckId}
        assignItemToCheck={assignItemToCheck}
        unassignItemFromCheck={unassignItemFromCheck}
        addSplitCheck={addSplitCheck}
        activeSplitCheck={activeSplitCheck}
        getCheckBreakdown={getCheckBreakdown}
        orderSubtotal={orderSubtotal}
        orderServiceFee={orderServiceFee}
        serviceFeeName={serviceFeeName}
        setAmountToPay={setAmountToPay}
        setTableCardPaymentStep={setTableCardPaymentStep}
        setPaymentMode={setPaymentMode}
        onApplySplit={onApplySplit}
      />
    );
  }

  return null;
};
