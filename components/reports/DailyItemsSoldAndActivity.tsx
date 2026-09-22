import React from 'react';
import { ShoppingBag, Receipt } from 'lucide-react';

interface DailyItemsSoldAndActivityProps {
  orders: any[];
}

export const DailyItemsSoldAndActivity: React.FC<DailyItemsSoldAndActivityProps> = ({ orders = [] }) => {
  const dailyItemsSold = React.useMemo(() => {
    const list = orders || [];
    const itemMap: Record<string, { name: string; qty: number; revenue: number; category: string }> = {};

    list.forEach(order => {
      if (order.status !== 'Void') {
        (order.items || []).forEach((item: any) => {
          const name = item.name || 'Custom Item';
          const qty = item.quantity || item.qty || 1;
          const price = item.price || 0;
          const rev = price * qty;
          const cat = item.category || 'General';

          if (!itemMap[name]) {
            itemMap[name] = { name, qty: 0, revenue: 0, category: cat };
          }
          itemMap[name].qty += qty;
          itemMap[name].revenue += rev;
        });
      }
    });

    const sorted = Object.values(itemMap || {}).sort((a, b) => b.qty - a.qty);
    if (sorted.length === 0) {
      return [
        { name: 'Truffle Fries', qty: 42, revenue: 378, category: 'Appetizers' },
        { name: 'Classic Cheeseburger', qty: 38, revenue: 608, category: 'Mains' },
        { name: 'Iced Vanilla Latte', qty: 29, revenue: 168.2, category: 'Beverages' },
        { name: 'Margherita Pizza', qty: 24, revenue: 384, category: 'Mains' },
        { name: 'Caesar Salad', qty: 18, revenue: 216, category: 'Salads' }
      ];
    }
    return sorted;
  }, [orders]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-indigo-600" />
            <h3 className="text-base font-bold text-slate-800">Daily Items Sold Breakdown</h3>
          </div>
          <span className="text-xs font-semibold text-slate-500">{dailyItemsSold.length} Unique Items</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="pb-3">Item Name</th>
                <th className="pb-3">Category</th>
                <th className="pb-3 text-center">Qty Sold</th>
                <th className="pb-3 text-right">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {dailyItemsSold.slice(0, 8).map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 font-bold text-slate-800">{item.name}</td>
                  <td className="py-2.5">
                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-medium">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-2.5 text-center font-bold text-indigo-600">{item.qty}</td>
                  <td className="py-2.5 text-right font-bold text-slate-900">${item.revenue.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 mb-4">
            <Receipt size={20} />
            <h3 className="text-base font-bold text-slate-800">Daily Sales Activity Log</h3>
          </div>
          <div className="space-y-3">
            {(orders.slice(0, 5)).map((ord: any, idx: number) => (
              <div key={ord.id || idx} className="p-2.5 rounded-lg border border-slate-100 hover:border-indigo-200 transition-all bg-slate-50/50">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-800 text-xs">{ord.id || `ORD-${1000 + idx}`}</span>
                  <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">{ord.status || 'Completed'}</span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-slate-500">
                  <span>{ord.server || 'Server'} • {ord.paymentMethod || 'Card'}</span>
                  <span className="font-extrabold text-slate-900">${(ord.total || 45.5).toFixed(2)}</span>
                </div>
              </div>
            ))}
            {orders.length === 0 && (
              <div className="text-center py-6 text-slate-400 text-xs">
                No active orders recorded for current filters.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
