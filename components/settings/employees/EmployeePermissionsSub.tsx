import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { RolePermissionMatrix } from '../../staff/permissions/RolePermissionMatrix';
import { EmployeePermissionOverridesModal } from '../../staff/permissions/EmployeePermissionOverridesModal';
import { getDefaultRolePermissionState, DEFAULT_ROLE_COLUMNS } from '../../staff/permissions/permissionDefaults';
import { RolePermissionAccess, RolePermissionMatrixState, EmployeeOverride } from '../../staff/permissions/types';
import { Role, Employee } from '../../../types';
import { MOCK_EMPLOYEES } from '../../../src/mocks/mockBusinessData';

interface EmployeePermissionsSubProps {
  renderSectionHeader: (title: string, description: string, parentSection?: string) => React.ReactNode;
  roles?: Role[];
  setRoles?: React.Dispatch<React.SetStateAction<Role[]>>;
  matrixState?: RolePermissionMatrixState;
  setMatrixState?: React.Dispatch<React.SetStateAction<RolePermissionMatrixState>>;
}

export const EmployeePermissionsSub: React.FC<EmployeePermissionsSubProps> = ({ 
  renderSectionHeader, 
  roles = [], 
  setRoles, 
  matrixState = {}, 
  setMatrixState 
}) => {



  const [overrides, setOverrides] = useState<EmployeeOverride[]>([]);
  const [showOverridesModal, setShowOverridesModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const handleChangePermission = (roleId: string, permissionId: string, value: RolePermissionAccess) => {
    if (setMatrixState) {
      setMatrixState((prev: RolePermissionMatrixState) => ({
        ...prev,
        [roleId]: {
          ...(prev[roleId] || {}),
          [permissionId]: value,
        },
      }));
    }
  };

  const handleAddRole = (roleName: string, cloneFromRoleId?: string) => {
    const newRoleId = `R-${Date.now()}`;
    const newRole: Role = {
      id: newRoleId,
      name: roleName,
      type: 'Custom',
      isSystem: false,
      description: 'Custom added role',
    };

    if (setRoles) setRoles((prev) => [...prev, newRole]);

    if (setMatrixState) setMatrixState((prev) => {
      const cloned = cloneFromRoleId && prev[cloneFromRoleId] ? { ...prev[cloneFromRoleId] } : {};
      return {
        ...prev,
        [newRoleId]: cloned,
      };
    });

    setToast(`Added new role "${roleName}" to permission matrix.`);
    setTimeout(() => setToast(null), 3000);
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

  const handleSaveAll = () => {
    setToast('Categorized 15-section permissions matrix saved successfully!');
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <div className="max-w-7xl animate-fade-in pb-20 space-y-6">
      <div className="flex justify-between items-end flex-wrap gap-4">
        {renderSectionHeader(
          'Categorized Employee Permissions (15 Modules)',
          'Comprehensive permission matrix with Allow, Require Approval, Deny, role inheritance, and employee overrides.',
          'Employees'
        )}
        <button
          onClick={handleSaveAll}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-md mb-8 transition-all"
        >
          Save All Permissions
        </button>
      </div>

      {toast && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 text-sm font-bold animate-fade-in">
          <CheckCircle2 size={18} /> {toast}
        </div>
      )}

      <RolePermissionMatrix
        roles={roles}
        matrix={matrixState}
        onChangePermission={handleChangePermission}
        onAddRole={handleAddRole}
        onOpenEmployeeOverrides={() => setShowOverridesModal(true)}
      />

      <EmployeePermissionOverridesModal
        show={showOverridesModal}
        onClose={() => setShowOverridesModal(false)}
        employees={MOCK_EMPLOYEES}
        roles={roles}
        overrides={overrides}
        onSaveOverride={handleSaveOverride}
        matrix={matrixState}
      />
    </div>
  );
};
