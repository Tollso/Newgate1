import React, { useState } from 'react';
import { Landmark, ShieldAlert, Key, RefreshCw, Lock } from 'lucide-react';

interface EditorProps {
  categoryId: string;
  selectedPageId: string | null;
  onFieldChange: () => void;
}

export const BankingAndIntegrationsEditor: React.FC<EditorProps> = ({
  categoryId,
  selectedPageId,
  onFieldChange
}) => {
  const [bankAccountMask, setBankAccountMask] = useState('Chase Bank (•••• 8829)');
  const [requireReAuth, setRequireReAuth] = useState(true);

  if (categoryId === 'banking_billing') {
    return (
      <div className="space-y-6">
        <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
            <Landmark size={16} className="text-amber-600" />
            <span>Official Merchant Statements & Provider Tax Verification</span>
          </div>
          <p className="text-xs text-amber-900 leading-relaxed font-medium">
            Provider-issued statements and tax documents should be retrieved or linked from the provider, not fabricated by your app.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-indigo-600 font-bold">
            <Landmark size={18} />
            <h3 className="text-sm uppercase tracking-wider text-slate-800">19. Linked Merchant Payout Account</h3>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
            <div>
              <span className="font-bold text-xs text-slate-800">{bankAccountMask}</span>
              <span className="block text-[10px] font-semibold text-emerald-600">ACH Deposit Verified • Daily Payouts Active</span>
            </div>
            <button className="px-3 py-1.5 bg-slate-200 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-300">
              Update Bank Details
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-rose-50 border border-rose-200 p-5 rounded-2xl space-y-2">
        <div className="flex items-center gap-2 text-rose-900 font-bold text-xs">
          <Lock size={16} className="text-rose-600" />
          <span>Security Protocol: Sensitive Changes Protection</span>
        </div>
        <p className="text-xs text-rose-900 leading-relaxed font-medium">
          Sensitive changes: Require fresh authentication for banking, credentials, and access administration.
        </p>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="reAuth"
            checked={requireReAuth}
            onChange={(e) => { setRequireReAuth(e.target.checked); onFieldChange(); }}
            className="rounded text-rose-600 focus:ring-rose-500"
          />
          <label htmlFor="reAuth" className="text-xs font-bold text-slate-900">
            Require fresh PIN / password re-authentication before saving API credentials or bank account modifications
          </label>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-indigo-600 font-bold">
          <Key size={18} />
          <h3 className="text-sm uppercase tracking-wider text-slate-800">20. API Keys, Webhooks & Draft Publishing Rollback</h3>
        </div>

        <div className="flex gap-3 text-xs font-bold">
          <button className="px-3 py-2 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-xl flex items-center gap-1.5 hover:bg-indigo-100">
            <RefreshCw size={14} />
            <span>Generate New API Key</span>
          </button>
          <button className="px-3 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200">
            Configuration Rollback & History
          </button>
        </div>
      </div>
    </div>
  );
};
