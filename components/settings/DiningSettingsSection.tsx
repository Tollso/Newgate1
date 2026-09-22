import React, { useState, useEffect } from 'react';
import { Utensils, LayoutGrid, DollarSign, Users, Percent, Tag, CheckCircle2 } from 'lucide-react';
import { TipConfig, GlobalTaxConfig, getEffectiveTaxRate } from '../../types';

interface DiningSettingsSectionProps {
  renderSectionHeader: (title: string, description: string, parentSection?: string) => React.ReactNode;
  diningSections: string[];
  setDiningSections: React.Dispatch<React.SetStateAction<string[]>>;
  onNavigate?: (tab: string) => void;
  tipConfig?: TipConfig;
  setTipConfig?: React.Dispatch<React.SetStateAction<TipConfig>>;
  taxConfig?: GlobalTaxConfig;
  setTaxConfig?: React.Dispatch<React.SetStateAction<GlobalTaxConfig>>;
}

export const DiningSettingsSection: React.FC<DiningSettingsSectionProps> = ({
  renderSectionHeader,
  diningSections,
  setDiningSections,
  onNavigate,
  tipConfig,
  setTipConfig,
  taxConfig,
  setTaxConfig
}) => {
  const [localTip, setLocalTip] = useState<TipConfig>(
    tipConfig || { 
      enabled: true, 
      defaultPercentage: 18, 
      suggestedPercentages: [15, 18, 20, 25], 
      allowCustom: true,
      autoGratuityEnabled: true,
      autoGratuityRate: 18,
      autoGratuityMinPartySize: 6,
      serviceFeeEnabled: true,
      serviceFeeName: 'Service Fee',
      serviceFeeType: 'Percentage',
      serviceFeeValue: 3.5
    }
  );

  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  useEffect(() => {
    if (tipConfig) setLocalTip(tipConfig);
  }, [tipConfig]);

  const handleUpdateTipConfig = (updated: TipConfig) => {
    setLocalTip(updated);
    if (setTipConfig) setTipConfig(updated);
    setSavedNotice("Table fee & gratuity settings updated!");
    setTimeout(() => setSavedNotice(null), 3000);
  };

  const effectiveTax = taxConfig ? getEffectiveTaxRate(taxConfig) : 8.25;

  return (
    <div className="max-w-4xl animate-fade-in pb-20 space-y-8">
      {renderSectionHeader("Dining & Table Settings", "Manage floor plan sections, table service rules, auto-gratuities, and service fees.", "Settings")}
      
      {savedNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 text-sm font-bold animate-fade-in">
          <CheckCircle2 size={18} /> {savedNotice}
        </div>
      )}

      {/* Service Rules & Dining Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Utensils size={20} />
            </div>
            <h3 className="font-bold text-slate-800">Service Rules</h3>
          </div>
          <div className="space-y-4">
            <label className="flex items-center justify-between group cursor-pointer">
              <span className="text-sm font-medium text-slate-600">Auto-clear tables on payment</span>
              <div className="w-10 h-5 bg-indigo-600 rounded-full relative">
                <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full transition-all" />
              </div>
            </label>
            <label className="flex items-center justify-between group cursor-pointer">
              <span className="text-sm font-medium text-slate-600">Require seat selection</span>
              <div className="w-10 h-5 bg-slate-200 rounded-full relative">
                <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-all" />
              </div>
            </label>
            <label className="flex items-center justify-between group cursor-pointer">
              <span className="text-sm font-medium text-slate-600">Print order on fire</span>
              <div className="w-10 h-5 bg-indigo-600 rounded-full relative">
                <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full transition-all" />
              </div>
            </label>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <LayoutGrid size={20} />
            </div>
            <h3 className="font-bold text-slate-800">Dining Sections</h3>
          </div>
          <div className="space-y-2">
            {diningSections.map(sec => (
              <div key={sec} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-xs font-bold text-slate-700">{sec}</span>
                <button
                  onClick={() => setDiningSections(prev => prev.filter(s => s !== sec))}
                  className="text-[10px] font-black text-slate-400 uppercase hover:text-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                const name = prompt("Enter new section name:");
                if (name && name.trim()) setDiningSections(prev => [...prev, name.trim()]);
              }}
              className="w-full py-2 mt-2 border-2 border-dashed border-slate-200 rounded-lg text-[10px] font-black text-slate-400 uppercase hover:border-indigo-300 hover:text-indigo-600 transition-all font-sans"
            >
              + Add New Section
            </button>
          </div>
        </div>
      </div>

      {/* Table Fees, Auto Gratuity & Service Charges */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <DollarSign size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Table Fees & Gratuity Policy</h3>
              <p className="text-xs text-slate-500">Configure auto gratuity rates, party size thresholds, and service fees for table checks</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono font-bold bg-slate-100 px-3 py-1 rounded-lg text-slate-700">
              Active Sales Tax: {effectiveTax.toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Automatic Gratuity Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-amber-600" />
              <h4 className="font-bold text-slate-800 text-sm">Automatic Gratuity (Large Parties)</h4>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={localTip.autoGratuityEnabled ?? true}
                onChange={e => handleUpdateTipConfig({ ...localTip, autoGratuityEnabled: e.target.checked })}
                className="h-5 w-5 text-amber-600 rounded border-slate-300 focus:ring-amber-500"
              />
              <span className="text-xs font-bold text-slate-700">Enabled</span>
            </label>
          </div>

          {(localTip.autoGratuityEnabled ?? true) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-amber-50/40 rounded-xl border border-amber-200/60">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Auto Gratuity Rate (%)</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    value={localTip.autoGratuityRate ?? 18}
                    onChange={e => handleUpdateTipConfig({ ...localTip, autoGratuityRate: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold font-mono text-slate-800 outline-none focus:border-amber-500"
                  />
                  <Percent size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Auto-Apply Party Size Threshold</label>
                <input
                  type="number"
                  min="1"
                  value={localTip.autoGratuityMinPartySize ?? 6}
                  onChange={e => handleUpdateTipConfig({ ...localTip, autoGratuityMinPartySize: parseInt(e.target.value) || 1 })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold font-mono text-slate-800 outline-none focus:border-amber-500"
                  placeholder="e.g. 6 guests"
                />
                <p className="text-[10px] text-slate-500 mt-1">Auto-selected on table order panel when guest count reaches or exceeds this number</p>
              </div>
            </div>
          )}
        </div>

        {/* Service Fee Section */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Tag size={16} className="text-indigo-600" />
              <h4 className="font-bold text-slate-800 text-sm">Service Charge / Fee</h4>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={localTip.serviceFeeEnabled ?? true}
                onChange={e => handleUpdateTipConfig({ ...localTip, serviceFeeEnabled: e.target.checked })}
                className="h-5 w-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
              />
              <span className="text-xs font-bold text-slate-700">Enabled</span>
            </label>
          </div>

          {(localTip.serviceFeeEnabled ?? true) && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-indigo-50/40 rounded-xl border border-indigo-200/60">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Fee Label / Name</label>
                <input
                  type="text"
                  value={localTip.serviceFeeName ?? 'Service Fee'}
                  onChange={e => handleUpdateTipConfig({ ...localTip, serviceFeeName: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-indigo-500"
                  placeholder="e.g. Service Fee"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Calculation Type</label>
                <select
                  value={localTip.serviceFeeType ?? 'Percentage'}
                  onChange={e => handleUpdateTipConfig({ ...localTip, serviceFeeType: e.target.value as 'Percentage' | 'Fixed' })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-indigo-500"
                >
                  <option value="Percentage">Percentage (%)</option>
                  <option value="Fixed">Fixed Amount ($)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Fee Value</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={localTip.serviceFeeValue ?? 3.5}
                    onChange={e => handleUpdateTipConfig({ ...localTip, serviceFeeValue: parseFloat(e.target.value) || 0 })}
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
      </div>

      {/* Visual Designer Banner */}
      <div className="bg-indigo-900 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-black mb-2 uppercase tracking-tight">Byte Dining Visual Designer</h3>
            <p className="text-indigo-100 text-sm max-w-md font-medium">
              Update your restaurant layout, add tables, or rearrange your floor plan in real-time.
            </p>
          </div>
          <button 
            onClick={() => onNavigate && onNavigate('Floor Plan Designer')}
            className="px-8 py-4 bg-white text-indigo-900 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-slate-100 transition-all active:scale-95 shrink-0"
          >
            Launch Designer
          </button>
        </div>
        <LayoutGrid size={200} className="absolute -bottom-20 -right-20 text-white/5 rotate-12" />
      </div>
    </div>
  );
};

