import React, { useState } from 'react';
import { Users, Shield, Lock, AlertTriangle, Clock, Calendar, CheckSquare } from 'lucide-react';

interface EditorProps {
  categoryId: string;
  selectedPageId: string | null;
  onFieldChange: () => void;
}

export const EmployeesAndLaborEditor: React.FC<EditorProps> = ({
  categoryId,
  selectedPageId,
  onFieldChange
}) => {
  const [separateJobRoles, setSeparateJobRoles] = useState(true);
  const [preserveOriginalTimecards, setPreserveOriginalTimecards] = useState(true);
  const [failedAttemptsLimit, setFailedAttemptsLimit] = useState(3);
  const [inactivityLockSeconds, setInactivityLockSeconds] = useState(60);

  if (categoryId === 'employees_permissions') {
    return (
      <div className="space-y-6">
        <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
            <AlertTriangle size={16} className="text-amber-600" />
            <span>Security Principle: Jobs, Roles & Permission Separation</span>
          </div>
          <p className="text-xs text-amber-900 leading-relaxed font-medium">
            Keep jobs, roles, and wages separate. Changing someone's job assignment must not silently grant administrative access.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="sepJobRoles"
              checked={separateJobRoles}
              onChange={(e) => { setSeparateJobRoles(e.target.checked); onFieldChange(); }}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="sepJobRoles" className="text-xs font-bold text-slate-800">
              Strictly enforce job-role separation (Job assignment only dictates pay rate & section, not admin permissions)
            </label>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-indigo-600 font-bold">
            <Shield size={18} />
            <h3 className="text-sm uppercase tracking-wider text-slate-800">Terminal Security & Login Safeguards</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">POS Inactivity Auto-Lock (Seconds)</label>
              <select
                value={inactivityLockSeconds}
                onChange={(e) => { setInactivityLockSeconds(Number(e.target.value)); onFieldChange(); }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
              >
                <option value={30}>30 Seconds (Strict)</option>
                <option value={60}>60 Seconds (Standard Bar / Floor)</option>
                <option value={120}>120 Seconds</option>
                <option value={0}>Disabled (Kitchen KDS Only)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Failed PIN Attempt Lockout Limit</label>
              <select
                value={failedAttemptsLimit}
                onChange={(e) => { setFailedAttemptsLimit(Number(e.target.value)); onFieldChange(); }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
              >
                <option value={3}>3 Failed PIN Attempts</option>
                <option value={5}>5 Failed PIN Attempts</option>
              </select>
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
          <Clock size={16} className="text-indigo-600" />
          <span>Compliance Rule: Timecard Preservation & Audit Trail</span>
        </div>
        <p className="text-xs text-indigo-950 leading-relaxed font-medium">
          Do not silently change recorded work time to match a schedule. Corrections should preserve the original entry and approval history.
        </p>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="presTimecards"
            checked={preserveOriginalTimecards}
            onChange={(e) => { setPreserveOriginalTimecards(e.target.checked); onFieldChange(); }}
            className="rounded text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="presTimecards" className="text-xs font-bold text-slate-900">
            Enforce immutable original timecard stamps with full edit history & supervisor sign-off requirements
          </label>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-indigo-600 font-bold">
          <Calendar size={18} />
          <h3 className="text-sm uppercase tracking-wider text-slate-800">Clock-In & Attendance Rules</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Early Clock-in Threshold (Minutes)</label>
            <input
              type="number"
              defaultValue={10}
              onChange={onFieldChange}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Late Clock-in Manager Alert Threshold (Minutes)</label>
            <input
              type="number"
              defaultValue={15}
              onChange={onFieldChange}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
