import React from 'react';
import { ChevronRight, ChevronLeft, Building2, ArrowRight } from 'lucide-react';

interface ItemSalesItem {
  name: string;
  price: string;
}

interface BreakdownRow {
  time: string;
  sales: string;
  laborCost: string;
  laborPct: string;
}

interface CapitalSlide {
  title: string;
  desc: string;
  badge: string;
}

interface DashboardDataPanelsProps {
  itemSalesPages: ItemSalesItem[][];
  itemPage: number;
  setItemPage: React.Dispatch<React.SetStateAction<number>>;
  breakdownPages: BreakdownRow[][];
  breakdownPage: number;
  setBreakdownPage: React.Dispatch<React.SetStateAction<number>>;
  capitalSlides: CapitalSlide[];
  capitalSlide: number;
  setCapitalSlide: React.Dispatch<React.SetStateAction<number>>;
  onNavigate?: (tab: string) => void;
  onShowCapitalModal: () => void;
}

export const DashboardDataPanels: React.FC<DashboardDataPanelsProps> = ({
  itemSalesPages,
  itemPage,
  setItemPage,
  breakdownPages,
  breakdownPage,
  setBreakdownPage,
  capitalSlides,
  capitalSlide,
  setCapitalSlide,
  onNavigate,
  onShowCapitalModal
}) => {
  return (
    <div className="space-y-6 mt-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Net Sales by Item Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-black text-slate-800 uppercase tracking-tight">
                Net sales by item
              </span>
              <button onClick={() => onNavigate?.('Item Sales')} className="text-xs font-black text-indigo-600 hover:text-indigo-800 uppercase tracking-wider flex items-center gap-0.5 bg-indigo-50 px-2.5 py-1 rounded-lg">
                VIEW ALL <ChevronRight size={14} />
              </button>
            </div>

            <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-wider pb-3 border-b border-slate-100">
              <span>Item</span>
              <span>Net sales</span>
            </div>

            <div className="divide-y divide-slate-100 min-h-[180px]">
              {itemSalesPages[itemPage].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-3">
                  <span className="font-semibold text-slate-800 text-sm">{item.name}</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">{item.price}</span>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-slate-400 font-medium pt-2">Real time</p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-100 mt-4">
            <button 
              onClick={() => setItemPage(prev => (prev === 0 ? itemSalesPages.length - 1 : prev - 1))}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="flex items-center gap-1.5">
              {itemSalesPages.map((_, idx) => (
                <button 
                  key={idx}
                  onClick={() => setItemPage(idx)}
                  className={`h-2 rounded-full transition-all ${itemPage === idx ? 'w-5 bg-slate-800' : 'w-2 bg-slate-300'}`}
                />
              ))}
            </div>
            <button 
              onClick={() => setItemPage(prev => (prev === itemSalesPages.length - 1 ? 0 : prev + 1))}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Hourly Financial Performance Matrix Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => onNavigate?.('Sales Report')} className="text-sm font-black text-slate-800 hover:text-indigo-600 flex items-center gap-1 uppercase tracking-tight">
                Hourly Financial Performance Matrix <ChevronRight size={16} />
              </button>
            </div>

            <div className="grid grid-cols-4 text-xs font-bold text-slate-400 uppercase tracking-wider pb-3 border-b border-slate-100">
              <span>Time</span>
              <span className="text-right">Net sales</span>
              <span className="text-right">Labor cost</span>
              <span className="text-right">Labor %</span>
            </div>

            <div className="divide-y divide-slate-100 min-h-[180px]">
              {breakdownPages[breakdownPage].map((row, idx) => (
                <div key={idx} className="grid grid-cols-4 py-3 text-xs">
                  <span className="font-semibold text-slate-800">{row.time}</span>
                  <span className="font-mono font-bold text-slate-900 text-right">{row.sales}</span>
                  <span className="font-mono text-slate-500 text-right">{row.laborCost}</span>
                  <span className="font-mono font-bold text-indigo-600 text-right">{row.laborPct}</span>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-slate-400 font-medium pt-2">Real time</p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-100 mt-4">
            <button 
              onClick={() => setBreakdownPage(prev => (prev === 0 ? breakdownPages.length - 1 : prev - 1))}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="flex items-center gap-1.5">
              {breakdownPages.map((_, idx) => (
                <button 
                  key={idx}
                  onClick={() => setBreakdownPage(idx)}
                  className={`h-2 rounded-full transition-all ${breakdownPage === idx ? 'w-5 bg-slate-800' : 'w-2 bg-slate-300'}`}
                />
              ))}
            </div>
            <button 
              onClick={() => setBreakdownPage(prev => (prev === breakdownPages.length - 1 ? 0 : prev + 1))}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Financial Products Card (Byte Capital) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <button onClick={onShowCapitalModal} className="text-sm font-black text-slate-800 hover:text-indigo-600 flex items-center gap-1 uppercase tracking-tight">
                Byte Capital <ChevronRight size={16} />
              </button>
            </div>

            <div className="bg-gradient-to-br from-indigo-100/90 via-indigo-50 to-blue-50 border border-indigo-200/80 rounded-2xl p-5 mb-4 relative overflow-hidden">
              <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] font-black uppercase tracking-widest bg-indigo-200/80 text-indigo-900 px-2.5 py-1 rounded-md">
                  {capitalSlides[capitalSlide].badge}
                </span>
                <Building2 size={28} className="text-indigo-500 opacity-80" />
              </div>

              <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">
                {capitalSlides[capitalSlide].title}
              </h3>
              
              <p className="text-xs text-slate-600 font-medium leading-relaxed mb-4">
                {capitalSlides[capitalSlide].desc}
              </p>

              <button 
                onClick={onShowCapitalModal}
                className="text-xs font-black text-indigo-700 hover:text-indigo-900 flex items-center gap-1 group cursor-pointer"
              >
                Explore offers <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button 
              onClick={() => setCapitalSlide(prev => (prev === 0 ? capitalSlides.length - 1 : prev - 1))}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="flex items-center gap-1.5">
              {capitalSlides.map((_, idx) => (
                <button 
                  key={idx}
                  onClick={() => setCapitalSlide(idx)}
                  className={`h-2 rounded-full transition-all ${capitalSlide === idx ? 'w-5 bg-slate-800' : 'w-2 bg-slate-300'}`}
                />
              ))}
            </div>
            <button 
              onClick={() => setCapitalSlide(prev => (prev === capitalSlides.length - 1 ? 0 : prev + 1))}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Test Kitchen & Payroll Setup Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Test Kitchen Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                BETA FEATURE
              </span>
              <span className="text-xs font-bold text-slate-400">Test Kitchen</span>
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-2">Test Kitchen</h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed mb-4">
              Try upcoming Beta features before they launch. Opt-in to the new experimental table management dashboard today.
            </p>
          </div>
          <button 
            onClick={() => onNavigate?.('Floor Plan Designer')}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm transition-all text-center"
          >
            Opt-In Now
          </button>
        </div>

        {/* Payroll Setup Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                AUTOMATION
              </span>
              <span className="text-xs font-bold text-slate-400">Payroll</span>
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-2">Payroll Setup</h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed mb-4">
              Automate your team payouts. Sync tipped out amounts and wage metrics instantly from your local drawer closeouts.
            </p>
          </div>
          <button 
            onClick={() => onNavigate?.('Employees')}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm transition-all text-center"
          >
            Set Up Payroll
          </button>
        </div>
      </div>
    </div>
  );
};
