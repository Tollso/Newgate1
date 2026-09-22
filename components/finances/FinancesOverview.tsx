
import React, { useState } from 'react';
import { MOCK_DETAILED_DEPOSITS } from '../../constants';
import { Transaction, DetailedOrder } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { DollarSign, CreditCard, TrendingUp, AlertCircle, Clock, FileText, ArrowUpRight } from 'lucide-react';

interface FinancesOverviewProps {
    transactions: Transaction[];
    orders?: DetailedOrder[];
    onNavigate?: (tab: string) => void;
}

const FinancesOverview: React.FC<FinancesOverviewProps> = ({ transactions, orders = [] , onNavigate }) => {
    const [dateRange, setDateRange] = useState('Today');

    // Filter transactions based on dateRange (mocking a filter for today; in real life, check actual dates)
    const validTransactions = transactions || []; // Default to all for now as it's a demo

    // Derived metrics from actual transactions state
    const amountCollected = validTransactions.reduce((sum, t) => sum + t.amount, 0);
    const transactionsCount = validTransactions.length;
    
    // Simulate open batch as sum of card transactions for today
    const cardTransactions = validTransactions.filter(t => ['Visa', 'MasterCard', 'AmEx', 'Discover', 'Card', 'Gift Card'].includes(t.method));
    const openBatchAmount = cardTransactions.reduce((sum, t) => sum + t.amount, 0);
    const cashAmount = validTransactions.filter(t => t.method === 'Cash').reduce((sum, t) => sum + t.amount, 0);

    // Calculate taxes approximately from orders (if they exist)
    const taxes = orders.reduce((sum, o) => sum + (o.fees || 0), 0) + (amountCollected * 0.0825); // Estimating 8.25% if no taxes strictly itemized

    // Chart Data
    const chartData = [
        { name: 'Card', value: openBatchAmount },
        { name: 'Cash', value: cashAmount },
        { name: 'Other', value: Math.max(0, amountCollected - openBatchAmount - cashAmount) }
    ];

    const COLORS = ['#4f46e5', '#10b981', '#f59e0b'];

    return (
        <div className="space-y-6 animate-fade-in">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Financial Overview</h1>
                    <p className="text-slate-500">Real-time snapshot of your business finances</p>
                </div>
                <select 
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white shadow-sm"
                >
                    <option>Today</option>
                    <option>Yesterday</option>
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                </select>
            </div>

            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-sm font-medium text-slate-500 mb-2">Amount Collected</p>
                    <h3 className="text-3xl font-bold text-slate-900 mb-2">${amountCollected.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                            <TrendingUp size={12} /> +0.06%
                        </span>
                        <span className="text-slate-400">vs prev period</span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-sm font-medium text-slate-500 mb-2">Taxes Collected</p>
                    <h3 className="text-3xl font-bold text-slate-900 mb-2">${taxes.toFixed(2)}</h3>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                            <TrendingUp size={12} /> +0.03%
                        </span>
                    </div>
                </div>
                <div 
                    onClick={() => onNavigate && onNavigate('Transactions')}
                    className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:border-indigo-400 hover:shadow-md transition-all active:scale-[0.98]"
                >
                    <div className="flex justify-between items-start">
                        <p className="text-sm font-medium text-slate-500 mb-2">Transactions</p>
                        <span className="text-xs text-indigo-500 font-semibold bg-indigo-50 px-2 py-0.5 rounded">View List</span>
                    </div>
                    <h3 className="text-3xl font-bold text-slate-900 mb-2">{transactionsCount}</h3>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                            <TrendingUp size={12} /> +0.26%
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 {/* Tender Breakdown Chart */}
                 <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                     <h3 className="font-bold text-slate-800 mb-6">Amount Collected by Tender Type</h3>
                     <div className="h-64">
                         <ResponsiveContainer width="100%" height="100%">
                             <BarChart data={chartData} layout="vertical">
                                 <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                 <XAxis type="number" hide />
                                 <YAxis dataKey="name" type="category" width={80} tick={{fill: '#64748b'}} />
                                 <Tooltip cursor={{fill: 'transparent'}} formatter={(value: number) => `$${value.toLocaleString()}`} />
                                 <Bar dataKey="value" barSize={32} radius={[0, 4, 4, 0]}>
                                     {chartData.map((entry, index) => (
                                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                     ))}
                                 </Bar>
                             </BarChart>
                         </ResponsiveContainer>
                     </div>
                     <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-100">
                         {chartData.map((item, idx) => (
                             <div key={item.name} className="text-center">
                                 <p className="text-xs text-slate-500 uppercase font-semibold">{item.name}</p>
                                 <p className="font-bold text-slate-900 mt-1" style={{ color: COLORS[idx] }}>${item.value.toLocaleString()}</p>
                             </div>
                         ))}
                     </div>
                 </div>

                 {/* Actions & Mini-Lists */}
                 <div className="space-y-6">
                     {/* Closeout Widget */}
                     <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6">
                         <div className="flex items-center justify-between mb-2">
                             <h4 className="font-bold text-indigo-900 flex items-center gap-2">
                                 <Clock size={18} /> Next Closeout
                             </h4>
                             <span className="text-xs bg-white text-indigo-700 px-2 py-1 rounded border border-indigo-100 font-medium">2:58 AM</span>
                         </div>
                         <p className="text-indigo-700 text-sm mb-4">Open Batch Amount: <span className="font-bold">${openBatchAmount.toLocaleString()}</span></p>
                         <button className="w-full py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 shadow-sm transition-colors text-sm">
                             View Current Batch
                         </button>
                         <p className="text-xs text-indigo-500 mt-3 text-center">Funds available in 1-3 business days.</p>
                     </div>

                     {/* Recent Deposits */}
                     <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                         <h4 className="font-bold text-slate-800 mb-4">Recent Deposits</h4>
                         <div className="space-y-3">
                             {MOCK_DETAILED_DEPOSITS.slice(0, 3).map(dep => (
                                 <div key={dep.id} className="flex justify-between items-center text-sm">
                                     <span className="text-slate-600">{dep.date}</span>
                                     <span className="font-mono font-medium text-emerald-600">+${dep.transferred.toLocaleString()}</span>
                                 </div>
                             ))}
                         </div>
                         <button className="w-full mt-4 text-indigo-600 text-sm font-medium hover:underline text-left flex items-center gap-1">
                             View all deposits <ArrowUpRight size={14} />
                         </button>
                     </div>

                     {/* Disputes */}
                     <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex items-center justify-between">
                         <div>
                             <h4 className="font-bold text-slate-800">Open Disputes</h4>
                             <p className="text-sm text-slate-500">No open disputes requiring action.</p>
                         </div>
                         <div className="h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                             <AlertCircle size={20} />
                         </div>
                     </div>
                 </div>
            </div>
        </div>
    );
};

export default FinancesOverview;
