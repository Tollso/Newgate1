import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, Lock } from 'lucide-react';

interface FraudPreventionSubProps {
  renderSectionHeader: (title: string, description: string, parentSection?: string) => React.ReactNode;
  fraudSettings: any;
  setFraudSettings: (val: any) => void;
}

export const FraudPreventionSub: React.FC<FraudPreventionSubProps> = ({
  renderSectionHeader,
  fraudSettings,
  setFraudSettings
}) => {
  const [saved, setSaved] = useState(false);
  const [maxOrderAmount, setMaxOrderAmount] = useState<number>(2000);
  const [velocityLimit, setVelocityLimit] = useState<number>(5);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl animate-fade-in pb-20 space-y-8">
      {renderSectionHeader("Fraud Prevention & Risk Rules", "Configure AVS strictness, CVV verification, and transaction velocity limits.", "Transactions")}

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 text-sm font-bold animate-fade-in">
          <CheckCircle2 size={18} /> Fraud prevention parameters updated successfully!
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-6">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Address Verification System (AVS) Strictness</label>
          <select
            value={fraudSettings.avsLevel || 'strict'}
            onChange={e => setFraudSettings({ ...fraudSettings, avsLevel: e.target.value })}
            className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm font-bold bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="strict">Strict (Require exact ZIP & Street Address match)</option>
            <option value="moderate">Moderate (Require ZIP match only)</option>
            <option value="disabled">Disabled (Accept transactions without address check)</option>
          </select>
        </div>

        <label className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
          <div className="flex items-center gap-3">
            <Lock size={20} className="text-indigo-600" />
            <div>
              <span className="text-sm font-bold text-slate-800 block">Require Card CVV Match</span>
              <span className="text-xs text-slate-500 font-medium">Decline card-not-present transactions if CVV fails validation</span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={fraudSettings.cvvCheck ?? true}
            onChange={e => setFraudSettings({ ...fraudSettings, cvvCheck: e.target.checked })}
            className="h-5 w-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
          />
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Maximum Single Order Limit ($)</label>
            <input
              type="number"
              value={maxOrderAmount}
              onChange={e => setMaxOrderAmount(parseInt(e.target.value) || 0)}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm font-bold font-mono bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <span className="text-[10px] text-slate-400 font-medium mt-1 block">Orders above this limit trigger manager authorization</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Hourly Velocity Risk Limit (Attempts)</label>
            <input
              type="number"
              value={velocityLimit}
              onChange={e => setVelocityLimit(parseInt(e.target.value) || 0)}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm font-bold font-mono bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <span className="text-[10px] text-slate-400 font-medium mt-1 block">Max declined attempts from same IP before 1-hour block</span>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            onClick={handleSave}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-md transition-all"
          >
            Update Fraud Policy
          </button>
        </div>
      </div>
    </div>
  );
};
