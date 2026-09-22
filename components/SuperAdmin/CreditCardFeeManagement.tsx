/**
 * CreditCardFeeManagement
 * Authority Rule: ONLY Newgate Super Admin can configure or toggle Credit Card Fee policy.
 * Implements Section 7.3 of the Newgate Platform Architecture.
 */

import React, { useState, useEffect } from 'react';
import { CreditCard, AlertTriangle, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';
import { ChargesEngine, CreditCardFeeConfig } from '../../services/chargesEngine';
import { UserRole } from '../../types/business';

interface CreditCardFeeManagementProps {
  currentUserRole: string;
  currentUserId: string;
  merchantId?: string;
}

export const CreditCardFeeManagement: React.FC<CreditCardFeeManagementProps> = ({
  currentUserRole,
  currentUserId,
  merchantId = 'M001',
}) => {
  const isSuperAdmin = currentUserRole === UserRole.SUPER_ADMIN || currentUserRole === 'SUPER_ADMIN';

  const [config, setConfig] = useState<CreditCardFeeConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Editable form state
  const [enabled, setEnabled] = useState(false);
  const [ratePercentage, setRatePercentage] = useState(2.75);
  const [fixedAmountDollars, setFixedAmountDollars] = useState(0.15);
  const [labelOnReceipt, setLabelOnReceipt] = useState('Card Processing Surcharge');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadConfig();
  }, [merchantId]);

  const loadConfig = async () => {
    setLoading(true);
    try {
      const res = await ChargesEngine.getCreditCardFeeConfig(merchantId);
      setConfig(res);
      setEnabled(res.enabled);
      setRatePercentage(res.ratePercentage);
      setFixedAmountDollars(res.fixedAmountDollars);
      setLabelOnReceipt(res.labelOnReceipt);
      setNotes(res.notes || '');
    } catch (e: any) {
      setErrorMessage(e.message || 'Failed to load Credit Card Fee config');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!isSuperAdmin) {
      setErrorMessage('AUTHORITY VIOLATION: Only Newgate Super Admin has authority to configure Credit Card Fee policy.');
      return;
    }

    setSaving(true);
    setErrorMessage('');
    setSavedSuccess(false);

    try {
      const updated = await ChargesEngine.setCreditCardFeeConfig(
        {
          merchantId,
          enabled,
          ratePercentage: Number(ratePercentage),
          fixedAmountDollars: Number(fixedAmountDollars),
          labelOnReceipt,
          notes,
          lastUpdatedBySuperAdminId: currentUserId,
          lastUpdatedDate: new Date().toISOString(),
          reviewStatus: 'APPROVED',
        },
        currentUserRole,
        currentUserId
      );

      setConfig(updated);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-slate-500">Loading Credit Card Fee configuration...</div>;
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg">
            <CreditCard size={22} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              Credit Card Fee Policy
              <span className="text-xs bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Lock size={12} /> Super Admin Authority Only
              </span>
            </h3>
            <p className="text-sm text-slate-500">
              Control merchant-level credit card surcharge rates and legal disclosures.
            </p>
          </div>
        </div>

        {isSuperAdmin ? (
          <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full flex items-center gap-1">
            <ShieldCheck size={14} /> Authorized: Super Admin
          </span>
        ) : (
          <span className="text-xs font-semibold px-2.5 py-1 bg-rose-50 text-rose-700 rounded-full flex items-center gap-1">
            <Lock size={14} /> Locked for Merchant Admins
          </span>
        )}
      </div>

      {errorMessage && (
        <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-sm flex items-center gap-2">
          <AlertTriangle size={16} />
          {errorMessage}
        </div>
      )}

      {savedSuccess && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-sm flex items-center gap-2">
          <CheckCircle2 size={16} />
          Credit card fee policy successfully updated and logged to audit trail.
        </div>
      )}

      {/* Jurisdiction Compliance Warning Box */}
      <div className="mb-6 p-4 bg-amber-50/80 border border-amber-200 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={18} />
          <div className="text-xs text-amber-900 space-y-1">
            <p className="font-bold">Legal Jurisdiction Compliance Warning</p>
            <p>
              Credit card surcharging is subject to payment network rules and state laws. Surcharging must not exceed the actual cost of card acceptance (typically capped at 3.0% - 3.5%).
            </p>
            <p className="text-amber-800 font-medium">
              * Split tender rule: Cash and gift card tenders will NOT inherit this fee.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
          <div>
            <span className="font-semibold text-slate-800 block text-sm">Enable Credit Card Surcharge</span>
            <span className="text-xs text-slate-500">Automatically append fee when card payment tender is selected</span>
          </div>
          <input
            type="checkbox"
            checked={enabled}
            disabled={!isSuperAdmin}
            onChange={(e) => setEnabled(e.target.checked)}
            className="w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 disabled:opacity-50"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Surcharge Rate (%)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.05"
                min="0"
                max="4.0"
                disabled={!isSuperAdmin || !enabled}
                value={ratePercentage}
                onChange={(e) => setRatePercentage(parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100 disabled:text-slate-400"
              />
              <span className="absolute right-3 top-2 text-slate-400 text-sm">%</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Standard range: 2.50% - 3.50%</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Fixed Transaction Surcharge ($)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0"
                max="1.0"
                disabled={!isSuperAdmin || !enabled}
                value={fixedAmountDollars}
                onChange={(e) => setFixedAmountDollars(parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100 disabled:text-slate-400"
              />
              <span className="absolute right-3 top-2 text-slate-400 text-sm">$</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Optional fixed component per swipe/tap</p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Receipt & Invoice Line Label
          </label>
          <input
            type="text"
            disabled={!isSuperAdmin || !enabled}
            value={labelOnReceipt}
            onChange={(e) => setLabelOnReceipt(e.target.value)}
            placeholder="e.g. Card Processing Fee"
            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100 disabled:text-slate-400"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Compliance & Review Audit Notes
          </label>
          <textarea
            rows={2}
            disabled={!isSuperAdmin}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Super Admin review notes, approval reference, or legal disclosure confirmation..."
            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100 disabled:text-slate-400"
          />
        </div>

        {config?.lastUpdatedDate && (
          <div className="text-xs text-slate-500 pt-2 border-t border-slate-100 flex justify-between">
            <span>Last reviewed: {new Date(config.lastUpdatedDate).toLocaleString()}</span>
            <span>Reviewed by: {config.lastUpdatedBySuperAdminId}</span>
          </div>
        )}

        {isSuperAdmin ? (
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-lg text-sm transition-colors shadow-sm disabled:opacity-50"
          >
            {saving ? 'Saving Policy...' : 'Save & Enforce Credit Card Fee Policy'}
          </button>
        ) : (
          <div className="p-3 bg-slate-100 text-slate-600 rounded-lg text-xs text-center font-medium">
            Contact your Newgate Super Admin platform team to request Credit Card Fee modifications.
          </div>
        )}
      </div>
    </div>
  );
};
