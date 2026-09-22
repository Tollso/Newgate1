import React, { useState } from 'react';
import { Clock, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { ReportTotalDetailModal } from './ReportTotalDetailModal';
import { DailyItemsSoldAndActivity } from './DailyItemsSoldAndActivity';

interface DailySalesTabProps {
  filteredHourlyData: any[];
  daypartFilter: string;
  setDaypartFilter: (val: string) => void;
  calculateTotal: (key: any) => number;
  orders?: any[];
}

export const DailySalesTab: React.FC<DailySalesTabProps> = ({
  filteredHourlyData,
  daypartFilter,
  setDaypartFilter,
  calculateTotal,
  orders = []
}) => {
  const [selectedDetail, setSelectedDetail] = useState<{
    title: string;
    label: string;
    value: number;
  } | null>(null);

  const topServers = React.useMemo(() => {
    const list = orders || [];
    const serverMap: Record<string, number> = {};
    
    const getDaypartForTime = (timeStr?: string) => {
      if (!timeStr) return 'Lunch';
      const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
      let hourValue = 12;
      if (match) {
        hourValue = parseInt(match[1]);
        if (match[3].toUpperCase() === 'PM' && hourValue !== 12) hourValue += 12;
        if (match[3].toUpperCase() === 'AM' && hourValue === 12) hourValue = 0;
      }
      if (hourValue >= 6 && hourValue < 11) return 'Breakfast';
      if (hourValue >= 11 && hourValue < 16) return 'Lunch';
      if (hourValue >= 16 && hourValue < 21) return 'Dinner';
      return 'Late Night';
    };

    list.forEach(o => {
      if (o.status !== 'Open' && o.status !== 'Void') {
        const dp = getDaypartForTime(o.time);
        if (daypartFilter === 'All' || dp === daypartFilter) {
          const serverName = o.server || 'Other';
          const net = (o.total || 0) - (o.discount || 0);
          serverMap[serverName] = (serverMap[serverName] || 0) + net;
        }
      }
    });

    const sorted = Object.entries(serverMap || {})
      .map(([name, sales]) => ({ name, sales }))
      .sort((a, b) => b.sales - a.sales);

    if (sorted.length === 0) {
      return [
        { name: 'Alice Walker', sales: 0 },
        { name: 'Michael Server', sales: 0 },
        { name: 'Emma Davis', sales: 0 }
      ];
    }
    return sorted;
  }, [orders, daypartFilter]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center divide-x divide-slate-100">
          <div 
            onClick={() => setSelectedDetail({ title: 'Gross Sales Total Details', label: 'Gross Sales', value: calculateTotal('grossSales') })}
            className="cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition-colors group"
            title="Click to view itemized transactions for Gross Sales"
          >
            <p className="text-xs text-slate-500 uppercase font-semibold mb-1 group-hover:text-indigo-600 transition-colors">Gross Sales</p>
            <p className="text-xl font-bold text-slate-900">${calculateTotal('grossSales').toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
            <p className="text-[10px] text-indigo-500 font-medium">Audit →</p>
          </div>
          <div 
            onClick={() => setSelectedDetail({ title: 'Refunds Total Audit Log', label: 'Refunds', value: calculateTotal('refunds') })}
            className="cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition-colors group"
            title="Click to view refund transaction details"
          >
            <p className="text-xs text-slate-500 uppercase font-semibold mb-1 group-hover:text-red-600 transition-colors">Refunds</p>
            <p className="text-xl font-bold text-red-500">-${calculateTotal('refunds').toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
            <p className="text-[10px] text-red-400 font-medium">Audit →</p>
          </div>
          <div 
            onClick={() => setSelectedDetail({ title: 'Net Sales Total Breakdown', label: 'Net Sales', value: calculateTotal('netSales') })}
            className="cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition-colors group"
            title="Click to view Net Sales transaction breakdown"
          >
            <p className="text-xs text-slate-500 uppercase font-semibold mb-1 group-hover:text-indigo-600 transition-colors">Net Sales</p>
            <p className="text-xl font-bold text-indigo-600">${calculateTotal('netSales').toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
            <p className="text-[10px] text-indigo-500 font-medium">Audit →</p>
          </div>
          <div 
            onClick={() => setSelectedDetail({ title: 'Sales Taxes Audit Log', label: 'Taxes', value: calculateTotal('taxes') })}
            className="cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition-colors group"
            title="Click to view tax line details"
          >
            <p className="text-xs text-slate-500 uppercase font-semibold mb-1 group-hover:text-slate-800 transition-colors">Taxes</p>
            <p className="text-xl font-bold text-slate-700">${calculateTotal('taxes').toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
            <p className="text-[10px] text-slate-400 font-medium">Audit →</p>
          </div>
          <div 
            onClick={() => setSelectedDetail({ title: 'Staff Tips Total Details', label: 'Tips', value: calculateTotal('tips') })}
            className="cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition-colors group"
            title="Click to view tip breakdown"
          >
            <p className="text-xs text-slate-500 uppercase font-semibold mb-1 group-hover:text-emerald-600 transition-colors">Tips</p>
            <p className="text-xl font-bold text-slate-700">${calculateTotal('tips').toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
            <p className="text-[10px] text-emerald-500 font-medium">Audit →</p>
          </div>
          <div 
            onClick={() => setSelectedDetail({ title: 'Total Collected Tender Audit', label: 'Collected', value: calculateTotal('amountCollected') })}
            className="border-none cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition-colors group"
            title="Click to view total collected tender details"
          >
            <p className="text-xs text-emerald-600 uppercase font-semibold mb-1 group-hover:underline">Total Collected</p>
            <p className="text-xl font-bold text-emerald-600">${calculateTotal('amountCollected').toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
            <p className="text-[10px] text-emerald-600 font-bold">Audit →</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800">Daypart Performance</h3>
          <div className="flex bg-slate-100 p-1 rounded-lg">
            {['All', 'Breakfast', 'Lunch', 'Dinner', 'Late Night'].map((dp) => (
              <button
                key={dp}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${daypartFilter === dp ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                onClick={() => setDaypartFilter(dp)}
              >
                {dp}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {(() => {
            const getDaypart = (hourStr: string) => {
              const [time, period] = hourStr.split(' ');
              let hourValue = parseInt(time.split(':')[0]);
              if (period === 'PM' && hourValue !== 12) hourValue += 12;
              if (period === 'AM' && hourValue === 12) hourValue = 0;
              
              if (hourValue >= 6 && hourValue < 11) return 'Breakfast';
              if (hourValue >= 11 && hourValue < 16) return 'Lunch';
              if (hourValue >= 16 && hourValue < 21) return 'Dinner';
              return 'Late Night';
            };

            const daypartTotals = filteredHourlyData.reduce((acc, curr) => {
              const dp = getDaypart(curr.hour);
              if (!acc[dp]) acc[dp] = 0;
              acc[dp] += curr.netSales;
              return acc;
            }, {} as Record<string, number>);

            return ['Breakfast', 'Lunch', 'Dinner', 'Late Night'].map((dp) => (
              <div 
                key={dp} 
                onClick={() => setSelectedDetail({ title: `${dp} Shift Total Breakdown`, label: `${dp} Net Sales`, value: daypartTotals[dp] || 0 })}
                className={`bg-white p-4 rounded-xl border-t-4 shadow-sm border-slate-200 transition-all cursor-pointer hover:border-indigo-500 hover:shadow-md ${daypartFilter === dp ? 'border-indigo-500 ring-2 ring-indigo-50' : ''}`}
                title={`Click to view audit details for ${dp}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{dp}</p>
                  <Clock size={14} className="text-slate-300" />
                </div>
                <h4 className="text-xl font-black text-slate-900">${(daypartTotals[dp] || 0).toLocaleString()}</h4>
                <div className="mt-2 flex justify-between items-center text-[10px] text-slate-400 font-medium">
                  <span>
                    {dp === 'Breakfast' && '6:00 AM - 11:00 AM'}
                    {dp === 'Lunch' && '11:00 AM - 4:00 PM'}
                    {dp === 'Dinner' && '4:00 PM - 9:00 PM'}
                    {dp === 'Late Night' && '9:00 PM - 6:00 AM'}
                  </span>
                  <span className="text-indigo-600 font-bold">Details →</span>
                </div>
              </div>
            ));
          })()}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-96">
          <h3 className="text-lg font-bold text-slate-800 mb-4">
            {daypartFilter === 'All' ? 'Hourly Sales Performance' : `${daypartFilter} Performance Breakdown`}
          </h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filteredHourlyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="hour" tick={{fontSize: 10, fill: '#64748b'}} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(v) => `$${v}`} tick={{fontSize: 10, fill: '#64748b'}} axisLine={false} tickLine={false} />
              <Tooltip 
                cursor={{fill: '#f8fafc'}}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                formatter={(value: number) => `$${value.toFixed(2)}`} 
              />
              <Bar dataKey="amountCollected" fill="#6366f1" radius={[4, 4, 0, 0]} name="Collected" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 mb-4">
              <TrendingUp size={20} />
              <h4 className="font-bold">Top Servers ({daypartFilter})</h4>
            </div>
            <div className="space-y-4">
              {topServers.map((server) => (
                <div 
                  key={server.name}
                  onClick={() => setSelectedDetail({ title: `${server.name} - Shift Performance Audit`, label: 'Sales', value: server.sales })} 
                  className="flex items-center justify-between cursor-pointer hover:bg-slate-50 p-1.5 rounded-lg transition-colors"
                >
                  <span className="text-xs font-semibold text-slate-700">{server.name}</span>
                  <span className="text-xs font-bold text-slate-900">${server.sales.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <DailyItemsSoldAndActivity orders={orders} />

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

