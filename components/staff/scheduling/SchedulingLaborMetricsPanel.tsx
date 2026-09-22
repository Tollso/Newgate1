import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface LaborMetrics {
  shiftCount: number;
  employeeCount: number;
  totalHours: number;
  totalLaborCost: number;
  avgHourlyRate: number;
}

interface TrendDataPoint {
  displayDate: string;
  cost: number;
}

interface SchedulingLaborMetricsPanelProps {
  metrics: LaborMetrics;
  trendData: TrendDataPoint[];
}

export const SchedulingLaborMetricsPanel: React.FC<SchedulingLaborMetricsPanelProps> = ({
  metrics,
  trendData
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 divide-y sm:divide-y-0 lg:divide-x divide-slate-100">
        <div className="flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Scheduled Shifts</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-slate-900">{metrics.shiftCount}</span>
            <span className="text-xs text-slate-500">shifts for {metrics.employeeCount} employees</span>
          </div>
        </div>
        <div className="flex flex-col justify-between pt-4 sm:pt-0 lg:pl-6">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Shift Hours</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-slate-900">{metrics.totalHours.toFixed(1)}</span>
            <span className="text-xs text-slate-500">hours scheduled</span>
          </div>
        </div>
        <div className="flex flex-col justify-between pt-4 lg:pt-0 lg:pl-6">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Estimated Labor Cost</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-indigo-600">${metrics.totalLaborCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            <span className="text-xs text-emerald-600 font-medium">budget forecast</span>
          </div>
        </div>
        <div className="flex flex-col justify-between pt-4 lg:pt-0 lg:pl-6">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Average Hourly Rate</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-slate-900">${metrics.avgHourlyRate.toFixed(2)}</span>
            <span className="text-xs text-slate-500">/ hour weighted avg</span>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h4 className="text-sm font-bold text-slate-800">Upcoming 7-Day Budget Forecast</h4>
            <p className="text-xs text-slate-500">Visualizing estimated labor cost spikes based on scheduled shifts</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5 text-indigo-600">
              <span className="h-2 w-2 rounded-full bg-indigo-600"></span>
              <span>Daily Labor Cost ($)</span>
            </div>
          </div>
        </div>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="displayDate" 
                tickLine={false} 
                axisLine={false}
                tick={{ fill: '#64748b', fontSize: 11 }}
              />
              <YAxis 
                tickLine={false} 
                axisLine={false}
                tick={{ fill: '#64748b', fontSize: 11 }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                labelStyle={{ fontWeight: 'bold', color: '#1e293b', fontSize: '11px' }}
                itemStyle={{ fontSize: '12px' }}
                formatter={(value: any) => [`$${parseFloat(value).toFixed(2)}`, 'Labor Cost']}
              />
              <Line 
                type="monotone" 
                dataKey="cost" 
                stroke="#4f46e5" 
                strokeWidth={3} 
                dot={{ fill: '#4f46e5', strokeWidth: 2, r: 4 }} 
                activeDot={{ r: 6, strokeWidth: 0 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
