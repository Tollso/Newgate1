
import React, { useState, useMemo } from 'react';
import { MOCK_EMPLOYEES_SALES_DATA } from '../../constants';
import { Download, Printer, Filter, Users, ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { DateRangeSelector, FilterSelect, getMultiplierForDateRange } from './ReportFilters';
import { BarChart, Bar, PieChart, Pie, Cell, Tooltip, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { downloadCSV } from '../../src/utils/csvExportUtil';
import { ReportTotalDetailModal } from './ReportTotalDetailModal';

const COLORS = ['#4f46e5', '#0ea5e9', '#8b5cf6', '#ec4899', '#f59e0b'];

type SortField = 'employeeName' | 'grossSales' | 'discounts' | 'netSales' | 'tips' | 'taxesCollected' | 'amountCollected' | 'paymentCount' | 'avgTicketSize';
type SortDirection = 'asc' | 'desc';

interface EmployeeSalesReportProps {
    orders?: any[];
    employees?: any[];
}

const EmployeeSalesReport: React.FC<EmployeeSalesReportProps> = ({ orders = [], employees = [] }) => {
    const [dateRange, setDateRange] = useState('Today');
    const [employeeFilter, setEmployeeFilter] = useState('All Employees');
    const [deviceFilter, setDeviceFilter] = useState('All Devices');
    const [sortField, setSortField] = useState<SortField>('netSales');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

    const [selectedDetail, setSelectedDetail] = useState<{
        title: string;
        label: string;
        value: number;
    } | null>(null);

    const multiplier = React.useMemo(() => {
        let m = getMultiplierForDateRange(dateRange);
        if (employeeFilter !== 'All Employees') m *= 0.25;
        if (deviceFilter !== 'All Devices') m *= 0.7;
        return m;
    }, [dateRange, employeeFilter, deviceFilter]);

    const rawRows = React.useMemo(() => {
        const empMap: Record<string, { employeeId: string, employeeName: string, role: string, grossSales: number, discounts: number, netSales: number, tips: number, taxesCollected: number, amountCollected: number, paymentCount: number }> = {};
        
        // Seed with defaults
        MOCK_EMPLOYEES_SALES_DATA.rows.forEach(r => {
            const paymentCount = Math.round((r.paymentCount || 0) * multiplier);
            const netSales = (r.netSales || 0) * multiplier;
            empMap[r.employeeName] = {
                employeeId: r.employeeId,
                employeeName: r.employeeName,
                role: r.role,
                grossSales: (r.grossSales || 0) * multiplier,
                discounts: (r.discounts || 0) * multiplier,
                netSales,
                tips: (r.tips || 0) * multiplier,
                taxesCollected: (r.taxesCollected || 0) * multiplier,
                amountCollected: (r.amountCollected || 0) * multiplier,
                paymentCount
            };
        });

        // Add real orders!
        orders.forEach(order => {
            const isPaid = order.status !== 'Void' && order.status !== 'Refunded';
            if (!isPaid) return;

            const name = order.employeeName || 'Staff';
            const gross = order.total || 0;
            const disc = order.discount || 0;
            const net = gross - disc;
            const tip = order.tip || 0;
            const tax = order.fees || (net * 0.0825);
            const collected = net + tip;

            if (empMap[name]) {
                empMap[name].grossSales += gross;
                empMap[name].discounts += disc;
                empMap[name].netSales += net;
                empMap[name].tips += tip;
                empMap[name].taxesCollected += tax;
                empMap[name].amountCollected += collected;
                empMap[name].paymentCount += 1;
            } else {
                empMap[name] = {
                    employeeId: `E-DYN-${name}`,
                    employeeName: name,
                    role: 'Server',
                    grossSales: gross,
                    discounts: disc,
                    netSales: net,
                    tips: tip,
                    taxesCollected: tax,
                    amountCollected: collected,
                    paymentCount: 1
                };
            }
        });

        return Object.values(empMap || {}).map(r => ({
            ...r,
            avgTicketSize: r.paymentCount > 0 ? r.netSales / r.paymentCount : 0
        }));
    }, [orders, multiplier]);

    const summary = React.useMemo(() => {
        const totalNetSales = rawRows.reduce((acc, r) => acc + r.netSales, 0);
        const totalTips = rawRows.reduce((acc, r) => acc + r.tips, 0);
        const totalCount = rawRows.reduce((acc, r) => acc + r.paymentCount, 0);
        const avgTicketSize = totalCount > 0 ? totalNetSales / totalCount : 0;
        
        return {
            netSales: totalNetSales,
            avgTicketSize,
            tips: totalTips,
            laborCost: totalNetSales * 0.22,
            laborCostPercentage: 22.0
        };
    }, [rawRows]);

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortField(field);
            // Default to ascending for alphabetical name, descending for monetary and numerical values
            setSortDirection(field === 'employeeName' ? 'asc' : 'desc');
        }
    };

    const sortedRows = useMemo(() => {
        return [...rawRows].sort((a, b) => {
            const aVal = a[sortField];
            const bVal = b[sortField];

            if (typeof aVal === 'string') {
                const cmp = aVal.localeCompare(bVal as string);
                return sortDirection === 'asc' ? cmp : -cmp;
            }

            const numA = Number(aVal) || 0;
            const numB = Number(bVal) || 0;
            return sortDirection === 'asc' ? numA - numB : numB - numA;
        });
    }, [rawRows, sortField, sortDirection]);

    const chartData = rawRows.map(r => ({
        name: r.employeeName,
        netSales: r.netSales,
        tips: r.tips
    }));

    const renderSortHeader = (field: SortField, label: string, align: 'left' | 'right' = 'right') => {
        const isActive = sortField === field;
        return (
            <th 
                className={`px-4 py-3 font-semibold text-${align} cursor-pointer select-none transition-colors group hover:bg-slate-100/80 ${
                    isActive ? 'text-indigo-600 bg-indigo-50/50' : 'text-slate-600 hover:text-slate-900'
                }`}
                onClick={() => handleSort(field)}
                title={`Click to sort by ${label}`}
            >
                <div className={`inline-flex items-center gap-1.5 ${align === 'right' ? 'flex-row-reverse' : 'flex-row'}`}>
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
                    <h1 className="text-2xl font-bold text-slate-800">Employee Sales Report</h1>
                    <p className="text-slate-500">Performance tracking and labor cost analysis</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => window.print()} className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors">
                        <Printer size={16} /> Print
                    </button>
                    <button onClick={() => downloadCSV(sortedRows, 'Employee_Sales_Report')} className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium shadow-sm transition-colors">
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
                    <FilterSelect value={employeeFilter} onChange={setEmployeeFilter} options={['All Employees', ...rawRows.map(r => r.employeeName)]} />
                    <FilterSelect value={deviceFilter} onChange={setDeviceFilter} options={['All Devices']} />
                </div>
            </div>

            {/* Summary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                 <div onClick={() => setSelectedDetail({ title: 'Total Net Sales Details', label: 'Net Sales', value: summary.netSales })} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:border-indigo-400 hover:shadow-md transition-all group">
                    <p className="text-xs text-slate-500 uppercase font-bold mb-1 group-hover:text-indigo-600 transition-colors">Net Sales</p>
                    <h3 className="text-xl font-bold text-indigo-600">${summary.netSales.toFixed(2)}</h3>
                    <p className="text-[10px] text-indigo-500 mt-1 font-medium">Click for breakdown →</p>
                </div>
                <div onClick={() => setSelectedDetail({ title: 'Average Ticket Size Audit', label: 'Avg Ticket', value: summary.avgTicketSize })} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:border-indigo-400 hover:shadow-md transition-all group">
                    <p className="text-xs text-slate-500 uppercase font-bold mb-1 group-hover:text-indigo-600 transition-colors">Avg Ticket</p>
                    <h3 className="text-xl font-bold text-slate-900">${summary.avgTicketSize.toFixed(2)}</h3>
                    <p className="text-[10px] text-slate-400 mt-1 font-medium">Click for breakdown →</p>
                </div>
                <div onClick={() => setSelectedDetail({ title: 'Staff Tips Summary Breakdown', label: 'Tips', value: summary.tips })} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:border-indigo-400 hover:shadow-md transition-all group">
                    <p className="text-xs text-slate-500 uppercase font-bold mb-1 group-hover:text-indigo-600 transition-colors">Tips</p>
                    <h3 className="text-xl font-bold text-emerald-600">${summary.tips.toFixed(2)}</h3>
                    <p className="text-[10px] text-emerald-600 mt-1 font-medium">Click for breakdown →</p>
                </div>
                 <div onClick={() => setSelectedDetail({ title: 'Labor Cost & Shift Breakdown', label: 'Labor Cost', value: summary.laborCost })} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:border-indigo-400 hover:shadow-md transition-all group">
                    <p className="text-xs text-slate-500 uppercase font-bold mb-1 group-hover:text-indigo-600 transition-colors">Labor Cost</p>
                    <h3 className="text-xl font-bold text-slate-700">${summary.laborCost.toFixed(2)}</h3>
                    <p className="text-[10px] text-slate-400 mt-1 font-medium">Click for breakdown →</p>
                </div>
                 <div onClick={() => setSelectedDetail({ title: 'Labor Cost % Metric Details', label: 'Labor Cost %', value: summary.laborCostPercentage })} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:border-indigo-400 hover:shadow-md transition-all group">
                    <p className="text-xs text-slate-500 uppercase font-bold mb-1 group-hover:text-indigo-600 transition-colors">Labor Cost %</p>
                    <h3 className={`text-xl font-bold ${summary.laborCostPercentage > 30 ? 'text-red-600' : 'text-emerald-600'}`}>
                        {summary.laborCostPercentage.toFixed(2)}%
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-1 font-medium">Click for details →</p>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                     <h3 className="font-bold text-slate-800 mb-4">Net Sales by Employee</h3>
                     <div className="h-64">
                         <ResponsiveContainer width="100%" height="100%">
                             <BarChart data={chartData}>
                                 <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                 <XAxis dataKey="name" tick={{fontSize: 12}} />
                                 <YAxis tickFormatter={(v) => `$${v}`} tick={{fontSize: 12}} />
                                 <Tooltip cursor={{fill: 'transparent'}} formatter={(v: number) => `$${v}`} />
                                 <Bar dataKey="netSales" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Net Sales" barSize={40} />
                             </BarChart>
                         </ResponsiveContainer>
                     </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                     <h3 className="font-bold text-slate-800 mb-4">Sales Contribution</h3>
                     <div className="h-64">
                         <ResponsiveContainer width="100%" height="100%">
                             <PieChart>
                                 <Pie
                                    data={chartData}
                                    dataKey="netSales"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
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
            </div>

            {/* Detailed Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Users size={18} className="text-indigo-600" />
                        <h3 className="font-bold text-slate-800">Detailed Breakdown</h3>
                        <span className="text-xs text-slate-400 font-medium ml-2">
                            (Sorted by <span className="font-bold text-indigo-600 capitalize">{sortField.replace(/([A-Z])/g, ' $1')}</span> {sortDirection.toUpperCase()})
                        </span>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                            <tr>
                                {renderSortHeader('employeeName', 'Employee', 'left')}
                                {renderSortHeader('grossSales', 'Gross', 'right')}
                                {renderSortHeader('discounts', 'Disc', 'right')}
                                {renderSortHeader('netSales', 'Net Sales', 'right')}
                                {renderSortHeader('tips', 'Tips', 'right')}
                                {renderSortHeader('taxesCollected', 'Taxes', 'right')}
                                {renderSortHeader('amountCollected', 'Collected', 'right')}
                                {renderSortHeader('paymentCount', 'Txns', 'right')}
                                {renderSortHeader('avgTicketSize', 'Avg Tkt', 'right')}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {sortedRows.map(row => (
                                <tr 
                                    key={row.employeeId} 
                                    onClick={() => setSelectedDetail({ title: `${row.employeeName} - Sales Breakdown`, label: 'Net Sales', value: row.netSales })}
                                    className="hover:bg-indigo-50/50 cursor-pointer transition-colors group"
                                    title="Click to view itemized transaction details for this employee"
                                >
                                    <td className="px-4 py-3">
                                        <div className="font-medium text-slate-900 group-hover:text-indigo-600 transition-colors">{row.employeeName}</div>
                                        <div className="text-xs text-slate-400">{row.role}</div>
                                    </td>
                                    <td className="px-4 py-3 text-right font-mono">${row.grossSales.toFixed(2)}</td>
                                    <td className="px-4 py-3 text-right font-mono text-red-500">{row.discounts === 0 ? '-' : `$${row.discounts.toFixed(2)}`}</td>
                                    <td className="px-4 py-3 text-right font-mono font-bold text-indigo-600">${row.netSales.toFixed(2)}</td>
                                    <td className="px-4 py-3 text-right font-mono text-emerald-600">${row.tips.toFixed(2)}</td>
                                    <td className="px-4 py-3 text-right font-mono text-slate-500">${row.taxesCollected.toFixed(2)}</td>
                                    <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">${row.amountCollected.toFixed(2)}</td>
                                    <td className="px-4 py-3 text-right text-slate-600 font-mono">{row.paymentCount}</td>
                                    <td className="px-4 py-3 text-right font-mono text-slate-600">${row.avgTicketSize.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Total Details Modal */}
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

export default EmployeeSalesReport;
