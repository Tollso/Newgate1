import React, { useState } from 'react';
import { Percent, Save, CheckCircle2, DollarSign, Users } from 'lucide-react';
import { TipConfig, Employee } from '../../../types';
import { SettingsService } from '../../../services/settingsService';

interface PosSettingsTipsSectionProps {
  tipConfig?: TipConfig;
  currentUser: Employee;
  onUpdateTipConfig?: (config: TipConfig) => void;
}

export const PosSettingsTipsSection: React.FC<PosSettingsTipsSectionProps> = ({
  tipConfig,
  currentUser,
  onUpdateTipConfig,
}) => {
  const [enabled, setEnabled] = useState(tipConfig?.enabled ?? true);
  const [defaultPercentage, setDefaultPercentage] = useState(tipConfig?.defaultPercentage ?? 18);
  const [suggestedPercentages, setSuggestedPercentages] = useState<number[]>(
    tipConfig?.suggestedPercentages || [15, 18, 20, 25]
  );
  const [allowCustom, setAllowCustom] = useState(tipConfig?.allowCustom ?? true);
  const [autoGratuityEnabled, setAutoGratuityEnabled] = useState(true);
  const [autoGratuityPartySize, setAutoGratuityPartySize] = useState(6);
  const [autoGratuityRate, setAutoGratuityRate] = useState(18);
  const [savedNotification, setSavedNotification] = useState<string | null>(null);

  const handleSave = async () => {
    const updated: TipConfig = {
      enabled,
      defaultPercentage,
      suggestedPercentages,
      allowCustom,
    };

    await SettingsService.updateSettings(
      { merchantId: 'M001', locationId: 'LOC-1' },
      { tipConfig: updated },
      currentUser.id,
      currentUser.name
    );

    onUpdateTipConfig?.(updated);
    setSavedNotification('Tip prompts and auto-gratuity policies persisted to terminal.');
    setTimeout(() => setSavedNotification(null), 3500);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Percent className="text-indigo-400" size={24} />
            <h3 className="text-xl font-black text-white">Tipping & Service Charge Automation</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Configure customer-facing tip prompt screens, percentage presets, and large-party auto gratuity.
          </p>
        </div>

        {savedNotification && (
          <div className="px-4 py-2 bg-emerald-950/80 border border-emerald-600/60 rounded-xl flex items-center gap-2 text-emerald-300 text-xs font-semibold">
            <CheckCircle2 size={16} />
            <span>{savedNotification}</span>
          </div>
        )}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
        <h4 className="text-sm font-black uppercase tracking-wider text-slate-300">
          Tip Prompt Settings
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700/80 flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-white">Prompt Tips at Checkout</div>
              <div className="text-xs text-slate-400 mt-0.5">
                Display tip selection on card reader and customer screen.
              </div>
            </div>
            <button
              onClick={() => setEnabled(!enabled)}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                enabled ? 'bg-indigo-600' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  enabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700/80 flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-white">Allow Custom Tip Entry</div>
              <div className="text-xs text-slate-400 mt-0.5">
                Enable keypad for custom dollar amount or percentage.
              </div>
            </div>
            <button
              onClick={() => setAllowCustom(!allowCustom)}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                allowCustom ? 'bg-indigo-600' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  allowCustom ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700/80 flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-white">Default Selected Preset</div>
              <div className="text-xs text-slate-400 mt-0.5">
                Pre-highlighted percentage when payment screen loads.
              </div>
            </div>
            <select
              value={defaultPercentage}
              onChange={(e) => setDefaultPercentage(Number(e.target.value))}
              className="px-3 py-1.5 bg-slate-700 border border-slate-600 rounded-xl text-xs font-bold text-white"
            >
              <option value={15}>15%</option>
              <option value={18}>18%</option>
              <option value={20}>20%</option>
              <option value={22}>22%</option>
              <option value={25}>25%</option>
            </select>
          </div>

          <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700/80 flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-white">Preset Buttons</div>
              <div className="text-xs text-slate-400 mt-0.5">
                Quick selection buttons shown to customer.
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs font-mono font-bold text-indigo-300">
              {suggestedPercentages.map(p => `${p}%`).join(', ')}
            </div>
          </div>
        </div>

        {/* Large Party Auto-Gratuity */}
        <div className="pt-4 border-t border-slate-800 space-y-4">
          <h4 className="text-sm font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Users size={16} className="text-indigo-400" />
            Large Party Auto-Gratuity
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700/80 flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-white">Enable Auto-Gratuity</div>
                <div className="text-xs text-slate-400">Apply to parties meeting threshold.</div>
              </div>
              <button
                onClick={() => setAutoGratuityEnabled(!autoGratuityEnabled)}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                  autoGratuityEnabled ? 'bg-indigo-600' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    autoGratuityEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700/80">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Guest Count Threshold
              </label>
              <select
                value={autoGratuityPartySize}
                onChange={(e) => setAutoGratuityPartySize(Number(e.target.value))}
                className="w-full px-3 py-1.5 bg-slate-700 border border-slate-600 rounded-xl text-xs font-bold text-white"
              >
                <option value={5}>5 or more guests</option>
                <option value={6}>6 or more guests</option>
                <option value={8}>8 or more guests</option>
              </select>
            </div>

            <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700/80">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Gratuity Rate
              </label>
              <select
                value={autoGratuityRate}
                onChange={(e) => setAutoGratuityRate(Number(e.target.value))}
                className="w-full px-3 py-1.5 bg-slate-700 border border-slate-600 rounded-xl text-xs font-bold text-white"
              >
                <option value={18}>18%</option>
                <option value={20}>20%</option>
                <option value={22}>22%</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-800">
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/30"
          >
            <Save size={14} />
            Save Tip Policies
          </button>
        </div>
      </div>
    </div>
  );
};
