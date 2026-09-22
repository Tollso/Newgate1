import React from 'react';
import { ChevronDown } from 'lucide-react';
import { RevenueItem } from '../../../types';

interface ItemSalesTableProps {
  groupedItems: Record<string, RevenueItem[]>;
  onSelectDetail: (detail: { title: string; label: string; value: number }) => void;
}

export const ItemSalesTable: React.FC<ItemSalesTableProps> = ({
  groupedItems,
  onSelectDetail,
}) => {
  const safeEntries = Object.entries(groupedItems || {});

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
          <tr>
            <th className="px-6 py-4 font-semibold">Item Name</th>
            <th className="px-6 py-4 font-semibold text-right">Gross Sales</th>
            <th className="px-6 py-4 font-semibold text-right">Qty Sold</th>
            <th className="px-6 py-4 font-semibold text-right">COGS</th>
            <th className="px-6 py-4 font-semibold text-right">Gross Profit</th>
            <th className="px-6 py-4 font-semibold text-right">Margin %</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {safeEntries.map(([category, items]: [string, RevenueItem[]]) => {
            const catGross = (items || []).reduce((sum, i) => sum + (i.grossSales || 0), 0);
            const catQty = (items || []).reduce((sum, i) => sum + (i.quantitySold || 0), 0);
            const catCOGS = (items || []).reduce((sum, i) => sum + (i.cogs || 0), 0);
            const catProfit = (items || []).reduce((sum, i) => sum + (i.grossProfit || 0), 0);
            const catMargin = catGross > 0 ? (catProfit / catGross) * 100 : 0;

            return (
              <React.Fragment key={category}>
                <tr className="bg-slate-50/50">
                  <td colSpan={6} className="px-6 py-2 font-bold text-slate-800 flex items-center gap-2">
                    <ChevronDown size={14} /> {category}
                  </td>
                </tr>
                {(items || []).map(item => (
                  <tr
                    key={item.id}
                    onClick={() => onSelectDetail({ title: `${item.name} - Item Performance Audit`, label: 'Item Sales', value: item.grossSales })}
                    className="hover:bg-indigo-50/50 cursor-pointer transition-colors group"
                    title="Click to view itemized orders for this item"
                  >
                    <td className="px-6 py-3 pl-10 font-medium text-slate-900 group-hover:text-indigo-600 transition-colors">{item.name}</td>
                    <td className="px-6 py-3 text-right font-mono font-bold text-slate-900">${item.grossSales.toFixed(2)}</td>
                    <td className="px-6 py-3 text-right text-slate-600 font-medium">{item.quantitySold}</td>
                    <td className="px-6 py-3 text-right font-mono text-rose-500">${item.cogs.toFixed(2)}</td>
                    <td className="px-6 py-3 text-right font-mono font-bold text-emerald-600">${item.grossProfit.toFixed(2)}</td>
                    <td className="px-6 py-3 text-right font-mono font-medium text-slate-600">
                      {(item.grossSales > 0 ? (item.grossProfit / item.grossSales) * 100 : 0).toFixed(1)}%
                    </td>
                  </tr>
                ))}
                <tr
                  onClick={() => onSelectDetail({ title: `${category} Category Total Audit`, label: 'Category Total', value: catGross })}
                  className="bg-slate-50 border-t border-slate-200 font-semibold text-slate-800 hover:bg-indigo-100/40 cursor-pointer transition-colors"
                  title={`Click to view audit details for category ${category}`}
                >
                  <td className="px-6 py-3 pl-10 text-xs uppercase tracking-wide font-bold text-indigo-700">Category Total ({category})</td>
                  <td className="px-6 py-3 text-right font-mono font-black">${catGross.toFixed(2)}</td>
                  <td className="px-6 py-3 text-right font-bold">{catQty}</td>
                  <td className="px-6 py-3 text-right font-mono text-rose-600">${catCOGS.toFixed(2)}</td>
                  <td className="px-6 py-3 text-right font-mono text-emerald-700 font-black">${catProfit.toFixed(2)}</td>
                  <td className="px-6 py-3 text-right font-mono text-slate-700">{catMargin.toFixed(1)}%</td>
                </tr>
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
