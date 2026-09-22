
import React, { useState } from 'react';
import { DollarSign, CheckCircle2, ArrowUpRight } from 'lucide-react';

export const FinancialsSection: React.FC = () => {
  const [feePercentage, setFeePercentage] = useState<number>(0.5);
  const [fixedFeeCents, setFixedFeeCents] = useState<number>(0.15);
  const [payoutSchedule, setPayoutSchedule] = useState<string>('Daily Rolling (2-day)');
  const [showSavedMsg, setShowSavedMsg] = useState<boolean>(false);

  const handleUpdateFees = () => {
    setShowSavedMsg(true);
    setTimeout(() => setShowSavedMsg(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="text-2xl font-black text-slate-800 tracking-tighter uppercase">Platform Financials</h3>
        <p className="text-slate-500 font-medium text-sm">Global fee schedules, payout parameters, and revenue collection</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h4 className="font-black text-slate-800 text-sm uppercase tracking-widest mb-6">Platform Fee Schedule</h4>
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Merchant Transaction Rate (%)</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  step="0.05"
                  value={feePercentage}
                  onChange={e => setFeePercentage(parseFloat(e.target.value) || 0)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-black text-xl text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-2xl font-black text-slate-400">%</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Fixed Transaction Fee ($)</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  step="0.01"
                  value={fixedFeeCents}
                  onChange={e => setFixedFeeCents(parseFloat(e.target.value) || 0)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-black text-xl text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-2xl font-black text-slate-400">$</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Automated Payout Cycle</label>
              <select
                value={payoutSchedule}
                onChange={e => setPayoutSchedule(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-sm text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Daily Rolling (2-day)">Daily Rolling (2-day)</option>
                <option value="Weekly (Mondays)">Weekly (Mondays)</option>
                <option value="Monthly (1st of month)">Monthly (1st of month)</option>
                <option value="Instant Payout (1% surcharge)">Instant Payout (1% surcharge)</option>
              </select>
            </div>

            {showSavedMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 text-xs font-bold animate-fade-in">
                <CheckCircle2 size={16} /> Global fee schedule updated & propagated to all active merchants!
              </div>
            )}

            <button
              onClick={handleUpdateFees}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm shadow-xl shadow-slate-900/10 hover:bg-indigo-600 transition-colors"
            >
              UPDATE GLOBAL FEES
            </button>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="font-black text-slate-800 text-sm uppercase tracking-widest mb-6">Payout Statistics & Volume</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-xs font-bold text-slate-500 block">Total Net Merchant Payouts (YTD)</span>
                  <span className="text-2xl font-black text-slate-900">$2,418,920.00</span>
                </div>
                <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl">
                  <DollarSign size={20} />
                </div>
              </div>

              <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-xs font-bold text-slate-500 block">Platform SaaS Fees Collected</span>
                  <span className="text-2xl font-black text-indigo-600">$18,450.00</span>
                </div>
                <div className="p-3 bg-indigo-100 text-indigo-700 rounded-xl">
                  <ArrowUpRight size={20} />
                </div>
              </div>

              <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-xs font-bold text-slate-500 block">Pending Batch Settlements</span>
                  <span className="text-xl font-black text-amber-600">$34,120.80 (12 Merchants)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 text-xs text-slate-400 font-medium">
            Next scheduled automated ACH settlement runs tonight at 11:59 PM EST.
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialsSection;
