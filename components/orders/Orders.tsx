import React, { useState } from 'react';
import { MOCK_EMPLOYEES } from '../../constants';
import { DetailedOrder } from '../../types';
import { Search, Download, ChevronRight, Printer, RotateCcw, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { OrderDetailModal } from './OrderDetailModal';

interface OrdersProps {
  orders: DetailedOrder[];
  onSelectOrder?: (order: DetailedOrder) => void;
  onReprintReceipt?: (order: DetailedOrder) => void;
  onProcessRefund?: (order: DetailedOrder) => void;
  onUpdateOrderStatus?: (orderId: string, status: string) => void;
  onReopenOrder?: (order: DetailedOrder) => void;
  onAddOrder?: () => void;
}

type OperationalFilter = 'ALL' | 'OPEN' | 'READY' | 'COMPLETED' | 'TAKEOUT' | 'DINE_IN';

const Orders: React.FC<OrdersProps> = ({ 
  orders, 
  onSelectOrder,
  onReprintReceipt,
  onProcessRefund,
  onUpdateOrderStatus,
  onReopenOrder
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<DetailedOrder | null>(null);
  const [filterEmployee, setFilterEmployee] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [operationalFilter, setOperationalFilter] = useState<OperationalFilter>('ALL');
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (order.cardLast4 && order.cardLast4.includes(searchTerm)) ||
      (order.customerName && order.customerName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesEmployee = filterEmployee === 'All' || order.employeeName === filterEmployee;
    const matchesType = filterType === 'All' || order.type === filterType;

    // Operational filter
    let matchesOp = true;
    if (operationalFilter === 'OPEN') {
      matchesOp = order.status === 'Open' || order.status === 'Pending' || order.status === 'Unpaid';
    } else if (operationalFilter === 'READY') {
      matchesOp = order.status === 'Ready' || order.status === 'Prepared';
    } else if (operationalFilter === 'COMPLETED') {
      matchesOp = order.status === 'Paid' || order.status === 'Completed';
    } else if (operationalFilter === 'TAKEOUT') {
      matchesOp = order.type === 'Takeout' || order.type === 'To Go' || order.type === 'Pickup';
    } else if (operationalFilter === 'DINE_IN') {
      matchesOp = order.type === 'Dine-in' || order.type === 'Dine In' || !!order.table;
    }

    return matchesSearch && matchesEmployee && matchesType && matchesOp;
  });

  const totalAmount = filteredOrders.reduce((sum, order) => sum + order.total, 0);
  const totalCount = filteredOrders.length;
  const cardTotal = filteredOrders.filter(o => ['Visa', 'MasterCard', 'AmEx', 'Discover'].includes(o.paymentMethod)).reduce((sum, o) => sum + o.total, 0);
  const otherTotal = totalAmount - cardTotal;

  const handleReprint = (e: React.MouseEvent, order: DetailedOrder) => {
    e.stopPropagation();
    if (onReprintReceipt) {
      onReprintReceipt(order);
    }
    setActionSuccessMessage(`Receipt reprinted for #${order.id}`);
    setTimeout(() => setActionSuccessMessage(null), 3000);
  };

  const handleRefund = (e: React.MouseEvent, order: DetailedOrder) => {
    e.stopPropagation();
    if (onProcessRefund) {
      onProcessRefund(order);
    }
    setActionSuccessMessage(`Refund modal opened for #${order.id}`);
    setTimeout(() => setActionSuccessMessage(null), 3000);
  };

  return (
    <div className="flex flex-col space-y-5 h-full animate-fade-in text-slate-100">
      {selectedOrder && (
        <OrderDetailModal 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)} 
        />
      )}

      {actionSuccessMessage && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-700 text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{actionSuccessMessage}</span>
        </div>
      )}

      {/* Operational Filter Chips */}
      <div className="flex flex-wrap items-center gap-2 shrink-0">
        {[
          { key: 'ALL', label: 'All Orders' },
          { key: 'OPEN', label: 'Open / Unpaid' },
          { key: 'READY', label: 'Ready for Pickup' },
          { key: 'COMPLETED', label: 'Completed Today' },
          { key: 'DINE_IN', label: 'Dine-in Tables' },
          { key: 'TAKEOUT', label: 'Takeout / To-Go' },
        ].map(chip => (
          <button
            key={chip.key}
            onClick={() => setOperationalFilter(chip.key as OperationalFilter)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm ${
              operationalFilter === chip.key
                ? 'bg-indigo-600 text-white shadow-indigo-600/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-sm flex flex-col md:flex-row gap-3 shrink-0">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search Order ID, Customer name or Card Last 4..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 text-sm focus:border-indigo-500 outline-none"
          />
        </div>
        <select 
          className="border border-slate-700 rounded-xl px-4 py-2.5 bg-slate-800 text-slate-200 text-sm outline-none"
          value={filterEmployee}
          onChange={(e) => setFilterEmployee(e.target.value)}
        >
          <option value="All">All Staff / Cashiers</option>
          {Array.from(new Set(MOCK_EMPLOYEES.map(e => e.name))).map(name => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
        <select 
          className="border border-slate-700 rounded-xl px-4 py-2.5 bg-slate-800 text-slate-200 text-sm outline-none"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="All">All Types</option>
          <option value="Dine-in">Dine-in</option>
          <option value="Takeout">Takeout</option>
          <option value="Delivery">Delivery</option>
        </select>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 shrink-0">
        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl">
          <p className="text-[11px] text-indigo-400 uppercase font-bold tracking-wider">Filtered Orders</p>
          <p className="text-2xl font-black text-white mt-0.5">{totalCount}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl">
          <p className="text-[11px] text-emerald-400 uppercase font-bold tracking-wider">Total Volume</p>
          <p className="text-2xl font-black text-emerald-400 mt-0.5">${totalAmount.toFixed(2)}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl">
          <p className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Credit Card</p>
          <p className="text-2xl font-black text-slate-200 mt-0.5">${cardTotal.toFixed(2)}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl">
          <p className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">Cash / Split</p>
          <p className="text-2xl font-black text-slate-200 mt-0.5">${otherTotal.toFixed(2)}</p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 flex-1 overflow-hidden flex flex-col">
        <div className="overflow-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-950/80 border-b border-slate-800 sticky top-0 z-10 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Time</th>
                <th className="px-6 py-3.5">Order / Type</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Total</th>
                <th className="px-6 py-3.5">Server</th>
                <th className="px-6 py-3.5 text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-sm">
              {filteredOrders.map(order => (
                <tr 
                  key={order.id} 
                  onClick={() => {
                    setSelectedOrder(order);
                    if (onSelectOrder) onSelectOrder(order);
                  }}
                  className="cursor-pointer transition-colors hover:bg-slate-800/50"
                >
                  <td className="px-6 py-4">
                    <div className="font-semibold text-white">{order.time || '12:30 PM'}</div>
                    <div className="text-xs text-slate-400">{order.date || 'Today'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-mono font-bold text-indigo-400">#{order.id}</div>
                    <div className="text-xs text-slate-300 mt-0.5">
                      {order.type} {order.table ? `• Table ${order.table}` : ''}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                      order.status === 'Paid' || order.status === 'Completed'
                        ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60' 
                        : 'bg-amber-950/80 text-amber-300 border border-amber-800/60'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-white text-base">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-slate-300">{order.employeeName}</td>
                  <td className="px-6 py-4 text-right" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={(e) => handleReprint(e, order)}
                        title="Reprint receipt via thermal printer"
                        className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 transition-colors"
                      >
                        <Printer size={16} />
                      </button>
                      <button
                        onClick={(e) => handleRefund(e, order)}
                        title="Process refund or void"
                        className="p-2 bg-rose-950/60 hover:bg-rose-900 text-rose-300 rounded-lg border border-rose-800/60 transition-colors"
                      >
                        <RotateCcw size={16} />
                      </button>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold"
                      >
                        Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    No orders match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;
