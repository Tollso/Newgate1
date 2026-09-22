import { DiningTable, Employee, DiningOrderItem } from '../../types';

export const executeTableAction = (
  action: string,
  actionTable: DiningTable | null,
  currentUser: Employee,
  activeTableOrders: Record<string, any>,
  onUpdateTableStatus: (table: DiningTable) => void,
  onUpdateTableOrder: (tableId: string, data: any) => void,
  setActiveTableId: (id: string | null) => void,
  setShowPayment: (show: boolean) => void,
  setActionTable: (table: DiningTable | null) => void
) => {
  if (!actionTable) return;

  if (action === 'SEAT') {
    const storedData = activeTableOrders[actionTable.id];
    if (!storedData) {
      const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
      onUpdateTableStatus({ 
        ...actionTable, 
        status: 'Occupied' as const, 
        employeeId: currentUser?.id || 'system', 
        assignedToName: currentUser?.name || 'System', 
        timeSeated: new Date().toISOString(),
        orderId: orderId 
      });
      onUpdateTableOrder(actionTable.id, { items: [], guests: [{ id: 1 }], orderType: 'Dine In' });
    } else if (actionTable.status !== 'Occupied') {
      onUpdateTableStatus({ ...actionTable, status: 'Occupied' as const });
    }
    setActiveTableId(actionTable.id);
    setActionTable(null);
  } else if (action === 'OPEN_ORDER') {
    setActiveTableId(actionTable.id);
    setActionTable(null);
  } else if (action === 'MARK_RESERVED') {
    onUpdateTableStatus({ ...actionTable, status: 'Reserved' as const });
    setActionTable(null);
  } else if (action === 'MARK_DIRTY') {
    onUpdateTableStatus({ ...actionTable, status: 'Dirty' as const });
    setActionTable(null);
  } else if (action === 'MARK_CLEAN' || action === 'CLEAR_TABLE') {
    onUpdateTableStatus({ 
      ...actionTable, 
      status: action === 'CLEAR_TABLE' ? 'Dirty' as const : 'Available' as const,
      assignedToName: undefined,
      timeSeated: undefined,
      orderId: undefined
    });
    onUpdateTableOrder(actionTable.id, undefined);
    setActionTable(null);
  } else if (action === 'MARK_PAYMENT') {
    onUpdateTableStatus({ ...actionTable, status: 'Payment' as const });
    setActiveTableId(actionTable.id);
    setShowPayment(true);
    setActionTable(null);
  } else if (action === 'CANCEL_RESERVATION') {
    onUpdateTableStatus({ ...actionTable, status: 'Available' as const });
    setActionTable(null);
  }
};
