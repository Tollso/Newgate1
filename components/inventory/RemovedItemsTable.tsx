import React from 'react';
import { ChevronUp, ChevronDown, Printer, Trash2 } from 'lucide-react';

export interface RemovedItem {
  id: string;
  itemName: string;
  price: number;
  removedAt: string;
  employeeName: string;
  reason: string;
  orderId: string;
  orderType: string;
  printStatus: 'Printed' | 'Unprinted';
  category: string;
  removedBy?: string;
  serverSection?: string;
  time?: string;
}

interface RemovedItemsTableProps {
  sortedItems: RemovedItem[];
  displayDensity: 'Detailed' | 'Compact';
  sortColumn: 'item' | 'price' | 'date' | 'employee';
  sortDirection: 'asc' | 'desc';
  handleSort: (col: 'item' | 'price' | 'date' | 'employee') => void;
  handleDeleteLog: (id: string, name: string) => void;
}

export const RemovedItemsTable: React.FC<RemovedItemsTableProps> = ({
  sortedItems,
  displayDensity,
  sortColumn,
  sortDirection,
  handleSort,
  handleDeleteLog
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] uppercase tracking-wider text-slate-500 font-bold">
              <th onClick={() => handleSort('item')} className="px-6 py-4 cursor-pointer hover:text-slate-800 transition-colors">
                <div className="flex items-center gap-1.5">
                  Item Name
                  {sortColumn === 'item' && (sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                </div>
              </th>
              <th onClick={() => handleSort('price')} className="px-6 py-4 cursor-pointer hover:text-slate-800 transition-colors">
                <div className="flex items-center gap-1.5">
                  Price
                  {sortColumn === 'price' && (sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                </div>
              </th>
              <th onClick={() => handleSort('date')} className="px-6 py-4 cursor-pointer hover:text-slate-800 transition-colors">
                <div className="flex items-center gap-1.5">
                  Removed At
                  {sortColumn === 'date' && (sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                </div>
              </th>
              <th onClick={() => handleSort('employee')} className="px-6 py-4 cursor-pointer hover:text-slate-800 transition-colors">
                <div className="flex items-center gap-1.5">
                  Employee
                  {sortColumn === 'employee' && (sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                </div>
              </th>
              <th className="px-6 py-4">Reason</th>
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4 text-center">Print Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {sortedItems.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-slate-400 italic">
                  No void items found matching your filter criteria.
                </td>
              </tr>
            ) : (
              sortedItems.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900">
                    {item.itemName}
                    {displayDensity === 'Detailed' && (
                      <div className="text-[11px] font-normal text-slate-400 mt-0.5">Category: {item.category}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-slate-800">${item.price.toFixed(2)}</td>
                  <td className="px-6 py-4 text-slate-600 font-medium">
                    {item.removedAt} {item.time && <span className="text-xs text-slate-400 font-normal">{item.time}</span>}
                  </td>
                  <td className="px-6 py-4 text-slate-700 font-medium">
                    {item.employeeName}
                    {item.removedBy && item.removedBy !== item.employeeName && (
                      <div className="text-[11px] text-slate-400 font-normal">Auth: {item.removedBy}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold border border-slate-200/60">
                      {item.reason}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-indigo-600 font-bold">{item.orderId}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                      item.printStatus === 'Printed' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/80' : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>
                      <Printer size={12} />
                      {item.printStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDeleteLog(item.id, item.itemName)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete log entry"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
