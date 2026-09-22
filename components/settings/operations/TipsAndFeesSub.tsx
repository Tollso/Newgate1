import React, { useState, useEffect } from 'react';
import { Percent, CheckCircle2, Users, DollarSign } from 'lucide-react';
import { TipConfig } from '../../../types';
import { TipPoolingConfig } from './TipPoolingConfig';

interface TipsAndFeesSubProps {
  renderSectionHeader: (title: string, description: string, parentSection?: string) => React.ReactNode;
  tipConfig?: TipConfig;
  setTipConfig?: React.Dispatch<React.SetStateAction<TipConfig>>;
}

export const TipsAndFeesSub: React.FC<TipsAndFeesSubProps> = ({
  renderSectionHeader,
  tipConfig,
  setTipConfig
}) => {
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'tipping' | 'pooling'>('tipping');

  const [localTip, setLocalTip] = useState<TipConfig>(
    tipConfig || { enabled: true, defaultPercentage: 18, suggestedPercentages: [15, 18, 20, 25], allowCustom: true }
  );

  const [calcPreTax, setCalcPreTax] = useState(true);
  const [promptSignature, setPromptSignature] = useState(true);

  useEffect(() => {
    if (tipConfig) {
      setLocalTip(tipConfig);
    }
  }, [tipConfig]);

  const triggerSaveToast = (msg: string) => {
    setSavedMessage(msg);
    setTimeout(() => setSavedMessage(null), 3000);
  };

  const handleSaveTip = () => {
    if (setTipConfig) setTipConfig(localTip);
    triggerSaveToast("Tip & fee policy updated successfully!");
  };

  return (
    <div className="max-w-4xl animate-fade-in pb-20 space-y-8">
      {renderSectionHeader("Tipping, Auto-Gratuity & Service Fees", "Configure customer tip prompts, default percentages, auto gratuity rates, and service charges.", "Business operations")}
      
      {/* Sub-Tabs for Tipping vs Pooling */}
      <div className="flex border border-slate-200 bg-white p-1 rounded-xl shadow-sm max-w-md shrink-0">
        <button
          onClick={() => setActiveTab('tipping')}
          className={`flex-1 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all ${
            activeTab === 'tipping' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Tipping & Fees
        </button>
        <button
          onClick={() => setActiveTab('pooling')}
          className={`flex-1 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all ${
            activeTab === 'pooling' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Tip Pooling Policy
        </button>
      </div>

      {activeTab === 'pooling' ? (
        <TipPoolingConfig />
      ) : (
        <>
          {savedMessage && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 text-sm font-bold animate-fade-in">
              <CheckCircle2 size={18} /> {savedMessage}
            </div>
          )}

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-6">
            <label className="flex items-center justify-between p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 cursor-pointer">
              <div>
                <span className="text-sm font-bold text-slate-900 block">Enable On-Screen Tip Prompt</span>
                <span className="text-xs text-slate-500 font-medium">Prompt customers for tips during card checkout</span>
              </div>
              <input
                type="checkbox"
                checked={localTip.enabled}
                onChange={e => setLocalTip({ ...localTip, enabled: e.target.checked })}
                className="h-5 w-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
              />
            </label>

            <div className="space-y-4">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Suggested Tip Percentages</label>
              <div className="grid grid-cols-4 gap-3">
                {localTip.suggestedPercentages.map((pct, idx) => (
                  <div key={idx} className="relative">
                    <input
                      type="number"
                      value={pct}
                      onChange={e => {
                        const newArr = [...localTip.suggestedPercentages];
                        newArr[idx] = parseInt(e.target.value) || 0;
                        setLocalTip({ ...localTip, suggestedPercentages: newArr });
                      }}
                      className="w-full border border-slate-300 rounded-xl p-3 text-center text-sm font-bold font-mono outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Default Pre-Selected Tip (%)</label>
                <input
                  type="number"
                  value={localTip.defaultPercentage}
                  onChange={e => setLocalTip({ ...localTip, defaultPercentage: parseInt(e.target.value) || 0 })}
                  className="w-full border border-slate-300 rounded-xl p-3 text-sm font-bold font-mono outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex flex-col justify-end">
                <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localTip.allowCustom}
                    onChange={e => setLocalTip({ ...localTip, allowCustom: e.target.checked })}
                    className="h-5 w-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                  />
                  <span className="text-xs font-bold text-slate-700">Allow Custom Dollar/Percentage Tips</span>
                </label>
              </div>
            </div>

            {/* Auto Gratuity Configuration */}
            <div className="pt-6 border-t border-slate-200 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Users size={16} className="text-indigo-600" /> Automatic Gratuity Policy
                  </h4>
                  <p className="text-xs text-slate-500">Automatically or manually apply gratuity for large dining parties or table bills</p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localTip.autoGratuityEnabled ?? true}
                    onChange={e => setLocalTip({ ...localTip, autoGratuityEnabled: e.target.checked })}
                    className="h-5 w-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                  />
                  <span className="text-xs font-bold text-slate-700">Enabled</span>
                </label>
              </div>

              {(localTip.autoGratuityEnabled ?? true) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Auto Gratuity Rate (%)</label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.5"
                        value={localTip.autoGratuityRate ?? 18}
                        onChange={e => setLocalTip({ ...localTip, autoGratuityRate: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold font-mono text-slate-800 outline-none focus:border-indigo-500"
                      />
                      <Percent size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Auto-Apply Min Party Size</label>
                    <input
                      type="number"
                      min="1"
                      value={localTip.autoGratuityMinPartySize ?? 6}
                      onChange={e => setLocalTip({ ...localTip, autoGratuityMinPartySize: parseInt(e.target.value) || 1 })}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold font-mono text-slate-800 outline-none focus:border-indigo-500"
                      placeholder="e.g. 6 guests"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Auto-selected for parties with this guest count or higher</p>
                  </div>
                </div>
              )}
            </div>

            {/* Service Fee Configuration */}
            <div className="pt-6 border-t border-slate-200 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <DollarSign size={16} className="text-indigo-600" /> Service Fee Configuration
                  </h4>
                  <p className="text-xs text-slate-500">Configure additional service charges or kitchen fees for table orders</p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localTip.serviceFeeEnabled ?? true}
                    onChange={e => setLocalTip({ ...localTip, serviceFeeEnabled: e.target.checked })}
                    className="h-5 w-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                  />
                  <span className="text-xs font-bold text-slate-700">Enabled</span>
                </label>
              </div>

              {(localTip.serviceFeeEnabled ?? true) && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Fee Label / Name</label>
                    <input
                      type="text"
                      value={localTip.serviceFeeName ?? 'Service Fee'}
                      onChange={e => setLocalTip({ ...localTip, serviceFeeName: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-indigo-500"
                      placeholder="e.g. Service Fee"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Fee Type</label>
                    <select
                      value={localTip.serviceFeeType ?? 'Percentage'}
                      onChange={e => setLocalTip({ ...localTip, serviceFeeType: e.target.value as 'Percentage' | 'Fixed' })}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-indigo-500"
                    >
                      <option value="Percentage">Percentage (%)</option>
                      <option value="Fixed">Fixed Amount ($)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Fee Value</label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        value={localTip.serviceFeeValue ?? 3.5}
                        onChange={e => setLocalTip({ ...localTip, serviceFeeValue: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold font-mono text-slate-800 outline-none focus:border-indigo-500"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                        {localTip.serviceFeeType === 'Fixed' ? '$' : '%'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-100">
              <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                <span className="text-xs font-bold text-slate-700">Calculate Tip Suggested Amounts on Pre-Tax Subtotal</span>
                <input
                  type="checkbox"
                  checked={calcPreTax}
                  onChange={e => setCalcPreTax(e.target.checked)}
                  className="h-5 w-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                <span className="text-xs font-bold text-slate-700">Prompt Customer Signature on Screen</span>
                <input
                  type="checkbox"
                  checked={promptSignature}
                  onChange={e => setPromptSignature(e.target.checked)}
                  className="h-5 w-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                />
              </label>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={handleSaveTip}
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-md transition-all"
              >
                Save Tip & Fee Policy
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
