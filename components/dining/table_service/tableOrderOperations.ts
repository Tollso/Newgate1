import { DiningTable, Employee, KitchenTicket } from '../../../types';
import { buildKitchenTicket } from '../tableServiceHelpers';
import { ActiveTableOrderData } from './tableServiceTypes';

export const getOrderSettings = () => {
  try {
    const stored = localStorage.getItem('byte_dining_order_settings');
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.error(e);
  }
  return {
    autoFireOnPay: true,
    autoFireOnBack: true,
    requireSeatSelection: false,
    printOnFire: true,
    autoClearOnPayment: true,
  };
};

export const firePendingOrders = (
  activeTableId: string | null,
  activeTable: DiningTable | undefined,
  activeTableOrders: Record<string, ActiveTableOrderData>,
  currentOrderData: ActiveTableOrderData | undefined,
  safeTables: DiningTable[],
  currentUser: Employee,
  onFireToKitchen?: (ticket: KitchenTicket) => void,
  onUpdateTableOrder?: (tableId: string, data: ActiveTableOrderData | undefined) => void
) => {
  const settings = getOrderSettings();
  if (!settings.autoFireOnBack) return;

  if (activeTableId && activeTable) {
    const currentItems = activeTableOrders[activeTableId]?.items || [];
    const hasUnfired = currentItems.some(i => !i.fired);
    if (hasUnfired) {
      const ticket = buildKitchenTicket(currentItems, activeTable, currentOrderData?.orderType || 'Dine In', currentUser);
      if (ticket && onFireToKitchen) onFireToKitchen(ticket);
      
      onUpdateTableOrder?.(activeTableId, {
        ...(currentOrderData || { items: [], guests: [{ id: 1 }] }),
        items: currentItems.map(i => ({ ...i, fired: true })),
      });
    }
  }

  Object.entries((activeTableOrders as any) || {}).forEach(([tableId, orderData]: [string, any]) => {
    if (tableId === activeTableId) return;
    const tableObj = safeTables.find(t => t.id === tableId);
    if (!tableObj || !orderData) return;
    
    const hasUnfired = orderData.items?.some((i: any) => !i.fired);
    if (hasUnfired) {
      const ticket = buildKitchenTicket(orderData.items, tableObj, orderData.orderType || 'Dine In', currentUser);
      if (ticket && onFireToKitchen) onFireToKitchen(ticket);
      
      onUpdateTableOrder?.(tableId, {
        ...orderData,
        items: orderData.items.map((i: any) => ({ ...i, fired: true })),
      });
    }
  });
};

export const moveOrderToTargetTable = (
  sourceId: string,
  targetId: string,
  activeTableOrders: Record<string, ActiveTableOrderData>,
  currentOrderData: ActiveTableOrderData | undefined,
  safeTables: DiningTable[],
  activeTable: DiningTable | undefined,
  currentUser: Employee,
  onUpdateTableOrder: (tableId: string, data: ActiveTableOrderData | undefined) => void,
  onUpdateTableStatus: (table: DiningTable) => void
): DiningTable | undefined => {
  const sourceOrder = activeTableOrders[sourceId] || currentOrderData || { items: [], guests: [{ id: 1 }] };
  const targetTableObj = safeTables.find(t => 
    t.id === targetId || t.name === targetId || `Table ${t.name}` === targetId || 
    targetId.includes(t.name) || t.id.toLowerCase() === targetId.toLowerCase()
  );

  if (targetTableObj) {
    onUpdateTableOrder(targetTableObj.id, sourceOrder);
    onUpdateTableOrder(sourceId, undefined);
    onUpdateTableStatus({ 
      ...targetTableObj, 
      status: 'Occupied', 
      assignedToName: activeTable?.assignedToName || currentUser?.name,
      timeSeated: activeTable?.timeSeated || new Date().toISOString(),
      orderId: activeTable?.orderId || `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
    });
    if (activeTable) {
      onUpdateTableStatus({ ...activeTable, status: 'Available', assignedToName: undefined, timeSeated: undefined, orderId: undefined });
    }
    return targetTableObj;
  }
  return undefined;
};

export const combineOrdersWithTargetTable = (
  tgtTable: string,
  activeTable: DiningTable,
  safeTables: DiningTable[],
  activeTableOrders: Record<string, ActiveTableOrderData>,
  orderItems: any[],
  guests: any[],
  currentUser: Employee,
  onUpdateTableOrder: (tableId: string, data: ActiveTableOrderData | undefined) => void,
  onUpdateTableStatus: (table: DiningTable) => void
): DiningTable | undefined => {
  const targetTableObj = safeTables.find(t => 
    t.id === tgtTable || t.name === tgtTable || `Table ${t.name}` === tgtTable || 
    tgtTable.includes(t.name) || t.id.toLowerCase() === tgtTable.toLowerCase()
  );

  if (targetTableObj) {
    const sourceOrder: ActiveTableOrderData = activeTableOrders[activeTable.id] || { items: orderItems, guests };
    const targetOrder: ActiveTableOrderData = activeTableOrders[targetTableObj.id] || { items: [], guests: [{ id: 1 }] };

    const maxTargetGuest = targetOrder.guests.reduce((max: number, g: any) => Math.max(max, g.id), 0);
    const remappedSourceItems = sourceOrder.items.map((item: any) => ({
      ...item,
      seatNumber: item.seatNumber === 0 ? 0 : item.seatNumber + maxTargetGuest,
    }));
    const remappedSourceGuests = sourceOrder.guests.map((g: any) => ({
      ...g,
      id: g.id + maxTargetGuest,
    }));

    const combinedOrder: ActiveTableOrderData = {
      items: [...targetOrder.items, ...remappedSourceItems],
      guests: [...targetOrder.guests, ...remappedSourceGuests],
      orderType: targetOrder.orderType || sourceOrder.orderType,
      preAuthInfo: targetOrder.preAuthInfo || sourceOrder.preAuthInfo,
    };

    onUpdateTableOrder(targetTableObj.id, combinedOrder);
    onUpdateTableOrder(activeTable.id, undefined);
    onUpdateTableStatus({ ...activeTable, status: 'Available', assignedToName: undefined, timeSeated: undefined, orderId: undefined });
    onUpdateTableStatus({ 
      ...targetTableObj, 
      status: 'Occupied',
      assignedToName: targetTableObj.assignedToName || activeTable.assignedToName || currentUser?.name,
      timeSeated: targetTableObj.timeSeated || new Date().toISOString(),
    });
    return targetTableObj;
  }
  return undefined;
};
