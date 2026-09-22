import React, { useState } from 'react';
import { X, Shield, Search, Check, AlertTriangle, Ban, Info } from 'lucide-react';
import { ALL_PERMISSION_CATEGORIES, getLinkedPosOptionId, getPosOptionName } from './permissionCatalog';
import { EmployeeOverride, EmployeePermissionSetting, PermissionScope, RolePermissionMatrixState } from './types';
import { Employee, Role } from '../../../types';
import { getDefaultRolePermissionState } from './permissionDefaults';

interface EmployeePermissionOverridesModalProps {
  show: boolean;
  onClose: () => void;
  employees: Employee[];
  roles: Role[];
  overrides: EmployeeOverride[];
  onSaveOverride: (override: EmployeeOverride) => void;
  matrix?: RolePermissionMatrixState;
}

export const EmployeePermissionOverridesModal: React.FC<EmployeePermissionOverridesModalProps> = ({
  show,
  onClose,
  employees,
  roles,
  overrides,
  onSaveOverride,
  matrix,
}) => {
  const [selectedEmpId, setSelectedEmpId] = useState<string>(employees[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  if (!show) return null;

  const currentEmployee = employees.find((e) => e.id === selectedEmpId) || employees[0];

  const getEmpOverride = (permId: string): EmployeeOverride => {
    const found = overrides.find((o) => o.employeeId === selectedEmpId && o.permissionId === permId);
    return (
      found || {
        employeeId: selectedEmpId,
        permissionId: permId,
        setting: 'INHERIT',
        scope: 'ENTIRE_LOCATION',
        dollarLimit: undefined,
        percentLimit: undefined,
        maxDaysLimit: undefined,
      }
    );
  };

  const handleUpdate = (permId: string, updates: Partial<EmployeeOverride>) => {
    const existing = getEmpOverride(permId);
    const updated: EmployeeOverride = { ...existing, ...updates, employeeId: selectedEmpId, permissionId: permId };
    onSaveOverride(updated);
  };

  const filteredCategories = ALL_PERMISSION_CATEGORIES.map((cat) => {
    if (selectedCategory !== 'ALL' && cat.id !== selectedCategory) return null;
    const permissions = cat.permissions.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (permissions.length === 0) return null;
    return { ...cat, permissions };
  }).filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div>
            <h3 className="font-extrabold text-base text-slate-800 flex items-center gap-2">
              <Shield size={18} className="text-indigo-600" /> Employee-Specific Permission Overrides
            </h3>
            <p className="text-xs text-slate-500">Override role-based permissions and configure custom scopes or dollar caps.</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl font-bold">
            <X size={20} />
          </button>
        </div>

        {/* Filters and Employee Selector */}
        <div className="p-4 bg-slate-100/70 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-[260px]">
            <label className="text-xs font-bold text-slate-700 whitespace-nowrap">Target Employee:</label>
            <select
              value={selectedEmpId}
              onChange={(e) => setSelectedEmpId(e.target.value)}
              className="flex-1 text-xs font-bold border border-slate-300 rounded-xl px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {employees.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name} — ({e.role})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 flex-1 min-w-[260px]">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter permissions..."
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-xl bg-white outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs border border-slate-300 rounded-xl px-2 py-1.5 bg-white font-medium text-slate-700 outline-none"
            >
              <option value="ALL">All Sections ({ALL_PERMISSION_CATEGORIES.length})</option>
              {ALL_PERMISSION_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.number}. {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Content Table */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {filteredCategories.map((cat) =>
            cat ? (
              <div key={cat.id} className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
                <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex justify-between items-center">
                  <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[9px]">
                      {cat.number}
                    </span>
                    {cat.name}
                  </h4>
                </div>
                <div className="divide-y divide-slate-100">
                  {cat.permissions.map((perm) => {
                    const ovr = getEmpOverride(perm.id);

                    const empRoleObj = roles.find(
                      (r) =>
                        r.name.toLowerCase() === currentEmployee?.role?.toLowerCase() ||
                        r.id === currentEmployee?.role
                    );
                    const roleId = empRoleObj?.id || 'R-SERVER';
                    const activeMatrix = matrix || getDefaultRolePermissionState();

                    const posOptionId = getLinkedPosOptionId(perm.id);
                    let isPosEnabled = true;
                    let posOptionName = '';

                    if (posOptionId) {
                      posOptionName = getPosOptionName(posOptionId);
                      const posOvr = overrides.find(
                        (o) => o.employeeId === selectedEmpId && o.permissionId === posOptionId
                      );
                      if (posOvr) {
                        if (posOvr.setting === 'ALLOW') {
                          isPosEnabled = true;
                        } else if (posOvr.setting === 'DENY') {
                          isPosEnabled = false;
                        } else {
                          isPosEnabled = activeMatrix[roleId]?.[posOptionId] === 'ALLOW';
                        }
                      } else {
                        isPosEnabled = activeMatrix[roleId]?.[posOptionId] === 'ALLOW';
                      }
                    }

                    return (
                      <div key={perm.id} className={`p-4 hover:bg-slate-50/70 transition-colors flex flex-col gap-2 ${!isPosEnabled ? 'bg-amber-50/10 border-l-4 border-amber-500/50 pl-3' : ''}`}>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="max-w-md">
                            <span className="font-bold text-slate-900 text-xs flex flex-wrap items-center gap-1.5">
                              {perm.name}
                              {posOptionId && (
                                <span className={`inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded border ${
                                  isPosEnabled
                                    ? 'bg-slate-50 text-slate-500 border-slate-200'
                                    : 'bg-amber-50 text-amber-700 border-amber-200 font-bold animate-pulse'
                                }`} title={`Linked to POS Access: ${posOptionName}`}>
                                  🔗 {posOptionName}
                                </span>
                              )}
                            </span>
                            <span className="text-[11px] text-slate-500 block mt-0.5">{perm.description}</span>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 shrink-0">
                            {/* Setting Selector with ON/OFF Toggle */}
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">Override:</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const isOn = ovr.setting === 'ALLOW';
                                  handleUpdate(perm.id, { setting: isOn ? 'DENY' : 'ALLOW' });
                                }}
                                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                                  ovr.setting === 'ALLOW'
                                    ? 'bg-emerald-500'
                                    : ovr.setting === 'INHERIT'
                                    ? 'bg-slate-400'
                                    : 'bg-slate-300'
                                }`}
                              >
                                <span
                                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                                    ovr.setting === 'ALLOW' ? 'translate-x-4' : 'translate-x-0'
                                  }`}
                                />
                              </button>
                              <select
                                value={ovr.setting}
                                onChange={(e) => handleUpdate(perm.id, { setting: e.target.value as EmployeePermissionSetting })}
                                className={`text-xs font-bold rounded-xl px-2 py-1 border outline-none cursor-pointer ${
                                  ovr.setting === 'INHERIT'
                                    ? 'bg-slate-100 text-slate-700 border-slate-300'
                                    : ovr.setting === 'ALLOW'
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                    : 'bg-rose-50 text-rose-800 border-rose-300'
                                }`}
                              >
                                <option value="INHERIT">Inherit from Role</option>
                                <option value="ALLOW">ON</option>
                                <option value="DENY">OFF</option>
                              </select>
                            </div>

                            {/* Scope Selector */}
                            {perm.hasScope && (
                              <div className="flex items-center gap-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase">Scope:</label>
                                <select
                                  value={ovr.scope || 'ENTIRE_LOCATION'}
                                  onChange={(e) => handleUpdate(perm.id, { scope: e.target.value as PermissionScope })}
                                  className="text-xs border border-slate-300 rounded-xl px-2 py-1 bg-white"
                                >
                                  <option value="OWN_RECORDS">Own Records Only</option>
                                  <option value="ASSIGNED_SECTION">Assigned Section</option>
                                  <option value="ENTIRE_LOCATION">Entire Location</option>
                                </select>
                              </div>
                            )}

                            {/* Dollar Limit Input */}
                            {perm.hasDollarLimit && (
                              <div className="flex items-center gap-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase">Limit ($):</label>
                                <input
                                  type="number"
                                  value={ovr.dollarLimit ?? ''}
                                  onChange={(e) => handleUpdate(perm.id, { dollarLimit: e.target.value ? parseFloat(e.target.value) : undefined })}
                                  placeholder="No limit"
                                  className="w-20 text-xs border border-slate-300 rounded-xl px-2 py-1 bg-white"
                                />
                              </div>
                            )}

                            {/* Percent Limit Input */}
                            {perm.hasPercentLimit && (
                              <div className="flex items-center gap-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase">Limit (%):</label>
                                <input
                                  type="number"
                                  value={ovr.percentLimit ?? ''}
                                  onChange={(e) => handleUpdate(perm.id, { percentLimit: e.target.value ? parseFloat(e.target.value) : undefined })}
                                  placeholder="Max %"
                                  className="w-16 text-xs border border-slate-300 rounded-xl px-2 py-1 bg-white"
                                />
                              </div>
                            )}
                          </div>
                        </div>

                        {!isPosEnabled && posOptionId && (
                          <div className="flex items-center gap-2 text-[10px] text-amber-700 bg-amber-50 border border-amber-200/60 rounded-xl px-3 py-1.5 font-medium animate-fade-in max-w-2xl mt-1">
                            <AlertTriangle size={12} className="text-amber-500 shrink-0" />
                            <span>
                              Linked POS Access Option <strong>{posOptionName}</strong> is currently turned OFF for this employee. This permission will not take effect.
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                handleUpdate(posOptionId, { setting: 'ALLOW' });
                              }}
                              className="ml-auto underline text-indigo-600 hover:text-indigo-800 font-bold text-[10px] cursor-pointer whitespace-nowrap"
                            >
                              Enable POS Option Now
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-md transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
