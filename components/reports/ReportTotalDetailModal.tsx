import React, { useState, useMemo } from 'react';
import { X, Download, Printer, Search, ChevronDown, ChevronUp, ShoppingBag } from 'lucide-react';
import { downloadCSV } from '../../src/utils/csvExportUtil';

import { DetailedOrder } from '../../types';

export interface ReportDetailRow {
  id: string;
  orderNumber: string;
  timestamp: string;
  employeeName: string;
  customerOrTable: string;
  paymentMethod: string;
  grossSales: number;
  discounts: number;
  tax: number;
  tip: number;
  netSales: number;
  totalCollected: number;
  itemsCount: number;
  itemsSummary?: string;
  itemsList?: Array<{ name: string; qty: number; price: number }>;
}

interface ReportTotalDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  metricLabel: string;
  metricValue: number;
  rows?: ReportDetailRow[];
  orders?: DetailedOrder[];
}

export const ReportTotalDetailModal: React.FC<ReportTotalDetailModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle = 'Detailed transaction audit log contributing to this total',
  metricLabel,
  metricValue,
  rows = [],
  orders = []
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  const generatedRows: ReportDetailRow[] = useMemo(() => {
    if (rows && rows.length > 0) return rows;

    if (orders && orders.length > 0) {
      const label = metricLabel ? metricLabel.toLowerCase() : '';
      const t = title ? title.toLowerCase() : '';

      const getDaypart = (hourStr: string) => {
        const parts = hourStr.split(' ');
        if (parts.length < 2) return 'lunch';
        const [time, period] = parts;
        let hourValue = parseInt(time.split(':')[0]);
        if (period === 'PM' && hourValue !== 12) hourValue += 12;
        if (period === 'AM' && hourValue === 12) hourValue = 0;
        if (hourValue >= 6 && hourValue < 11) return 'breakfast';
        if (hourValue >= 11 && hourValue < 16) return 'lunch';
        if (hourValue >= 16 && hourValue < 21) return 'dinner';
        return 'late night';
      };

      const filteredOrders = orders.filter(o => {
        // Handle Open Orders
        if (t.includes('open order') || label.includes('open order')) {
          return o.status === 'Open';
        }
        // Handle Refunds / Partially Refunded
        if (t.includes('refund') || label.includes('refund')) {
          return o.status === 'Refunded' || o.status === 'Partially Refunded';
        }
        // Handle Voids
        if (t.includes('void') || label.includes('void')) {
          return o.status === 'Void';
        }

        // Filter by specific payment methods (e.g. Visa, MasterCard, Cash)
        if (label === 'visa' || label === 'mastercard' || label === 'amex' || label === 'discover' || label === 'cash' || label === 'gift card') {
          return o.paymentMethod?.toLowerCase() === label;
        }

        // Filter by specific order types (e.g. Dine-In, Takeout, Delivery, Drive-Thru)
        if (label === 'dine-in' || label === 'takeout' || label === 'delivery' || label === 'drive-thru') {
          return o.type?.toLowerCase() === label;
        }

        // Filter by Server/Employee name (e.g. Elena R. Performance)
        const serverMatch = title.match(/^(.+?)\s*-\s*Shift/i) || title.match(/^(.+?)\s*Performance/i) || title.match(/^(.+?)\s*-\s*Sales/i);
        if (serverMatch) {
          const serverName = serverMatch[1].trim().toLowerCase();
          return o.employeeName?.toLowerCase() === serverName;
        }

        // Filter by Daypart
        if (t.includes('breakfast') || label.includes('breakfast')) {
          return getDaypart(o.time || '') === 'breakfast';
        }
        if (t.includes('lunch') || label.includes('lunch')) {
          return getDaypart(o.time || '') === 'lunch';
        }
        if (t.includes('dinner') || label.includes('dinner')) {
          return getDaypart(o.time || '') === 'dinner';
        }
        if (t.includes('late night') || label.includes('late night')) {
          return getDaypart(o.time || '') === 'late night';
        }

        // Filter by specific item performance (e.g. Wagyu Beef Burger - Item Performance Audit)
        const itemMatch = title.match(/^(.+?)\s*-\s*Item/i);
        if (itemMatch) {
          const itemName = itemMatch[1].trim().toLowerCase();
          return o.items?.some(i => i.name.toLowerCase() === itemName);
        }

        // Filter by category total (e.g. Beverages Category Total Audit)
        const categoryMatch = title.match(/^(.+?)\s*Category\s*Total/i);
        if (categoryMatch) {
          const catName = categoryMatch[1].trim().toLowerCase();
          return o.items?.some(i => {
            const name = i.name.toLowerCase();
            let itemCat = 'main course';
            if (name.includes('beer') || name.includes('drink') || name.includes('wine') || name.includes('soda') || name.includes('coke')) {
              itemCat = 'beverages';
            } else if (name.includes('salad') || name.includes('fries') || name.includes('tacos') || name.includes('calamari') || name.includes('soup')) {
              itemCat = 'appetizers';
            } else if (name.includes('cake') || name.includes('dessert') || name.includes('ice cream') || name.includes('brownie')) {
              itemCat = 'desserts';
            }
            return itemCat === catName;
          });
        }

        // Filter by Discounts
        if (t.includes('discount') || label.includes('discount')) {
          return (o.discount || 0) > 0;
        }

        // Filter by Gift Cards
        if (t.includes('gift card') || label.includes('gift card') || label.includes('loaded') || label.includes('issued') || label.includes('liability')) {
          return o.paymentMethod === 'Gift Card';
        }

        // Default: Show all non-void orders
        return o.status !== 'Void';
      });

      return filteredOrders.map(o => {
        const gross = o.total || 0;
        const discount = o.discount || 0;
        const net = gross - discount;
        const tax = o.fees || +(net * 0.0825).toFixed(2);
        const tip = o.tip || 0;
        const totalCollected = net + tax + tip;
        const items = o.items || [];

        return {
          id: o.id || `TXN-${Math.random().toString(36).substr(2, 9)}`,
          orderNumber: o.id && o.id.startsWith('#') ? o.id : `#ORD-${o.id || Math.floor(1000 + Math.random() * 9000)}`,
          timestamp: o.time || o.date || '12:00 PM',
          employeeName: o.employeeName || 'Unknown Server',
          customerOrTable: o.type === 'Dine-in' ? 'Table' : o.type || 'Standard',
          paymentMethod: o.cardLast4 ? `${o.paymentMethod || 'Card'} ****${o.cardLast4}` : o.paymentMethod || 'Cash',
          grossSales: gross,
          discounts: discount,
          tax: tax,
          tip: tip,
          netSales: net,
          totalCollected: totalCollected,
          itemsCount: items.reduce((acc, x) => acc + x.quantity, 0),
          itemsSummary: items.map(x => `${x.quantity}x ${x.name}`).join(', '),
          itemsList: items.map(x => ({ name: x.name, qty: x.quantity, price: x.price }))
        };
      });
    }

    return [];
  }, [rows, orders, title, metricLabel]);

  const filteredRows = useMemo(() => {
    if (!searchTerm.trim()) return generatedRows;
    const term = searchTerm.toLowerCase();
    return generatedRows.filter(r =>
      r.orderNumber.toLowerCase().includes(term) ||
      r.employeeName.toLowerCase().includes(term) ||
      r.customerOrTable.toLowerCase().includes(term) ||
      r.paymentMethod.toLowerCase().includes(term) ||
      (r.itemsSummary && r.itemsSummary.toLowerCase().includes(term))
    );
  }, [generatedRows, searchTerm]);

  const aggregateCalculated = useMemo(() => {
    return filteredRows.reduce((acc, r) => {
      acc.gross += typeof r.grossSales === 'number' ? r.grossSales : 0;
      acc.discount += typeof r.discounts === 'number' ? r.discounts : 0;
      acc.net += typeof r.netSales === 'number' ? r.netSales : 0;
      acc.tax += typeof r.tax === 'number' ? r.tax : 0;
      acc.tip += typeof r.tip === 'number' ? r.tip : 0;
      acc.collected += typeof r.totalCollected === 'number' ? r.totalCollected : 0;
      return acc;
    }, { gross: 0, discount: 0, net: 0, tax: 0, tip: 0, collected: 0 });
  }, [filteredRows]);

  const safeFormatNumber = (val: any): string => {
    const num = typeof val === 'number' ? val : parseFloat(String(val));
    if (isNaN(num)) return '0.00';
    return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in overflow-hidden">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono text-xs font-bold uppercase tracking-wider border border-indigo-400/30">
                Total Audit Detail
              </span>
              <span className="text-slate-400 text-xs font-medium">• Live Audit</span>
            </div>
            <h2 className="text-xl font-black text-white mt-1 flex items-center gap-2">{title}</h2>
            <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer">
            <X size={18} />
          </button>
        </div>

        {/* Quick KPI Summary Bar */}
        <div className="bg-slate-50 border-b border-slate-200 p-4 grid grid-cols-2 md:grid-cols-4 gap-3 shrink-0">
          <div className="bg-white p-3 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">{metricLabel}</span>
            <span className="text-lg font-black text-indigo-600 font-mono">${safeFormatNumber(metricValue)}</span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Orders / Txns</span>
            <span className="text-lg font-black text-slate-800 font-mono">{filteredRows.length} Orders</span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Calculated Net</span>
            <span className="text-lg font-black text-emerald-600 font-mono">${safeFormatNumber(aggregateCalculated.net)}</span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Tips & Tax</span>
            <span className="text-lg font-black text-slate-700 font-mono">${safeFormatNumber(aggregateCalculated.tip + aggregateCalculated.tax)}</span>
          </div>
        </div>

        {/* Search & Actions Bar */}
        <div className="px-6 py-3 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3 shrink-0 bg-white">
          <div className="relative w-full sm:w-72">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Filter by Order, Staff, Table..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-100 text-slate-800 placeholder-slate-400 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 border border-transparent focus:border-indigo-400 transition-all"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button onClick={() => downloadCSV(filteredRows, `${title.replace(/\s+/g, '_')}_Breakdown`)} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer">
              <Download size={14} /> Export CSV
            </button>
            <button onClick={() => window.print()} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer">
              <Printer size={14} /> Print Audit
            </button>
          </div>
        </div>

        {/* Breakdown Table */}
        <div className="overflow-y-auto flex-1 p-6 space-y-2">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-100 text-slate-500 uppercase font-bold sticky top-0 z-10">
              <tr>
                <th className="px-3 py-2.5 rounded-l-xl">Order Ref</th>
                <th className="px-3 py-2.5">Time</th>
                <th className="px-3 py-2.5">Server</th>
                <th className="px-3 py-2.5">Location</th>
                <th className="px-3 py-2.5">Tender</th>
                <th className="px-3 py-2.5 text-right">Gross</th>
                <th className="px-3 py-2.5 text-right">Disc</th>
                <th className="px-3 py-2.5 text-right">Net</th>
                <th className="px-3 py-2.5 text-right">Tip</th>
                <th className="px-3 py-2.5 text-right rounded-r-xl">Collected</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredRows.map((r) => {
                const isExpanded = expandedRowId === r.id;
                return (
                  <React.Fragment key={r.id}>
                    <tr onClick={() => setExpandedRowId(isExpanded ? null : r.id)} className="hover:bg-indigo-50/50 cursor-pointer transition-colors group">
                      <td className="px-3 py-3 font-bold text-indigo-600 flex items-center gap-1.5">
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        {r.orderNumber}
                      </td>
                      <td className="px-3 py-3 text-slate-500 font-mono text-[11px]">{r.timestamp}</td>
                      <td className="px-3 py-3 font-medium text-slate-900">{r.employeeName}</td>
                      <td className="px-3 py-3 text-slate-600">{r.customerOrTable}</td>
                      <td className="px-3 py-3 text-slate-600">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[10px] font-bold">{r.paymentMethod}</span>
                      </td>
                      <td className="px-3 py-3 text-right font-mono">${r.grossSales.toFixed(2)}</td>
                      <td className="px-3 py-3 text-right font-mono text-rose-500">{r.discounts > 0 ? `-$${r.discounts.toFixed(2)}` : '-'}</td>
                      <td className="px-3 py-3 text-right font-mono font-bold text-slate-900">${r.netSales.toFixed(2)}</td>
                      <td className="px-3 py-3 text-right font-mono text-emerald-600">${r.tip.toFixed(2)}</td>
                      <td className="px-3 py-3 text-right font-mono font-black text-indigo-600">${r.totalCollected.toFixed(2)}</td>
                    </tr>
                    {isExpanded && (
                      <tr>
                        <td colSpan={10} className="px-4 py-3 bg-slate-50 border-y border-indigo-100">
                          <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
                            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                              <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                                <ShoppingBag size={14} className="text-indigo-600" /> Itemized Order Breakdown ({r.itemsCount} items)
                              </span>
                              <span className="text-[11px] text-slate-400 font-mono">Tax: ${r.tax.toFixed(2)}</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                              {r.itemsList?.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center bg-slate-50 p-2 rounded-lg border border-slate-100 text-xs">
                                  <span className="font-bold text-slate-700">{item.qty}x {item.name}</span>
                                  <span className="font-mono text-slate-900 font-bold">${(item.price * item.qty).toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-between items-center shrink-0">
          <span className="text-xs text-slate-400 font-medium">Showing {filteredRows.length} line items • End of audit log</span>
          <button onClick={onClose} className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer">
            Close Details
          </button>
        </div>

      </div>
    </div>
  );
};
