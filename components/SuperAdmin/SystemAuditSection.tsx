import React, { useState } from 'react';
import { Activity, ShieldCheck, Server, AlertCircle, RefreshCw, Download, CheckCircle2 } from 'lucide-react';
import { downloadCSV } from '../../src/utils/csvExportUtil';

interface SystemLog {
  id: string;
  timestamp: string;
  service: string;
  action: string;
  user: string;
  severity: 'INFO' | 'WARN' | 'ERROR';
  details: string;
}

const INITIAL_LOGS: SystemLog[] = [
  { id: 'LOG-801', timestamp: '2026-08-03 13:20:11', service: 'AUTH-GATEWAY', action: 'OAuth Token Issued', user: 'admin@lumirestaurant.com', severity: 'INFO', details: 'Granted session key for POS Terminal #4' },
  { id: 'LOG-802', timestamp: '2026-08-03 13:18:45', service: 'PAYMENT-GATEWAY', action: 'Batch Settlement', user: 'SYSTEM_CRON', severity: 'INFO', details: 'Settled $14,280.50 across 12 active merchants' },
  { id: 'LOG-803', timestamp: '2026-08-03 13:15:02', service: 'INVENTORY-SYNC', action: 'Stock Level Threshold Warning', user: 'SYSTEM_MONITOR', severity: 'WARN', details: 'Item "Truffle Fries" below safety threshold (qty: 3)' },
  { id: 'LOG-804', timestamp: '2026-08-03 13:10:00', service: 'SUPERADMIN-CORE', action: 'Merchant Provisioned', user: 'superadmin@bytepos.io', severity: 'INFO', details: 'Provisioned new tenant "Downtown Bistro" (Growth Plan)' },
  { id: 'LOG-805', timestamp: '2026-08-03 12:55:18', service: 'DATABASE-CLUSTER', action: 'Read Replica Failover Test', user: 'SYSTEM_HEALTH', severity: 'INFO', details: 'Automated health check completed in 12ms' },
  { id: 'LOG-806', timestamp: '2026-08-03 12:40:22', service: 'SECURITY-FIREWALL', action: 'Rate Limit Block', user: 'IP_192.168.1.104', severity: 'ERROR', details: 'Exceeded 500 requests/min threshold on /api/v1/auth' },
];

export const SystemAuditSection: React.FC = () => {
  const [logs, setLogs] = useState<SystemLog[]>(INITIAL_LOGS);
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const filteredLogs = logs.filter(log => {
    const matchesSev = severityFilter === 'ALL' || log.severity === severityFilter;
    const matchesQuery = searchQuery === '' ||
      log.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSev && matchesQuery;
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      const newLog: SystemLog = {
        id: `LOG-${Math.floor(100 + Math.random() * 900)}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        service: 'HEALTH-CHECK',
        action: 'System Diagnostics Ping',
        user: 'SYSTEM_AUDITOR',
        severity: 'INFO',
        details: 'All microservices running at optimal throughput (12ms latency)'
      };
      setLogs(prev => [newLog, ...prev]);
    }, 600);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-2xl font-black text-slate-800 tracking-tighter uppercase">System Audit & Health</h3>
          <p className="text-slate-500 font-medium text-sm">Real-time telemetry, audit logs, and security monitoring</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all"
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} /> Refresh Telemetry
          </button>
          <button
            onClick={() => downloadCSV(filteredLogs, 'System_Audit_Logs')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition-all"
          >
            <Download size={14} /> Export Logs
          </button>
        </div>
      </div>

      {/* System Service Health Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Server size={22} />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Core API Gateway</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-base font-black text-slate-900">99.99% Uptime</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Activity size={22} />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">P99 API Latency</span>
            <p className="text-base font-black text-slate-900">14 ms avg</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <ShieldCheck size={22} />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">OAuth & Auth DB</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <CheckCircle2 size={14} className="text-emerald-500" />
              <span className="text-sm font-bold text-slate-800">Healthy</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <AlertCircle size={22} />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Security Events (24h)</span>
            <p className="text-base font-black text-amber-600">0 Critical</p>
          </div>
        </div>
      </div>

      {/* Audit Stream Table & Controls */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h4 className="font-black text-slate-800 text-sm uppercase tracking-wider">Platform Security & Audit Stream</h4>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Immutable record of all enterprise administrative actions</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search audit logs..."
              className="px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 flex-1 md:w-56"
            />
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-3.5 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="ALL">All Severities</option>
              <option value="INFO">Info Only</option>
              <option value="WARN">Warnings</option>
              <option value="ERROR">Errors / Blocks</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-500 uppercase font-black tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Log ID / Timestamp</th>
                <th className="px-6 py-3.5">Microservice</th>
                <th className="px-6 py-3.5">Action Event</th>
                <th className="px-6 py-3.5">User / Trigger</th>
                <th className="px-6 py-3.5">Severity</th>
                <th className="px-6 py-3.5">Event Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-mono font-bold text-slate-900">{log.id}</div>
                    <div className="text-[10px] text-slate-400">{log.timestamp}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-700 rounded-md font-mono font-bold text-[10px]">
                      {log.service}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900">{log.action}</td>
                  <td className="px-6 py-4 font-mono text-slate-600">{log.user}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                      log.severity === 'ERROR' ? 'bg-rose-100 text-rose-800' :
                      log.severity === 'WARN' ? 'bg-amber-100 text-amber-800' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {log.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 max-w-xs truncate">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
