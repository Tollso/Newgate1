import React from 'react';
import { Employee, Notification } from '../../types';
import { PosAppType } from './PosLauncher';
import { LayoutGrid, ChevronRight, Search, Bell, Lock, ArrowRight, Settings, Box, ShoppingBag, CreditCard } from 'lucide-react';

interface CashierPOSHeaderProps {
  currentApp: PosAppType;
  setCurrentApp: (app: PosAppType) => void;
  authenticatedPosUser: Employee;
  setAuthenticatedPosUser: (user: Employee | null) => void;
  myNotifications: Notification[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isSearchFocused: boolean;
  setIsSearchFocused: (focused: boolean) => void;
  onNavigate?: (tab: string) => void;
}

export const CashierPOSHeader: React.FC<CashierPOSHeaderProps> = ({
  currentApp,
  setCurrentApp,
  authenticatedPosUser,
  setAuthenticatedPosUser,
  myNotifications = [],
  searchQuery,
  setSearchQuery,
  isSearchFocused,
  setIsSearchFocused,
  onNavigate
}) => {
  const searchResults = [
    { id: 'settings', label: 'Settings', sub: 'System Configuration', icon: Settings, action: () => onNavigate && onNavigate('Settings') },
    { id: 'inventory', label: 'Inventory', sub: 'Item Library', icon: Box, action: () => onNavigate && onNavigate('Item Library') },
    { id: 'orders', label: 'Orders', sub: 'Transaction History', icon: ShoppingBag, action: () => onNavigate && onNavigate('Orders') },
    { id: 'register', label: 'Register', sub: 'New Sale', icon: CreditCard, action: () => setCurrentApp('REGISTER') },
  ].filter(item => item.label.toLowerCase().includes(searchQuery.toLowerCase()) || item.sub.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <header className="h-20 bg-white text-slate-800 flex items-center justify-between px-8 shrink-0 shadow-sm z-30 border-b border-slate-200">
      <div className="flex items-center gap-6">
        <button onClick={() => setCurrentApp('LAUNCHER')} className="flex items-center gap-3 group">
          <div className="h-10 w-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform">
            <LayoutGrid size={20} className="text-white" />
          </div>
          <div className="text-left">
            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] leading-none mb-1">Terminal Mode</p>
            <h1 className="font-black text-xl tracking-tighter uppercase leading-none">Omni COMMAND</h1>
          </div>
        </button>
        {currentApp !== 'LAUNCHER' && (
          <div className="flex items-center gap-4 animate-fade-in">
            <ChevronRight size={18} className="text-slate-300" />
            <h2 className="font-black text-sm uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100">
              {currentApp.replace('_', ' ')}
            </h2>
          </div>
        )}
      </div>

      <div className="flex-1 max-w-lg mx-auto relative z-50 hidden lg:block">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            placeholder="Search settings, apps, or commands..." 
            className="w-full pl-12 pr-16 py-3 bg-slate-100 border border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-sm text-slate-700"
          />
        </div>

        {isSearchFocused && searchQuery && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
            <div className="p-2">
              {searchResults.length > 0 ? searchResults.map((result) => (
                <button
                  key={result.id}
                  onClick={() => {
                    result.action();
                    setSearchQuery('');
                  }}
                  className="w-full flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 text-slate-500 rounded-lg group-hover:bg-indigo-100 group-hover:text-indigo-600">
                      <result.icon size={18} />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-slate-800 text-sm group-hover:text-indigo-700">{result.label}</p>
                      <p className="text-xs text-slate-400 font-medium">{result.sub}</p>
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-slate-300" />
                </button>
              )) : (
                <div className="p-4 text-center text-slate-400 text-sm italic">No results found</div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 bg-slate-50 px-5 py-2.5 rounded-2xl border border-slate-100">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <div className="text-left leading-none">
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Authenticated</p>
            <p className="text-xs font-black uppercase text-slate-700">{authenticatedPosUser.name}</p>
          </div>
        </div>
        <button className="p-3 hover:bg-slate-100 rounded-2xl text-slate-400 hover:text-indigo-600 transition-colors">
          <Bell size={20} />
          {(myNotifications || []).length > 0 && <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white" />}
        </button>
        <button onClick={() => setAuthenticatedPosUser(null)} className="p-3 hover:bg-slate-100 rounded-2xl text-slate-400 hover:text-indigo-600 transition-colors">
          <Lock size={20} />
        </button>
      </div>
    </header>
  );
};
