import React from 'react';
import { BarChart2, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface CategoryChartItem {
  name: string;
  profit: number;
  cogs: number;
}

interface RankedItem {
  id: string;
  name: string;
  quantitySold: number;
  grossSales: number;
  grossProfit: number;
}

interface ItemSalesChartsProps {
  categoryChartData: CategoryChartItem[];
  topItems: RankedItem[];
  topMarginItems: RankedItem[];
}

export const ItemSalesCharts: React.FC<ItemSalesChartsProps> = ({
  categoryChartData,
  topItems,
  topMarginItems,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-72">
        <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
          <BarChart2 size={18} className="text-indigo-600" /> Category Profitability
        </h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={categoryChartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={(v) => `$${v}`} tick={{ fontSize: 12 }} />
            <Tooltip formatter={(v: number) => `$${v.toFixed(2)}`} />
            <Legend />
            <Bar dataKey="profit" stackId="a" fill="#10b981" name="Gross Profit" />
            <Bar dataKey="cogs" stackId="a" fill="#f43f5e" name="COGS" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <h4 className="font-bold text-sm text-slate-800 mb-3 flex items-center gap-2">
            <TrendingUp size={16} className="text-emerald-500" /> Top Sellers (Qty)
          </h4>
          <div className="space-y-3">
            {topItems.map((item, i) => (
              <div key={item.id} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                    {i + 1}
                  </span>
                  <span className="text-slate-700 font-medium">{item.name}</span>
                </div>
                <span className="font-bold text-slate-900">{item.quantitySold}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <h4 className="font-bold text-sm text-slate-800 mb-3 flex items-center gap-2">
            <TrendingUp size={16} className="text-indigo-500" /> Highest Margin
          </h4>
          <div className="space-y-3">
            {topMarginItems.map((item, i) => (
              <div key={item.id} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                    {i + 1}
                  </span>
                  <span className="text-slate-700 font-medium">{item.name}</span>
                </div>
                <span className="font-bold text-emerald-600">
                  {((item.grossProfit / (item.grossSales || 1)) * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
