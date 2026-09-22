import React from 'react';
import { 
  BarChart2, TrendingUp, BookOpen, Edit3, Grid, Receipt, Users, Clock, Sparkles, Waves, Zap, Megaphone, Monitor
} from 'lucide-react';

interface DashboardQuickActionsProps {
  onNavigate?: (tab: string) => void;
  onShowInstantDepositModal: () => void;
}

export const DashboardQuickActions: React.FC<DashboardQuickActionsProps> = ({
  onNavigate,
  onShowInstantDepositModal
}) => {
  return (
    <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
      <div>
        <h2 className="text-base font-extrabold text-slate-900 mb-4 tracking-tight">
          Quick actions
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-x-6 gap-y-3">
          <button 
            onClick={() => onNavigate?.('Sales Report')}
            className="flex items-center gap-3 text-slate-700 hover:text-indigo-600 font-bold text-sm py-1.5 transition-colors text-left group"
          >
            <div className="p-2 rounded-lg bg-slate-50 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
              <BarChart2 size={16} />
            </div>
            Sales summary
          </button>

          <button 
            onClick={() => onNavigate?.('Employee Sales')}
            className="flex items-center gap-3 text-slate-700 hover:text-indigo-600 font-bold text-sm py-1.5 transition-colors text-left group"
          >
            <div className="p-2 rounded-lg bg-slate-50 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
              <TrendingUp size={16} />
            </div>
            Labor summary
          </button>

          <button 
            onClick={() => onNavigate?.('Item Library')}
            className="flex items-center gap-3 text-slate-700 hover:text-indigo-600 font-bold text-sm py-1.5 transition-colors text-left group"
          >
            <div className="p-2 rounded-lg bg-slate-50 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
              <BookOpen size={16} />
            </div>
            Menu builder
          </button>

          <button 
            onClick={() => onNavigate?.('Categories')}
            className="flex items-center gap-3 text-slate-700 hover:text-indigo-600 font-bold text-sm py-1.5 transition-colors text-left group"
          >
            <div className="p-2 rounded-lg bg-slate-50 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
              <Edit3 size={16} />
            </div>
            Edit menus
          </button>

          <button 
            onClick={() => onNavigate?.('Modifier Groups')}
            className="flex items-center gap-3 text-slate-700 hover:text-indigo-600 font-bold text-sm py-1.5 transition-colors text-left group"
          >
            <div className="p-2 rounded-lg bg-slate-50 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
              <Grid size={16} />
            </div>
            Menu manager
          </button>

          <button 
            onClick={() => onNavigate?.('Transactions')}
            className="flex items-center gap-3 text-slate-700 hover:text-indigo-600 font-bold text-sm py-1.5 transition-colors text-left group"
          >
            <div className="p-2 rounded-lg bg-slate-50 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
              <Receipt size={16} />
            </div>
            Refund check
          </button>

          <button 
            onClick={() => onNavigate?.('Employee List')}
            className="flex items-center gap-3 text-slate-700 hover:text-indigo-600 font-bold text-sm py-1.5 transition-colors text-left group"
          >
            <div className="p-2 rounded-lg bg-slate-50 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
              <Users size={16} />
            </div>
            Employees
          </button>

          <button 
            onClick={() => onNavigate?.('Schedule')}
            className="flex items-center gap-3 text-slate-700 hover:text-indigo-600 font-bold text-sm py-1.5 transition-colors text-left group"
          >
            <div className="p-2 rounded-lg bg-slate-50 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
              <Clock size={16} />
            </div>
            Time entry management
          </button>
        </div>
      </div>

      <div className="mt-6 bg-slate-50 border border-slate-200/80 rounded-xl p-4">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-3">
          NEW FROM TABLEHERE
        </span>
        <div className="space-y-2.5">
          <button onClick={() => onNavigate?.('Sales Report')} className="w-full flex items-center gap-2 text-xs font-bold text-indigo-700 hover:text-indigo-900 transition-colors">
            <Sparkles size={14} className="text-indigo-500 shrink-0" />
            <span>Daily brief</span>
          </button>
          <button onClick={() => onNavigate?.('Peer Insights')} className="w-full flex items-center gap-2 text-xs font-bold text-indigo-700 hover:text-indigo-900 transition-colors">
            <Waves size={14} className="text-indigo-500 shrink-0" />
            <span>Benchmarking</span>
          </button>
          <button onClick={onShowInstantDepositModal} className="w-full flex items-center gap-2 text-xs font-bold text-indigo-700 hover:text-indigo-900 transition-colors">
            <Zap size={14} className="text-indigo-500 shrink-0" />
            <span>Instant deposit</span>
          </button>
          <button onClick={() => onNavigate?.('App Market')} className="w-full flex items-center gap-2 text-xs font-bold text-indigo-700 hover:text-indigo-900 transition-colors">
            <Megaphone size={14} className="text-indigo-500 shrink-0" />
            <span>Advertising</span>
          </button>
          <button onClick={() => onNavigate?.('Printer Labels')} className="w-full flex items-center gap-2 text-xs font-bold text-indigo-700 hover:text-indigo-900 transition-colors">
            <Monitor size={14} className="text-indigo-500 shrink-0" />
            <span>Device hub</span>
          </button>
        </div>
      </div>
    </div>
  );
};
