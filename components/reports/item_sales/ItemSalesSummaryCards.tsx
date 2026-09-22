import React from 'react';

interface ItemSalesSummaryCardsProps {
  totalGrossSales: number;
  totalCOGS: number;
  totalGrossProfit: number;
  margin: number;
  onSelectDetail: (detail: { title: string; label: string; value: number }) => void;
}

export const ItemSalesSummaryCards: React.FC<ItemSalesSummaryCardsProps> = ({
  totalGrossSales,
  totalCOGS,
  totalGrossProfit,
  margin,
  onSelectDetail,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <div
        onClick={() => onSelectDetail({ title: 'Gross Item Sales Total Audit', label: 'Gross Sales', value: totalGrossSales })}
        className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:border-indigo-400 hover:shadow-md transition-all group"
      >
        <p className="text-xs text-slate-500 uppercase font-bold mb-1 group-hover:text-indigo-600 transition-colors">Gross Sales</p>
        <h3 className="text-xl font-bold text-slate-900">${totalGrossSales.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
        <p className="text-[10px] text-indigo-500 font-medium mt-1">Audit Details →</p>
      </div>

      <div
        onClick={() => onSelectDetail({ title: 'Net Item Sales Audit', label: 'Net Sales', value: totalGrossSales })}
        className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:border-indigo-400 hover:shadow-md transition-all group"
      >
        <p className="text-xs text-slate-500 uppercase font-bold mb-1 group-hover:text-indigo-600 transition-colors">Net Sales</p>
        <h3 className="text-xl font-bold text-indigo-600">${totalGrossSales.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
        <p className="text-[10px] text-indigo-500 font-medium mt-1">Audit Details →</p>
      </div>

      <div
        onClick={() => onSelectDetail({ title: 'COGS Cost Analysis Audit', label: 'COGS', value: totalCOGS })}
        className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:border-rose-400 hover:shadow-md transition-all group"
      >
        <p className="text-xs text-slate-500 uppercase font-bold mb-1 group-hover:text-rose-600 transition-colors">COGS (Costs)</p>
        <h3 className="text-xl font-bold text-rose-500">-${totalCOGS.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
        <p className="text-[10px] text-rose-400 font-medium mt-1">Audit Details →</p>
      </div>

      <div
        onClick={() => onSelectDetail({ title: 'Gross Profit Margin Audit', label: 'Gross Profit', value: totalGrossProfit })}
        className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:border-emerald-400 hover:shadow-md transition-all group"
      >
        <p className="text-xs text-slate-500 uppercase font-bold mb-1 group-hover:text-emerald-600 transition-colors">Gross Profit</p>
        <h3 className="text-xl font-bold text-emerald-600">${totalGrossProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
        <p className="text-[10px] text-emerald-500 font-medium mt-1">Audit Details →</p>
      </div>

      <div
        onClick={() => onSelectDetail({ title: 'Average Margin Metric Details', label: 'Avg Margin %', value: margin })}
        className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-emerald-500 cursor-pointer hover:shadow-md transition-all group"
      >
        <p className="text-xs text-slate-500 uppercase font-bold mb-1 group-hover:text-emerald-600 transition-colors">Average Margin</p>
        <h3 className="text-xl font-bold text-emerald-600">{margin.toFixed(2)}%</h3>
        <p className="text-[10px] text-slate-400 font-medium mt-1">Audit Details →</p>
      </div>
    </div>
  );
};
