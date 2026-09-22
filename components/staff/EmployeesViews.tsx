import React, { useState } from 'react';
import { Role, PermissionItem, RoleAssignmentRequest, PasscodeSettings, Employee } from '../../types';
import { Users, Settings, Plus, Trash2, Grid, Briefcase, XCircle, Check, Lock } from 'lucide-react';
import { MOCK_PERMISSION_GROUPS } from '../../constants';
import { RolePermissionMatrix } from './permissions/RolePermissionMatrix';
import { EmployeePermissionOverridesModal } from './permissions/EmployeePermissionOverridesModal';
import { getDefaultRolePermissionState } from './permissions/permissionDefaults';
import { RolePermissionAccess, RolePermissionMatrixState, EmployeeOverride } from './permissions/types';
import { MOCK_EMPLOYEES } from '../../src/mocks/mockBusinessData';

interface EmployeesViewsProps {
  viewMode: 'Employees' | 'Roles' | 'Matrix' | 'Assignments' | 'Security';
  roles: Role[];
  openRoleSettings: (role: Role) => void;
  permissionsByCategory: Record<string, PermissionItem[]>;
  matrixState: RolePermissionMatrixState;
  setMatrixState: React.Dispatch<React.SetStateAction<RolePermissionMatrixState>>;
  assignments: RoleAssignmentRequest[];
  handleAssignmentDecision: (id: string, status: 'Approved' | 'Denied') => void;
  passcodeSettings: PasscodeSettings;
  setPasscodeSettings: React.Dispatch<React.SetStateAction<PasscodeSettings>>;
  onAddRole?: (roleName: string, cloneFromRoleId?: string) => string | void;
  onDeleteRole?: (roleId: string) => void;
  employees?: Employee[];
}

export const EmployeesViews: React.FC<EmployeesViewsProps> = ({
  viewMode,
  roles = [],
  openRoleSettings,
  permissionsByCategory = {},
  matrixState,
  setMatrixState,
  assignments = [],
  handleAssignmentDecision,
  passcodeSettings,
  setPasscodeSettings,
  onAddRole,
  onDeleteRole,
  employees
}) => {
  if (viewMode === 'Roles') {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-6 py-4">Role Name</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Employees</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {roles.map(role => (
                <tr key={role.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900">{role.name}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded font-medium border ${role.type === 'Default' ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-indigo-50 text-indigo-700 border-indigo-200'}`}>
                      {role.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    <div className="flex items-center gap-2">
                      <Users size={16} /> {role.employeeCount || 0}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-sm">{role.description}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => openRoleSettings(role)}
                        className="px-3 py-1 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-700 font-medium"
                      >
                        Manage
                      </button>
                      {!role.isSystem && (
                        <button 
                          onClick={() => onDeleteRole && onDeleteRole(role.id)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded border border-transparent hover:border-red-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden p-6">
          <h3 className="font-bold text-lg text-slate-800 mb-4">Permission Groups</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MOCK_PERMISSION_GROUPS.map(group => (
              <div key={group.id} className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-slate-900">{group.name}</h4>
                  <Settings size={16} className="text-slate-400 cursor-pointer hover:text-indigo-600" />
                </div>
                <p className="text-sm text-slate-500 mb-3">{group.description}</p>
                <div className="flex gap-2 flex-wrap">
                  {(group.permissions || []).slice(0, 3).map(p => (
                    <span key={p} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200">
                      {p.replace('ACCESS_', '')}
                    </span>
                  ))}
                  {group.permissions && group.permissions.length > 3 && <span className="text-[10px] text-slate-400 px-1">+{group.permissions.length - 3} more</span>}
                </div>
              </div>
            ))}
            <button className="border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-colors">
              <Plus size={24} className="mb-1" />
              <span className="font-medium text-sm">Create Group</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const [overrides, setOverrides] = useState<EmployeeOverride[]>([]);
  const [showOverridesModal, setShowOverridesModal] = useState(false);

  React.useEffect(() => {
    setMatrixState(prev => {
      let hasChanges = false;
      const newState = { ...prev };
      
      Object.keys(newState).forEach(roleId => {
        if (!roles.find(r => r.id === roleId)) {
          delete newState[roleId];
          hasChanges = true;
        }
      });
      
      roles.forEach(r => {
        if (!newState[r.id]) {
          newState[r.id] = {};
          hasChanges = true;
        }
      });
      
      return hasChanges ? newState : prev;
    });
  }, [roles, setMatrixState]);

  const handleChangePermission = (roleId: string, permissionId: string, value: RolePermissionAccess) => {
    setMatrixState((prev) => ({
      ...prev,
      [roleId]: {
        ...(prev[roleId] || {}),
        [permissionId]: value,
      },
    }));
  };

  const handleSaveOverride = (override: EmployeeOverride) => {
    setOverrides((prev) => {
      const idx = prev.findIndex((o) => o.employeeId === override.employeeId && o.permissionId === override.permissionId);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = override;
        return updated;
      }
      return [...prev, override];
    });
  };

  if (viewMode === 'Matrix') {
    return (
      <>
        <RolePermissionMatrix
          roles={roles}
          matrix={matrixState}
          onChangePermission={handleChangePermission}
          onAddRole={onAddRole || (() => {})}
          onOpenEmployeeOverrides={() => setShowOverridesModal(true)}
        />
        <EmployeePermissionOverridesModal
          show={showOverridesModal}
          onClose={() => setShowOverridesModal(false)}
          employees={employees || MOCK_EMPLOYEES}
          roles={roles}
          overrides={overrides}
          onSaveOverride={handleSaveOverride}
          matrix={matrixState}
        />
      </>
    );
  }

  if (viewMode === 'Assignments') {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
              <Briefcase size={20} /> Pending Role Assignments
            </h3>
            <p className="text-sm text-slate-500">Approve or deny role changes requested by managers.</p>
          </div>
          <div className="divide-y divide-slate-100">
            {assignments.filter(a => a.status === 'Pending').length === 0 ? (
              <div className="p-12 text-center text-slate-500 italic">
                No pending assignment requests.
              </div>
            ) : (
              assignments.filter(a => a.status === 'Pending').map(req => (
                <div key={req.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex gap-4 items-center">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                      {req.employeeName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{req.employeeName} <span className="font-normal text-slate-500">({req.employeeId})</span></p>
                      <div className="flex items-center gap-2 text-sm mt-1">
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">{req.currentRole}</span>
                        <span className="text-slate-400">→</span>
                        <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200 font-medium">{req.requestedRole}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-2">Requested by {req.requesterName} on {req.date}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleAssignmentDecision(req.id, 'Denied')}
                      className="px-4 py-2 border border-red-200 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 font-medium flex items-center gap-2 transition-colors"
                    >
                      <XCircle size={16} /> Deny
                    </button>
                    <button 
                      onClick={() => handleAssignmentDecision(req.id, 'Approved')}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium flex items-center gap-2 shadow-sm transition-colors"
                    >
                      <Check size={16} /> Approve
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
          <h4 className="font-bold text-slate-800 mb-4">Recent History</h4>
          <div className="space-y-3">
            {assignments.filter(a => a.status !== 'Pending').map(req => (
              <div key={req.id} className="flex items-center justify-between text-sm bg-white p-3 rounded-lg border border-slate-200">
                <span className="text-slate-700">
                  <strong>{req.employeeName}</strong>: {req.currentRole} → {req.requestedRole}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-bold ${req.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                  {req.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (viewMode === 'Security') {
    return (
      <div className="space-y-6 max-w-3xl animate-fade-in">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
              <Lock size={20} /> Device Passcode Policy
            </h3>
            <p className="text-sm text-slate-500">Enforce security standards for POS access.</p>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div>
                <h4 className="font-bold text-slate-900">Require Passcode</h4>
                <p className="text-sm text-slate-500">Employees must enter a code to unlock the register.</p>
              </div>
              <button 
                onClick={() => setPasscodeSettings(prev => ({...prev, requirePasscode: !prev.requirePasscode}))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${passcodeSettings.requirePasscode ? 'bg-emerald-500' : 'bg-slate-300'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${passcodeSettings.requirePasscode ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Minimum Length</label>
                <select 
                  value={passcodeSettings.minLength}
                  onChange={(e) => setPasscodeSettings(prev => ({...prev, minLength: parseInt(e.target.value)}))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value={4}>4 Digits (Standard)</option>
                  <option value={6}>6 Digits (Secure)</option>
                  <option value={8}>8 Digits (High Security)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
