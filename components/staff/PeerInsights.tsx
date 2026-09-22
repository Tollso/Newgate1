
import React, { useState } from 'react';
import { generatePeerInsights } from '../../services/geminiService';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Sparkles, TrendingUp, Users, DollarSign, Download, Printer, Filter } from 'lucide-react';
import { DateRangeSelector, FilterSelect, getMultiplierForDateRange } from '../reports/ReportFilters';
import { Customer, PeerComparisonData } from '../../types';
import { MOCK_PEER_METRICS } from '../../constants';
import { downloadCSV } from '../../src/utils/csvExportUtil';

interface PeerInsightsProps {
    totalSales: number;
    transactionCount: number;
    customers: Customer[];
}

const PeerInsights: React.FC<PeerInsightsProps> = ({ totalSales, transactionCount, customers }) => {
    const [insight, setInsight] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [peerGroup, setPeerGroup] = useState('Fast Casual Dining');
    const [dateRange, setDateRange] = useState('Last 30 Days');

    const multiplier = React.useMemo(() => {
        let m = getMultiplierForDateRange(dateRange);
        if (peerGroup !== 'Fast Casual Dining') m *= 1.25;
        return m;
    }, [dateRange, peerGroup]);

    const handleGenerateInsights = async () => {
        setLoading(true);
        const result = await generatePeerInsights(totalSales, transactionCount, customers.slice(0, 3));
        setInsight(result);
        setLoading(false);
    }

    const metrics = React.useMemo(() => [
        { ...MOCK_PEER_METRICS.grossSales, you: MOCK_PEER_METRICS.grossSales.you * multiplier, peerAverage: MOCK_PEER_METRICS.grossSales.peerAverage * multiplier },
        { ...MOCK_PEER_METRICS.avgMonthlySales, you: MOCK_PEER_METRICS.avgMonthlySales.you * multiplier, peerAverage: MOCK_PEER_METRICS.avgMonthlySales.peerAverage * multiplier },
        { ...MOCK_PEER_METRICS.avgTransactions, you: Math.round(MOCK_PEER_METRICS.avgTransactions.you * multiplier), peerAverage: Math.round(MOCK_PEER_METRICS.avgTransactions.peerAverage * multiplier) },
        MOCK_PEER_METRICS.avgTransactionSize // Average goes relatively unchanged by volume multiplier
    ], [multiplier]);

    const chartDataSales = React.useMemo(() => MOCK_PEER_METRICS.chartData.map(d => ({
        ...d,
        you: d.you * multiplier,
        peers: d.peers * multiplier
    })), [multiplier]);

    const chartDataTxn = React.useMemo(() => MOCK_PEER_METRICS.transactionSizeChartData.map(d => ({
        ...d, // Average transaction size remains relatively unaffected by the straight date volume multiplier
    })), [multiplier]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Peer Insights</h1>
                    <p className="text-slate-500">Benchmark performance against similar businesses</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => window.print()} className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors">
                        <Printer size={16} /> Print
                    </button>
                    <button onClick={() => downloadCSV(metrics, 'Peer_Insights_Report')} className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium shadow-sm transition-colors">
                        <Download size={16} /> Export Report
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
                <div className="flex items-center gap-2 text-slate-500 font-medium">
                    <Filter size={18} /> Comparison Settings:
                </div>
                <DateRangeSelector value={dateRange} onChange={setDateRange} />
                <FilterSelect 
                    value={peerGroup}
                    onChange={setPeerGroup}
                    options={['Fast Casual Dining', 'Coffee Shop', 'Retail Boutique', 'Full Service Restaurant']}
                />
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((m, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <p className="text-sm font-medium text-slate-500 mb-1">{m.metric}</p>
                        <h3 className="text-2xl font-bold text-slate-900 mb-1">
                            {m.format === 'currency' ? '$' : ''}{m.you.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </h3>
                        <div className="flex items-center gap-2">
                            <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                                +{m.percentageDiff}%
                            </span>
                            <span className="text-xs text-slate-400">vs peers</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sales Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="text-lg font-semibold text-slate-800 mb-6">Gross Sales Trends</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartDataSales}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="month" tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
                                <YAxis tickFormatter={(v) => `$${v/1000}k`} tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
                                <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
                                <Legend />
                                <Line type="monotone" dataKey="you" stroke="#4f46e5" strokeWidth={3} name="Your Business" activeDot={{r: 6}} />
                                <Line type="monotone" dataKey="peers" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" name="Peer Average" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* AI Insights Section */}
                <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-xl p-6 text-white shadow-xl relative overflow-hidden flex flex-col justify-between">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles className="text-yellow-400" size={24} />
                            <h3 className="text-xl font-bold">Growth Opportunities</h3>
                        </div>
                        
                        {!insight ? (
                            <div className="text-center py-8">
                                <p className="text-indigo-200 mb-6">Analyze performance gaps and receive tailored strategies to outperform your peer group.</p>
                                <button 
                                    onClick={handleGenerateInsights}
                                    disabled={loading}
                                    className="bg-white text-indigo-900 px-6 py-3 rounded-lg font-bold hover:bg-indigo-50 transition-colors disabled:opacity-75 w-full shadow-lg"
                                >
                                    {loading ? 'Analyzing Data...' : 'Generate Strategies'}
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4 animate-fade-in">
                                <div className="prose prose-invert prose-sm max-w-none bg-white/10 p-4 rounded-lg border border-white/10">
                                    {insight}
                                </div>
                                <button 
                                    onClick={() => setInsight(null)} 
                                    className="text-indigo-300 text-sm hover:text-white underline"
                                >
                                    Refresh Analysis
                                </button>
                            </div>
                        )}
                    </div>
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-indigo-500 opacity-20 rounded-full blur-3xl"></div>
                </div>
            </div>

            {/* Transaction Size Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800 mb-6">Average Transaction Size Comparison</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                         <BarChart data={chartDataTxn}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="month" tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
                            <YAxis tickFormatter={(v) => `$${v}`} tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
                            <Tooltip formatter={(v: number) => `$${v.toFixed(2)}`} cursor={{fill: 'transparent'}} />
                            <Legend />
                            <Bar dataKey="you" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Your Business" barSize={32} />
                            <Bar dataKey="peers" fill="#cbd5e1" radius={[4, 4, 0, 0]} name="Peer Average" barSize={32} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

export default PeerInsights;