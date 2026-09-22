import React, { useMemo } from 'react';
import { Clock, DollarSign, Users, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface LaborCostTabProps {
  orders?: any[];
}

export const LaborCostTab: React.FC<LaborCostTabProps> = ({ orders = [] }) => {
  const dailyData = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const salesByDay: Record<string, number> = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };

    orders.forEach(o => {
      if (o.status !== 'Open' && o.status !== 'Void') {
        const dObj = o.date ? new Date(o.date) : new Date();
        if (!isNaN(dObj.getTime())) {
          const dayName = dObj.toLocaleDateString('en-US', { weekday: 'short' });
          if (salesByDay[dayName] !== undefined) {
            const net = (o.total || 0) - (o.discount || 0);
            salesByDay[dayName] += net;
          }
        }
      }
    });

    return days.map(day => {
      const sales = salesByDay[day] || 0;
      // Assume basic FOH/BOH shifts are on duty costing a base line + dynamic portion of sales
      const cost = sales > 0 ? 150 + (sales * 0.18) : 0;
      return {
        date: day,
        cost,
        sales
      };
    });
  }, [orders]);

  const totalCost = dailyData.reduce((acc, curr) => acc + curr.cost, 0);
  const totalSales = dailyData.reduce((acc, curr) => acc + curr.sales, 0);
  const avgPct = totalSales > 0 ? (totalCost / totalSales) * 100 : 0;

  const roles = [
    { role: 'Servers / FOH', count: 6, hours: 142, avgPay: '$16.50/hr', cost: '$2,343.00' },
    { role: 'Line Cooks / BOH', count: 4, hours: 120, avgPay: '$21.00/hr', cost: '$2,520.00' },
    { role: 'Bartenders', count: 3, hours: 85, avgPay: '$18.00/hr', cost: '$1,530.00' },
    { role: 'Shift Managers', count: 2, hours: 80, avgPay: '$26.00/hr', cost: '$2,080.00' }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">Total Labor Cost</span>
            <DollarSign size={18} className="text-indigo-600" />
          </div>
          <h3 className="text-2xl font-black text-slate-900">${totalCost.toLocaleString(undefined, {minimumFractionDigits: 2})}</h3>
          <p className="text-xs text-slate-400 mt-1">Current period payroll</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">Labor Cost %</span>
            <TrendingUp size={18} className="text-emerald-600" />
          </div>
          <h3 className={`text-2xl font-black ${avgPct > 30 ? 'text-rose-600' : 'text-emerald-600'}`}>
            {avgPct.toFixed(1)}%
          </h3>
          <p className="text-xs text-slate-400 mt-1">Target range: 20% - 28%</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">Total Hours</span>
            <Clock size={18} className="text-indigo-600" />
          </div>
          <h3 className="text-2xl font-black text-slate-900">427 hrs</h3>
          <p className="text-xs text-slate-400 mt-1">12 hrs Overtime</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">Active Staff</span>
            <Users size={18} className="text-indigo-600" />
          </div>
          <h3 className="text-2xl font-black text-slate-900">15 Staff</h3>
          <p className="text-xs text-slate-400 mt-1">Across 4 departments</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <h3 className="text-base font-black text-slate-900 mb-4">Labor Cost vs Net Sales</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{fontSize: 12, fill: '#64748b'}} />
              <YAxis tickFormatter={(v) => `$${v}`} tick={{fontSize: 12, fill: '#64748b'}} />
              <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
              <Legend />
              <Bar dataKey="sales" fill="#818cf8" radius={[4, 4, 0, 0]} name="Net Sales ($)" />
              <Bar dataKey="cost" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Labor Cost ($)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Role Breakdown Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
          <h3 className="font-black text-slate-800 text-sm uppercase tracking-wider">Labor Cost by Department</h3>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase font-bold">
            <tr>
              <th className="px-6 py-3">Department / Role</th>
              <th className="px-6 py-3 text-center">Staff Count</th>
              <th className="px-6 py-3 text-center">Total Hours</th>
              <th className="px-6 py-3 text-center">Avg Hourly Rate</th>
              <th className="px-6 py-3 text-right">Labor Spend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {roles.map((r, i) => (
              <tr key={i} className="hover:bg-slate-50">
                <td className="px-6 py-3.5 font-bold text-slate-900">{r.role}</td>
                <td className="px-6 py-3.5 text-center">{r.count}</td>
                <td className="px-6 py-3.5 text-center">{r.hours} hrs</td>
                <td className="px-6 py-3.5 text-center font-mono">{r.avgPay}</td>
                <td className="px-6 py-3.5 text-right font-mono font-bold text-indigo-600">{r.cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
