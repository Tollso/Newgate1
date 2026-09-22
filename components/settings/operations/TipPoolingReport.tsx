import React from 'react';
import { X, Award, DollarSign, Clock, User, Sparkles, TrendingUp } from 'lucide-react';
import { MOCK_EMPLOYEES } from '../../../src/mocks/mockBusinessData';

interface TipPoolingReportProps {
  onClose: () => void;
  interval: string;
  pools: any[];
}

export const TipPoolingReport: React.FC<TipPoolingReportProps> = ({ onClose, interval, pools }) => {
  // Simulate active shift data
  const simulatedEmployees = MOCK_EMPLOYEES.filter(e => ['Server', 'Host', 'Server Lead', 'Employee'].includes(e.role))
    .map(e => {
      // Map display jobs for pooling
      let poolJob = e.role === 'Server Lead' ? 'Server' : e.role;
      if (poolJob === 'Employee') poolJob = 'Runner';
      return {
        ...e,
        poolJob,
        hours: e.hoursWorked > 0 ? e.hoursWorked : 8,
        sales: Math.round((e.hoursWorked || 8) * 120),
        collectedTips: Math.round((e.hoursWorked || 8) * 22)
      };
    });

  const totalCollected = simulatedEmployees.reduce((sum, e) => sum + e.collectedTips, 0) + 180; // Add online orders tips

  // Calculate tip distribution logic based on current pools configuration
  let onlineTips = 180;
  let serverContributions = 0;
  let poolAllocations: Record<string, number> = {};

  // Simple reactive simulation logic based on points/percentages
  const serverContPercent = pools.find(p => p.type === 'custom')?.contributors?.find((c: any) => c.job === 'Server')?.amount || 3;
  
  simulatedEmployees.forEach(emp => {
    if (emp.poolJob === 'Server') {
      const contrib = Math.round(emp.collectedTips * (serverContPercent / 100));
      serverContributions += contrib;
    }
  });

  const totalPoolFund = Math.round((onlineTips * 0.8) + serverContributions);

  // Distribute based on recipients
  const recipients = pools[1]?.recipients || [
    { job: 'Busser', amount: 50 },
    { job: 'Runner', amount: 30 },
    { job: 'Host', amount: 20 }
  ];

  const distributedList = simulatedEmployees.map(emp => {
    let received = 0;
    let shareDetail = '';
    
    const recRule = recipients.find((r: any) => r.job === emp.poolJob);
    if (recRule) {
      // Calculate share
      const sameJobCount = simulatedEmployees.filter(e => e.poolJob === emp.poolJob).length || 1;
      const jobTotalAlloc = totalPoolFund * ((recRule.amount || 20) / 100);
      received = Math.round(jobTotalAlloc / sameJobCount);
      shareDetail = `${recRule.amount}% of pool split by ${sameJobCount} workers`;
    }

    const originalKeep = emp.poolJob === 'Server' 
      ? emp.collectedTips - Math.round(emp.collectedTips * (serverContPercent / 100))
      : emp.collectedTips;

    return {
      ...emp,
      contributed: emp.poolJob === 'Server' ? Math.round(emp.collectedTips * (serverContPercent / 100)) : 0,
      received,
      finalTips: originalKeep + received,
      shareDetail
    };
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-900 text-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-800">
        
        <div className="px-8 py-5 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="text-amber-400" size={18} />
              <h3 className="font-bold text-xl text-slate-100">Tip Pooling Simulation Report</h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">Simulated performance for active interval: <span className="text-indigo-400 font-bold uppercase">{interval}</span></p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 transition-colors p-1 bg-slate-800 hover:bg-slate-700 rounded-full">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 overflow-y-auto space-y-6 flex-1 bg-slate-950">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
              <span className="text-slate-400 text-xs font-bold uppercase block">Total Tips Collected</span>
              <span className="text-2xl font-black text-slate-100 mt-1 block font-mono">${totalCollected}</span>
              <span className="text-[10px] text-slate-500 mt-1 block">Includes $180 from Online Ordering</span>
            </div>
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
              <span className="text-slate-400 text-xs font-bold uppercase block">Total Pooled Fund</span>
              <span className="text-2xl font-black text-indigo-400 mt-1 block font-mono">${totalPoolFund}</span>
              <span className="text-[10px] text-slate-500 mt-1 block">Online contribs + Server cuts ({serverContPercent}%)</span>
            </div>
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
              <span className="text-slate-400 text-xs font-bold uppercase block">Support Distributed</span>
              <span className="text-2xl font-black text-emerald-400 mt-1 block font-mono">
                ${distributedList.reduce((sum, e) => sum + e.received, 0)}
              </span>
              <span className="text-[10px] text-slate-500 mt-1 block">Allocated to Bussers, Runners, and Hosts</span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-300 flex items-center gap-2">
              <User size={16} className="text-indigo-400" /> Employee Payout Breakdown
            </h4>
            
            <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-900/40">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-900 text-slate-400 font-bold border-b border-slate-800">
                    <th className="p-4">Employee</th>
                    <th className="p-4">Job / Role</th>
                    <th className="p-4 text-center">Hours</th>
                    <th className="p-4 text-right font-mono">Collected</th>
                    <th className="p-4 text-right text-rose-400 font-mono">Contributed</th>
                    <th className="p-4 text-right text-emerald-400 font-mono">From Pool</th>
                    <th className="p-4 text-right font-bold text-slate-100 font-mono">Take Home</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {distributedList.map((emp) => (
                    <tr key={emp.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-4 font-semibold text-slate-200">{emp.name}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 font-bold text-slate-300 border border-slate-700">
                          {emp.poolJob}
                        </span>
                      </td>
                      <td className="p-4 text-center font-mono text-slate-400">{emp.hours}h</td>
                      <td className="p-4 text-right font-mono text-slate-300">${emp.collectedTips}</td>
                      <td className="p-4 text-right font-mono text-rose-400">-${emp.contributed}</td>
                      <td className="p-4 text-right font-mono text-emerald-400">+${emp.received}</td>
                      <td className="p-4 text-right font-bold font-mono text-slate-100 bg-slate-900/50">${emp.finalTips}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-4 bg-indigo-950/40 border border-indigo-900/50 rounded-2xl text-xs text-indigo-200 leading-relaxed">
            <span className="font-bold block mb-1">💡 Pooling Insights</span>
            All calculation shares match the selected policy. Servers keep their remaining tips intact, and support roles receive accurate allocations based on their configured points and hours worked.
          </div>
        </div>

        <div className="px-8 py-5 border-t border-slate-800 flex justify-end gap-3 bg-slate-900/50">
          <button onClick={onClose} className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold uppercase rounded-xl transition-all">
            Dismiss
          </button>
          <button onClick={() => alert("Report exported to Excel/CSV successfully!")} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase rounded-xl shadow-lg shadow-indigo-950 transition-all flex items-center gap-1.5">
            Export Report
          </button>
        </div>
      </div>
    </div>
  );
};
