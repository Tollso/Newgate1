import React from 'react';
import { X, User } from 'lucide-react';
import { EmployeeDetail } from './TipPoolingTypes';

interface TipPoolingEmployeeDrawerProps {
  selectedEmployee: EmployeeDetail | null;
  onClose: () => void;
}

export const TipPoolingEmployeeDrawer: React.FC<TipPoolingEmployeeDrawerProps> = ({
  selectedEmployee,
  onClose,
}) => {
  if (!selectedEmployee) {
    return (
      <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-8 text-center text-slate-500 flex flex-col items-center justify-center space-y-2">
        <User size={36} className="text-slate-300" />
        <span className="font-bold text-slate-800 text-xs">No Employee Selected</span>
        <p className="text-[11px] text-slate-400 max-w-[200px]">Click any employee row in the list to view full customer contributions, sales, and pool distribution details.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 text-white rounded-2xl shadow-xl overflow-hidden border border-slate-800 animate-fade-in">
      {/* Sidebar Header */}
      <div className="p-5 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
        <div>
          <h3 className="font-extrabold text-base text-slate-100">{selectedEmployee.name}'s Tips</h3>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mt-0.5">Job: {selectedEmployee.job}</span>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-200 transition-colors p-1 bg-slate-800 hover:bg-slate-700 rounded-full"
        >
          <X size={15} />
        </button>
      </div>

      {/* Sidebar Content */}
      <div className="p-6 space-y-6 text-xs max-h-[75vh] overflow-y-auto">
        {/* Collected From Customers */}
        <div className="space-y-2.5">
          <h4 className="font-black text-[10px] text-slate-400 uppercase tracking-widest">Tips & Gratuities Collected</h4>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-2 font-mono">
            <div className="flex justify-between">
              <span className="text-slate-400">Cash tips</span>
              <span className="font-bold text-slate-200">${selectedEmployee.collected.cash.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Non-cash tips</span>
              <span className="font-bold text-slate-200">${selectedEmployee.collected.nonCash.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t border-slate-800/80 pt-2 font-bold text-slate-100">
              <span>Total tips</span>
              <span>${selectedEmployee.collected.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t border-slate-800/80 pt-2 text-[11px]">
              <span className="text-slate-400">Cash gratuity</span>
              <span className="font-bold text-slate-300">${selectedEmployee.collected.cashGrat.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Non-cash gratuity</span>
              <span className="font-bold text-slate-300">${selectedEmployee.collected.nonCashGrat.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t border-slate-800/80 pt-2 font-bold text-slate-100 text-[11px]">
              <span>Total gratuity</span>
              <span>${selectedEmployee.collected.totalGrat.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Sales Section */}
        {selectedEmployee.sales.total > 0 && (
          <div className="space-y-2.5">
            <h4 className="font-black text-[10px] text-slate-400 uppercase tracking-widest">Sales Breakdown</h4>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-2 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Liquor</span>
                <span className="font-bold text-slate-200">${selectedEmployee.sales.liquor.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Food</span>
                <span className="font-bold text-slate-200">${selectedEmployee.sales.food.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-800/80 pt-2 font-bold text-indigo-400">
                <span>Total sales</span>
                <span>${selectedEmployee.sales.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Support Staff Contributed to Pool */}
        {selectedEmployee.contributions.total > 0 && (
          <div className="space-y-2.5">
            <h4 className="font-black text-[10px] text-slate-400 uppercase tracking-widest">Tips Contributed to Pool</h4>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-3 font-mono">
              <div className="flex justify-between font-bold text-rose-400">
                <span>Total contributed</span>
                <span>${selectedEmployee.contributions.total.toFixed(2)}</span>
              </div>
              {selectedEmployee.contributions.breakdown.map((b, idx) => (
                <div key={idx} className="border-t border-slate-800/80 pt-2 text-[10px] space-y-1">
                  <div className="flex justify-between text-slate-400 font-bold">
                    <span>{b.category} Contribution</span>
                    <span className="text-rose-400/90">${b.amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-500">
                    <span>Sales (${b.sales.toFixed(2)}) × {b.rate}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Earnings from Pooling */}
        <div className="space-y-2.5">
          <h4 className="font-black text-[10px] text-indigo-400 uppercase tracking-widest">Tips & Gratuities Earned from Pooling</h4>
          <div className="bg-indigo-950/40 p-4 rounded-xl border border-indigo-900/50 space-y-2 font-mono">
            <div className="flex justify-between">
              <span className="text-indigo-200">Cash tips earned</span>
              <span className="font-bold text-indigo-100">${selectedEmployee.earnings.cash.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-indigo-200">Non-cash tips earned</span>
              <span className="font-bold text-indigo-100">${selectedEmployee.earnings.nonCash.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t border-indigo-900/30 pt-2 text-[11px] text-indigo-300">
              <span>Cash gratuity earned</span>
              <span>${selectedEmployee.earnings.cashGrat.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[11px] text-indigo-300">
              <span>Non-cash gratuity earned</span>
              <span>${selectedEmployee.earnings.nonCashGrat.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t border-indigo-500/50 pt-2 font-extrabold text-indigo-300 text-sm">
              <span>Total earnings</span>
              <span className="text-amber-400 font-black">${selectedEmployee.earnings.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 bg-slate-950/80 border-t border-slate-800/80 flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-lg transition-colors cursor-pointer"
        >
          Close Detail
        </button>
      </div>
    </div>
  );
};
