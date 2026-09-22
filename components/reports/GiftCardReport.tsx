
import React, { useState } from 'react';
import { MOCK_GIFT_CARD_DATA } from '../../constants';
import { Download, Printer, Filter, Gift, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { DateRangeSelector, FilterSelect, getMultiplierForDateRange } from './ReportFilters';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { downloadCSV } from '../../src/utils/csvExportUtil';
import { ReportTotalDetailModal } from './ReportTotalDetailModal';

interface GiftCardReportProps {
  orders?: any[];
}

const GiftCardReport: React.FC<GiftCardReportProps> = ({ orders = [] }) => {
  const [loadMethod, setLoadMethod] = useState('All');
  const [dateRange, setDateRange] = useState('Today');
  const [employeeFilter, setEmployeeFilter] = useState('All Employees');
  const [selectedDetail, setSelectedDetail] = useState<{
    title: string;
    label: string;
    value: number;
  } | null>(null);
  
  const multiplier = React.useMemo(() => {
        let m = getMultiplierForDateRange(dateRange);
        if (employeeFilter !== 'All Employees') m *= 0.25;
        return m;
  }, [dateRange, employeeFilter]);

  const summary = React.useMemo(() => ({
      ...MOCK_GIFT_CARD_DATA.summary,
      totalLoaded: MOCK_GIFT_CARD_DATA.summary.totalLoaded * multiplier,
      paidLoaded: MOCK_GIFT_CARD_DATA.summary.paidLoaded * multiplier,
      complimentaryLoaded: MOCK_GIFT_CARD_DATA.summary.complimentaryLoaded * multiplier,
      countIssued: Math.round(MOCK_GIFT_CARD_DATA.summary.countIssued * multiplier),
      totalRedeemed: MOCK_GIFT_CARD_DATA.summary.totalRedeemed * multiplier
  }), [multiplier]);
  
  const filteredTransactions = React.useMemo(() => 
      MOCK_GIFT_CARD_DATA.transactions.map(t => ({
          ...t,
          amount: t.amount * multiplier
      })).filter(t => 
          loadMethod === 'All' || 
          (loadMethod === 'Paid' && t.loadMethod === 'Paid') || 
          (loadMethod === 'Complimentary' && t.loadMethod === 'Complimentary')
      )
  , [loadMethod, multiplier]);

  return (
    <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Gift Cards Report</h1>
                <p className="text-slate-500">Track issuance, redemption, and liabilities</p>
            </div>
            <div className="flex gap-2">
                <button onClick={() => window.print()} className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors">
                    <Printer size={16} /> Print
                </button>
                <button onClick={() => downloadCSV(filteredTransactions, 'Gift_Cards_Report')} className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium shadow-sm transition-colors">
                    <Download size={16} /> Export CSV
                </button>
            </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
            <div className="flex items-center gap-2 text-slate-500 font-medium whitespace-nowrap">
                <Filter size={18} /> Filters:
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                <DateRangeSelector value={dateRange} onChange={setDateRange} />
                <FilterSelect 
                    value={loadMethod} 
                    onChange={setLoadMethod} 
                    options={[
                        {label: 'All Load Methods', value: 'All'},
                        {label: 'Paid', value: 'Paid'},
                        {label: 'Complimentary', value: 'Complimentary'}
                    ]}
                />
                <FilterSelect value={employeeFilter} onChange={setEmployeeFilter} options={['All Employees']} />
            </div>
        </div>

        {/* Summary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div 
              onClick={() => setSelectedDetail({ title: 'Total Gift Cards Loaded Audit', label: 'Total Loaded', value: summary.totalLoaded })} 
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:border-indigo-400 hover:shadow-md transition-all group"
              title="Click for audit details"
            >
                <div className="flex justify-between items-start mb-2">
                    <p className="text-xs text-slate-500 uppercase font-bold group-hover:text-indigo-600 transition-colors">Total Loaded</p>
                    <Gift size={16} className="text-indigo-500" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">${summary.totalLoaded.toFixed(2)}</h3>
                <p className="text-[10px] text-indigo-500 mt-1 font-medium">Click for breakdown →</p>
            </div>
            <div 
              onClick={() => setSelectedDetail({ title: 'Paid Gift Cards Loaded Audit', label: 'Paid Loaded', value: summary.paidLoaded })}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:border-emerald-400 hover:shadow-md transition-all group"
              title="Click for audit details"
            >
                <p className="text-xs text-slate-500 uppercase font-bold mb-2 group-hover:text-emerald-600 transition-colors">Paid Loaded</p>
                <h3 className="text-2xl font-bold text-emerald-600">${summary.paidLoaded.toFixed(2)}</h3>
                <p className="text-[10px] text-emerald-500 mt-1 font-medium">Click for breakdown →</p>
            </div>
            <div 
              onClick={() => setSelectedDetail({ title: 'Complimentary Gift Cards Audit', label: 'Comp Loaded', value: summary.complimentaryLoaded })}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:border-blue-400 hover:shadow-md transition-all group"
              title="Click for audit details"
            >
                <p className="text-xs text-slate-500 uppercase font-bold mb-2 group-hover:text-blue-600 transition-colors">Complimentary</p>
                <h3 className="text-2xl font-bold text-blue-600">${summary.complimentaryLoaded.toFixed(2)}</h3>
                <p className="text-[10px] text-blue-500 mt-1 font-medium">Click for breakdown →</p>
            </div>
             <div 
              onClick={() => setSelectedDetail({ title: 'Cards Issued Quantity Audit', label: 'Cards Issued', value: summary.countIssued })}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:border-indigo-400 hover:shadow-md transition-all group"
              title="Click for audit details"
            >
                <p className="text-xs text-slate-500 uppercase font-bold mb-2 group-hover:text-indigo-600 transition-colors">Cards Issued</p>
                <h3 className="text-2xl font-bold text-slate-900">{summary.countIssued}</h3>
                <p className="text-[10px] text-indigo-500 mt-1 font-medium">Click for breakdown →</p>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Redemption Chart */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Redemption Trends</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={[
                            {date: 'May 10', redeemed: 50}, {date: 'May 11', redeemed: 120}, 
                            {date: 'May 12', redeemed: 80}, {date: 'May 13', redeemed: 150}, 
                            {date: 'May 14', redeemed: 200}, {date: 'May 15', redeemed: 100}
                        ]}>
                            <defs>
                                <linearGradient id="colorRedeem" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                            <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} tick={{fontSize: 12}} />
                            <CartesianGrid vertical={false} strokeDasharray="3 3" />
                            <Tooltip />
                            <Area type="monotone" dataKey="redeemed" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorRedeem)" name="Redeemed" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Quick Stats */}
            <div 
              onClick={() => setSelectedDetail({ title: 'Outstanding Gift Card Liability Audit', label: 'Liability Balance', value: 4250 })}
              className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 cursor-pointer hover:border-indigo-300 hover:shadow-md transition-all group"
            >
                 <h3 className="font-bold text-indigo-900 mb-4 flex justify-between items-center">
                   <span>Liability Snapshot</span>
                   <span className="text-xs text-indigo-600 font-semibold group-hover:underline">Audit Details →</span>
                 </h3>
                 <div className="space-y-4">
                     <div className="flex justify-between items-center border-b border-indigo-200 pb-2">
                         <span className="text-indigo-700 text-sm">Outstanding Balance</span>
                         <span className="font-bold text-indigo-900">$4,250.00</span>
                     </div>
                     <div className="flex justify-between items-center border-b border-indigo-200 pb-2">
                         <span className="text-indigo-700 text-sm">Redeemed (Period)</span>
                         <span className="font-bold text-indigo-900">${summary.totalRedeemed.toFixed(2)}</span>
                     </div>
                     <div className="flex justify-between items-center">
                         <span className="text-indigo-700 text-sm">Active Cards</span>
                         <span className="font-bold text-indigo-900">142</span>
                     </div>
                 </div>
            </div>
        </div>

        {/* Detailed Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
                <h3 className="font-bold text-slate-800">Gift Card Activity</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Transaction ID</th>
                            <th className="px-6 py-4 font-semibold">Type</th>
                            <th className="px-6 py-4 font-semibold">Date</th>
                            <th className="px-6 py-4 font-semibold">Load Method</th>
                            <th className="px-6 py-4 font-semibold">Employee</th>
                            <th className="px-6 py-4 font-semibold text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredTransactions.map(t => (
                            <tr 
                              key={t.id} 
                              onClick={() => setSelectedDetail({ title: `Gift Card Txn ${t.id} Audit`, label: `Txn Amount (${t.type})`, value: t.amount })}
                              className="hover:bg-indigo-50/50 cursor-pointer transition-colors group"
                              title="Click for transaction audit"
                            >
                                <td className="px-6 py-4 font-mono text-slate-600 group-hover:text-indigo-600 transition-colors">
                                    {t.id}
                                    <div className="text-xs text-slate-400">{t.orderId}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`flex items-center gap-1 font-medium ${t.type === 'Load' ? 'text-emerald-600' : 'text-purple-600'}`}>
                                        {t.type === 'Load' ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />}
                                        {t.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-700">{t.date}</td>
                                <td className="px-6 py-4 text-slate-600">{t.type === 'Load' ? t.loadMethod : '-'}</td>
                                <td className="px-6 py-4 text-slate-900">{t.employeeName}</td>
                                <td className={`px-6 py-4 text-right font-mono font-bold ${t.type === 'Load' ? 'text-emerald-600' : 'text-slate-900'}`}>
                                    {t.type === 'Load' ? '+' : ''}{t.amount.toFixed(2)}
                                </td>
                            </tr>
                        ))}
                        {filteredTransactions.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic">No transactions found matching your criteria.</td>
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

export default GiftCardReport;
