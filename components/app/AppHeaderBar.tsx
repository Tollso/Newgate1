import React, { useState, useEffect, useRef } from 'react';
import { Bell, HelpCircle, Settings as SettingsIcon, RefreshCw, User, LogOut, Search, CornerDownLeft, MonitorSmartphone } from 'lucide-react';
import { Employee, Notification } from '../../types';

interface AppHeaderBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: Employee;
  serverNotifications: Notification[];
  isProfileMenuOpen: boolean;
  setIsProfileMenuOpen: (open: boolean) => void;
  setShowRoleSwitcher: (show: boolean) => void;
  onLogout: () => void;
}

const SEARCH_OPTIONS = [
  { label: 'Dashboard & Overview', tab: 'Home', category: 'General' },
  { label: 'Cashier POS Register', tab: 'New Sale', category: 'POS' },
  { label: 'Orders & Tickets', tab: 'Orders', category: 'POS' },
  { label: 'Transactions & Payments', tab: 'Transactions', category: 'Finance' },
  { label: 'Invoices Billing', tab: 'Invoices', category: 'Finance' },
  { label: 'Tip Pooling Reports', tab: 'Tip Pooling', category: 'Staff' },
  { label: 'Employee List', tab: 'Employee List', category: 'Staff' },
  { label: 'Schedule & Rosters', tab: 'Schedule', category: 'Staff' },
  { label: 'Time Clock Punches', tab: 'Time Clock', category: 'Staff' },
  { label: 'Item Library / Inventory', tab: 'Item Library', category: 'Inventory' },
  { label: 'Categories Management', tab: 'Categories', category: 'Inventory' },
  { label: 'Modifier Groups', tab: 'Modifier Groups', category: 'Inventory' },
  { label: 'Printer Labels & Routing', tab: 'Printer Labels', category: 'Hardware' },
  { label: 'Discounts & Promo Codes', tab: 'Discounts', category: 'POS' },
  { label: 'Customer Directory', tab: 'Customer List', category: 'Customers' },
  { label: 'Customer Feedback Logs', tab: 'Feedback', category: 'Customers' },
  { label: 'Finances Overview', tab: 'Overview', category: 'Finance' },
  { label: 'Sales Reports & Analytics', tab: 'Reports', category: 'Finance' },
  { label: 'Deposits & Settlements', tab: 'Deposits', category: 'Finance' },
  { label: 'Tax Reports', tab: 'Tax', category: 'Finance' },
  { label: 'Disputes & Claims', tab: 'Disputes', category: 'Finance' },
  { label: 'Floor Plan Setup', tab: 'Floor Plan', category: 'Dining' },
  { label: 'Kitchen Display System (KDS)', tab: 'KDS', category: 'Hardware' },
  { label: 'Touch-First POS Shell', tab: 'POS Shell', category: 'POS' },
  { label: 'Retail Barcode Register', tab: 'Retail POS', category: 'Retail' },
  { label: 'Retail Inventory & POs', tab: 'Retail Inventory', category: 'Retail' },
  { label: 'Nonprofit Giving Register', tab: 'Giving Register', category: 'Nonprofit' },
  { label: 'Self-Service Giving Kiosk', tab: 'Giving Kiosk', category: 'Nonprofit' },
  { label: 'Nonprofit Donors & Campaigns CRM', tab: 'Nonprofit CRM', category: 'Nonprofit' },
  { label: 'Super-Admin Credit Card Surcharges', tab: 'SuperAdmin', category: 'Admin' },
  { label: 'System Settings', tab: 'Settings', category: 'General' }
];

export const AppHeaderBar: React.FC<AppHeaderBarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  serverNotifications = [],
  isProfileMenuOpen,
  setIsProfileMenuOpen,
  setShowRoleSwitcher,
  onLogout,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = searchQuery.trim()
    ? SEARCH_OPTIONS.filter(opt =>
        opt.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opt.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opt.tab.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSelectOption = (tabName: string) => {
    setActiveTab(tabName);
    setSearchQuery('');
    setIsSearchFocused(false);
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-30 shadow-sm relative">
      {/* Tab Title Indicator & Quick Jump */}
      <div className="flex items-center gap-3 shrink-0">
        <h2 className="font-extrabold text-lg text-slate-800 tracking-tight hidden xl:block">
          {activeTab}
        </h2>

        {/* Quick Launch Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('POS Shell')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'POS Shell'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-indigo-700 hover:bg-white hover:shadow-xs'
            }`}
          >
            <MonitorSmartphone size={14} />
            <span>POS Shell</span>
          </button>
          <button
            onClick={() => setActiveTab('Retail POS')}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'Retail POS'
                ? 'bg-white text-indigo-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Retail</span>
          </button>
          <button
            onClick={() => setActiveTab('Giving Register')}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'Giving Register'
                ? 'bg-white text-rose-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Giving</span>
          </button>
          <button
            onClick={() => setActiveTab('Byte Dining')}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'Byte Dining'
                ? 'bg-white text-amber-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Dining</span>
          </button>
        </div>
      </div>

      {/* Global Application Search Bar */}
      <div ref={searchContainerRef} className="flex-1 max-w-xl mx-4 relative">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search size={16} className={`${isSearchFocused ? 'text-indigo-600' : 'text-slate-400'} transition-colors`} />
          </div>
          <input
            type="text"
            placeholder="Search system options, tools, settings..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchFocused(true);
            }}
            onFocus={() => setIsSearchFocused(true)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 hover:bg-slate-100/55 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all text-slate-800"
          />
        </div>

        {/* Search Results Dropdown List */}
        {isSearchFocused && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-50 max-h-96 overflow-y-auto animate-scale-in">
            {searchQuery.trim() === '' ? (
              <div className="p-4 text-xs">
                <span className="font-bold text-slate-400 uppercase tracking-widest block mb-2 text-[10px]">Quick Navigation</span>
                <div className="grid grid-cols-2 gap-2">
                  {SEARCH_OPTIONS.slice(0, 6).map((opt) => (
                    <button
                      key={opt.tab}
                      onClick={() => handleSelectOption(opt.tab)}
                      className="text-left px-3.5 py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-slate-700 font-bold"
                    >
                      <span className="block text-[11px]">{opt.label}</span>
                      <span className="text-[9px] text-slate-400 uppercase tracking-wider font-extrabold">{opt.category}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : filteredOptions.length > 0 ? (
              <div className="p-2 divide-y divide-slate-50">
                {filteredOptions.map((opt) => (
                  <button
                    key={opt.tab}
                    onClick={() => handleSelectOption(opt.tab)}
                    className="w-full text-left px-4 py-3 rounded-xl hover:bg-indigo-50/50 transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <span className="block text-xs font-bold text-slate-800 group-hover:text-indigo-950">{opt.label}</span>
                      <span className="inline-block mt-1 text-[9px] font-black uppercase tracking-widest bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-700 transition-colors">
                        {opt.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 group-hover:text-indigo-600 transition-colors">
                      <span>Jump to</span>
                      <CornerDownLeft size={10} />
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs">
                <p className="font-bold">No matching options found</p>
                <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">Try searching for settings, POS, reports, or scheduling</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Side Icons and Profile Dropdown */}
      <div className="flex items-center gap-6">
        {/* Utility Actions Icons */}
        <div className="flex items-center gap-3 border-r border-slate-200 pr-6 mr-2">
          <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-all relative" title="Notifications">
            <Bell size={20} />
            {(serverNotifications || []).length > 0 && <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>}
          </button>
          <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-all" title="Help & Documentation">
            <HelpCircle size={20} />
          </button>
          <button
            onClick={() => setActiveTab('Settings')}
            className={`p-2 rounded-lg transition-all ${activeTab === 'Settings' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-100'}`}
            title="Settings"
          >
            <SettingsIcon size={20} />
          </button>
        </div>

        {/* Profile Section */}
        <div className="flex items-center gap-3 relative">
          <div className="flex flex-col items-end hidden sm:flex">
            <span className="text-sm font-bold text-slate-900 leading-none">{currentUser.name}</span>
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mt-1">{currentUser.role.replace('_', ' ')}</span>
          </div>
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold border transition-all shadow-sm
              ${isProfileMenuOpen
                ? 'bg-indigo-600 text-white border-indigo-700'
                : 'bg-indigo-100 text-indigo-700 border-indigo-200 hover:ring-2 hover:ring-indigo-200'}`}
            title="Account Profile"
          >
            {currentUser.name.charAt(0)}
          </button>

          {/* Profile Dropdown Menu */}
          {isProfileMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setIsProfileMenuOpen(false)}
              />
              <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 z-40 overflow-hidden animate-scale-in">
                <div className="p-4 bg-slate-50 border-b border-slate-200">
                  <p className="text-sm font-bold text-slate-900">{currentUser.name}</p>
                  <p className="text-xs text-slate-500 font-medium">{currentUser.email}</p>
                  <div className="mt-2 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase rounded-md">
                      {currentUser.role.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <div className="p-2">
                  <button
                    onClick={() => { setActiveTab('Settings'); setIsProfileMenuOpen(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    <User size={18} className="text-slate-400" />
                    <span>My Profile</span>
                  </button>
                  <button
                    onClick={() => { setShowRoleSwitcher(true); setIsProfileMenuOpen(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    <RefreshCw size={18} className="text-slate-400" />
                    <span>Switch Role</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('Settings'); setIsProfileMenuOpen(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    <SettingsIcon size={18} className="text-slate-400" />
                    <span>System Settings</span>
                  </button>
                  <div className="my-1 border-t border-slate-100" />
                  <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-rose-600 hover:bg-rose-50 rounded-lg transition-colors font-medium"
                  >
                    <LogOut size={18} className="text-rose-500" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
