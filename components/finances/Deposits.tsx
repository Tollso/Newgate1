
import React from 'react';
import { MOCK_DETAILED_DEPOSITS } from '../../constants';
import { Download, Printer, Filter, Zap, ArrowUpRight } from 'lucide-react';

const Deposits: React.FC = () => {
    const totalTransferred = 15484.42;
    const totalSubmitted = 15484.42;

    return (
        <div className="space-y-6 animate-fade-in">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Deposits</h1>
                    <p className="text-slate-500">Track settlements and bank transfers</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-medium">
                        <Printer size={16} /> Print
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium shadow-sm">
                        <Download size={16} /> Export CSV
                    </button>
                </div>
            </div>

            {/* Promo Banner */}
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl p-4 text-white flex justify-between items-center shadow-md">
                 <div className="flex items-center gap-3">
                     <div className="p-2 bg-white/20 rounded-lg">
                         <Zap size={24} className="text-yellow-300" />
                     </div>
                     <div>
                         <h3 className="font-bold">Need your money now?</h3>
                         <p className="text-sm text-indigo-100">Get funds instantly with Rapid Deposit for a 1.75% fee.</p>
                     </div>
                 </div>
                 <button className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-bold text-sm shadow hover:bg-indigo-50 transition-colors">
                     Enable Rapid Deposit
                 </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-xs text-slate-500 uppercase font-bold mb-1">Amount Transferred</p>
                    <h3 className="text-2xl font-bold text-emerald-600">${totalTransferred.toLocaleString()}</h3>
                    <p className="text-xs text-slate-400 mt-1">From 2 recent transfers</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-xs text-slate-500 uppercase font-bold mb-1">Amount Submitted</p>
                    <h3 className="text-2xl font-bold text-slate-900">${totalSubmitted.toLocaleString()}</h3>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-xs text-slate-500 uppercase font-bold mb-1">Fees & Adjustments</p>
                    <h3 className="text-2xl font-bold text-slate-700">$0.00</h3>
                </div>
            </div>

            {/* Deposit History Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800">Deposit History</h3>
                    <div className="flex gap-2">
                        <select className="text-sm border border-slate-300 rounded px-2 py-1 bg-white">
                            <option>Last 30 Days</option>
                            <option>This Year</option>
                        </select>
                    </div>
                </div>
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                        <tr>
                            <th className="px-6 py-3 font-semibold">Deposit Date</th>
                            <th className="px-6 py-3 font-semibold text-right">Submitted</th>
                            <th className="px-6 py-3 font-semibold text-right">Fees/Adj</th>
                            <th className="px-6 py-3 font-semibold text-right">Transferred</th>
                            <th className="px-6 py-3 font-semibold text-right">Status</th>
                            <th className="px-6 py-3 font-semibold text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {MOCK_DETAILED_DEPOSITS.map(dep => (
                            <tr key={dep.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 font-medium text-slate-900">{dep.date}</td>
                                <td className="px-6 py-4 text-right font-mono text-slate-600">${dep.submitted.toLocaleString()}</td>
                                <td className="px-6 py-4 text-right font-mono text-red-500">{dep.fees === 0 ? '-' : `-$${dep.fees.toFixed(2)}`}</td>
                                <td className="px-6 py-4 text-right font-mono font-bold text-emerald-600">${dep.transferred.toLocaleString()}</td>
                                <td className="px-6 py-4 text-right">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${dep.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                                        {dep.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center justify-end gap-1 w-full">
                                        View <ArrowUpRight size={14} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Deposits;
