import React from 'react';
import { Wifi, Battery, Lock } from 'lucide-react';
import { Employee } from '../../../types';
import { NativeBridge } from '../../../services/nativeBridge';

interface PosShellSessionPanelProps {
  businessName?: string;
  activeUser: Employee;
  businessDate: string;
  drawerBalance: string;
  batteryLevel: number;
  terminalName?: string;
  deviceId?: string;
  onLockTerminal: () => void;
}

export const PosShellSessionPanel: React.FC<PosShellSessionPanelProps> = ({
  businessName = 'Lumi Restaurant & Bar',
  activeUser,
  businessDate,
  drawerBalance,
  batteryLevel,
  terminalName,
  deviceId,
  onLockTerminal,
}) => {
  return (
    <aside className="w-full lg:w-80 shrink-0 bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-2xl space-y-6">
      <div className="space-y-6">
        {/* Merchant Identity Branding */}
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-black">
            NEWGATE POS APPLIANCE
          </div>
          <h2 className="text-xl font-black text-white tracking-tight mt-0.5">
            {businessName}
          </h2>
          <div className="text-xs text-slate-400 mt-0.5">
            {terminalName || 'Main Register'}{deviceId ? ` • ${deviceId}` : ''}
          </div>
        </div>

        {/* Current Employee Profile Card */}
        <div className="p-4 bg-slate-800/90 rounded-2xl border border-slate-700/80 flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-black text-lg flex items-center justify-center shadow-md">
            {activeUser.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-black text-white truncate">{activeUser.name}</div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="px-2 py-0.5 bg-indigo-950 text-indigo-300 rounded text-[10px] font-extrabold uppercase border border-indigo-800/80">
                {activeUser.role}
              </span>
              <span className="text-[11px] text-slate-400">ID: {activeUser.id}</span>
            </div>
          </div>
        </div>

        {/* Operational Shift & Drawer Telemetry */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between p-2.5 bg-slate-800/40 rounded-xl border border-slate-800">
            <span className="text-slate-400">Business Date</span>
            <span className="font-mono text-white font-bold">{businessDate}</span>
          </div>
          <div className="flex items-center justify-between p-2.5 bg-slate-800/40 rounded-xl border border-slate-800">
            <span className="text-slate-400">Shift Status</span>
            <span className="font-bold text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Shift #1 (Active)
            </span>
          </div>
          <div className="flex items-center justify-between p-2.5 bg-slate-800/40 rounded-xl border border-slate-800">
            <span className="text-slate-400">Cash Float</span>
            <span className="font-mono font-bold text-slate-200">{drawerBalance}</span>
          </div>
        </div>

        {/* Hardware & Network Status Indicator */}
        <div className="space-y-2">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Hardware & Telemetry
          </div>
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Wifi size={14} className="text-emerald-400" /> Mesh Sync
              </span>
              <span className="text-emerald-400 font-bold text-[11px]">Online (5ms)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Battery size={14} className={batteryLevel > 20 ? 'text-emerald-400' : 'text-rose-400'} /> Battery
              </span>
              <span className="font-mono font-bold text-slate-200 text-[11px]">{batteryLevel}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-[11px]">Thermal ESC/POS</span>
              <span className="text-emerald-400 font-bold text-[11px]">Ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Touch "LOCK / SIGN OUT" Action */}
      <div className="pt-2">
        <button
          onClick={() => {
            NativeBridge.beep(1600, 60);
            onLockTerminal();
          }}
          className="w-full py-3.5 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-rose-950/50 transition-all transform active:scale-95 border border-rose-500/50"
        >
          <Lock size={18} />
          <span>Lock Terminal / Switch User</span>
        </button>
      </div>
    </aside>
  );
};
