import React, { useState, useEffect } from 'react';
import { Percent, CheckCircle2, Plus, Trash2, Tag, ShieldCheck, Info } from 'lucide-react';
import { GlobalTaxConfig, AdditionalTaxRate, getEffectiveTaxRate } from '../../../types';

interface TaxesSubProps {
  renderSectionHeader: (title: string, description: string, parentSection?: string) => React.ReactNode;
  taxConfig?: GlobalTaxConfig;
  setTaxConfig?: React.Dispatch<React.SetStateAction<GlobalTaxConfig>>;
}

export const TaxesSub: React.FC<TaxesSubProps> = ({
  renderSectionHeader,
  taxConfig,
  setTaxConfig
}) => {
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const [localTax, setLocalTax] = useState<GlobalTaxConfig>(
    taxConfig || { rate: 8.875, name: 'State & Local Sales Tax', enabled: true, includeInPrice: false, additionalTaxes: [] }
  );

  useEffect(() => {
    if (taxConfig) {
      setLocalTax(taxConfig);
    }
  }, [taxConfig]);

  const updateTaxState = (updated: GlobalTaxConfig) => {
    setLocalTax(updated);
    if (setTaxConfig) {
      setTaxConfig(updated);
    }
  };

  const triggerSaveToast = (msg: string) => {
    setSavedMessage(msg);
    setTimeout(() => setSavedMessage(null), 3000);
  };

  const handleAddAdditionalTax = () => {
    const newTax: AdditionalTaxRate = {
      id: `tax-${Date.now()}`,
      name: 'City / Hospitality Tax',
      rate: 2.5,
      enabled: true
    };
    const updated = {
      ...localTax,
      additionalTaxes: [...(localTax.additionalTaxes || []), newTax]
    };
    updateTaxState(updated);
    triggerSaveToast("Added new additional tax rate");
  };

  const handleUpdateAdditionalTax = (id: string, fields: Partial<AdditionalTaxRate>) => {
    const updatedTaxes = (localTax.additionalTaxes || []).map(t =>
      t.id === id ? { ...t, ...fields } : t
    );
    const updated = { ...localTax, additionalTaxes: updatedTaxes };
    updateTaxState(updated);
  };

  const handleRemoveAdditionalTax = (id: string) => {
    const updatedTaxes = (localTax.additionalTaxes || []).filter(t => t.id !== id);
    const updated = { ...localTax, additionalTaxes: updatedTaxes };
    updateTaxState(updated);
    triggerSaveToast("Removed tax rate");
  };

  const handleSaveTax = () => {
    updateTaxState(localTax);
    triggerSaveToast("Tax configuration saved & applied live to all invoices!");
  };

  const effectiveRate = getEffectiveTaxRate(localTax);

  return (
    <div className="max-w-4xl animate-fade-in pb-20 space-y-8">
      {renderSectionHeader("Taxes & Sales Charges", "Configure sales tax rates, additional taxes, and fee inclusions applied to all invoices and receipts.", "Business operations")}
      
      {savedMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 text-sm font-bold animate-fade-in">
          <CheckCircle2 size={18} /> {savedMessage}
        </div>
      )}

      <div className="p-4 bg-indigo-50/80 border border-indigo-200 text-indigo-900 rounded-2xl flex items-start gap-3 text-xs font-semibold">
        <Info size={18} className="text-indigo-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-sm block text-indigo-950 mb-0.5">Live Tax Calculation Enabled</span>
          Tax rate changes apply immediately to all active invoices, POS registers, and dining receipts.
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-6">
        <div className="flex items-center justify-between p-4 bg-slate-900 text-white rounded-2xl">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-emerald-400" size={20} />
            <div>
              <h4 className="font-bold text-sm">Combined Active Tax Rate</h4>
              <p className="text-xs text-slate-400 font-medium">Applied to taxable order subtotals</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black font-mono text-emerald-400">{effectiveRate.toFixed(3)}%</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Primary Tax Name</label>
            <input
              type="text"
              value={localTax.name}
              onChange={e => updateTaxState({ ...localTax, name: e.target.value })}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm font-bold bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Primary Tax Rate (%)</label>
            <div className="relative">
              <input
                type="number"
                step="0.001"
                value={localTax.rate}
                onChange={e => updateTaxState({ ...localTax, rate: parseFloat(e.target.value) || 0 })}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm font-bold font-mono bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <Percent size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Tag size={16} className="text-indigo-600" /> Additional Tax Rates
              </h4>
              <p className="text-xs text-slate-500">Add local, hospitality, alcohol, or municipal tax rates</p>
            </div>
            <button
              type="button"
              onClick={handleAddAdditionalTax}
              className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors border border-indigo-200"
            >
              <Plus size={14} /> Add Tax Rate
            </button>
          </div>

          {(!localTax.additionalTaxes || localTax.additionalTaxes.length === 0) ? (
            <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-500">
              No additional tax rates configured. Click "Add Tax Rate" to add secondary tax tiers.
            </div>
          ) : (
            <div className="space-y-3">
              {localTax.additionalTaxes.map((addTax) => (
                <div key={addTax.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center gap-3">
                  <input
                    type="text"
                    placeholder="Tax Name (e.g. City Tax)"
                    value={addTax.name}
                    onChange={e => handleUpdateAdditionalTax(addTax.id, { name: e.target.value })}
                    className="flex-1 w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-indigo-500"
                  />
                  <div className="relative w-full sm:w-32">
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Rate %"
                      value={addTax.rate}
                      onChange={e => handleUpdateAdditionalTax(addTax.id, { rate: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold font-mono text-slate-800 outline-none focus:border-indigo-500"
                    />
                    <Percent size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={addTax.enabled}
                      onChange={e => handleUpdateAdditionalTax(addTax.id, { enabled: e.target.checked })}
                      className="h-4 w-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                    />
                    <span className="text-xs font-bold text-slate-600">Active</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => handleRemoveAdditionalTax(addTax.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                    title="Delete tax rate"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-100">
          <label className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
            <div>
              <span className="text-sm font-bold text-slate-800 block">Enable Automated Tax Calculation</span>
              <span className="text-xs text-slate-500 font-medium">Apply configured tax rates automatically on invoices and checkouts</span>
            </div>
            <input
              type="checkbox"
              checked={localTax.enabled}
              onChange={e => updateTaxState({ ...localTax, enabled: e.target.checked })}
              className="h-5 w-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
            />
          </label>

          <label className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
            <div>
              <span className="text-sm font-bold text-slate-800 block">Include Tax in Displayed Item Prices</span>
              <span className="text-xs text-slate-500 font-medium">Prices listed on menu already reflect sales tax (VAT style)</span>
            </div>
            <input
              type="checkbox"
              checked={localTax.includeInPrice}
              onChange={e => updateTaxState({ ...localTax, includeInPrice: e.target.checked })}
              className="h-5 w-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
            />
          </label>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            onClick={handleSaveTax}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-md transition-all"
          >
            Save Tax Settings
          </button>
        </div>
      </div>
    </div>
  );
};
