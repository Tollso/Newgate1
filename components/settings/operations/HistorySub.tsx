import React from 'react';
import { FileText, Printer, Search, History } from 'lucide-react';
import { MOCK_AUDIT_LOGS } from '../../../constants';
import { downloadCSV } from '../../../src/utils/csvExportUtil';

interface HistorySubProps {
  renderSectionHeader: (title: string, description: string, parentSection?: string) => React.ReactNode;
  historySearchQuery: string;
  setHistorySearchQuery: (val: string) => void;
  historyActionFilter: string;
  setHistoryActionFilter: (val: string) => void;
  historyEmployeeFilter: string;
  setHistoryEmployeeFilter: (val: string) => void;
  historyDateRange: string;
  setHistoryDateRange: (val: string) => void;
  filteredAuditLogs: typeof MOCK_AUDIT_LOGS;
}

export const HistorySub: React.FC<HistorySubProps> = ({
  renderSectionHeader,
  historySearchQuery,
  setHistorySearchQuery,
  historyActionFilter,
  setHistoryActionFilter,
  historyEmployeeFilter,
  setHistoryEmployeeFilter,
  historyDateRange,
  setHistoryDateRange,
  filteredAuditLogs
}) => {
  return (
    <div className="max-w-6xl animate-fade-in pb-20 space-y-8">
      <div className="flex justify-between items-end">
        {renderSectionHeader("Business Operation History", "View detailed audit logs for all system activities, item removals, and transactions.", "Business operations")}
        <div className="flex items-center gap-2 mb-8">
          <button 
            onClick={() => downloadCSV(filteredAuditLogs, 'Audit_History_Logs')}
            className="flex items-center gap-2 px-4 py-2 text-indigo-600 font-bold text-sm bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm"
          >
            <FileText size={16} /> Export CSV
          </button>
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-bold text-sm rounded-xl hover:bg-indigo-700 transition-all shadow-md"
          >
            <Printer size={16} /> Print Log
          </button>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-1.5 ml-1">Search Details</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                value={historySearchQuery}
                onChange={e => setHistorySearchQuery(e.target.value)}
                placeholder="Order ID, employee, item..." 
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50/50"
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-1.5 ml-1">Action Type</label>
            <select 
              value={historyActionFilter}
              onChange={e => setHistoryActionFilter(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-600 bg-white"
            >
              <option value="All">All Activities</option>
              <option value="Item Removed">Item Removals</option>
              <option value="Transaction Completed">Transactions</option>
              <option value="Refund Issued">Refunds</option>
              <option value="Settings Updated">Settings</option>
              <option value="Price Override">Price Overrides</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-1.5 ml-1">Employee</label>
            <select 
              value={historyEmployeeFilter}
              onChange={e => setHistoryEmployeeFilter(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-600 bg-white"
            >
              <option value="All">All Employees</option>
              {Array.from(new Set(MOCK_AUDIT_LOGS.map(l => l.user))).map(user => (
                <option key={user} value={user}>{user}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-1.5 ml-1">Timeframe</label>
            <select 
              value={historyDateRange}
              onChange={e => setHistoryDateRange(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-600 bg-white"
            >
              <option value="All time">All time</option>
              <option value="Today">Today</option>
              <option value="Yesterday">Yesterday</option>
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Last 30 Days">Last 30 Days</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
            Showing {(filteredAuditLogs || []).length} Records
          </h3>
          <button 
            onClick={() => {
              setHistorySearchQuery('');
              setHistoryActionFilter('All');
              setHistoryEmployeeFilter('All');
              setHistoryDateRange('All time');
            }}
            className="text-[10px] font-black text-indigo-600 uppercase hover:underline"
          >
            Reset Filters
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Detailed Audit Log</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {(filteredAuditLogs || []).length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <History size={40} className="text-slate-200" />
                      <p className="font-bold">No history records match your filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAuditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-slate-900">
                          {new Date(log.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border ${
                        log.action === 'Item Removed' ? 'bg-red-50 text-red-600 border-red-200' :
                        log.action === 'Transaction Completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                        log.action === 'Refund Issued' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                        'bg-blue-50 text-blue-600 border-blue-200'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-slate-700">{log.user}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-slate-600 font-medium max-w-md leading-relaxed">{log.details}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-[10px] font-black text-emerald-600 uppercase">Logged</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
