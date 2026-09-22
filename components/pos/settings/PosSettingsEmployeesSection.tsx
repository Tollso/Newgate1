import React, { useState, useMemo } from 'react';
import {
  Shield, Check, Key, RotateCcw, Save, AlertCircle,
  Lock, CheckCircle2, ChevronRight, Search, Eye, EyeOff,
  UserCheck, ShieldAlert, X, Sparkles, Filter
} from 'lucide-react';
import { Employee } from '../../../types';
import {
  PermissionService,
  CANONICAL_PERMISSIONS,
  ROLE_PRESET_PERMISSIONS,
} from '../../../services/permissionService';

interface PosSettingsEmployeesSectionProps {
  employees: Employee[];
  currentUser?: Employee;
  onUpdateEmployee?: (employee: Employee) => void;
}

export const PosSettingsEmployeesSection: React.FC<PosSettingsEmployeesSectionProps> = ({
  employees,
  currentUser,
  onUpdateEmployee,
}) => {
  const canManage = currentUser ? PermissionService.can(currentUser, 'roles.permissions.manage') : true;

  const [selectedEmpId, setSelectedEmpId] = useState<string>(employees[0]?.id || '');
  const [searchEmployeeQuery, setSearchEmployeeQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchPermQuery, setSearchPermQuery] = useState('');
  const [savedNotification, setSavedNotification] = useState<string | null>(null);

  // Selected employee reference
  const selectedEmp = employees.find(e => e.id === selectedEmpId) || employees[0];

  // Local draft state for selected employee
  const [draftRole, setDraftRole] = useState<string>(selectedEmp?.role || 'STAFF');
  const [currentPermissions, setCurrentPermissions] = useState<string[]>(() => {
    return selectedEmp ? PermissionService.getEffectivePermissions(selectedEmp) : [];
  });

  // Secure PIN change state
  const [showPinModal, setShowPinModal] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showPinMask, setShowPinMask] = useState(false);
  const [pinError, setPinError] = useState<string | null>(null);
  const [stagedPin, setStagedPin] = useState<string | null>(null);

  // Role change preset recommendation banner
  const [showRolePresetPrompt, setShowRolePresetPrompt] = useState(false);

  const actor: Employee = currentUser || {
    id: 'E_ADMIN',
    name: 'Administrator',
    role: 'BUSINESS_ADMIN',
    email: 'admin@pos.internal',
    hourlyRate: 0,
    hoursWorked: 0,
    status: 'Active',
  };

  const handleSelectEmployee = (emp: Employee) => {
    setSelectedEmpId(emp.id);
    setDraftRole(emp.role || 'STAFF');
    setCurrentPermissions(PermissionService.getEffectivePermissions(emp));
    setShowRolePresetPrompt(false);
    setShowPinModal(false);
    setPinError(null);
    setStagedPin(null);
    setSavedNotification(null);
  };

  const handleRoleChange = (newRole: string) => {
    setDraftRole(newRole);
    if (selectedEmp && newRole !== selectedEmp.role) {
      setShowRolePresetPrompt(true);
    } else {
      setShowRolePresetPrompt(false);
    }
  };

  const handleApplyPresetForDraftRole = () => {
    const roleKey = (draftRole || '').toUpperCase();
    const preset = ROLE_PRESET_PERMISSIONS[roleKey] || ROLE_PRESET_PERMISSIONS.STAFF || [];
    setCurrentPermissions([...preset]);
    setShowRolePresetPrompt(false);
    setSavedNotification(`Applied default permission preset for role: ${draftRole}`);
  };

  const handleKeepCustomPermissions = () => {
    setShowRolePresetPrompt(false);
  };

  const handleTogglePermission = (permId: string) => {
    setCurrentPermissions(prev => {
      if (prev.includes(permId)) {
        return prev.filter(p => p !== permId);
      } else {
        return [...prev, permId];
      }
    });
  };

  const handleSelectAllVisible = () => {
    const visibleIds = filteredPermissions.map(p => p.id);
    setCurrentPermissions(prev => Array.from(new Set([...prev, ...visibleIds])));
  };

  const handleDeselectAllVisible = () => {
    const visibleIds = new Set(filteredPermissions.map(p => p.id));
    setCurrentPermissions(prev => prev.filter(id => !visibleIds.has(id)));
  };

  const handleResetToRoleDefaults = () => {
    if (!selectedEmp) return;
    const roleKey = (draftRole || selectedEmp.role || '').toUpperCase();
    const preset = ROLE_PRESET_PERMISSIONS[roleKey] || ROLE_PRESET_PERMISSIONS.STAFF || [];
    setCurrentPermissions([...preset]);
    setSavedNotification(`Permissions reset to ${draftRole} defaults.`);
  };

  const handleSavePinDraft = () => {
    setPinError(null);
    const cleaned = newPin.trim();
    if (!/^\d{4,6}$/.test(cleaned)) {
      setPinError('PIN must consist of 4 to 6 numeric digits.');
      return;
    }
    if (cleaned !== confirmPin.trim()) {
      setPinError('PIN entries do not match. Please re-enter.');
      return;
    }

    setStagedPin(cleaned);
    setShowPinModal(false);
    setNewPin('');
    setConfirmPin('');
    setSavedNotification('New PIN staged. Click "Save & Audit Profile" below to apply.');
  };

  const handleSaveSecurityProfile = async () => {
    if (!selectedEmp) return;

    try {
      const result = await PermissionService.saveEmployeeSecurityProfile({
        employeeId: selectedEmp.id,
        role: draftRole,
        permissions: currentPermissions,
        passcode: stagedPin || undefined,
        actor,
      });

      if (result.success && result.employee) {
        const updatedEmp: Employee = {
          ...selectedEmp,
          role: draftRole,
          permissions: [...currentPermissions],
          passcode: stagedPin || selectedEmp.passcode,
        };

        // Notify parent state for immediate state synchronization
        if (onUpdateEmployee) {
          onUpdateEmployee(updatedEmp);
        }

        setStagedPin(null);
        setShowRolePresetPrompt(false);
        setSavedNotification(`Security profile and permissions saved for ${selectedEmp.name}. POS Hub recalculated.`);
        setTimeout(() => setSavedNotification(null), 5000);
      }
    } catch (err) {
      console.error('[PosSettingsEmployeesSection] Error saving employee security profile:', err);
      setSavedNotification('Failed to save security profile.');
    }
  };

  const categories = ['ALL', 'App Access', 'Operations', 'Dining & Tables', 'Hardware & Setup', 'Financial & Cash'];

  const filteredEmployees = useMemo(() => {
    const q = searchEmployeeQuery.toLowerCase().trim();
    if (!q) return employees;
    return employees.filter(e =>
      e.name.toLowerCase().includes(q) ||
      (e.role && e.role.toLowerCase().includes(q)) ||
      (e.email && e.email.toLowerCase().includes(q))
    );
  }, [employees, searchEmployeeQuery]);

  const filteredPermissions = useMemo(() => {
    return CANONICAL_PERMISSIONS.filter(p => {
      if (activeCategory !== 'ALL' && p.category !== activeCategory) {
        return false;
      }
      if (searchPermQuery.trim()) {
        const q = searchPermQuery.toLowerCase().trim();
        return (
          p.name.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [activeCategory, searchPermQuery]);

  const rolePresetList = Object.keys(ROLE_PRESET_PERMISSIONS);

  // Access Control Guard
  if (!canManage) {
    return (
      <div className="max-w-xl mx-auto mt-12 p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-6 text-amber-400">
          <ShieldAlert size={36} />
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono mb-4">
          <Lock size={12} />
          <span>Restricted Access</span>
        </span>
        <h3 className="text-2xl font-black text-white tracking-tight mb-2">
          Permission Required: roles.permissions.manage
        </h3>
        <p className="text-sm text-slate-400 leading-relaxed">
          You do not have administrative authority to manage staff roles, toggle permissions, or alter employee terminal PINs.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner with Summary */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="text-indigo-400" size={24} />
              <h3 className="text-xl font-black text-white">Staff Roles & Permissions Governance</h3>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                roles.permissions.manage
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Select staff member, set organizational role, and toggle fine-grained app tile and operational privileges. Changes take effect on the POS Hub immediately.
            </p>
          </div>

          {savedNotification && (
            <div className="px-4 py-2.5 bg-emerald-950/80 border border-emerald-600/60 rounded-xl flex items-center gap-2 text-emerald-300 text-xs font-semibold shadow-lg shadow-emerald-950/40 animate-fade-in">
              <CheckCircle2 size={16} />
              <span>{savedNotification}</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Staff Roster Selector */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">
              Staff Members ({filteredEmployees.length})
            </span>
          </div>

          {/* Search box */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input
              type="text"
              placeholder="Search staff by name or role..."
              value={searchEmployeeQuery}
              onChange={(e) => setSearchEmployeeQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredEmployees.map(emp => {
              const isSelected = emp.id === selectedEmp?.id;
              const perms = emp.permissions && emp.permissions.length > 0
                ? emp.permissions
                : (ROLE_PRESET_PERMISSIONS[(emp.role || '').toUpperCase()] || []);
              const hasPin = Boolean(emp.passcode);

              return (
                <button
                  key={emp.id}
                  onClick={() => handleSelectEmployee(emp)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-indigo-950/60 border-indigo-500 shadow-lg shadow-indigo-950/40 text-white'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-xl font-black flex items-center justify-center text-sm shadow-sm shrink-0 ${
                      isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {emp.name.charAt(0)}
                    </div>
                    <div className="truncate">
                      <div className="font-bold text-sm text-white flex items-center gap-2 truncate">
                        <span className="truncate">{emp.name}</span>
                        {isSelected && (
                          <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-semibold shrink-0">
                            Editing
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                        <span className="font-semibold text-slate-300">{emp.role}</span>
                        <span>•</span>
                        <span>{perms.length} perms</span>
                        <span>•</span>
                        <span className={hasPin ? 'text-emerald-400 font-mono' : 'text-slate-500'}>
                          {hasPin ? 'PIN set' : 'No PIN'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={18} className={`shrink-0 ${isSelected ? 'text-indigo-400' : 'text-slate-600'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Role Selector, PIN Editor & Granular Permissions */}
        {selectedEmp && (
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
              {/* Profile Card & Role/PIN Controls */}
              <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 font-black text-xl flex items-center justify-center shadow-inner">
                    {selectedEmp.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-white">{selectedEmp.name}</h4>
                    <p className="text-xs text-slate-400">
                      ID: <span className="font-mono text-slate-300">{selectedEmp.id}</span> • Email: {selectedEmp.email || 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Role and Passcode controls */}
                <div className="flex flex-wrap items-center gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                      Assigned Role
                    </span>
                    <select
                      value={draftRole}
                      onChange={(e) => handleRoleChange(e.target.value)}
                      className="px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-indigo-500 cursor-pointer shadow-sm"
                    >
                      {rolePresetList.map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                      Terminal PIN
                    </span>
                    <button
                      onClick={() => {
                        setShowPinModal(true);
                        setPinError(null);
                        setNewPin('');
                        setConfirmPin('');
                      }}
                      className="px-3.5 py-2 bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-indigo-500 rounded-xl text-xs font-mono font-bold text-indigo-300 flex items-center gap-2 transition-all shadow-sm"
                    >
                      <Key size={14} />
                      <span>{stagedPin ? `PIN: ${stagedPin} (Staged)` : selectedEmp.passcode ? 'PIN Configured' : 'Set PIN'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Role Change Preset Banner */}
              {showRolePresetPrompt && (
                <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in">
                  <div className="flex items-center gap-3">
                    <Sparkles className="text-indigo-400 shrink-0" size={20} />
                    <div>
                      <p className="text-xs font-bold text-white">
                        Role changed to <span className="text-indigo-300">{draftRole}</span>
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Would you like to apply the default permission preset for {draftRole}?
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={handleApplyPresetForDraftRole}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors shadow-sm"
                    >
                      Apply {draftRole} Defaults
                    </button>
                    <button
                      onClick={handleKeepCustomPermissions}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                    >
                      Keep Custom
                    </button>
                  </div>
                </div>
              )}

              {/* Category Filter & Permissions Search */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Category Filter Tabs */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                          activeCategory === cat
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-750'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Filter Search */}
                  <div className="relative sm:w-56">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                    <input
                      type="text"
                      placeholder="Filter permissions..."
                      value={searchPermQuery}
                      onChange={(e) => setSearchPermQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Batch Actions Bar */}
                <div className="flex items-center justify-between text-xs px-1 text-slate-400">
                  <span>Showing {filteredPermissions.length} permissions</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSelectAllVisible}
                      className="text-indigo-400 hover:text-indigo-300 hover:underline font-semibold"
                    >
                      Select All
                    </button>
                    <span>•</span>
                    <button
                      onClick={handleDeselectAllVisible}
                      className="text-slate-400 hover:text-slate-200 hover:underline"
                    >
                      Deselect All
                    </button>
                  </div>
                </div>
              </div>

              {/* Permissions Checkbox Grid */}
              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                {filteredPermissions.map(perm => {
                  const isEnabled = currentPermissions.includes(perm.id);

                  return (
                    <div
                      key={perm.id}
                      onClick={() => handleTogglePermission(perm.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between select-none ${
                        isEnabled
                          ? 'bg-indigo-950/40 border-indigo-600/70 hover:border-indigo-500'
                          : 'bg-slate-900 border-slate-800 hover:border-slate-700 opacity-60 hover:opacity-90'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all shrink-0 ${
                          isEnabled
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'bg-slate-800 border border-slate-700 text-transparent'
                        }`}>
                          <Check size={14} strokeWidth={3} />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-2">
                            <span>{perm.name}</span>
                            <span className="text-[10px] font-mono text-slate-400 font-normal">
                              ({perm.id})
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">{perm.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60 hidden sm:inline">
                          {perm.category}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isEnabled
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-500 border border-slate-700/50'
                        }`}>
                          {isEnabled ? 'Granted' : 'Revoked'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Actions Footer */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-slate-800 gap-4">
                <button
                  onClick={handleResetToRoleDefaults}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors border border-slate-700 justify-center"
                >
                  <RotateCcw size={14} />
                  <span>Reset to {draftRole} Defaults</span>
                </button>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <div className="text-right">
                    <span className="text-xs text-white font-mono font-bold">
                      {currentPermissions.length}
                    </span>
                    <span className="text-xs text-slate-400 font-mono ml-1">
                      / {CANONICAL_PERMISSIONS.length} privileges active
                    </span>
                  </div>
                  <button
                    onClick={handleSaveSecurityProfile}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/30"
                  >
                    <Save size={14} />
                    <span>Save & Audit Profile</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Secure PIN Change Dialog Modal */}
      {showPinModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-scale-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
                  <Key size={20} />
                </div>
                <div>
                  <h4 className="text-lg font-black text-white">Configure Terminal PIN</h4>
                  <p className="text-xs text-slate-400">Employee: {selectedEmp?.name}</p>
                </div>
              </div>
              <button
                onClick={() => setShowPinModal(false)}
                className="text-slate-500 hover:text-white p-1 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {pinError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{pinError}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  New PIN (4 to 6 numeric digits)
                </label>
                <div className="relative">
                  <input
                    type={showPinMask ? 'text' : 'password'}
                    maxLength={6}
                    placeholder="Enter 4-6 digit passcode"
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm font-mono text-white tracking-widest focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPinMask(!showPinMask)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPinMask ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Confirm New PIN
                </label>
                <input
                  type={showPinMask ? 'text' : 'password'}
                  maxLength={6}
                  placeholder="Re-enter passcode"
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm font-mono text-white tracking-widest focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div className="font-semibold text-slate-300">Security Notice:</div>
                <p>
                  This PIN enables fast terminal login, lock screen unlocking, and cashier authorization. It is encrypted in persistent storage and tracked via audit logs.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowPinModal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePinDraft}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/30"
              >
                Stage PIN
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PosSettingsEmployeesSection;
