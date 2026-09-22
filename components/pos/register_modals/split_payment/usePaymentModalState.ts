import { useState } from 'react';
import { playBeep } from '../../../../utils';
import { SplitPart, PaymentViewMode } from './splitTypes';

export function getOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export function calculateSplitParts(totalAmount: number, count: number): SplitPart[] {
  const base = Math.floor((totalAmount / count) * 100) / 100;
  const parts: SplitPart[] = [];
  let accumulated = 0;
  for (let i = 0; i < count; i++) {
    if (i === count - 1) {
      const lastAmount = Math.max(0, Math.round((totalAmount - accumulated) * 100) / 100);
      parts.push({ partNumber: i + 1, amount: lastAmount, status: 'Pending' });
    } else {
      parts.push({ partNumber: i + 1, amount: base, status: 'Pending' });
      accumulated += base;
    }
  }
  return parts;
}

interface UsePaymentModalStateProps {
  total: number;
  initialSplitMode?: boolean;
  giftCards?: any[];
  setGiftCards?: any;
  onPay: (paymentMethod: string, tipAmount?: number) => void;
}

export function usePaymentModalState({
  total,
  initialSplitMode = false,
  giftCards = [],
  setGiftCards,
  onPay
}: UsePaymentModalStateProps) {
  const [view, setView] = useState<PaymentViewMode>(initialSplitMode ? 'SPLIT_SETUP' : 'METHODS');
  const [splitCount, setSplitCount] = useState<number>(2);
  const [isSplitMode, setIsSplitMode] = useState<boolean>(initialSplitMode);
  const [splitParts, setSplitParts] = useState<SplitPart[]>(() => calculateSplitParts(total, 2));
  const [currentPartIndex, setCurrentPartIndex] = useState<number>(0);
  const [statusNotification, setStatusNotification] = useState<string>('');

  const [selectedTip, setSelectedTip] = useState<number>(0);
  const [customTipInput, setCustomTipInput] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<string>('Card');
  const [gcCode, setGcCode] = useState('');
  const [gcError, setGcError] = useState('');
  const [currentDue, setCurrentDue] = useState<number>(total);
  const [partialPaidMessage, setPartialPaidMessage] = useState<string>('');

  const [amountMode, setAmountMode] = useState<'FULL' | 'CUSTOM'>('FULL');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [partialPayments, setPartialPayments] = useState<{ amount: number; method: string; tip?: number }[]>([]);

  const handleInitiateSplit = () => {
    const parts = calculateSplitParts(total, 2);
    setSplitCount(2);
    setSplitParts(parts);
    setCurrentPartIndex(0);
    setIsSplitMode(true);
    setView('SPLIT_SETUP');
  };

  const handleUpdateSplitCount = (newCount: number) => {
    const validCount = Math.max(2, Math.min(10, newCount));
    setSplitCount(validCount);
    setSplitParts(calculateSplitParts(total, validCount));
    setCurrentPartIndex(0);
  };

  const handleStartSplitPayments = () => {
    setIsSplitMode(true);
    setCurrentPartIndex(0);
    setView('METHODS');
    setStatusNotification(`Ready for 1st Payment ($${splitParts[0]?.amount.toFixed(2)})`);
  };

  const activePart = isSplitMode && splitParts[currentPartIndex] ? splitParts[currentPartIndex] : null;
  const currentPayableAmount = isSplitMode && activePart ? activePart.amount : currentDue;

  const parsedCustom = parseFloat(customAmount);
  const effectivePayAmount =
    !isSplitMode && amountMode === 'CUSTOM' && !isNaN(parsedCustom) && parsedCustom > 0
      ? Math.min(currentDue, Math.round(parsedCustom * 100) / 100)
      : currentPayableAmount;

  const completeSplitPartPayment = (method: string, tip: number = 0) => {
    const updatedParts: SplitPart[] = splitParts.map((p, idx) =>
      idx === currentPartIndex ? { ...p, status: 'Paid' as const, method, tip } : p
    );
    setSplitParts(updatedParts);

    const nextIndex = currentPartIndex + 1;
    if (nextIndex < updatedParts.length) {
      playBeep('success');
      setCurrentPartIndex(nextIndex);
      setSelectedTip(0);
      setCustomTipInput('');
      setView('METHODS');
      setStatusNotification(
        `✓ ${getOrdinal(currentPartIndex + 1)} Payment Complete! Now taking ${getOrdinal(nextIndex + 1)} Payment ($${updatedParts[nextIndex].amount.toFixed(2)})`
      );
    } else {
      playBeep('success');
      const totalTipAll = updatedParts.reduce((sum, p) => sum + (p.tip || 0), 0);
      const methodsUsed = Array.from(new Set(updatedParts.map((p) => p.method))).join(' & ');
      onPay(`Split (${updatedParts.length} Parts - ${methodsUsed})`, totalTipAll);
    }
  };

  const handleProcessPayment = (method: string, tip: number = 0) => {
    if (isSplitMode && activePart) {
      completeSplitPartPayment(method, tip);
      return;
    }

    const payAmt = effectivePayAmount;
    const remaining = Math.max(0, Math.round((currentDue - payAmt) * 100) / 100);
    const updatedPartials = [...partialPayments, { amount: payAmt, method, tip }];
    setPartialPayments(updatedPartials);

    if (remaining <= 0.009) {
      playBeep('success');
      const allTip = updatedPartials.reduce((sum, p) => sum + (p.tip || 0), 0);
      const methodsUsed = Array.from(new Set(updatedPartials.map((p) => p.method))).join(' & ');
      const desc = updatedPartials.length > 1 ? `Split (${updatedPartials.length} Parts - ${methodsUsed})` : method;
      onPay(desc, allTip);
    } else {
      playBeep('success');
      setCurrentDue(remaining);
      setAmountMode('FULL');
      setCustomAmount('');
      setSelectedTip(0);
      setCustomTipInput('');
      setView('METHODS');
      setPartialPaidMessage(
        `✓ Collected $${payAmt.toFixed(2)} via ${method}${tip > 0 ? ` (+$${tip.toFixed(2)} tip)` : ''}. Remaining due: $${remaining.toFixed(2)}`
      );
      setStatusNotification(`Partial payment of $${payAmt.toFixed(2)} processed. Remaining balance: $${remaining.toFixed(2)}`);
    }
  };

  const handleGiftCardPay = () => {
    setGcError('');
    if (!gcCode.trim()) {
      setGcError('Please enter a gift card code');
      playBeep('error');
      return;
    }
    const cleanInput = (gcCode || '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    const gc = giftCards.find((g: any) => (g.code || '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase() === cleanInput);
    if (!gc || gc.status !== 'Active' || gc.balance <= 0) {
      setGcError(!gc ? 'Gift card not found.' : 'Gift card is depleted or inactive.');
      playBeep('error');
      return;
    }

    const payableTotal = currentPayableAmount + selectedTip;
    const amountToDeduct = Math.min(gc.balance, payableTotal);
    const remainingAfterGC = Math.max(0, payableTotal - amountToDeduct);

    if (setGiftCards) {
      setGiftCards(giftCards.map((g: any) => {
        if (g.id !== gc.id) return g;
        const bal = Math.max(0, g.balance - amountToDeduct);
        return { ...g, balance: bal, status: bal <= 0 ? 'Redeemed' : 'Active' };
      }));
    }
    playBeep('success');

    if (isSplitMode) {
      if (remainingAfterGC <= 0) completeSplitPartPayment('Gift Card', selectedTip);
      else setGcError(`Gift card covered $${amountToDeduct.toFixed(2)}. Pay remaining $${remainingAfterGC.toFixed(2)}.`);
    } else {
      if (remainingAfterGC <= 0) onPay('Gift Card', selectedTip);
      else {
        setCurrentDue(remainingAfterGC - selectedTip);
        setPartialPaidMessage(`Applied $${amountToDeduct.toFixed(2)} from Gift Card. Due: $${(remainingAfterGC - selectedTip).toFixed(2)}`);
        setGcCode('');
        setView('METHODS');
      }
    }
  };

  return {
    view, setView, splitCount, isSplitMode, setIsSplitMode, splitParts, setSplitParts,
    currentPartIndex, setCurrentPartIndex, statusNotification, selectedTip, setSelectedTip,
    customTipInput, setCustomTipInput, selectedMethod, setSelectedMethod, gcCode, setGcCode,
    gcError, setGcError, currentDue, partialPaidMessage, amountMode, setAmountMode,
    customAmount, setCustomAmount, partialPayments, currentPayableAmount, effectivePayAmount,
    handleInitiateSplit, handleUpdateSplitCount, handleStartSplitPayments, handleProcessPayment,
    handleGiftCardPay
  };
}
