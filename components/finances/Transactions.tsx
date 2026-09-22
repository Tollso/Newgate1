import React, { useState } from 'react';
import { Transaction, DetailedOrder } from '../../types';
import { Search, Filter, Download, ChevronRight, CreditCard, Clock, ArrowUpRight } from 'lucide-react';
import { TransactionDetailModal } from './TransactionDetailModal';

interface TransactionsProps {
  transactions: Transaction[];
  orders?: DetailedOrder[];
}

const Transactions: React.FC<TransactionsProps> = ({ transactions, orders = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const filtered = transactions.filter(t => 
    t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.method.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col gap-6 animate-fade-in">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Transactions Audit</h1>
          <p className="text-xs text-slate-500 font-medium">Real-time payment logs, network settlements & ledger verification</p>
        </div>
        <button 
          onClick={() => alert("Transactions exported as CSV!")}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-2 transition-colors"
        >
          <Download size={16} /> Export
        </button>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        <div className="flex-1 bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col min-h-0 overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex gap-3 bg-slate-50/50">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search transaction ID, method, staff..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs font-medium bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 flex items-center gap-1.5 hover:bg-slate-50">
              <Filter size={14} /> Filter
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 font-bold text-slate-400 uppercase tracking-wider">
                  <th className="p-4">Tx ID</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Method</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Staff</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filtered.map(tx => (
                  <tr 
                    key={tx.id} 
                    onClick={() => setSelectedTx(tx)}
                    className={`hover:bg-slate-50/80 cursor-pointer transition-colors ${selectedTx?.id === tx.id ? 'bg-indigo-50/50' : ''}`}
                  >
                    <td className="p-4 font-mono font-bold text-slate-800">{tx.id}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full font-extrabold text-[10px] ${
                        tx.type === 'Refund' ? 'bg-red-50 text-red-600' : tx.type === 'Deposit' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="p-4 flex items-center gap-2">
                      <CreditCard size={14} className="text-slate-400" />
                      {tx.method}
                    </td>
                    <td className="p-4 font-bold text-slate-900">${tx.amount.toFixed(2)}</td>
                    <td className="p-4">{tx.employeeId}</td>
                    <td className="p-4 text-slate-400">{tx.date}</td>
                    <td className="p-4 text-right">
                      <button className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-600">
                        <ChevronRight size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {selectedTx && (
          <div className="w-[420px] shrink-0 h-full">
            <TransactionDetailModal 
              tx={selectedTx} 
              orders={orders} 
              onClose={() => setSelectedTx(null)} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
