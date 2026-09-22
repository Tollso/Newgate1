import React, { useState } from 'react';
import { Employee, UserRole, Role, RolePermission, PermissionItem, RoleAssignmentRequest, PasscodeSettings } from '../../types';
import { Plus } from 'lucide-react';
import { MOCK_ROLES, MOCK_PERMISSIONS, MOCK_ROLE_PERMISSIONS, MOCK_ROLE_ASSIGNMENT_REQUESTS, MOCK_PASSCODE_SETTINGS } from '../../constants';
import { NewRoleModal } from './NewRoleModal';
import { EmployeeEditModal } from './EmployeeEditModal';
import { EmployeesViews } from './EmployeesViews';
import { EmployeesTable } from './EmployeesTable';
import { getDefaultRolePermissionState } from './permissions/permissionDefaults';
import { RolePermissionMatrixState } from './permissions/types';

interface EmployeesProps {
  employees: Employee[];
  roles?: Role[];
  setRoles?: React.Dispatch<React.SetStateAction<Role[]>>;
  rolePermissions?: RolePermission[];
  setRolePermissions?: React.Dispatch<React.SetStateAction<RolePermission[]>>;
  matrixState?: RolePermissionMatrixState;
  setMatrixState?: React.Dispatch<React.SetStateAction<RolePermissionMatrixState>>;
  onAddEmployee?: (employee: Employee) => void;
  onUpdateEmployee?: (employee: Employee) => void;
  onDeleteEmployee?: (id: string) => void;
}
const Employees: React.FC<EmployeesProps> = ({ 
  employees, onAddEmployee, onUpdateEmployee, onDeleteEmployee,
  roles: propRoles, setRoles: propSetRoles,
  rolePermissions: propRolePermissions, setRolePermissions: propSetRolePermissions,
  matrixState: propMatrixState, setMatrixState: propSetMatrixState
}) => {

  const [viewMode, setViewMode] = useState<'Employees' | 'Roles' | 'Matrix' | 'Assignments' | 'Security'>('Employees');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'Profile' | 'Role' | 'Payroll' | 'Security'>('Profile');
  
  const [localRoles, setLocalRoles] = useState<Role[]>(MOCK_ROLES);
  const [localRolePermissions, setLocalRolePermissions] = useState<RolePermission[]>(MOCK_ROLE_PERMISSIONS);
  const [localMatrixState, setLocalMatrixState] = useState<RolePermissionMatrixState>(getDefaultRolePermissionState());

  const roles = propRoles || localRoles;
  const setRoles = propSetRoles || setLocalRoles;
  const rolePermissions = propRolePermissions || localRolePermissions;
  const setRolePermissions = propSetRolePermissions || setLocalRolePermissions;
  const matrixState = propMatrixState || localMatrixState;
  const setMatrixState = propSetMatrixState || setLocalMatrixState;

  const [selectedRoleForEdit, setSelectedRoleForEdit] = useState<Role | null>(null);
  const [showRoleEditModal, setShowRoleEditModal] = useState(false);

  const [showNewRoleModal, setShowNewRoleModal] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [cloneRoleId, setCloneRoleId] = useState('R-ADMIN');
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>([]);
  const [employeeSearch, setEmployeeSearch] = useState('');
  const [viewSelectedOnly, setViewSelectedOnly] = useState(false);

  const [assignments, setAssignments] = useState<RoleAssignmentRequest[]>(MOCK_ROLE_ASSIGNMENT_REQUESTS);
  const [passcodeSettings, setPasscodeSettings] = useState<PasscodeSettings>(MOCK_PASSCODE_SETTINGS);

  const [currentEmployee, setCurrentEmployee] = useState<Partial<Employee>>({
    role: 'Employee', status: 'Active', payType: 'Hourly', hourlyRate: 0, hoursWorked: 0, permissions: [], deviceAccess: true
  });
  const [formError, setFormError] = useState<string | null>(null);

  const isPasscodeUnique = (code: string, excludeId?: string) => !employees.some(emp => emp.passcode === code && emp.id !== excludeId);

  const handleOpenAdd = () => {
    setIsEditing(false);
    setCurrentEmployee({ role: 'Employee', status: 'Active', payType: 'Hourly', hourlyRate: 0, hoursWorked: 0, permissions: [], deviceAccess: true });
    setFormError(null);
    setActiveTab('Profile');
    setShowModal(true);
  };

  const handleOpenEdit = (emp: Employee) => {
    setIsEditing(true);
    setCurrentEmployee({ ...emp });
    setFormError(null);
    setActiveTab('Profile');
    setShowModal(true);
  };

  const handleSaveEmployee = () => {
    setFormError(null);
    if (!currentEmployee.name || !currentEmployee.email || !currentEmployee.passcode) {
      setFormError("Name, Email, and Passcode are required.");
      return;
    }
    if (currentEmployee.passcode.length < passcodeSettings.minLength) {
      setFormError(`Passcode must be at least ${passcodeSettings.minLength} digits.`);
      return;
    }
    if (!isPasscodeUnique(currentEmployee.passcode, currentEmployee.id)) {
      setFormError("This passcode is already assigned to another employee.");
      return;
    }

    if (isEditing && onUpdateEmployee) {
      onUpdateEmployee(currentEmployee as Employee);
    } else if (!isEditing && onAddEmployee) {
      onAddEmployee({ id: `E-${Date.now()}`, ...currentEmployee } as Employee);
    }
    setShowModal(false);
  };

  const isPermissionEnabled = (roleId: string, key: string) => {
    if (roleId === 'R-ADMIN') return true;
    const perm = rolePermissions.find(p => p.roleId === roleId && p.permissionKey === key);
    return perm ? perm.access : false;
  };

  const togglePermission = (roleId: string, key: string) => {
    setRolePermissions(prev => {
      const exists = prev.find(p => p.roleId === roleId && p.permissionKey === key);
      if (exists) {
        return prev.map(p => p.roleId === roleId && p.permissionKey === key ? { ...p, access: !p.access } : p);
      }
      return [...prev, { roleId, permissionKey: key, access: true }];
    });
  };

  const handleAddRole = () => {
    setNewRoleName('');
    setCloneRoleId(roles[0]?.id || '');
    setSelectedEmployeeIds([]);
    setEmployeeSearch('');
    setViewSelectedOnly(false);
    setShowNewRoleModal(true);
  };

  const handleSaveNewRole = () => {
    if (!newRoleName.trim()) return;
    const newRoleId = `R-${Date.now()}`;
    const newRole: Role = {
      id: newRoleId, name: newRoleName, type: 'Custom', isSystem: false, description: 'Custom role', employeeCount: (selectedEmployeeIds || []).length
    };

    setRoles([...roles, newRole]);
    const permissionsToClone = rolePermissions.filter(rp => rp.roleId === cloneRoleId);
    setRolePermissions([...rolePermissions, ...permissionsToClone.map(rp => ({ ...rp, roleId: newRoleId }))]);
    setMatrixState(prev => {
      const newState = { ...prev };
      newState[newRoleId] = cloneRoleId && prev[cloneRoleId] ? { ...prev[cloneRoleId] } : {};
      return newState;
    });

    if ((selectedEmployeeIds || []).length > 0 && onUpdateEmployee) {
      selectedEmployeeIds.forEach(empId => {
        const emp = employees.find(e => e.id === empId);
        if (emp) onUpdateEmployee({ ...emp, role: newRoleName });
      });
    }
    setShowNewRoleModal(false);
  };

  const handleDeleteRole = (roleId: string) => {
    setRoles(roles.filter(r => r.id !== roleId));
    setRolePermissions(rolePermissions.filter(rp => rp.roleId !== roleId));
    setMatrixState(prev => {
      const newState = { ...prev };
      delete newState[roleId];
      return newState;
    });
  };

  const openRoleSettings = (role: Role) => {
    setSelectedRoleForEdit(role);
    setShowRoleEditModal(true);
  };

  const handleAssignmentDecision = (id: string, status: 'Approved' | 'Denied') => {
    setAssignments(prev => prev.map(req => req.id === id ? { ...req, status } : req));
  };

  const permissionsByCategory = MOCK_PERMISSIONS.reduce((acc, perm) => {
    if (!acc[perm.category]) acc[perm.category] = [];
    acc[perm.category].push(perm);
    return acc;
  }, {} as Record<string, PermissionItem[]>);

  return (
    <div className="space-y-6 relative">
      <EmployeeEditModal
        showModal={showModal}
        setShowModal={setShowModal}
        isEditing={isEditing}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentEmployee={currentEmployee}
        setCurrentEmployee={setCurrentEmployee}
        formError={formError}
        roles={roles}
        handleSaveEmployee={handleSaveEmployee}
      />

      <NewRoleModal
        showNewRoleModal={showNewRoleModal}
        setShowNewRoleModal={setShowNewRoleModal}
        newRoleName={newRoleName}
        setNewRoleName={setNewRoleName}
        cloneRoleId={cloneRoleId}
        setCloneRoleId={setCloneRoleId}
        roles={roles}
        employees={employees}
        selectedEmployeeIds={selectedEmployeeIds}
        setSelectedEmployeeIds={setSelectedEmployeeIds}
        employeeSearch={employeeSearch}
        setEmployeeSearch={setEmployeeSearch}
        viewSelectedOnly={viewSelectedOnly}
        setViewSelectedOnly={setViewSelectedOnly}
        handleSaveNewRole={handleSaveNewRole}
      />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {viewMode === 'Employees' ? 'Employee Management' : viewMode === 'Assignments' ? 'Role Assignments' : viewMode === 'Security' ? 'Security Policies' : 'Roles & Permissions'}
          </h1>
          <p className="text-slate-500">
            {viewMode === 'Employees' ? 'Manage staff roles, hours, and performance' : viewMode === 'Assignments' ? 'Approve or deny pending role changes' : viewMode === 'Security' ? 'Configure device access and passcodes' : 'Configure granular access control'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="bg-white border border-slate-300 rounded-lg p-1 flex">
            {(['Employees', 'Roles', 'Matrix', 'Assignments', 'Security'] as const).map(mode => (
              <button 
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${viewMode === mode ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {mode === 'Employees' ? 'List' : mode}
              </button>
            ))}
          </div>
          {viewMode === 'Employees' ? (
            <button onClick={handleOpenAdd} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm transition-colors">
              <Plus size={18} /> Add Employee
            </button>
          ) : viewMode === 'Roles' ? (
            <button onClick={handleAddRole} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm transition-colors">
              <Plus size={18} /> Add Role
            </button>
          ) : null}
        </div>
      </div>

      {viewMode === 'Employees' && (
        <EmployeesTable employees={employees} onOpenEdit={handleOpenEdit} onDeleteEmployee={onDeleteEmployee} />
      )}

      {viewMode !== 'Employees' && (
        <EmployeesViews
          viewMode={viewMode}
          roles={roles}
          openRoleSettings={openRoleSettings}
          permissionsByCategory={permissionsByCategory}
          matrixState={matrixState}
          setMatrixState={setMatrixState}
          assignments={assignments}
          handleAssignmentDecision={handleAssignmentDecision}
          passcodeSettings={passcodeSettings}
          setPasscodeSettings={setPasscodeSettings}
          employees={employees}
          onAddRole={(name, cloneFrom) => {
            const newRoleId = `R-${Date.now()}`;
            const newRole: Role = {
              id: newRoleId,
              name,
              type: 'Custom',
              isSystem: false,
              description: 'Custom added role',
              employeeCount: 0
            };
            setRoles([...roles, newRole]);
            if (cloneFrom) {
              const permissionsToClone = rolePermissions.filter(rp => rp.roleId === cloneFrom);
              setRolePermissions([...rolePermissions, ...permissionsToClone.map(rp => ({ ...rp, roleId: newRoleId }))]);
            }
            setMatrixState(prev => {
              const newState = { ...prev };
              newState[newRoleId] = cloneFrom && prev[cloneFrom] ? { ...prev[cloneFrom] } : {};
              return newState;
            });
            return newRoleId;
          }}
          onDeleteRole={handleDeleteRole}
        />
      )}
    </div>
  );
};

export default Employees;
