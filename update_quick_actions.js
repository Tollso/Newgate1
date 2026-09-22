const fs = require('fs');

const content = `import React from 'react';
import { 
  BarChart2, TrendingUp, BookOpen, Edit3, Grid, Receipt, Users, Clock, 
  Sparkles, Waves, Zap, Megaphone, Monitor, MonitorPlay, Coffee, 
  LayoutDashboard, ShoppingCart, Calendar, Settings
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
    <div className="lg:col-span-4 flex flex-col gap-4">
      {/* Launchpad Section */}
      <div className="bg-gradient-to-br from-indigo-900 to-indigo-700 rounded-2xl p-6 shadow-md text-white">
        <h2 className="text-base font-extrabold mb-4 tracking-tight">
          App Launchpad
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => onNavigate?.('New Sale')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors border border-white/10"
          >
            <ShoppingCart size={20} className="mb-2" />
            <span className="text-[11px] font-bold">Register</span>
          </button>
          <button 
            onClick={() => onNavigate?.('Byte Dining')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors border border-white/10"
          >
            <Coffee size={20} className="mb-2" />
            <span className="text-[11px] font-bold">Dining</span>
          </button>
          <button 
            onClick={() => onNavigate?.('Kiosk')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors border border-white/10"
          >
            <MonitorPlay size={20} className="mb-2" />
            <span className="text-[11px] font-bold">Kiosk</span>
          </button>
          <button 
            onClick={() => onNavigate?.('Kitchen Display')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors border border-white/10"
          >
            <LayoutDashboard size={20} className="mb-2" />
            <span className="text-[11px] font-bold">KDS</span>
          </button>
          <button 
            onClick={() => onNavigate?.('Reservations')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors border border-white/10"
          >
            <Calendar size={20} className="mb-2" />
            <span className="text-[11px] font-bold">Reservations</span>
          </button>
          <button 
            onClick={() => onNavigate?.('Settings')}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors border border-white/10"
          >
            <Settings size={20} className="mb-2" />
            <span className="text-[11px] font-bold">Settings</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex-1">
        <h2 className="text-base font-extrabold text-slate-900 mb-4 tracking-tight">
          Management
        </h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
          <button 
            onClick={() => onNavigate?.('Sales Report')}
            className="flex items-center gap-2 text-slate-700 hover:text-indigo-600 font-bold text-xs py-1 transition-colors text-left group"
          >
            <div className="p-1.5 rounded-md bg-slate-50 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
              <BarChart2 size={14} />
            </div>
            Sales
          </button>
          <button 
            onClick={() => onNavigate?.('Employee Sales')}
            className="flex items-center gap-2 text-slate-700 hover:text-indigo-600 font-bold text-xs py-1 transition-colors text-left group"
          >
            <div className="p-1.5 rounded-md bg-slate-50 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
              <TrendingUp size={14} />
            </div>
            Labor
          </button>
          <button 
            onClick={() => onNavigate?.('Item Library')}
            className="flex items-center gap-2 text-slate-700 hover:text-indigo-600 font-bold text-xs py-1 transition-colors text-left group"
          >
            <div className="p-1.5 rounded-md bg-slate-50 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
              <BookOpen size={14} />
            </div>
            Menu
          </button>
          <button 
            onClick={() => onNavigate?.('Employee List')}
            className="flex items-center gap-2 text-slate-700 hover:text-indigo-600 font-bold text-xs py-1 transition-colors text-left group"
          >
            <div className="p-1.5 rounded-md bg-slate-50 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
              <Users size={14} />
            </div>
            Staff
          </button>
          <button 
            onClick={() => onNavigate?.('Schedule')}
            className="flex items-center gap-2 text-slate-700 hover:text-indigo-600 font-bold text-xs py-1 transition-colors text-left group"
          >
            <div className="p-1.5 rounded-md bg-slate-50 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
              <Clock size={14} />
            </div>
            Time
          </button>
          <button 
            onClick={() => onNavigate?.('Transactions')}
            className="flex items-center gap-2 text-slate-700 hover:text-indigo-600 font-bold text-xs py-1 transition-colors text-left group"
          >
            <div className="p-1.5 rounded-md bg-slate-50 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
              <Receipt size={14} />
            </div>
            Refund
          </button>
        </div>

        <div className="mt-6 pt-5 border-t border-slate-100">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-3">
            Quick Actions
          </span>
          <div className="space-y-2.5">
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
          </div>
        </div>
      </div>
    </div>
  );
};
`;

fs.writeFileSync('components/dashboard/DashboardQuickActions.tsx', content);
