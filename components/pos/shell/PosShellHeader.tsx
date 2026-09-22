import React from 'react';
import { Search, Tv, QrCode, Settings, Lock } from 'lucide-react';
import { Employee } from '../../../types';
import { MerchantMode } from '../../../types/device';
import { NativeBridge } from '../../../services/nativeBridge';
import { PermissionService } from '../../../services/permissionService';

interface PosShellHeaderProps {
  currentMode: MerchantMode;
  businessDate: string;
  currentUser: Employee;
  activeUser: Employee | null;
  onOpenGlobalSearch?: () => void;
  onOpenCfd: () => void;
  onOpenProvisioning: () => void;
  onAdminExit: () => void;
  onLockTerminal: () => void;
  onDevChangeMode?: (mode: MerchantMode) => void;
}

export const PosShellHeader: React.FC<PosShellHeaderProps> = ({
  currentMode,
  businessDate,
  currentUser,
  activeUser,
  onOpenGlobalSearch,
  onOpenCfd,
  onOpenProvisioning,
  onAdminExit,
  onLockTerminal,
  onDevChangeMode,
}) => {
  const isDevMode = Boolean((import.meta as any).env?.DEV || (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development'));
  const effectiveUser = activeUser || currentUser;
  const canManageDevices = PermissionService.can(effectiveUser, 'devices.manage');
  const canOpenWebAdmin = PermissionService.can(effectiveUser, 'webadmin.open');

  return (
    <header className="h-20 px-6 bg-slate-900 border-b border-slate-800 flex items-center justify-between shadow-lg select-none">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2.5">
          <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
          <h1 className="text-xl font-black text-white tracking-tight">The Newgate POS</h1>
          <div className="flex items-center gap-1.5">
            <span
              className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1.5 shadow-sm"
              title="Merchant Mode: Locked to merchant business account / provisioned appliance profile"
            >
              <Lock size={10} className="text-slate-400" />
              <span>{currentMode}</span>
            </span>

            {/* Development-only demo mode switch. Completely hidden in production */}
            {isDevMode && onDevChangeMode && (
              <div
                className="flex items-center gap-1 bg-amber-950/40 border border-amber-600/40 rounded px-1.5 py-0.5 ml-1"
                title="[DEV ONLY DEMO SWITCH] This control is strictly disabled in production builds and only appears during development testing."
              >
                <span className="text-[9px] font-mono text-amber-400 font-extrabold uppercase tracking-wider">DEV:</span>
                <select
                  value={currentMode}
                  onChange={(e) => onDevChangeMode(e.target.value as MerchantMode)}
                  className="bg-transparent text-amber-300 text-[10px] font-bold font-mono uppercase outline-none cursor-pointer"
                >
                  <option value="RESTAURANT" className="bg-slate-900 text-slate-200">RESTAURANT</option>
                  <option value="RETAIL" className="bg-slate-900 text-slate-200">RETAIL</option>
                  <option value="NONPROFIT" className="bg-slate-900 text-slate-200">NONPROFIT</option>
                </select>
              </div>
            )}
          </div>
        </div>

        <span className="text-xs text-slate-400 font-mono hidden xl:inline">
          Business Date: {businessDate}
        </span>
      </div>

      <div className="flex items-center space-x-3">
        {/* Universal Search Button */}
        {onOpenGlobalSearch && (
          <button
            onClick={onOpenGlobalSearch}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-2 border border-slate-700 transition-colors"
          >
            <Search size={16} />
            <span className="hidden md:inline">Global Search</span>
          </button>
        )}

        {/* Customer Facing Display Toggle */}
        <button
          onClick={onOpenCfd}
          className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
          title="Launch Customer Display"
        >
          <Tv size={16} />
          <span className="hidden lg:inline">Customer Screen</span>
        </button>

        {/* Terminal Provisioning & Diagnostics (Permission gated) */}
        {canManageDevices && (
          <button
            onClick={onOpenProvisioning}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
            title="Terminal Hardware & Provisioning"
          >
            <QrCode size={16} />
            <span className="hidden lg:inline">Appliance Setup</span>
          </button>
        )}

        {/* Switch to Web Admin Shell (Authorized / Explicit permission gated) */}
        {canOpenWebAdmin && (
          <button
            onClick={onAdminExit}
            className="px-3.5 py-2 bg-indigo-950 hover:bg-indigo-900 text-indigo-200 border border-indigo-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Settings size={16} />
            <span className="hidden sm:inline">Web Admin</span>
          </button>
        )}

        {/* User badge & Logout */}
        <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
          <div className="text-right hidden sm:block">
            <span className="text-xs font-bold text-white block">{activeUser?.name || currentUser.name}</span>
            <span className="text-[10px] text-slate-400 block uppercase tracking-wider">{activeUser?.role || currentUser.role}</span>
          </div>
          <button
            onClick={() => {
              NativeBridge.beep(1600, 60);
              onLockTerminal();
            }}
            className="p-2.5 bg-rose-950/60 hover:bg-rose-900 text-rose-300 rounded-xl border border-rose-800/60 transition-colors"
            title="Lock Terminal / Enter PIN"
          >
            <Lock size={16} />
          </button>
        </div>
      </div>
    </header>
  );
};
