import React, { useState } from 'react';
import { CreditCard, Receipt, ShieldCheck, AlertCircle } from 'lucide-react';

interface EditorProps {
  categoryId: string;
  selectedPageId: string | null;
  onFieldChange: () => void;
}

export const PaymentsAndTaxesEditor: React.FC<EditorProps> = ({
  categoryId,
  selectedPageId,
  onFieldChange
}) => {
  const [taxInclusive, setTaxInclusive] = useState(false);
  const [autoGratPartySize, setAutoGratPartySize] = useState(6);
  const [autoGratPercent, setAutoGratPercent] = useState(18);

  if (categoryId === 'payments_fraud') {
    return (
      <div className="space-y-6">
        <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
            <ShieldCheck size={16} className="text-amber-600" />
            <span>Merchant Provider Capability Safeguard</span>
          </div>
          <p className="text-xs text-amber-900 leading-relaxed font-medium">
            Only show capabilities supported by the connected payment provider. Settings must not imply that your app can independently enable unsupported payment operations.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-indigo-600 font-bold">
            <CreditCard size={18} />
            <h3 className="text-sm uppercase tracking-wider text-slate-800">9. Connected Merchant Gateway Status</h3>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
            <div>
              <span className="font-bold text-xs text-slate-800">Stripe Terminal / Connect Account</span>
              <span className="block text-[10px] font-semibold text-emerald-600">Connected & Verified (Live Mode)</span>
            </div>
            <span className="text-xs font-mono font-bold bg-white px-2.5 py-1 rounded border border-slate-200 text-slate-600">acct_1M9x22Live</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Card Reader Pre-Authorization Limit</label>
              <input
                type="text"
                defaultValue="$50.00 Standard Bar Tab Hold"
                onChange={onFieldChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Offline Payments Queue Limit</label>
              <input
                type="text"
                defaultValue="$500.00 Max Offline Transaction"
                onChange={onFieldChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-indigo-50/70 border border-indigo-200 p-5 rounded-2xl space-y-3">
        <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs">
          <Receipt size={16} className="text-indigo-600" />
          <span>Explicit Calculation Rules & Service Charges</span>
        </div>
        <p className="text-xs text-indigo-950 leading-relaxed font-medium">
          Make each charge's application and calculation rules explicit. Square also distinguishes fixed/percentage service charges and application settings. Tax, surcharge, gratuity, and tip settings need to reflect applicable rules and provider capabilities; they should not ship with assumed universal legal defaults.
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-indigo-600 font-bold">
          <Receipt size={18} />
          <h3 className="text-sm uppercase tracking-wider text-slate-800">10. Tax Rates & Automatic Gratuity Thresholds</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Automatic Gratuity Party Threshold</label>
            <select
              value={autoGratPartySize}
              onChange={(e) => { setAutoGratPartySize(Number(e.target.value)); onFieldChange(); }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
            >
              <option value={6}>Parties of 6 or more guests</option>
              <option value={8}>Parties of 8 or more guests</option>
              <option value={0}>Disabled</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Auto Gratuity Percentage</label>
            <input
              type="number"
              value={autoGratPercent}
              onChange={(e) => { setAutoGratPercent(Number(e.target.value)); onFieldChange(); }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
            />
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
          <input
            type="checkbox"
            id="taxInc"
            checked={taxInclusive}
            onChange={(e) => { setTaxInclusive(e.target.checked); onFieldChange(); }}
            className="rounded text-indigo-600"
          />
          <label htmlFor="taxInc" className="text-xs font-bold text-slate-800">
            Calculate sales taxes as Inclusive in item prices (e.g., European / Liquor tax compliance)
          </label>
        </div>
      </div>
    </div>
  );
};
