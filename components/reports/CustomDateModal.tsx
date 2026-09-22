import React, { useState, useMemo } from 'react';
import { X, Calendar, Check, Clock, Sparkles, ArrowRight, RotateCcw, Zap } from 'lucide-react';

interface CustomDateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (dateRangeStr: string) => void;
}

export const CustomDateModal: React.FC<CustomDateModalProps> = ({ isOpen, onClose, onApply }) => {
  const [startDate, setStartDate] = useState(() => new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [activePreset, setActivePreset] = useState<string | null>('Last 7 Days');

  const daysDiff = useMemo(() => {
    if (!startDate || !endDate) return 0;
    const s = new Date(startDate + 'T00:00:00');
    const e = new Date(endDate + 'T00:00:00');
    const diff = Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return diff;
  }, [startDate, endDate]);

  if (!isOpen) return null;

  const formatDateLabel = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  const setPreset = (presetName: string, daysBack: number) => {
    const today = new Date();
    const end = today.toISOString().split('T')[0];
    const startObj = new Date(today.getTime() - (daysBack - 1) * 86400000);
    const start = startObj.toISOString().split('T')[0];
    setStartDate(start);
    setEndDate(end);
    setActivePreset(presetName);
  };

  const setMonthToDate = () => {
    const today = new Date();
    const end = today.toISOString().split('T')[0];
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const start = firstDay.toISOString().split('T')[0];
    setStartDate(start);
    setEndDate(end);
    setActivePreset('Month to Date');
  };

  const setYearToDate = () => {
    const today = new Date();
    const end = today.toISOString().split('T')[0];
    const firstDay = new Date(today.getFullYear(), 0, 1);
    const start = firstDay.toISOString().split('T')[0];
    setStartDate(start);
    setEndDate(end);
    setActivePreset('Year to Date');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (startDate && endDate) {
      onApply(`Custom Range (${startDate} to ${endDate})`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[110] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 transform transition-all scale-100">
        
        {/* Creative Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white relative overflow-hidden flex justify-between items-center">
          <div className="absolute -right-10 -top-10 w-36 h-36 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center gap-3.5 z-10">
            <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 text-indigo-300 shadow-inner">
              <Calendar size={22} className="text-indigo-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">Custom Reporting Horizon</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                  Interactive
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium mt-0.5">Define precise start and end boundaries for your report</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="z-10 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Quick Preset Pills */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
              <Zap size={14} className="text-amber-500" />
              <span>Quick Presets</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setPreset('Last 3 Days', 3)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 border ${
                  activePreset === 'Last 3 Days'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200 scale-105'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600'
                }`}
              >
                Last 3D
              </button>
              <button
                type="button"
                onClick={() => setPreset('Last 7 Days', 7)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 border ${
                  activePreset === 'Last 7 Days'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200 scale-105'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600'
                }`}
              >
                Last 7D
              </button>
              <button
                type="button"
                onClick={() => setPreset('Last 14 Days', 14)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 border ${
                  activePreset === 'Last 14 Days'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200 scale-105'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600'
                }`}
              >
                Last 14D
              </button>
              <button
                type="button"
                onClick={() => setPreset('Last 30 Days', 30)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 border ${
                  activePreset === 'Last 30 Days'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200 scale-105'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600'
                }`}
              >
                Last 30D
              </button>
              <button
                type="button"
                onClick={setMonthToDate}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 border ${
                  activePreset === 'Month to Date'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200 scale-105'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600'
                }`}
              >
                MTD
              </button>
              <button
                type="button"
                onClick={setYearToDate}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 border ${
                  activePreset === 'Year to Date'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200 scale-105'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600'
                }`}
              >
                YTD
              </button>
            </div>
          </div>

          {/* Date Inputs Grid Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            
            {/* Start Date Card */}
            <div className="p-3.5 bg-gradient-to-br from-indigo-50/40 via-slate-50/50 to-white rounded-2xl border border-slate-200 hover:border-indigo-300 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-all shadow-sm">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1">
                  <Calendar size={12} /> Start Date
                </span>
                <span className="text-[11px] font-medium text-slate-500">{formatDateLabel(startDate)}</span>
              </div>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setActivePreset(null);
                }}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-800 outline-none focus:border-indigo-500 focus:ring-0 shadow-inner"
                required
              />
            </div>

            {/* End Date Card */}
            <div className="p-3.5 bg-gradient-to-br from-indigo-50/40 via-slate-50/50 to-white rounded-2xl border border-slate-200 hover:border-indigo-300 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-all shadow-sm">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1">
                  <Calendar size={12} /> End Date
                </span>
                <span className="text-[11px] font-medium text-slate-500">{formatDateLabel(endDate)}</span>
              </div>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setActivePreset(null);
                }}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-800 outline-none focus:border-indigo-500 focus:ring-0 shadow-inner"
                required
              />
            </div>
          </div>

          {/* Calculated Horizon Badge */}
          <div className="p-3 bg-gradient-to-r from-indigo-50 via-slate-50 to-violet-50 rounded-2xl border border-indigo-100/80 flex items-center justify-between text-xs text-slate-700 font-medium shadow-sm">
            <div className="flex items-center gap-2">
              <Sparkles size={15} className="text-indigo-600 shrink-0" />
              <span>
                {daysDiff > 0 ? (
                  <>Selected duration: <strong className="text-indigo-900 font-bold">{daysDiff} {daysDiff === 1 ? 'day' : 'days'}</strong></>
                ) : (
                  <span className="text-amber-600 font-semibold">End date must be on or after start date</span>
                )}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-white/80 px-2.5 py-1 rounded-lg border border-slate-200/80">
              <Clock size={12} className="text-indigo-500 shrink-0" />
              <span>12:00 AM – 11:59 PM</span>
            </div>
          </div>

          {/* Creative Action Footer Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                const today = new Date().toISOString().split('T')[0];
                setStartDate(today);
                setEndDate(today);
                setActivePreset('Today');
              }}
              className="px-3.5 py-2.5 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 rounded-xl text-xs font-bold tracking-wide transition-all active:scale-95 flex items-center gap-1.5 shadow-sm"
            >
              <RotateCcw size={13} className="text-indigo-500" />
              <span>Reset to Today</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 border border-transparent text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={daysDiff <= 0}
                className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl text-xs font-bold tracking-wide shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.97] transition-all flex items-center gap-2 disabled:opacity-50 disabled:pointer-events-none group"
              >
                <Check size={16} className="text-indigo-200 group-hover:scale-110 transition-transform" />
                <span>Apply Horizon</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform text-indigo-200" />
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
