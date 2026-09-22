import React, { useState } from 'react';
import { DetailedOrder } from '../../types';
import { TrendingUp, Clock, User, DollarSign, Eye } from 'lucide-react';
import { ReportTotalDetailModal } from './ReportTotalDetailModal';

interface OpenOrdersTabProps {
  orders: DetailedOrder[];
}

export const OpenOrdersTab: React.FC<OpenOrdersTabProps> = ({ orders }) => {
  const [selectedDetail, setSelectedDetail] = useState<{
    title: string;
    label: string;
    value: number;
  } | null>(null);

  const openOrders = React.useMemo(() => {
    return orders.filter(o => o.status === 'Open');
  }, [orders]);

  const metrics = React.useMemo(() => {
    const totalCount = openOrders.length;
    const totalValue = openOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const avgValue = totalCount > 0 ? totalValue / totalCount : 0;
    
    return {
      count: totalCount,
      estimatedRevenue: totalValue,
      avgTicket: avgValue,
    };
  }, [openOrders]);

  return (
    <div className="space-y-6 animate-fade-in" id="open-orders-tab-container">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div 
          onClick={() => setSelectedDetail({ title: 'Active Open Orders Count Audit', label: 'Active Open Orders', value: metrics.count })}
          className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:border-indigo-400 hover:shadow-md transition-all group"
          id="metric-open-count"
        >
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs text-slate-500 uppercase font-bold group-hover:text-indigo-600 transition-colors">Active Open Orders</p>
            <Clock size={16} className="text-indigo-500" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">{metrics.count}</h3>
          <p className="text-[10px] text-indigo-500 mt-1 font-medium">Click to view details →</p>
        </div>

        <div 
          onClick={() => setSelectedDetail({ title: 'Estimated Open Revenue Audit', label: 'Est. Open Revenue', value: metrics.estimatedRevenue })}
          className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:border-indigo-400 hover:shadow-md transition-all group"
          id="metric-open-revenue"
        >
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs text-slate-500 uppercase font-bold group-hover:text-indigo-600 transition-colors">Est. Open Revenue</p>
            <DollarSign size={16} className="text-emerald-500" />
          </div>
          <h3 className="text-2xl font-bold text-emerald-600">${metrics.estimatedRevenue.toFixed(2)}</h3>
          <p className="text-[10px] text-emerald-500 mt-1 font-medium">Click to view details →</p>
        </div>

        <div 
          onClick={() => setSelectedDetail({ title: 'Average Open Ticket Size Audit', label: 'Avg Open Ticket', value: metrics.avgTicket })}
          className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:border-indigo-400 hover:shadow-md transition-all group"
          id="metric-open-avg"
        >
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs text-slate-500 uppercase font-bold group-hover:text-indigo-600 transition-colors">Avg Open Ticket</p>
            <TrendingUp size={16} className="text-indigo-500" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">${metrics.avgTicket.toFixed(2)}</h3>
          <p className="text-[10px] text-indigo-500 mt-1 font-medium">Click to view details →</p>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden" id="open-orders-table-wrapper">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-slate-800">Active Opening Orders</h3>
            <p className="text-xs text-slate-500 mt-0.5">Currently open tables and unpaid service tickets</p>
          </div>
          <span className="px-2.5 py-1 text-xs font-semibold bg-indigo-50 text-indigo-700 rounded-full">
            {openOrders.length} Open Tickets
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm" id="open-orders-data-table">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-semibold">Table / Order ID</th>
                <th className="px-6 py-4 font-semibold">Server</th>
                <th className="px-6 py-4 font-semibold">Device / Source</th>
                <th className="px-6 py-4 font-semibold">Items Count</th>
                <th className="px-6 py-4 font-semibold text-right">Current Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {openOrders.map((order) => (
                <tr 
                  key={order.id}
                  onClick={() => setSelectedDetail({ title: `Order ${order.id} Live Estimate`, label: 'Order Total', value: order.total })}
                  className="hover:bg-indigo-50/50 cursor-pointer transition-colors group"
                  title="Click to view details"
                >
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                      {order.id.startsWith('TEMP-') ? order.id.replace('TEMP-', 'Table ') : order.id}
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <Clock size={12} /> Seated at {order.time || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-700">
                    <div className="flex items-center gap-1.5 font-medium text-slate-900">
                      <User size={14} className="text-slate-400" />
                      {order.employeeName}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-medium">
                    {order.device || 'Table Service'}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-slate-800">
                      {order.items?.reduce((acc, curr) => acc + curr.quantity, 0) || 0} items
                    </span>
                    <div className="text-xs text-slate-400 truncate max-w-xs mt-0.5">
                      {order.items?.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-mono font-bold text-slate-900">
                    ${order.total.toFixed(2)}
                  </td>
                </tr>
              ))}
              {openOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">
                    No open orders right now. Seated tables with items will automatically populate here in real-time.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedDetail && (
        <ReportTotalDetailModal
          isOpen={!!selectedDetail}
          onClose={() => setSelectedDetail(null)}
          title={selectedDetail.title}
          metricLabel={selectedDetail.label}
          metricValue={selectedDetail.value}
          orders={orders}
        />
      )}
    </div>
  );
};
