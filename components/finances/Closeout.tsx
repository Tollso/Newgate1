
import React from 'react';
import { MOCK_BATCHES } from '../../constants';
import { Download, Printer, Filter, Zap, Clock, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Closeout: React.FC = () => {
    // Current batch logic
    const openBatchAmount = 3042.83;
    const openBatchCount = 30;

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Closeout & Batches</h1>
                    <p className="text-slate-500">Manage transaction settlements and funding</p>
                </div>
                <div className="flex gap-2">
                     <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-medium">
                        <Printer size={16} /> Print History
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium shadow-sm">
                        <Download size={16} /> Export CSV
                    </button>
                </div>
            </div>

            {/* Current Batch Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="font-bold text-slate-800">Current Open Batch</h3>
                            <p className="text-sm text-slate-500">Closing automatically at 2:58 AM</p>
                        </div>
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-bold uppercase">Open</span>
                    </div>
                    <div className="flex items-end gap-2 mb-2">
                        <h2 className="text-3xl font-bold text-slate-900">${openBatchAmount.toLocaleString()}</h2>
                        <span className="text-slate-500 mb-1">{openBatchCount} txns</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-4">
                        <div className="h-full bg-indigo-500 w-3/4 rounded-full"></div>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex-1 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 text-sm">
                            View Details
                        </button>
                        <button className="flex-1 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 shadow-sm text-sm flex items-center justify-center gap-2">
                            <Zap size={16} className="text-yellow-300" /> Rapid Deposit
                        </button>
                    </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl flex flex-col justify-center">
                    <h4 className="font-bold text-slate-800 mb-2">About Settlement</h4>
                    <p className="text-sm text-slate-600 mb-4">
                        A batch consists of all credit/debit transactions from a given period. Funds are typically deposited 1-3 business days after closeout.
                        Use <strong>Rapid Deposit</strong> (1.75% fee) to get funds instantly.
                    </p>
                    <div className="flex items-center gap-4 text-sm font-medium text-slate-700">
                        <div className="flex items-center gap-1">
                            <Clock size={16} className="text-slate-400" /> Auto-Close: Enabled
                        </div>
                        <div className="flex items-center gap-1">
                            <CheckCircle size={16} className="text-emerald-500" /> System Healthy
                        </div>
                    </div>
                </div>
            </div>

            {/* Batch History */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800">Batch History</h3>
                    <button className="text-indigo-600 text-sm font-medium hover:underline">View All</button>
                </div>
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                        <tr>
                            <th className="px-6 py-3 font-semibold">Date/Time</th>
                            <th className="px-6 py-3 font-semibold">Batch ID</th>
                            <th className="px-6 py-3 font-semibold">Status</th>
                            <th className="px-6 py-3 font-semibold">Type</th>
                            <th className="px-6 py-3 font-semibold text-right">Txn Count</th>
                            <th className="px-6 py-3 font-semibold text-right">Total Amount</th>
                            <th className="px-6 py-3 font-semibold text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {MOCK_BATCHES.map((batch, idx) => (
                            <tr key={idx} className="hover:bg-slate-50">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-slate-900">{batch.date}</div>
                                    <div className="text-xs text-slate-500">{batch.time}</div>
                                </td>
                                <td className="px-6 py-4 font-mono text-slate-600">{batch.id}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${batch.status === 'Closed' ? 'bg-slate-100 text-slate-800' : 'bg-green-100 text-green-800'}`}>
                                        {batch.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-600">{batch.type}</td>
                                <td className="px-6 py-4 text-right text-slate-700">{batch.transactionCount}</td>
                                <td className="px-6 py-4 text-right font-bold font-mono text-slate-900">${batch.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-indigo-600 hover:text-indigo-800 font-medium">Details</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Batch Trend Chart */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-72">
                <h3 className="font-bold text-slate-800 mb-4">Batch Amounts (Last 30 Days)</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={MOCK_BATCHES.slice(0, 4).reverse()}>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} />
                         <XAxis dataKey="date" tick={{fontSize: 10}} tickFormatter={(val) => val.split(',')[1]} />
                         <YAxis tickFormatter={(val) => `$${val/1000}k`} tick={{fontSize: 12}} />
                         <Tooltip formatter={(val: number) => `$${val.toLocaleString()}`} />
                         <Bar dataKey="amount" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Closeout;
