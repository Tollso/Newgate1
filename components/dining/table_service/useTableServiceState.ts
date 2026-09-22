import { useState, useEffect } from 'react';
import { DiningTable, InventoryItem, DiningOrderItem, getEffectiveTaxRate } from '../../../types';
import { buildKitchenTicket, calculateOrderTotals } from '../tableServiceHelpers';
import { UseTableServiceProps } from './tableServiceTypes';
import { getOrderSettings, firePendingOrders, moveOrderToTargetTable } from './tableOrderOperations';

export function useTableServiceState(props: UseTableServiceProps) {
  const {
    tables, currentUser, onExit, onFireToKitchen,
    activeTableOrders = {}, onUpdateTableOrder, onUpdateTableStatus, onProcessSale,
    kitchenTickets, onTicketStatusChange, tipConfig, taxConfig
  } = props;

  const [activeTableId, setActiveTableId] = useState<string | null>(null);
  const [actionTable, setActionTable] = useState<DiningTable | null>(null);
  const [activeSeat, setActiveSeat] = useState<number>(0); 
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [showPayment, setShowPayment] = useState(false);
  const [tableCardPaymentStep, setTableCardPaymentStep] = useState<'NONE' | 'TAP' | 'TIP' | 'GIFT_CARD'>('NONE');
  const [tableSelectedTip, setTableSelectedTip] = useState<number>(0);
  const [tableCustomTipInput, setTableCustomTipInput] = useState<string>('');
  const [billDiscount, setBillDiscount] = useState<{ type: 'Percentage' | 'Fixed'; value: number; name: string } | null>(null);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [initialPaymentMode, setInitialPaymentMode] = useState<'SELECT' | 'SPLIT_EVEN' | 'SPLIT_GUEST' | 'SPLIT_ITEM'>('SELECT');

  const currentOrderData = activeTableId ? activeTableOrders[activeTableId] : undefined;
  const orderItems = currentOrderData?.items || [];
  const guests = currentOrderData?.guests || [{ id: 1 }];
  const orderType = currentOrderData?.orderType || 'Dine In';
  
  const [activeSection, setActiveSection] = useState<string>('Main Floor');
  const safeTables = tables || [];
  const floorSections = Array.from(new Set(safeTables.map(t => t.section))).filter((s): s is string => !!s).sort();

  useEffect(() => {
    if (floorSections.length > 0 && (!activeSection || !floorSections.includes(activeSection))) {
      setActiveSection(floorSections[0]);
    }
  }, [floorSections, activeSection]);

  const activeTable = tables.find(t => t.id === activeTableId);

  const updateOrderItems = (newItems: DiningOrderItem[]) => {
    if (activeTableId) {
      onUpdateTableOrder(activeTableId, { 
        items: newItems, guests, orderType, 
        payments: currentOrderData?.payments, preAuthInfo: currentOrderData?.preAuthInfo 
      });
    }
  };

  const handleTableClick = (table: DiningTable) => {
    if (!table.isSeatable) return;
    if (onTicketStatusChange) {
      const tableTickets = (kitchenTickets || []).filter(ticket => ticket.table === 'Table ' + table.name && ticket.status === 'Ready');
      tableTickets.forEach(ticket => onTicketStatusChange(ticket.id, 'Delivered'));
    }
    if (table.status === 'Occupied' || table.status === 'Payment' || activeTableOrders[table.id]) {
      setActiveTableId(table.id);
      setActionTable(null);
      return;
    }
    setActionTable(table);
  };

  const addToOrder = (item: InventoryItem) => {
    const newItem: DiningOrderItem = {
      ...item, cartId: `din-${Date.now()}-${Math.random()}`, quantity: 1,
      seatNumber: activeSeat, fired: false, modifiers: [], course: 'Entree', color: 'bg-white'
    };
    updateOrderItems([...orderItems, newItem]);
  };

  const handleFire = () => {
    if (activeTable) {
      const ticket = buildKitchenTicket(orderItems, activeTable, orderType, currentUser);
      if (ticket && onFireToKitchen) onFireToKitchen(ticket);
    }
    updateOrderItems(orderItems.map(i => ({ ...i, fired: true })));
  };

  const effectiveTaxRate = taxConfig ? getEffectiveTaxRate(taxConfig) : 8.25;
  const defaultAutoGrat = Boolean(tipConfig?.autoGratuityEnabled && guests.length >= (tipConfig?.autoGratuityMinPartySize ?? 6));
  const autoGratuityApplied = currentOrderData?.autoGratuityApplied !== undefined ? currentOrderData.autoGratuityApplied : defaultAutoGrat;
  const defaultServiceFee = Boolean(tipConfig?.serviceFeeEnabled);
  const serviceFeeApplied = currentOrderData?.serviceFeeApplied !== undefined ? currentOrderData.serviceFeeApplied : defaultServiceFee;

  const totals = calculateOrderTotals(
    orderItems, billDiscount, currentOrderData?.payments, autoGratuityApplied,
    tipConfig?.autoGratuityRate ?? 18, serviceFeeApplied,
    { name: tipConfig?.serviceFeeName ?? 'Service Fee', type: tipConfig?.serviceFeeType ?? 'Percentage', value: tipConfig?.serviceFeeValue ?? 3.5 },
    effectiveTaxRate
  );

  const handleToggleAutoGratuity = () => {
    if (activeTableId) {
      onUpdateTableOrder(activeTableId, { ...currentOrderData, items: orderItems, guests, orderType, autoGratuityApplied: !autoGratuityApplied });
    }
  };

  const handleToggleServiceFee = () => {
    if (activeTableId) {
      onUpdateTableOrder(activeTableId, { ...currentOrderData, items: orderItems, guests, orderType, serviceFeeApplied: !serviceFeeApplied });
    }
  };

  const handleCloseCheck = (paymentMethod: string, tipAmount: number = 0, amountPaid?: number) => {
    const actualPaid = amountPaid !== undefined ? amountPaid : totals.total;
    const existingPayments = currentOrderData?.payments || [];
    const newPayments = [...existingPayments, { amount: actualPaid, method: paymentMethod }];
    const totalPaidSoFar = newPayments.reduce((sum, p) => sum + p.amount, 0);

    if (onProcessSale && activeTable) {
      onProcessSale(orderItems, actualPaid + tipAmount, paymentMethod, activeTable.orderId, tipAmount, totals.discountAmount);
    }

    if (totalPaidSoFar >= totals.total - 0.01) {
      onUpdateTableStatus({ ...activeTable!, status: 'Available', assignedToName: undefined, timeSeated: undefined, orderId: undefined });
      if (activeTableId) onUpdateTableOrder(activeTableId, undefined);
      setActiveTableId(null);
      setShowPayment(false);
    } else if (activeTableId) {
      onUpdateTableOrder(activeTableId, { items: orderItems, guests, orderType, payments: newPayments, preAuthInfo: currentOrderData?.preAuthInfo });
    }
  };

  const handleMoveOrder = (sourceId: string, targetId: string) => {
    const targetObj = moveOrderToTargetTable(
      sourceId, targetId, activeTableOrders, currentOrderData, safeTables, activeTable,
      currentUser, onUpdateTableOrder, onUpdateTableStatus
    );
    if (targetObj) setActiveTableId(targetObj.id);
  };

  const handleFireAllPending = () => {
    firePendingOrders(
      activeTableId, activeTable, activeTableOrders, currentOrderData,
      safeTables, currentUser, onFireToKitchen, onUpdateTableOrder
    );
  };

  const handleBackToFloor = () => {
    if (activeTableId && activeTable && orderItems.length === 0) {
      onUpdateTableStatus({ ...activeTable, status: 'Available', assignedToName: undefined, timeSeated: undefined, orderId: undefined });
      onUpdateTableOrder(activeTableId, undefined);
      setActiveTableId(null);
    } else {
      handleFireAllPending();
      setActiveTableId(null);
    }
  };

  const handleOpenPayment = (initialMode: 'SELECT' | 'SPLIT_EVEN' | 'SPLIT_GUEST' | 'SPLIT_ITEM' = 'SELECT') => {
    const settings = getOrderSettings();
    if (settings.autoFireOnPay && orderItems.some(i => !i.fired)) handleFire();
    setInitialPaymentMode(initialMode);
    setShowPayment(true);
  };

  const handleExit = () => {
    if (activeTableId && activeTable && orderItems.length === 0) {
      onUpdateTableStatus({ ...activeTable, status: 'Available', assignedToName: undefined, timeSeated: undefined, orderId: undefined });
      onUpdateTableOrder(activeTableId, undefined);
    } else {
      handleFireAllPending();
    }
    onExit();
  };

  return {
    activeTableId, setActiveTableId, actionTable, setActionTable, activeSeat, setActiveSeat,
    searchTerm, setSearchTerm, activeCategory, setActiveCategory, showPayment, setShowPayment,
    tableCardPaymentStep, setTableCardPaymentStep, tableSelectedTip, setTableSelectedTip,
    tableCustomTipInput, setTableCustomTipInput, billDiscount, setBillDiscount,
    showDiscountModal, setShowDiscountModal, initialPaymentMode, setInitialPaymentMode,
    currentOrderData, orderItems, guests, orderType, activeSection, setActiveSection,
    safeTables, floorSections, activeTable, updateOrderItems, handleTableClick,
    addToOrder, handleFire, effectiveTaxRate, autoGratuityApplied, serviceFeeApplied, totals,
    handleToggleAutoGratuity, handleToggleServiceFee, handleCloseCheck, handleMoveOrder,
    handleFireAllPending, handleBackToFloor, handleOpenPayment, handleExit
  };
}
