import React, { useState } from 'react';
import { ShieldCheck, X, AlertCircle, KeyRound, Check } from 'lucide-react';
import { PermissionService, AuthorizationContext, ManagerApprovalResult } from '../../services/permissionService';

interface ManagerApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApproved: (result: ManagerApprovalResult) => void;
  actionTitle: string;
  actionKey: string;
  context: AuthorizationContext;
  details?: string;
  defaultReasons?: string[];
}

export const ManagerApprovalModal: React.FC<ManagerApprovalModalProps> = ({
  isOpen,
  onClose,
  onApproved,
  actionTitle,
  actionKey,
  context,
  details,
  defaultReasons = ['Customer Satisfaction', 'Manager Promotion', 'Order Mistake', 'VIP Guest', 'Damaged Item', 'Other'],
}) => {
  const [pin, setPin] = useState('');
  const [reason, setReason] = useState(defaultReasons[0]);
  const [customReason, setCustomReason] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleKeyPress = (num: string) => {
    if (pin.length < 6) {
      setPin(prev => prev + num);
      setError(null);
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
    setError(null);
  };

  const handleClear = () => {
    setPin('');
    setError(null);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!pin) {
      setError('Please enter manager PIN');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const finalReason = reason === 'Other' && customReason ? customReason : reason;
      const res = await PermissionService.verifyManagerPin(pin, actionKey, context, finalReason);

      if (res.approved) {
        onApproved(res);
        onClose();
      } else {
        setError('Invalid manager PIN or insufficient rights');
        setPin('');
      }
    } catch (err: any) {
      setError(err?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Manager Approval Required</h3>
              <p className="text-xs text-slate-400">Supervisor override required to proceed</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Action Info Box */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-start gap-2.5">
            <KeyRound size={18} className="text-indigo-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-bold text-slate-900">{actionTitle}</p>
              {details && <p className="text-xs text-slate-500 mt-0.5">{details}</p>}
            </div>
          </div>

          {/* Reason Selection */}
          <div className="mt-3">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
              Approval Reason
            </label>
            <select
              value={reason}
              onChange={e => setReason(e.target.value)}
              className="w-full text-xs font-semibold px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {defaultReasons.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            {reason === 'Other' && (
              <input
                type="text"
                placeholder="Enter custom reason..."
                value={customReason}
                onChange={e => setCustomReason(e.target.value)}
                className="mt-2 w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            )}
          </div>
        </div>

        {/* Keypad and PIN Entry */}
        <div className="p-6 flex flex-col items-center">
          {/* PIN dots display */}
          <div className="flex items-center justify-center gap-3 mb-4">
            {[0, 1, 2, 3].map(index => (
              <div
                key={index}
                className={`h-4 w-4 rounded-full border-2 transition-all ${
                  pin.length > index
                    ? 'bg-indigo-600 border-indigo-600 scale-110 shadow-xs'
                    : 'border-slate-300 bg-slate-100'
                }`}
              />
            ))}
          </div>

          {error && (
            <div className="flex items-center gap-1.5 text-xs text-rose-600 font-semibold mb-3 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200">
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}

          {/* Numeric keypad */}
          <div className="grid grid-cols-3 gap-2.5 w-full max-w-xs">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
              <button
                key={num}
                type="button"
                onClick={() => handleKeyPress(num)}
                className="h-12 text-lg font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-all active:scale-95 flex items-center justify-center shadow-2xs"
              >
                {num}
              </button>
            ))}
            <button
              type="button"
              onClick={handleClear}
              className="h-12 text-xs font-bold uppercase rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 transition-all active:scale-95 flex items-center justify-center"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => handleKeyPress('0')}
              className="h-12 text-lg font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-all active:scale-95 flex items-center justify-center shadow-2xs"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleBackspace}
              className="h-12 text-xs font-bold uppercase rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 transition-all active:scale-95 flex items-center justify-center"
            >
              Del
            </button>
          </div>

          {/* Actions */}
          <div className="mt-5 w-full flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleSubmit()}
              disabled={loading || pin.length < 4}
              className="flex-1 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
            >
              {loading ? (
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Check size={14} />
                  <span>Authorize</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
