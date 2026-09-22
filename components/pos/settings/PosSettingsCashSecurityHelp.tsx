import React from 'react';
import { NativeBridge } from '../../../services/nativeBridge';

interface PosSettingsCashSecurityHelpProps {
  activeSection: 'CASH' | 'SECURITY' | 'HELP';
  defaultOpeningFloat: number;
  setDefaultOpeningFloat: (val: number) => void;
  blindCloseEnabled: boolean;
  setBlindCloseEnabled: (val: boolean) => void;
  kioskLockTaskEnabled: boolean;
  setKioskLockTaskEnabled: (val: boolean) => void;
  requireManagerForVoids: boolean;
  setRequireManagerForVoids: (val: boolean) => void;
  autoLockTimeout: string;
  setAutoLockTimeout: (val: string) => void;
  batteryLevel: number;
}

export const PosSettingsCashSecurityHelp: React.FC<PosSettingsCashSecurityHelpProps> = ({
  activeSection,
  defaultOpeningFloat,
  setDefaultOpeningFloat,
  blindCloseEnabled,
  setBlindCloseEnabled,
  kioskLockTaskEnabled,
  setKioskLockTaskEnabled,
  requireManagerForVoids,
  setRequireManagerForVoids,
  autoLockTimeout,
  setAutoLockTimeout,
  batteryLevel,
}) => {
  const handleToggleLockTask = async () => {
    const nextState = !kioskLockTaskEnabled;
    await NativeBridge.setLockTaskMode(nextState);
    setKioskLockTaskEnabled(nextState);
  };

  if (activeSection === 'CASH') {
    return (
      <div className="space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <h3 className="text-xl font-bold text-white">Cash & Closeout Policies</h3>
          <div>
            <label className="text-xs text-slate-400 uppercase font-mono font-bold block mb-1">
              Default Shift Opening Float ($)
            </label>
            <input
              type="number"
              value={defaultOpeningFloat}
              onChange={e => setDefaultOpeningFloat(parseFloat(e.target.value) || 0)}
              className="w-48 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono text-sm"
            />
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-800/60 rounded-xl border border-slate-700">
            <div>
              <div className="font-bold text-white text-sm">Enforce Blind Close</div>
              <div className="text-xs text-slate-400">Cashier cannot see expected drawer total before entering counted cash</div>
            </div>
            <button
              onClick={() => setBlindCloseEnabled(!blindCloseEnabled)}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                blindCloseEnabled ? 'bg-indigo-600' : 'bg-slate-700'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                blindCloseEnabled ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (activeSection === 'SECURITY') {
    return (
      <div className="space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <h3 className="text-xl font-bold text-white">Terminal Security & Locks</h3>
          <div className="flex items-center justify-between p-4 bg-slate-800/60 rounded-xl border border-slate-700">
            <div>
              <div className="font-bold text-white text-sm">Android Kiosk Mode (LockTask)</div>
              <div className="text-xs text-slate-400">Pin Newgate POS to foreground and lock Android system nav bar</div>
            </div>
            <button
              onClick={handleToggleLockTask}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                kioskLockTaskEnabled ? 'bg-rose-600 text-white' : 'bg-slate-700 text-slate-300'
              }`}
            >
              {kioskLockTaskEnabled ? 'Exit LockTask' : 'Enable LockTask'}
            </button>
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-800/60 rounded-xl border border-slate-700">
            <div>
              <div className="font-bold text-white text-sm">Require Manager PIN for Voids & Large Refunds</div>
              <div className="text-xs text-slate-400">Enforce prompt for manager PIN passcode during order item removal</div>
            </div>
            <button
              onClick={() => setRequireManagerForVoids(!requireManagerForVoids)}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                requireManagerForVoids ? 'bg-indigo-600' : 'bg-slate-700'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                requireManagerForVoids ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase font-mono font-bold block mb-1">
              Inactivity Auto-Lock Timeout
            </label>
            <select
              value={autoLockTimeout}
              onChange={e => setAutoLockTimeout(e.target.value)}
              className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs outline-none"
            >
              <option value="1">1 Minute</option>
              <option value="2">2 Minutes (Recommended)</option>
              <option value="5">5 Minutes</option>
              <option value="never">Never (Stay Unlocked)</option>
            </select>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-xl font-bold text-white">Appliance Information</h3>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between py-2 border-b border-slate-800">
            <span className="text-slate-400">App Version</span>
            <span className="font-mono text-white font-bold">v2.4.0 (Android Appliance)</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-800">
            <span className="text-slate-400">Hardware Runtime</span>
            <span className="font-bold text-emerald-400">Capacitor Native HAL Connected</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-800">
            <span className="text-slate-400">Battery Level</span>
            <span className="font-mono text-white font-bold">{batteryLevel}%</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-slate-400">Package Identifier</span>
            <span className="font-mono text-indigo-400">com.newgate.pos</span>
          </div>
        </div>
      </div>
    </div>
  );
};
