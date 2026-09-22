import React from 'react';
import { Calendar, Settings, Download, CheckCircle, Clock, Coins, Users, ChevronRight } from 'lucide-react';
import { ShiftEmployee, EmployeeDetail } from './TipPoolingTypes';

interface TipPoolingDailyShiftViewProps {
  selectedShift: 'Lunch' | 'Dinner';
  setSelectedShift: (shift: 'Lunch' | 'Dinner') => void;
  organizeBy: string;
  setOrganizeBy: (val: string) => void;
  isApproved: boolean;
  activePeriod: string;
  activePoolAmount: number;
  activeEmployees: ShiftEmployee[];
  selectedEmployee: EmployeeDetail | null;
  onSelectEmployee: (name: string) => void;
  onManagePolicy: () => void;
  onDownload: () => void;
  onApprove: () => void;
}

export const TipPoolingDailyShiftView: React.FC<TipPoolingDailyShiftViewProps> = ({
  selectedShift,
  setSelectedShift,
  organizeBy,
  setOrganizeBy,
  isApproved,
  activePeriod,
  activePoolAmount,
  activeEmployees,
  selectedEmployee,
  onSelectEmployee,
  onManagePolicy,
  onDownload,
  onApprove,
}) => {
  return (
    <div className="space-y-6">
      {/* Upper Report Nav Controller */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-indigo-600 animate-pulse"></span>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Tip Pooling Reports</h2>
          </div>
          <p className="text-xs text-slate-500 font-medium">Review and approve shifts, pools, and detailed server/support payouts</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl">
            <Calendar size={15} className="text-slate-400" />
            <span className="text-xs font-bold text-slate-700">Date:</span>
            <span className="text-xs font-bold text-slate-900">March 25, 2025</span>
          </div>

          <button
            onClick={onManagePolicy}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            <Settings size={14} /> Manage your policy
          </button>

          <button
            onClick={onDownload}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            <Download size={14} /> Download
          </button>

          <button
            onClick={onApprove}
            disabled={isApproved}
            className={`px-4.5 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 ${
              isApproved
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm cursor-pointer'
            }`}
          >
            {isApproved ? <CheckCircle size={14} /> : null}
            {isApproved ? 'Tips Approved' : 'Approve tips'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Shift Selectors Navigation */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 p-4">
          <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setSelectedShift('Lunch')}
              className={`px-4 py-2 text-xs font-bold uppercase rounded-lg transition-all ${
                selectedShift === 'Lunch'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Thursday Lunch
            </button>
            <button
              onClick={() => setSelectedShift('Dinner')}
              className={`px-4 py-2 text-xs font-bold uppercase rounded-lg transition-all ${
                selectedShift === 'Dinner'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Thursday Dinner
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-bold">Organize tips by</span>
            <select
              value={organizeBy}
              onChange={e => setOrganizeBy(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 outline-none"
            >
              <option value="Tips by Employee">Tips by Employee</option>
              <option value="Tips by Job">Tips by Job</option>
            </select>
          </div>
        </div>

        {/* Interval Shift Statistics bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-slate-100 border-b border-slate-100">
          <div className="bg-white p-5 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Time period</span>
            <div className="flex items-center gap-1.5">
              <Clock size={13} className="text-slate-400" />
              <span className="text-xs font-extrabold text-slate-700">{activePeriod}</span>
            </div>
          </div>
          <div className="bg-white p-5 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tips and gratuity in pool</span>
            <div className="flex items-center gap-1.5">
              <Coins size={13} className="text-indigo-500" />
              <span className="text-sm font-black text-slate-900 font-mono">
                ${activePoolAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
          <div className="bg-white p-5 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Employees in pool</span>
            <div className="flex items-center gap-1.5">
              <Users size={13} className="text-slate-400" />
              <span className="text-xs font-extrabold text-slate-700">{activeEmployees.length}</span>
            </div>
          </div>
        </div>

        {/* Employees breakdown table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-400 font-bold border-b border-slate-100">
                <th className="p-4 pl-6">Employee</th>
                <th className="p-4">Job</th>
                <th className="p-4 text-center">Hours worked</th>
                <th className="p-4 text-right">Tips before pooling</th>
                <th className="p-4 text-right">Tips after pooling</th>
                <th className="p-4 text-center">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activeEmployees.map((emp) => (
                <tr
                  key={emp.id}
                  onClick={() => onSelectEmployee(emp.name)}
                  className={`hover:bg-slate-50 cursor-pointer transition-colors ${
                    selectedEmployee?.name === emp.name ? 'bg-indigo-50/40 hover:bg-indigo-50/50' : ''
                  }`}
                >
                  <td className="p-4 pl-6 font-bold text-slate-900">{emp.name}</td>
                  <td className="p-4 text-slate-500 font-medium">{emp.job}</td>
                  <td className="p-4 text-center font-mono font-bold text-slate-600">{emp.hours > 0 ? emp.hours.toFixed(2) : '-'}</td>
                  <td className="p-4 text-right font-mono font-bold text-slate-500">
                    {emp.before > 0 ? `$${emp.before.toFixed(2)}` : '$0.00'}
                  </td>
                  <td className="p-4 text-right font-mono font-extrabold text-indigo-600">
                    {emp.after > 0 ? `$${emp.after.toFixed(2)}` : '$0.00'}
                  </td>
                  <td className="p-4 text-center text-slate-400">
                    <ChevronRight size={15} className="inline-block" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-slate-50/50 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Showing 1 to {activeEmployees.length} of {activeEmployees.length} rows</span>
          <div className="flex gap-1.5">
            <button className="px-2 py-1 border border-slate-200 bg-white rounded text-slate-600 font-bold cursor-default">1</button>
          </div>
        </div>
      </div>
    </div>
  );
};
