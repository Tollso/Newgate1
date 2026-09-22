import React from 'react';
import { RefreshCw, Printer, Download, Filter, Clock, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { DateRangeSelector, FilterSelect } from './ReportFilters';
import { MOCK_EMPLOYEES } from '../../constants';

interface ReportsHeaderNavProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  dateRange: string;
  setDateRange: (val: string) => void;
  employeeFilter: string;
  setEmployeeFilter: (val: string) => void;
  orderTypeFilter: string;
  setOrderTypeFilter: (val: string) => void;
  daypartFilter: string;
  setDaypartFilter: (val: string) => void;
  deviceFilter: string;
  setDeviceFilter: (val: string) => void;
  setShowDatePicker: (val: boolean) => void;
  handleAction: (action: string) => void;
}

export const ReportsHeaderNav: React.FC<ReportsHeaderNavProps> = ({
  activeTab,
  setActiveTab,
  dateRange,
  setDateRange,
  employeeFilter,
  setEmployeeFilter,
  orderTypeFilter,
  setOrderTypeFilter,
  daypartFilter,
  setDaypartFilter,
  deviceFilter,
  setDeviceFilter,
  setShowDatePicker,
  handleAction
}) => {
  const TABS = [
    'Overview',
    'Daily Sales',
    'Item Sales',
    'Employee Sales',
    'Team Performance',
    'Order Types',
    'Tender Types',
    'Discounts Report',
    'Gift Cards Report',
    'Deposits',
    'Tax',
    'Labor Cost',
    'Tip Pooling',
    'Open Orders'
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Financial Reports</h1>
          <p className="text-slate-500">Comprehensive overview of revenue, deposits, and liabilities</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => handleAction('Accounting Sync')} className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors">
            <RefreshCw size={16} /> Sync Accounting
          </button>
          <button onClick={() => handleAction('Print Job')} className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors">
            <Printer size={16} /> Print
          </button>
          <button onClick={() => handleAction('CSV Export')} className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium shadow-sm transition-colors">
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200 overflow-x-auto">
        <nav className="flex space-x-8">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              {tab === 'Overview' ? 'Trends & Overview' : tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Global Filters Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-4 rounded-2xl shadow-lg border border-slate-700/60 text-white flex flex-col gap-3 relative z-20">
        <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none overflow-hidden" />
        
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between z-10">
          <div className="flex items-center justify-between lg:justify-start gap-3 whitespace-nowrap">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-indigo-500/20 rounded-lg text-indigo-300 border border-indigo-400/20">
                <SlidersHorizontal size={16} />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Filter Controls
              </span>
            </div>

            {(employeeFilter !== 'All' || orderTypeFilter !== 'All' || daypartFilter !== 'All' || deviceFilter !== 'All') && (
              <button
                type="button"
                onClick={() => {
                  setEmployeeFilter('All');
                  setOrderTypeFilter('All');
                  setDaypartFilter('All');
                  setDeviceFilter('All');
                }}
                className="flex items-center gap-1 text-[11px] font-bold text-indigo-300 hover:text-white bg-indigo-500/20 hover:bg-indigo-500/30 px-2.5 py-1 rounded-lg border border-indigo-400/30 transition-all active:scale-95"
              >
                <RotateCcw size={11} /> Clear All
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3 w-full">
            <div className="w-full">
              <DateRangeSelector
                value={dateRange}
                onChange={(val) => {
                  if (val === 'Custom' || val === 'Custom Date Range' || val.startsWith('Custom')) {
                    setShowDatePicker(true);
                  } else {
                    setDateRange(val);
                  }
                }}
              />
            </div>
            <div className="w-full">
              <FilterSelect
                label="Employee"
                value={employeeFilter}
                options={['All', ...MOCK_EMPLOYEES.map(emp => emp.name)]}
                onChange={setEmployeeFilter}
              />
            </div>
            <div className="w-full">
              <FilterSelect
                label="Order Type"
                value={orderTypeFilter}
                options={['All', 'Dine-In', 'Takeout', 'Delivery', 'Drive-Thru']}
                onChange={setOrderTypeFilter}
              />
            </div>
            <div className="w-full">
              <FilterSelect
                label="Daypart"
                value={daypartFilter}
                options={['All', 'Breakfast', 'Lunch', 'Dinner', 'Late Night']}
                onChange={setDaypartFilter}
              />
            </div>
            <div className="w-full">
              <FilterSelect
                label="Device"
                value={deviceFilter}
                options={['All', 'Terminal 1', 'Terminal 2', 'Handheld 1', 'Online']}
                onChange={setDeviceFilter}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-1.5 text-[11px] text-slate-300 font-medium pt-2 border-t border-slate-700/50 z-10">
          <div className="flex items-center gap-1.5">
            <Clock size={12} className="text-indigo-400 shrink-0" />
            <span>Reporting window automatically resets daily at 12:00 AM</span>
          </div>
          <span className="text-[10px] text-indigo-300 font-semibold bg-indigo-900/50 px-2 py-0.5 rounded-md border border-indigo-500/30">
            Realtime Sync Active
          </span>
        </div>
      </div>
    </div>
  );
};
