import React from 'react';
import { Users, Shield, Key, Coins } from 'lucide-react';

import { EmployeeRolesSub } from './employees/EmployeeRolesSub';
import { EmployeePermissionsSub } from './employees/EmployeePermissionsSub';
import { TipPoolingConfig } from './operations/TipPoolingConfig';
import { Role, RolePermission } from '../../types';
import { RolePermissionMatrixState } from '../staff/permissions/types';


interface EmployeesSettingsSectionProps {
  subSection: string | null;
  setSubSection: (val: string | null) => void;
  renderSectionHeader: (title: string, description: string, parentSection?: string) => React.ReactNode;
  SettingCard: React.FC<any>;
  passcodeSettings: any;
  setPasscodeSettings: (val: any) => void;
  tempPasscodeSettings: any;
  setTempPasscodeSettings: (val: any) => void;
  roles?: Role[];
  setRoles?: React.Dispatch<React.SetStateAction<Role[]>>;
  rolePermissions?: RolePermission[];
  setRolePermissions?: React.Dispatch<React.SetStateAction<RolePermission[]>>;
  matrixState?: RolePermissionMatrixState;
  setMatrixState?: React.Dispatch<React.SetStateAction<RolePermissionMatrixState>>;
}

export const EmployeesSettingsSection: React.FC<EmployeesSettingsSectionProps> = ({
  subSection,
  setSubSection,
  renderSectionHeader,
  SettingCard,
  passcodeSettings,
  setPasscodeSettings,
  tempPasscodeSettings,
  setTempPasscodeSettings,
  roles, setRoles, rolePermissions, setRolePermissions, matrixState, setMatrixState
}) => {
  if (subSection === 'Employee roles') {
    return <EmployeeRolesSub renderSectionHeader={renderSectionHeader} roles={roles} setRoles={setRoles} />;
  }

  if (subSection === 'Employee permissions') {
    return <EmployeePermissionsSub renderSectionHeader={renderSectionHeader} roles={roles} setRoles={setRoles} matrixState={matrixState} setMatrixState={setMatrixState} />;
  }

  if (subSection === 'Tip pooling policy') {
    return (
      <div className="max-w-4xl animate-fade-in pb-20 space-y-8">
        {renderSectionHeader("Tip Pooling Policy", "Define automatic contribution and distribution strategies for card & cash tips.", "Employees")}
        <TipPoolingConfig />
      </div>
    );
  }

  if (subSection === 'Device passcode') {
    return (
      <div className="max-w-4xl animate-fade-in pb-20 space-y-8">
        {renderSectionHeader("Device Passcode & Security", "Configure terminal lock behaviors, login requirements, and passcode expiration rules.", "Employees")}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-slate-100 pb-8">
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Passcode Length</label>
                <select 
                  value={passcodeSettings.passcodeLength}
                  onChange={e => setPasscodeSettings({...passcodeSettings, passcodeLength: parseInt(e.target.value)})}
                  className="w-full border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-black text-slate-800 bg-white outline-none focus:border-indigo-500 transition-all"
                >
                  <option value={4}>4 DIGITS (Standard POS PIN)</option>
                  <option value={6}>6 DIGITS (Enhanced Security)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Login Security Mode</label>
                <label className="flex items-center gap-3 cursor-pointer p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <input 
                    type="checkbox" 
                    checked={passcodeSettings.requireAlpha} 
                    onChange={e => setPasscodeSettings({...passcodeSettings, requireAlpha: e.target.checked})}
                    className="h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" 
                  />
                  <div>
                    <p className="text-sm font-black text-slate-800">Alpha-Numeric Complex Codes</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">High Security Requirement</p>
                  </div>
                </label>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Passcode Expiration Interval</label>
                <select 
                  value={passcodeSettings.expirationDays}
                  onChange={e => setPasscodeSettings({...passcodeSettings, expirationDays: parseInt(e.target.value)})}
                  className="w-full border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-black text-slate-800 bg-white outline-none focus:border-indigo-500 transition-all"
                >
                  <option value={30}>EVERY 30 DAYS</option>
                  <option value={90}>EVERY 90 DAYS</option>
                  <option value={180}>EVERY 6 MONTHS</option>
                  <option value={0}>NEVER EXPIRE</option>
                </select>
              </div>
            </div>
          </div>

          <div className="py-4 flex justify-end gap-3">
            <button 
              onClick={() => setPasscodeSettings(tempPasscodeSettings)}
              className="px-10 py-3 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all text-xs uppercase tracking-widest"
            >
              Update Security Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl animate-fade-in pb-20">
      {renderSectionHeader("Employees", "Admin settings for staff management, access, and security.")}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SettingCard icon={Users} title="Employee roles" description="Define access levels like Manager, Server, or Admin." onClick={() => setSubSection('Employee roles')} />
        <SettingCard icon={Shield} title="Employee permissions" description="Granular control over specific app features per role." onClick={() => setSubSection('Employee permissions')} />
        <SettingCard icon={Key} title="Device passcode" description="Set global security policies for hardware login." onClick={() => setSubSection('Device passcode')} />
        <SettingCard icon={Coins} title="Tip pooling policy" description="Configure tip pools, contribution splits, and support staff distributions." onClick={() => setSubSection('Tip pooling policy')} />
      </div>
    </div>
  );
};
