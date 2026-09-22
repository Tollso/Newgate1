import React from 'react';
import { ChevronRight, ChevronLeft, TrendingUp, TrendingDown, Zap, Award } from 'lucide-react';

interface DashboardKpiCardsProps {
  netSalesValue: number;
  netSalesTrendPct: string;
  laborCostPct: number;
  laborCostTrendPct: string;
  discountsValue: number;
  discountsTrendPct: string;
  instantDepositAmount: number;
  awardsSlides: { title: string; desc: string; btnText: string; action: () => void }[];
  awardSlide: number;
  setAwardSlide: React.Dispatch<React.SetStateAction<number>>;
  onNavigate?: (tab: string) => void;
  onShowInstantDepositModal: () => void;
}

export const DashboardKpiCards: React.FC<DashboardKpiCardsProps> = ({
  netSalesValue,
  netSalesTrendPct,
  laborCostPct,
  laborCostTrendPct,
  discountsValue,
  discountsTrendPct,
  instantDepositAmount,
  awardsSlides,
  awardSlide,
  setAwardSlide,
  onNavigate,
  onShowInstantDepositModal
}) => {
  return (
    <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Net Sales Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between relative overflow-hidden group">
        <div>
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => onNavigate?.('Sales Report')} className="text-sm font-bold text-slate-800 hover:text-indigo-600 flex items-center gap-1">
              Net sales <ChevronRight size={16} />
            </button>
          </div>

          <div className="flex items-baseline justify-between mb-2">
            <span className="text-xs text-slate-400 font-semibold">Today</span>
            <span className="text-xs text-slate-400 font-semibold">Yesterday</span>
          </div>

          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl font-black text-slate-900 tracking-tight">
              ${netSalesValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
            <span className="px-2.5 py-1 bg-emerald-50 border border-emerald-200/80 text-emerald-600 rounded-lg text-xs font-extrabold flex items-center gap-0.5">
              <TrendingUp size={12} /> {netSalesTrendPct} vs yesterday
            </span>
          </div>

          <p className="text-[11px] text-slate-400 font-medium">Real time</p>
        </div>

        <div className="mt-4 bg-emerald-50/80 border border-emerald-200/80 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Online</span>
            <p className="text-xs text-slate-700 font-medium">
              <strong className="font-extrabold text-slate-900">${instantDepositAmount.toFixed(2)}</strong> available
            </p>
          </div>
          <button onClick={onShowInstantDepositModal} className="text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-lg shadow-sm transition-all text-center">
            Transfer Now
          </button>
        </div>
      </div>

      {/* Labor Cost % Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => onNavigate?.('Employee Sales')} className="text-sm font-bold text-slate-800 hover:text-indigo-600 flex items-center gap-1">
              Labor cost % of net sales <ChevronRight size={16} />
            </button>
          </div>

          <div className="flex items-baseline justify-between mb-2">
            <span className="text-xs text-slate-400 font-semibold">Today</span>
            <span className="text-xs text-slate-400 font-semibold">Yesterday</span>
          </div>

          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl font-black text-slate-900 tracking-tight">
              {laborCostPct}%
            </span>
            <span className="px-2.5 py-1 bg-emerald-50 border border-emerald-200/80 text-emerald-600 rounded-lg text-xs font-extrabold flex items-center gap-0.5">
              <TrendingDown size={12} /> {laborCostTrendPct} vs yesterday
            </span>
          </div>

          <p className="text-[11px] text-slate-400 font-medium">Real time</p>
        </div>
      </div>

      {/* Discounts Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => onNavigate?.('Discounts Report')} className="text-sm font-bold text-slate-800 hover:text-indigo-600 flex items-center gap-1">
              Discounts <ChevronRight size={16} />
            </button>
          </div>

          <div className="flex items-baseline justify-between mb-2">
            <span className="text-xs text-slate-400 font-semibold">Today</span>
            <span className="text-xs text-slate-400 font-semibold">Yesterday</span>
          </div>

          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl font-black text-slate-900 tracking-tight">
              ${discountsValue.toFixed(2)}
            </span>
            <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-600 rounded-lg text-xs font-extrabold flex items-center gap-0.5">
              <TrendingUp size={12} /> {discountsTrendPct}
            </span>
          </div>

          <p className="text-[11px] text-slate-400 font-medium">Real time</p>
        </div>
      </div>

      {/* Community & Awards Announcement Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-start gap-3.5 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600 shrink-0">
              <Award size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm leading-snug">
                {awardsSlides[awardSlide].title}
              </h3>
            </div>
          </div>

          <p className="text-xs text-slate-500 font-medium leading-relaxed mb-4">
            {awardsSlides[awardSlide].desc}
          </p>

          <button 
            onClick={awardsSlides[awardSlide].action}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 underline flex items-center gap-1"
          >
            {awardsSlides[awardSlide].btnText}
          </button>
        </div>

        <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-100 mt-4">
          <button 
            onClick={() => setAwardSlide(prev => (prev === 0 ? awardsSlides.length - 1 : prev - 1))}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <ChevronLeft size={16} />
          </button>
          <div className="flex items-center gap-1.5">
            {awardsSlides.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setAwardSlide(idx)}
                className={`h-2 rounded-full transition-all ${awardSlide === idx ? 'w-5 bg-slate-800' : 'w-2 bg-slate-300'}`}
              />
            ))}
          </div>
          <button 
            onClick={() => setAwardSlide(prev => (prev === awardsSlides.length - 1 ? 0 : prev + 1))}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
