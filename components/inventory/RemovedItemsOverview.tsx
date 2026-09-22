import React from 'react';
import { AlertTriangle, TrendingDown, HelpCircle, Sparkles } from 'lucide-react';

interface RemovedItemsOverviewProps {
  filteredCount: number;
  totalRemovedValue: number;
  unprintedCount: number;
  unprintedValue: number;
  hasRevenueClasses: boolean;
  handleSetupStandardClasses: () => void;
  setShowAddClassModal: (val: boolean) => void;
}

export const RemovedItemsOverview: React.FC<RemovedItemsOverviewProps> = ({
  filteredCount,
  totalRemovedValue,
  unprintedCount,
  unprintedValue,
  hasRevenueClasses,
  handleSetupStandardClasses,
  setShowAddClassModal
}) => {
  return (
    <div className="space-y-6">
      {!hasRevenueClasses && (
        <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 bg-amber-100/80 text-amber-800 rounded-xl shrink-0 mt-0.5">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-amber-900 text-sm flex items-center gap-1.5">
                Revenue Classes Notice
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-full">Required Config</span>
              </h3>
              <p className="text-xs text-amber-800/90 mt-1 leading-relaxed max-w-2xl">
                Configuring Revenue Classes enables precise categorisation of food, beverage, and retail voids. This allows automated loss reporting by menu section.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 shrink-0 self-end md:self-auto">
            <button 
              onClick={handleSetupStandardClasses} 
              className="px-3.5 py-2 text-xs font-bold bg-amber-900 text-amber-50 rounded-xl hover:bg-amber-950 transition-colors shadow-sm cursor-pointer"
            >
              Set Default Classes
            </button>
            <button 
              onClick={() => setShowAddClassModal(true)} 
              className="px-3.5 py-2 text-xs font-bold text-amber-900 bg-amber-100/90 hover:bg-amber-200/80 rounded-xl border border-amber-300/60 transition-colors cursor-pointer"
            >
              Add Custom Class
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between relative overflow-hidden group">
          <div className="space-y-1 z-10">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Filtered Items Count</p>
            <p className="text-3xl font-black text-slate-900">{filteredCount} <span className="text-sm font-semibold text-slate-400 font-sans">items</span></p>
            <p className="text-[11px] text-slate-500 font-medium pt-1">Matching current filter criteria</p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg">
            {filteredCount}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between relative overflow-hidden group">
          <div className="space-y-1 z-10">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              Total Removed Value
              <TrendingDown size={14} className="text-rose-500" />
            </p>
            <p className="text-3xl font-black text-slate-900">${totalRemovedValue.toFixed(2)}</p>
            <p className="text-[11px] text-slate-500 font-medium pt-1">Gross potential revenue lost</p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center font-bold text-lg">
            $
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between relative overflow-hidden group">
          <div className="space-y-1 z-10">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              Unprinted Voids
              <HelpCircle size={14} className="text-amber-500" />
            </p>
            <p className="text-3xl font-black text-slate-900">{unprintedCount} <span className="text-xs font-semibold text-slate-400">(${unprintedValue.toFixed(2)})</span></p>
            <p className="text-[11px] text-slate-500 font-medium pt-1">Removed prior to kitchen send</p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center font-bold text-lg">
            <Sparkles size={20} />
          </div>
        </div>
      </div>
    </div>
  );
};
