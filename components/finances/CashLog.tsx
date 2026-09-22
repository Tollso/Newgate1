
import React from 'react';
import { CashLogEntry } from '../../types';
import { DollarSign, AlertCircle, Printer, Download } from 'lucide-react';

interface CashLogProps {
  logs: CashLogEntry[];
}

const CashLog: React.FC<CashLogProps> = ({ logs }) => {
  return (
    <div className="space-y-6">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Cash Management Log</h1>
          <p className="text-slate-500">Daily reconciliation and cash drawer tracking</p>
        </div>
        <div className="flex gap-2">
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 text-sm">
                <Printer size={16} /> Print Log
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm shadow-sm">
                <Download size={16} /> Export
            </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Date</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Opening</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Sales (Cash)</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Drops/Payouts</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Expected</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Closing</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Variance</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Employee</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {logs.map((log) => {
                    const expected = log.openingAmount + log.cashSales - log.cashDrops;
                    return (
                        <tr key={log.id} className="hover:bg-slate-50">
                            <td className="px-6 py-4 font-medium text-slate-900">{log.date}</td>
                            <td className="px-6 py-4 text-right text-slate-600 font-mono">${log.openingAmount.toFixed(2)}</td>
                            <td className="px-6 py-4 text-right text-emerald-600 font-mono">+${log.cashSales.toFixed(2)}</td>
                            <td className="px-6 py-4 text-right text-red-500 font-mono">-${log.cashDrops.toFixed(2)}</td>
                            <td className="px-6 py-4 text-right text-slate-500 font-mono">${expected.toFixed(2)}</td>
                            <td className="px-6 py-4 text-right font-bold text-slate-900 font-mono">${log.closingAmount.toFixed(2)}</td>
                            <td className="px-6 py-4 text-right">
                                <span className={`font-mono font-bold ${log.variance === 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                    {log.variance > 0 ? '+' : ''}{log.variance.toFixed(2)}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-500">{log.employeeId}</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default CashLog;