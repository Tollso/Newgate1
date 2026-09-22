import React, { useState, useMemo } from 'react';
import { MOCK_DISCOUNT_REPORT } from '../../constants';
import { Download, Printer, Filter, Tag, LayoutDashboard, TrendingDown, ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { DateRangeSelector, FilterSelect, getMultiplierForDateRange } from './ReportFilters';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { downloadCSV } from '../../src/utils/csvExportUtil';
import { ReportTotalDetailModal } from './ReportTotalDetailModal';

const COLORS = ['#4f46e5', '#0ea5e9', '#8b5cf6', '#ec4899', '#f59e0b'];

type SortField = 'discountName' | 'uses' | 'itemsDiscounted' | 'totalAmount' | 'avgDiscount';
type SortDirection = 'asc' | 'desc';

interface DiscountsReportProps {
    discounts?: any[];
    orders?: any[];
}

const DiscountsReport: React.FC<DiscountsReportProps> = ({ discounts = [], orders = [] }) => {
    const [dateRange, setDateRange] = useState('Today');
    const [employeeFilter, setEmployeeFilter] = useState('All Employees');
    const [discountType, setDiscountType] = useState('All Discount Types');
    const [sortField, setSortField] = useState<SortField>('totalAmount');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

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

    const rawDetails = React.useMemo(() => {
        const discMap: Record<string, { discountId: string, discountName: string, uses: number, itemsDiscounted: number, totalAmount: number }> = {};
        
        // Seed with defaults
        MOCK_DISCOUNT_REPORT.details.forEach(d => {
            discMap[d.discountName] = {
                discountId: d.discountId,
                discountName: d.discountName,
                uses: Math.round(d.uses * multiplier),
                itemsDiscounted: Math.round(d.itemsDiscounted * multiplier),
                totalAmount: d.totalAmount * multiplier
            };
        });

        // Add real orders!
        orders.forEach(order => {
            const isPaid = order.status !== 'Void' && order.status !== 'Refunded';
            if (!isPaid) return;

            if (order.discount && order.discount > 0) {
                const itemsCount = order.items?.length || 1;
                const name = order.discount > 5 ? "Happy Hour 50%" : "$5 Off Lunch";
                
                if (discMap[name]) {
                    discMap[name].uses += 1;
                    discMap[name].itemsDiscounted += itemsCount;
                    discMap[name].totalAmount += order.discount;
                } else {
                    discMap[name] = {
                        discountId: `D-DYN-${name}`,
                        discountName: name,
                        uses: 1,
                        itemsDiscounted: itemsCount,
                        totalAmount: order.discount
                    };
                }
            }
        });

        return Object.values(discMap || {}).filter(d => discountType === 'All Discount Types' || d.discountName.includes(discountType === 'Percentage' ? '%' : '$'));
    }, [orders, multiplier, discountType]);

    const summary = React.useMemo(() => {
        const totalAmount = rawDetails.reduce((acc, d) => acc + d.totalAmount, 0);
        const totalUses = rawDetails.reduce((acc, d) => acc + d.uses, 0);
        const itemsDiscounted = rawDetails.reduce((acc, d) => acc + d.itemsDiscounted, 0);
        
        return {
            totalDiscountAmount: totalAmount,
            totalUses,
            percentageOfGrossSales: totalAmount > 0 ? 3.5 : 0,
            itemsDiscounted
        };
    }, [rawDetails]);

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortField(field);
            setSortDirection(field === 'discountName' ? 'asc' : 'desc');
        }
    };

    const sortedDetails = useMemo(() => {
        return [...rawDetails].sort((a, b) => {
            if (sortField === 'discountName') {
                const cmp = a.discountName.localeCompare(b.discountName);
                return sortDirection === 'asc' ? cmp : -cmp;
            }
            if (sortField === 'avgDiscount') {
                const avgA = a.totalAmount / (a.uses || 1);
                const avgB = b.totalAmount / (b.uses || 1);
                return sortDirection === 'asc' ? avgA - avgB : avgB - avgA;
            }
            const numA = Number(a[sortField]) || 0;
            const numB = Number(b[sortField]) || 0;
            return sortDirection === 'asc' ? numA - numB : numB - numA;
        });
    }, [rawDetails, sortField, sortDirection]);

    const chartData = rawDetails.map(d => ({
        name: d.discountName,
        value: d.totalAmount
    }));

    const renderSortHeader = (field: SortField, label: string, align: 'left' | 'center' | 'right' = 'right') => {
        const isActive = sortField === field;
        return (
            <th 
                className={`px-4 py-3 font-semibold text-${align} cursor-pointer select-none transition-colors group hover:bg-slate-100/80 ${
                    isActive ? 'text-indigo-600 bg-indigo-50/50' : 'text-slate-600 hover:text-slate-900'
                }`}
                onClick={() => handleSort(field)}
                title={`Click to sort by ${label}`}
            >
                <div className={`inline-flex items-center gap-1.5 ${align === 'right' ? 'flex-row-reverse' : align === 'center' ? 'justify-center' : 'flex-row'}`}>
                    <span>{label}</span>
                    <span className="shrink-0">
                        {isActive ? (
                            sortDirection === 'asc' ? (
                                <ArrowUp size={14} className="text-indigo-600 font-bold" />
                            ) : (
                                <ArrowDown size={14} className="text-indigo-600 font-bold" />
                            )
                        ) : (
                            <ArrowUpDown size={13} className="text-slate-300 group-hover:text-slate-500 transition-colors opacity-60 group-hover:opacity-100" />
                        )}
                    </span>
                </div>
            </th>
        );
    };

    return (
        <div className="space-y-6 animate-fade-in">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Discounts Report</h1>
                    <p className="text-slate-500">Track discount usage and impact on revenue</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => window.print()} className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors">
                        <Printer size={16} /> Print
                    </button>
                    <button onClick={() => downloadCSV(sortedDetails, 'Discounts_Report')} className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium shadow-sm transition-colors">
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
                    <FilterSelect value={employeeFilter} onChange={setEmployeeFilter} options={['All Employees']} />
                    <FilterSelect value={discountType} onChange={setDiscountType} options={['All Discount Types', 'Percentage', 'Amount']} />
                </div>
            </div>

            {/* Summary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                 <div onClick={() => setSelectedDetail({ title: 'Total Discounts Impact Audit', label: 'Total Discounts', value: summary.totalDiscountAmount })} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:border-red-400 hover:shadow-md transition-all group">
                    <p className="text-xs text-slate-500 uppercase font-bold mb-1 group-hover:text-red-600 transition-colors">Total Discount Amount</p>
                    <h3 className="text-2xl font-bold text-red-500">-${summary.totalDiscountAmount.toFixed(2)}</h3>
                     <p className="text-xs text-slate-400 mt-2">Click for transaction details →</p>
                </div>
                <div onClick={() => setSelectedDetail({ title: 'Discount Uses Frequency Audit', label: 'Total Uses', value: summary.totalUses })} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:border-indigo-400 hover:shadow-md transition-all group">
                    <p className="text-xs text-slate-500 uppercase font-bold mb-1 group-hover:text-indigo-600 transition-colors">Total Uses</p>
                    <h3 className="text-2xl font-bold text-slate-900">{summary.totalUses}</h3>
                     <p className="text-xs text-slate-400 mt-2">Click for transaction details →</p>
                </div>
                <div onClick={() => setSelectedDetail({ title: 'Discount % of Gross Sales', label: 'Discount %', value: summary.percentageOfGrossSales })} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:border-indigo-400 hover:shadow-md transition-all group">
                    <p className="text-xs text-slate-500 uppercase font-bold mb-1 group-hover:text-indigo-600 transition-colors">% of Gross Sales</p>
                    <h3 className="text-2xl font-bold text-indigo-600">{summary.percentageOfGrossSales}%</h3>
                     <p className="text-xs text-slate-400 mt-2">Click for ratio details →</p>
                </div>
                 <div onClick={() => setSelectedDetail({ title: 'Items Discounted Total Audit', label: 'Items Discounted', value: summary.itemsDiscounted })} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:border-indigo-400 hover:shadow-md transition-all group">
                    <p className="text-xs text-slate-500 uppercase font-bold mb-1 group-hover:text-indigo-600 transition-colors">Items Discounted</p>
                    <h3 className="text-2xl font-bold text-slate-700">{summary.itemsDiscounted}</h3>
                     <p className="text-xs text-slate-400 mt-2">Click for item details →</p>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                     <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Tag size={18} className="text-indigo-600" /> Discount Distribution</h3>
                     <div className="h-64">
                         <ResponsiveContainer width="100%" height="100%">
                             <PieChart>
                                 <Pie
                                    data={chartData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="#8884d8"
                                    label
                                 >
                                     {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                     ))}
                                 </Pie>
                                 <Tooltip formatter={(v: number) => `$${v}`} />
                                 <Legend />
                             </PieChart>
                         </ResponsiveContainer>
                     </div>
                 </div>

                 <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                     <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><TrendingDown size={18} className="text-red-500" /> Top Used Discounts</h3>
                     <div className="h-64">
                         <ResponsiveContainer width="100%" height="100%">
                             <BarChart data={rawDetails.slice(0, 5)} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                 <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                 <XAxis type="number" tickFormatter={(v) => `$${v}`} />
                                 <YAxis dataKey="discountName" type="category" width={100} tick={{fontSize: 12}} />
                                 <Tooltip formatter={(v: number) => `$${v}`} />
                                 <Bar dataKey="totalAmount" fill="#f43f5e" radius={[0, 4, 4, 0]} name="Total Amount" />
                             </BarChart>
                         </ResponsiveContainer>
                     </div>
                 </div>
            </div>

            {/* Detailed Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <LayoutDashboard size={18} /> Detailed Breakdown
                    </h3>
                    <span className="text-xs text-slate-400 font-medium">
                        (Sorted by <span className="font-bold text-indigo-600 capitalize">{sortField.replace(/([A-Z])/g, ' $1')}</span> {sortDirection.toUpperCase()})
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                            <tr>
                                {renderSortHeader('discountName', 'Discount Name', 'left')}
                                {renderSortHeader('uses', 'Uses', 'center')}
                                {renderSortHeader('itemsDiscounted', 'Items Discounted', 'center')}
                                {renderSortHeader('totalAmount', 'Total Amount', 'right')}
                                {renderSortHeader('avgDiscount', 'Avg Discount/Use', 'right')}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {sortedDetails.map(row => (
                                <tr 
                                    key={row.discountId} 
                                    onClick={() => setSelectedDetail({ title: `${row.discountName} - Audit Breakdown`, label: 'Discount Total', value: row.totalAmount })}
                                    className="hover:bg-indigo-50/50 cursor-pointer transition-colors group"
                                    title="Click to view itemized orders with this discount"
                                >
                                    <td className="px-4 py-3">
                                        <div className="font-medium text-slate-900 group-hover:text-indigo-600 transition-colors">{row.discountName}</div>
                                    </td>
                                    <td className="px-4 py-3 text-center text-slate-600 font-mono">{row.uses}</td>
                                    <td className="px-4 py-3 text-center text-slate-600 font-mono">{row.itemsDiscounted}</td>
                                    <td className="px-4 py-3 text-right font-mono text-red-500 font-bold">-${row.totalAmount.toFixed(2)}</td>
                                    <td className="px-4 py-3 text-right font-mono text-slate-600 font-mono">-${(row.totalAmount / (row.uses || 1)).toFixed(2)}</td>
                                </tr>
                            ))}
                            {sortedDetails.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-slate-500 italic">No discounts used in this period.</td>
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

export default DiscountsReport;
