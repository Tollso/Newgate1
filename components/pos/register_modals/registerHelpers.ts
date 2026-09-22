import { CartItem, Employee } from '../../../types';

export const logRemovedItem = (
  item: CartItem, 
  reason: string, 
  currentUser?: Employee, 
  currentOrderId?: string | null, 
  orderType: string = 'Dine-in'
) => {
  const saved = localStorage.getItem('omni_removed_items');
  let logs: any[] = [];
  if (saved) {
    try {
      logs = JSON.parse(saved);
    } catch (e) {
      console.error('Error parsing logs', e);
    }
  }
  
  const newLog = {
    id: `RM-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    itemName: item.name,
    price: item.price,
    removedAt: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }),
    time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    employeeName: currentUser?.name || 'Staff',
    removedBy: currentUser?.name || 'Staff',
    reason: reason,
    orderId: currentOrderId || `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
    orderType: orderType || 'Dine-in',
    printStatus: item.isFired ? 'Printed' as const : 'Unprinted' as const,
    category: item.category || 'Food',
    serverSection: 'Main Register'
  };
  
  logs.unshift(newLog);
  localStorage.setItem('omni_removed_items', JSON.stringify(logs));
};

export const getDefaultRemovalReasons = (removalReasons?: string[]) => {
  if (removalReasons && removalReasons.length > 0) return removalReasons;
  const saved = localStorage.getItem('omni_removal_reasons');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
  }
  return [
    "Customer Changed Mind",
    "Sent in Error",
    "Kitchen Backed Up / Long Wait",
    "Item Unavailable / Out of Stock",
    "Ordered Double by Mistake",
    "Wrong Item Selected",
    "Spilled / Damaged before Serving"
  ];
};
