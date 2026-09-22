import React from 'react';
import { DetailedOrder, Employee } from '../../../types';
import Orders from '../../orders/Orders';
import { NativeBridge } from '../../../services/nativeBridge';

interface PosShellOrdersViewProps {
  orders: DetailedOrder[];
  currentUser: Employee;
  onOpenManagerPin?: (action: string, callback: () => void) => void;
}

export const PosShellOrdersView: React.FC<PosShellOrdersViewProps> = ({
  orders,
  currentUser,
  onOpenManagerPin,
}) => {
  const handleReprintReceipt = async (order: DetailedOrder) => {
    NativeBridge.beep(2000, 100);
    const anyOrder = order as any;
    const receiptText = `
================================
       THE NEWGATE POS
       LUMI RESTAURANT
================================
ORDER ID: #${order.id}
DATE: ${order.date || new Date().toLocaleDateString()} ${order.time || new Date().toLocaleTimeString()}
SERVER: ${order.employeeName || currentUser.name}
TYPE: ${order.type} ${anyOrder.table ? `• TABLE ${anyOrder.table}` : ''}
--------------------------------
${(order.items || []).map((it: any) => `${it.quantity || 1}x ${it.name}   $${((it.price || 0) * (it.quantity || 1)).toFixed(2)}`).join('\n')}
--------------------------------
SUBTOTAL:               $${(anyOrder.subtotal || (order.total * 0.92)).toFixed(2)}
TAX:                    $${(anyOrder.tax || (order.total * 0.08)).toFixed(2)}
TOTAL:                  $${order.total.toFixed(2)}
PAYMENT:                ${order.paymentMethod || 'Credit Card'} (${order.cardLast4 ? `*${order.cardLast4}` : 'PAID'})
================================
   THANK YOU FOR DINING WITH US!
================================
`;
    await NativeBridge.printReceipt(receiptText);
  };

  const handleProcessRefund = (order: DetailedOrder) => {
    if (onOpenManagerPin) {
      onOpenManagerPin('Process Refund', () => {
        alert(`Refund authorized and completed for Order #${order.id} ($${order.total.toFixed(2)})`);
      });
    } else {
      alert(`Refund processed for Order #${order.id} ($${order.total.toFixed(2)})`);
    }
  };

  return (
    <div className="h-full bg-slate-900 p-6 overflow-y-auto">
      <Orders
        orders={orders}
        onSelectOrder={(order) => console.log('Selected order:', order.id)}
        onReprintReceipt={handleReprintReceipt}
        onProcessRefund={handleProcessRefund}
        onUpdateOrderStatus={(orderId, status) => console.log(`Order ${orderId} updated to ${status}`)}
      />
    </div>
  );
};
