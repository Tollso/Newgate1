import React, { useState, useMemo } from 'react';
import { MOCK_EMPLOYEES } from '../../constants';
import { Award, DollarSign, TrendingUp, Users, ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

type SortField = 'employeeName' | 'grossSales' | 'netSales' | 'tips' | 'paymentCount' | 'avgTicketSize';
type SortDirection = 'asc' | 'desc';

interface TeamPerformanceTabProps {
  orders?: any[];
}

export const TeamPerformanceTab: React.FC<TeamPerformanceTabProps> = ({ orders = [] }) => {
  const [sortField, setSortField] = useState<SortField>('netSales');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const rows = useMemo(() => {
    const employeesMap: Record<string, any> = {};
    MOCK_EMPLOYEES.forEach(emp => {
      employeesMap[emp.id] = {
        employeeId: emp.id,
        employeeName: emp.name,
        role: emp.role,
        grossSales: 0,
        discounts: 0,
        refunds: 0,
        netSales: 0,
        tips: 0,
        paymentCount: 0,
        avgTicketSize: 0
      };
    });

    const paidOrders = orders ? orders.filter(o => o.status !== 'Open' && o.status !== 'Void') : [];
    paidOrders.forEach(o => {
      let empId = o.employeeId;
      if (!empId && o.server) {
        const found = MOCK_EMPLOYEES.find(e => e.name.toLowerCase().includes(o.server!.toLowerCase()));
        if (found) empId = found.id;
      }
      if (!empId) {
        empId = 'E104'; // Default to Michael Server
      }

      if (!employeesMap[empId]) {
        employeesMap[empId] = {
          employeeId: empId,
          employeeName: o.server || 'Unknown Server',
          role: 'Server',
          grossSales: 0,
          discounts: 0,
          refunds: 0,
          netSales: 0,
          tips: 0,
          paymentCount: 0,
          avgTicketSize: 0
        };
      }

      const gross = o.total || 0;
      const disc = o.discount || 0;
      const net = gross - disc;
      const tip = o.tip || 0;

      employeesMap[empId].grossSales += gross;
      employeesMap[empId].discounts += disc;
      employeesMap[empId].netSales += net;
      employeesMap[empId].tips += tip;
      employeesMap[empId].paymentCount += 1;
    });

    return Object.values(employeesMap).map((emp: any) => ({
      ...emp,
      avgTicketSize: emp.paymentCount > 0 ? emp.netSales / emp.paymentCount : 0
    })).filter(emp => emp.paymentCount > 0 || ['Alice Walker', 'Michael Server', 'Emma Davis'].includes(emp.employeeName));
  }, [orders]);

  const totalSales = rows.reduce((acc, r) => acc + (r.netSales || 0), 0);
  const totalTips = rows.reduce((acc, r) => acc + (r.tips || 0), 0);
  const totalTxns = rows.reduce((acc, r) => acc + (r.paymentCount || 0), 0);
  const topPerformer = [...rows].sort((a, b) => (b.netSales || 0) - (a.netSales || 0))[0];

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection(field === 'employeeName' ? 'asc' : 'desc');
    }
  };

  const sortedRows = useMemo(() => {
    return [...rows].sort((a, b) => {
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
  }, [rows, sortField, sortDirection]);

  const chartData = rows.map(r => ({
    name: r.employeeName,
    netSales: r.netSales || 0,
    tips: r.tips || 0
  }));

  const renderSortHeader = (field: SortField, label: string, align: 'left' | 'right' = 'right') => {
    const isActive = sortField === field;
    return (
      <th 
        className={`px-6 py-3 text-${align} cursor-pointer select-none transition-colors group hover:bg-slate-100/80 ${
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
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">Top Server</span>
            <Award size={18} className="text-amber-500" />
          </div>
          <h3 className="text-xl font-black text-slate-900">{topPerformer?.employeeName || 'N/A'}</h3>
          <p className="text-xs text-indigo-600 font-extrabold mt-1">${(topPerformer?.netSales || 0).toFixed(2)} in net sales</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">Total Team Tips</span>
            <DollarSign size={18} className="text-emerald-600" />
          </div>
          <h3 className="text-2xl font-black text-emerald-600">${totalTips.toFixed(2)}</h3>
          <p className="text-xs text-slate-400 mt-1">Distributed across team</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">Total Transactions</span>
            <TrendingUp size={18} className="text-indigo-600" />
          </div>
          <h3 className="text-2xl font-black text-slate-900">{totalTxns}</h3>
          <p className="text-xs text-slate-400 mt-1">Orders served</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">Active Servers</span>
            <Users size={18} className="text-indigo-600" />
          </div>
          <h3 className="text-2xl font-black text-slate-900">{rows.length} Staff</h3>
          <p className="text-xs text-slate-400 mt-1">On duty this shift</p>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <h3 className="text-base font-black text-slate-900 mb-4">Employee Sales & Tips Comparison</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{fontSize: 12, fill: '#64748b'}} />
              <YAxis tickFormatter={(v) => `$${v}`} tick={{fontSize: 12, fill: '#64748b'}} />
              <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
              <Legend />
              <Bar dataKey="netSales" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Net Sales ($)" barSize={36} />
              <Bar dataKey="tips" fill="#10b981" radius={[4, 4, 0, 0]} name="Tips ($)" barSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Team Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <h3 className="font-black text-slate-800 text-sm uppercase tracking-wider">Employee Sales & Performance Log</h3>
          <span className="text-xs text-slate-400 font-medium">
            (Sorted by <span className="font-bold text-indigo-600 capitalize">{sortField.replace(/([A-Z])/g, ' $1')}</span> {sortDirection.toUpperCase()})
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase font-bold">
              <tr>
                {renderSortHeader('employeeName', 'Employee', 'left')}
                {renderSortHeader('grossSales', 'Gross Sales', 'right')}
                {renderSortHeader('netSales', 'Net Sales', 'right')}
                {renderSortHeader('tips', 'Tips', 'right')}
                {renderSortHeader('paymentCount', 'Txns', 'right')}
                {renderSortHeader('avgTicketSize', 'Avg Ticket', 'right')}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {sortedRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3.5">
                    <div className="font-bold text-slate-900">{row.employeeName}</div>
                    <div className="text-xs text-slate-400 font-semibold">{row.role}</div>
                  </td>
                  <td className="px-6 py-3.5 text-right font-mono">${(row.grossSales || 0).toFixed(2)}</td>
                  <td className="px-6 py-3.5 text-right font-mono font-bold text-indigo-600">${(row.netSales || 0).toFixed(2)}</td>
                  <td className="px-6 py-3.5 text-right font-mono font-bold text-emerald-600">${(row.tips || 0).toFixed(2)}</td>
                  <td className="px-6 py-3.5 text-right text-slate-600 font-mono">{row.paymentCount || 0}</td>
                  <td className="px-6 py-3.5 text-right font-mono text-slate-900">${(row.avgTicketSize || 0).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
