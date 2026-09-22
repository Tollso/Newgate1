import { DiningOrderItem, KitchenTicket, Employee, DiningTable } from '../../types';

export const buildKitchenTicket = (
  orderItems: DiningOrderItem[],
  activeTable: DiningTable,
  orderType: string,
  currentUser: Employee
): KitchenTicket | null => {
  const unfiredItems = orderItems.filter(i => !i.fired && !i.isVoided);
  if (unfiredItems.length === 0) return null;

  return {
    id: `TKT-${Date.now()}`,
    orderId: activeTable.orderId || `ORD-${Date.now()}`,
    type: orderType === 'To Go' ? 'Takeout' : 'Dine-in',
    status: 'Pending',
    timeIn: new Date().toISOString(),
    table: `Table ${activeTable.name}`,
    server: currentUser?.name || 'System',
    serverEmployeeId: currentUser?.id || 'system',
    items: unfiredItems.map(i => ({
      name: i.name,
      qty: i.quantity,
      modifiers: i.modifiers || [],
      seatNumber: i.seatNumber,
      guestName: i.seatNumber === 0 ? 'Shared' : `Guest ${i.seatNumber}`,
      printerLabels: Array.from(new Set([
        ...(i.printerLabels || []),
        ...(i.prepStations || [])
      ]))
    }))
  };
};

export const calculateOrderTotals = (
  orderItems: DiningOrderItem[],
  billDiscount: { type: 'Percentage' | 'Fixed'; value: number; name: string } | null,
  payments: { amount: number; method: string }[] = [],
  autoGratuityApplied: boolean = false,
  autoGratuityRate: number = 18,
  serviceFeeApplied: boolean = false,
  serviceFeeConfig?: { name?: string; type?: 'Percentage' | 'Fixed'; value?: number },
  taxRate: number = 8.25
) => {
  const subtotal = orderItems.reduce((acc, i) => i.isVoided ? acc : acc + (i.price * i.quantity), 0);
  let discountAmount = 0;
  if (billDiscount) {
    if (billDiscount.type === 'Percentage') discountAmount = subtotal * (billDiscount.value / 100);
    else discountAmount = billDiscount.value;
  }
  const taxableSubtotal = Math.max(0, subtotal - discountAmount);
  const tax = taxableSubtotal * (taxRate / 100);

  let autoGratuityAmount = 0;
  if (autoGratuityApplied) {
    autoGratuityAmount = taxableSubtotal * (autoGratuityRate / 100);
  }

  let serviceFeeAmount = 0;
  if (serviceFeeApplied && serviceFeeConfig) {
    const feeVal = serviceFeeConfig.value ?? 3.5;
    if (serviceFeeConfig.type === 'Fixed') {
      serviceFeeAmount = feeVal;
    } else {
      serviceFeeAmount = taxableSubtotal * (feeVal / 100);
    }
  }

  const total = taxableSubtotal + tax + autoGratuityAmount + serviceFeeAmount;
  const totalPaidSoFar = payments.reduce((sum, p) => sum + p.amount, 0);
  const remainingTotal = Math.max(0, total - totalPaidSoFar);

  return { 
    subtotal, 
    tax, 
    discountAmount, 
    autoGratuityAmount, 
    serviceFeeAmount, 
    total, 
    totalPaidSoFar, 
    remainingTotal 
  };
};
