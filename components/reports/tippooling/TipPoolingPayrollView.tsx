import React from 'react';
import { Calendar, Download, Send, CheckCircle, Clock, Info } from 'lucide-react';
import { PayrollDay } from './TipPoolingTypes';

interface TipPoolingPayrollViewProps {
  payrollDays: PayrollDay[];
  onDownload: () => void;
  onSendToPayroll: () => void;
  onSendIndividual: (id: string, date: string) => void;
}

export const TipPoolingPayrollView: React.FC<TipPoolingPayrollViewProps> = ({
  payrollDays,
  onDownload,
  onSendToPayroll,
  onSendIndividual,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 animate-fade-in">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-indigo-600"></span>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Tips Management</h2>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg w-fit">
            <Calendar size={14} />
            <span>Mar 25, 2025 - Apr 1, 2025</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onDownload}
            className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm"
          >
            <Download size={14} /> Download CSV
          </button>
          
          <button
            onClick={onSendToPayroll}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md"
          >
            <Send size={14} /> Send to payroll
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <div>
            <span className="text-xs font-extrabold text-slate-800">Payroll Export History</span>
            <p className="text-[10px] text-slate-400">Verify shift pool statuses before pushing to your payroll provider</p>
          </div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded">
            Weekly Summary
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-400 font-bold border-b border-slate-100">
                <th className="p-4.5 pl-6">Date</th>
                <th className="p-4.5 text-center">Employees</th>
                <th className="p-4.5 text-right">Total tips and gratuity</th>
                <th className="p-4.5 pl-8">Status</th>
                <th className="p-4.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {payrollDays.map((day) => (
                <tr key={day.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4.5 pl-6 font-bold text-slate-900">{day.date}</td>
                  <td className="p-4.5 text-center font-bold text-slate-600 font-mono">{day.employees}</td>
                  <td className="p-4.5 text-right font-black text-slate-800 font-mono">
                    ${day.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-4.5 pl-8">
                    {day.status === 'SENT TO PAYROLL' ? (
                      <div className="space-y-0.5">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100">
                          <CheckCircle size={11} /> SENT TO PAYROLL
                        </span>
                        <span className="block text-[9px] text-slate-400 font-bold pl-0.5">Sent on {day.sentDate}</span>
                      </div>
                    ) : day.status === 'READY' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100 animate-pulse">
                        <Clock size={11} /> READY
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-sky-50 text-sky-700 border border-sky-100">
                        <Clock size={11} /> IN PROGRESS
                      </span>
                    )}
                  </td>
                  <td className="p-4.5 text-center">
                    {day.status === 'READY' ? (
                      <button
                        onClick={() => onSendIndividual(day.id, day.date)}
                        className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[10px] uppercase rounded-lg tracking-wider transition-all cursor-pointer border border-indigo-200"
                      >
                        Submit
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-bold">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-400 flex items-center gap-2">
          <Info size={13} className="text-slate-400 shrink-0" />
          <span>Only approved or completed shifts can be exported to payroll. "In Progress" shifts will automatically become "Ready" at the end of the business day.</span>
        </div>
      </div>
    </div>
  );
};
