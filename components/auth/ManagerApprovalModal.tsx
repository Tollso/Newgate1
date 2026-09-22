/**
 * ManagerApprovalModal
 * System-wide Manager PIN Override & Approval Dialog (Section 5 & 10).
 * Validates manager credentials, enforces reason capture, and writes immutable records to AuditService.
 */

import React, { useState } from 'react';
import { ShieldAlert, Lock, CheckCircle2, X } from 'lucide-react';
import { PermissionService } from '../../services/permissionService';
import { AuditService } from '../../services/auditService';
import { Employee } from '../../types/business';

interface ManagerApprovalModalProps {
  isOpen: boolean;
  actionTitle: string; // e.g., 'VOID_ITEM', 'DRAWER_NO_SALE', 'PRICE_OVERRIDE', 'RECEIPTLESS_RETURN'
  actionDescription?: string;
  currentUser: Employee;
  onApprove: (manager: { id: string; name: string; reason: string }) => void;
  onCancel: () => void;
}

const COMMON_REASONS: Record<string, string[]> = {
  VOID_ITEM: ['Guest Changed Mind', 'Item Spilled / Cold', 'Cashier Typo', 'Manager Discretion'],
  DRAWER_NO_SALE: ['Making Change for Customer', 'Auditing Till Float', 'Cash Drop to Safe'],
  RECEIPTLESS_RETURN: ['Store Credit Approved', 'Defective Product', 'Customer Goodwill'],
  PRICE_OVERRIDE: ['Competitor Price Match', 'Damaged Packaging', 'VIP Courtesy'],
  REFUND: ['Unsatisfied Customer', 'Duplicate Charge', 'Wrong Item Delivered'],
};

export const ManagerApprovalModal: React.FC<ManagerApprovalModalProps> = ({
  isOpen,
  actionTitle,
  actionDescription,
  currentUser,
  onApprove,
  onCancel,
}) => {
  const [pin, setPin] = useState('');
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isOpen) return null;

  const defaultReasons = COMMON_REASONS[actionTitle] || [
    'Manager Discretion',
    'Customer Satisfaction',
    'System Correction',
  ];

  const handleKeyClick = (val: string) => {
    setErrorMsg(null);
    if (pin.length < 6) {
      setPin(prev => prev + val);
    }
  };

  const handleBackspace = () => {
    setErrorMsg(null);
    setPin(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    setErrorMsg(null);
    setPin('');
  };

  const handleSubmit = async () => {
    if (!pin) {
      setErrorMsg('Please enter manager PIN');
      return;
    }
    const reasonText = customReason.trim() || selectedReason || 'Manager Authorized';

    setIsVerifying(true);
    setErrorMsg(null);

    try {
      // Validate PIN using PermissionService
      const verifyResult = await PermissionService.verifyManagerPin(
        pin,
        actionTitle,
        {
          employeeId: currentUser.id,
          employeeName: currentUser.name,
          role: currentUser.role,
        },
        reasonText
      );

      if (!verifyResult.success || !verifyResult.manager) {
        setErrorMsg(verifyResult.error || 'Invalid manager PIN or insufficient permissions.');
        setPin('');
        setIsVerifying(false);
        return;
      }

      // Log directly to AuditService
      await AuditService.log({
        actorId: currentUser.id,
        actorName: currentUser.name,
        action: `MANAGER_APPROVAL_${actionTitle}`,
        targetType: 'MANAGER_OVERRIDE',
        approvalReason: reasonText,
        requiresApproval: true,
        approvedByManagerId: verifyResult.manager.id,
        approvedByManagerName: verifyResult.manager.name,
        status: 'EXECUTED',
      });

      onApprove({
        id: verifyResult.manager.id,
        name: verifyResult.manager.name,
        reason: reasonText,
      });
    } catch (e: any) {
      setErrorMsg(e.message || 'Authorization error occurred');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl">
              <ShieldAlert size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Manager Override Required</h3>
              <p className="text-xs text-slate-400 font-mono">{actionTitle.replace(/_/g, ' ')}</p>
            </div>
          </div>
          <button onClick={onCancel} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {actionDescription && (
            <p className="text-xs text-slate-300 bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              {actionDescription}
            </p>
          )}

          {/* Reason Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Select Reason
            </label>
            <div className="grid grid-cols-2 gap-2 mb-2">
              {defaultReasons.map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    setSelectedReason(r);
                    setCustomReason('');
                  }}
                  className={`px-3 py-2 text-xs font-semibold rounded-xl border text-left transition-colors truncate ${
                    selectedReason === r
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="Or type custom reason..."
              value={customReason}
              onChange={e => {
                setCustomReason(e.target.value);
                setSelectedReason('');
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
            />
          </div>

          {/* PIN Input Display */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 text-center">
              Enter Manager 4-Digit PIN
            </label>
            <div className="h-14 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center space-x-3">
              {[0, 1, 2, 3].map(i => (
                <div
                  key={i}
                  className={`w-3.5 h-3.5 rounded-full transition-all ${
                    pin.length > i ? 'bg-amber-400 scale-110 shadow-sm shadow-amber-400/50' : 'bg-slate-800'
                  }`}
                />
              ))}
            </div>
            {errorMsg && (
              <p className="text-xs text-rose-400 font-semibold text-center mt-2 animate-bounce">
                {errorMsg}
              </p>
            )}
          </div>

          {/* Touch Keypad */}
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <button
                key={num}
                type="button"
                onClick={() => handleKeyClick(num.toString())}
                className="h-12 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 rounded-xl font-mono text-lg font-bold text-white transition-colors"
              >
                {num}
              </button>
            ))}
            <button
              type="button"
              onClick={handleClear}
              className="h-12 bg-slate-800/60 hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-400 uppercase"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => handleKeyClick('0')}
              className="h-12 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 rounded-xl font-mono text-lg font-bold text-white transition-colors"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleBackspace}
              className="h-12 bg-slate-800/60 hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-400 uppercase"
            >
              Del
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isVerifying || pin.length < 4}
              className="flex-2 py-3 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-colors shadow-lg shadow-amber-600/30 flex items-center justify-center gap-2"
            >
              <Lock size={16} />
              {isVerifying ? 'Verifying PIN...' : 'Authorize Override'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
