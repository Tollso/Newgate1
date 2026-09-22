import React, { useState, useMemo } from 'react';
import { TrendMetric } from '../../types';
import { TrendingUp, Briefcase, ArrowRight } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, LineChart, Line } from 'recharts';
import { MOCK_SALES_OVERVIEW } from '../../constants';
import { ReportTotalDetailModal } from './ReportTotalDetailModal';

interface SalesOverviewTabProps {
  dateRange: string;
  dynamicMetrics: any;
  filteredHourlyData: any[];
  currentSalesData: any[];
  onNavigate?: (tab: string) => void;
  orders?: any[];
}

export const SalesOverviewTab: React.FC<SalesOverviewTabProps> = ({
  dateRange,
  dynamicMetrics,
  filteredHourlyData,
  currentSalesData,
  onNavigate,
  orders = []
}) => {
  const [selectedDetail, setSelectedDetail] = useState<{
    title: string;
    label: string;
    value: number;
  } | null>(null);

  const breakdownData = useMemo(() => {
    const tenderMap: Record<string, number> = {};
    const classMap: Record<string, number> = {};
    const cardMap: Record<string, number> = {};
    const categoryMap: Record<string, number> = {};
    const itemMap: Record<string, number> = {};

    const paidOrders = orders.filter(o => o.status !== 'Void' && o.status !== 'Open');

    paidOrders.forEach(o => {
      // 1. Tender types & Card types
      const method = o.paymentMethod || 'Cash';
      tenderMap[method] = (tenderMap[method] || 0) + (o.total || 0);

      if (o.paymentMethod === 'Visa' || o.paymentMethod === 'MasterCard' || o.paymentMethod === 'AmEx' || o.paymentMethod === 'Discover' || o.paymentMethod === 'Card') {
        const cardName = o.paymentMethod === 'Card' ? 'Visa' : o.paymentMethod;
        cardMap[cardName] = (cardMap[cardName] || 0) + (o.total || 0);
      }

      // 2. Revenue classes (e.g. Dine-In, Takeout, Delivery)
      const rClass = o.type || 'Dine-in';
      classMap[rClass] = (classMap[rClass] || 0) + (o.total || 0);

      // 3. Items & Categories
      o.items?.forEach(item => {
        const name = item.name;
        const qty = item.quantity || 1;
        const price = item.price || 0;
        const gross = price * qty;
        itemMap[name] = (itemMap[name] || 0) + gross;

        let category = 'Main Course';
        const lowerName = name.toLowerCase();
        if (lowerName.includes('beer') || lowerName.includes('drink') || lowerName.includes('wine') || lowerName.includes('soda') || lowerName.includes('coke')) {
          category = 'Beverages';
        } else if (lowerName.includes('salad') || lowerName.includes('fries') || lowerName.includes('tacos') || lowerName.includes('calamari') || lowerName.includes('soup')) {
          category = 'Appetizers';
        } else if (lowerName.includes('cake') || lowerName.includes('dessert') || lowerName.includes('ice cream') || lowerName.includes('brownie')) {
          category = 'Desserts';
        }
        categoryMap[category] = (categoryMap[category] || 0) + gross;
      });
    });

    const formatMap = (map: Record<string, number>) => {
      if (!map || typeof map !== 'object') return [];
      return Object.entries(map)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);
    };

    return {
      tenderTypes: formatMap(tenderMap).length > 0 ? formatMap(tenderMap) : MOCK_SALES_OVERVIEW.topTenderTypes,
      revenueClasses: formatMap(classMap).length > 0 ? formatMap(classMap) : MOCK_SALES_OVERVIEW.topRevenueClasses,
      cardTypes: formatMap(cardMap).length > 0 ? formatMap(cardMap) : MOCK_SALES_OVERVIEW.topCardTypes,
      categories: formatMap(categoryMap).length > 0 ? formatMap(categoryMap) : MOCK_SALES_OVERVIEW.topCategories,
      topItems: formatMap(itemMap).length > 0 ? formatMap(itemMap).slice(0, 5) : MOCK_SALES_OVERVIEW.topItems,
    };
  }, [orders]);

  const handleTableNavigate = (title: string) => {
    if (!onNavigate) return;
    if (title.includes('Tender')) onNavigate('Tender Types');
    else if (title.includes('Items') || title.includes('Categories')) onNavigate('Item Sales');
  };

  const MetricCard = ({ title, metric, prefix = '', suffix = '' }: { title: string, metric: TrendMetric, prefix?: string, suffix?: string }) => {
    const isPositive = metric.percentageChange >= 0;
    const handleCardClick = (e: React.MouseEvent) => {
      e.preventDefault();
      setSelectedDetail({ title: `${title} Total Audit`, label: title, value: metric.value });
    };

    return (
      <div 
        onClick={handleCardClick}
        className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-full cursor-pointer hover:border-indigo-400 hover:shadow-md transition-all group select-none"
        title={`Click to view itemized transaction details for ${title}`}
      >
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1 group-hover:text-indigo-600 transition-colors">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900">{prefix}{metric.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{suffix}</h3>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className={`flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${isPositive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
            {isPositive ? <TrendingUp size={12} className="mr-1"/> : <TrendingUp size={12} className="mr-1 rotate-180"/>}
            {Math.abs(metric.percentageChange)}%
          </span>
          <span 
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick(e);
            }}
            className="text-[10px] text-indigo-500 font-bold group-hover:underline cursor-pointer"
          >
            Details →
          </span>
        </div>
      </div>
    );
  };

  const BreakdownTable = ({ title, items }: { title: string, items: {name: string, value: number}[] }) => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
        <h4 className="font-semibold text-slate-800 text-sm">{title}</h4>
        <button 
          onClick={() => {
            if (onNavigate && (title.includes('Tender') || title.includes('Items') || title.includes('Categories'))) {
              handleTableNavigate(title);
            } else {
              setSelectedDetail({ title: `${title} Total Breakdown`, label: title, value: (items || []).reduce((acc, x) => acc + x.value, 0) });
            }
          }}
          className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 cursor-pointer"
        >
          DETAILS <ArrowRight size={10} />
        </button>
      </div>
      <table className="w-full text-sm text-left">
        <tbody className="divide-y divide-slate-100">
          {(items || []).length > 0 ? (items || []).map((item, idx) => (
            <tr 
              key={idx} 
              onClick={() => setSelectedDetail({ title: `${title}: ${item.name} Details`, label: item.name, value: item.value })}
              className="hover:bg-indigo-50/50 cursor-pointer transition-colors group"
            >
              <td className="px-4 py-3 text-slate-700 font-medium group-hover:text-indigo-600">{item.name}</td>
              <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">
                ${item.value.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
              </td>
            </tr>
          )) : (
            <tr><td colSpan={2} className="px-4 py-4 text-center text-slate-400 italic">No items sold</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <MetricCard title="Total Orders" metric={dynamicMetrics.orders} />
        <MetricCard title="Guest Count" metric={dynamicMetrics.guests} />
        <MetricCard title="Gross Sales" metric={dynamicMetrics.grossSales} prefix="$" />
        <MetricCard title="Net Sales" metric={dynamicMetrics.netSales} prefix="$" />
        <MetricCard title="Avg Ticket Size" metric={dynamicMetrics.avgTicketSize} prefix="$" />
        <MetricCard title="Amount Collected" metric={dynamicMetrics.amountCollected} prefix="$" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800">
                {dateRange === 'Today' ? 'Hourly Sales Performance' : 'Net Sales Trends'}
              </h3>
              <p className="text-sm text-slate-500">
                {dateRange === 'Today' ? 'Sales distribution across the day' : 'Comparing Current Period vs Previous Period'}
              </p>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {dateRange === 'Today' ? (
                <AreaChart data={filteredHourlyData}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(v) => `$${v}`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: number) => `$${value.toLocaleString()}`}
                  />
                  <Area type="monotone" dataKey="amountCollected" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                </AreaChart>
              ) : (
                <LineChart data={currentSalesData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(v) => `$${v}`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: number) => `$${value.toLocaleString()}`}
                  />
                  <Line type="monotone" dataKey="current" stroke="#6366f1" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                  <Line type="monotone" dataKey="previous" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
        <div 
          onClick={() => setSelectedDetail({ title: 'Labor Cost Total Breakdown', label: 'Labor Cost', value: dynamicMetrics.laborCost.total })}
          className="lg:col-span-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center items-center text-center cursor-pointer hover:border-orange-400 hover:shadow-md transition-all group"
          title="Click to view labor cost breakdown"
        >
          <div className="p-4 bg-orange-100 rounded-full text-orange-600 mb-4 group-hover:scale-110 transition-transform">
            <Briefcase size={32} />
          </div>
          <h3 className="text-slate-500 font-medium mb-1 group-hover:text-orange-600 transition-colors">Labor Cost</h3>
          <h2 className="text-3xl font-bold text-slate-900">{dynamicMetrics.laborCost.percentage}%</h2>
          <p className="text-slate-500 font-mono mt-1">${dynamicMetrics.laborCost.total.toLocaleString()}</p>
          <p className="text-[10px] text-orange-500 font-bold mt-2">Click for breakdown →</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 items-start">
        <BreakdownTable title="Tender Types" items={breakdownData.tenderTypes} />
        <BreakdownTable title="Revenue Classes" items={breakdownData.revenueClasses} />
        <BreakdownTable title="Card Types" items={breakdownData.cardTypes} />
        <BreakdownTable title="Categories" items={breakdownData.categories} />
        <BreakdownTable title="Top Items" items={breakdownData.topItems} />
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

