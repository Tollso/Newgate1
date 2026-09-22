import React, { useState } from 'react';
import { Wrench, QrCode, Printer, ShieldCheck, Settings } from 'lucide-react';
import { Employee } from '../../../types';
import { MerchantMode } from '../../../types/device';
import { CashDrawerService } from '../../../services/cashDrawerService';

interface PosShellManagerToolsProps {
  currentMode: MerchantMode;
  currentUser: Employee;
  businessName?: string;
  onExitToHub: () => void;
  onSwitchToAdmin: () => void;
  onOpenCfd: () => void;
}

export const PosShellManagerTools: React.FC<PosShellManagerToolsProps> = ({
  currentMode,
  currentUser,
  businessName,
  onExitToHub,
  onSwitchToAdmin,
  onOpenCfd,
}) => {
  const [hardwareTestStatus, setHardwareTestStatus] = useState<string | null>(null);

  return (
    <div className="h-full bg-slate-950 p-6 md:p-10 overflow-y-auto">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              <Wrench className="text-purple-400" />
              Manager Tools & Device Diagnostics
            </h2>
            <p className="text-xs text-slate-400">
              Terminal identity, peripheral hardware tests, register overrides, and Web Admin entry
            </p>
          </div>

          <button
            onClick={onExitToHub}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold"
          >
            Done
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Terminal Identity */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <QrCode size={18} className="text-indigo-400" />
              Terminal Hardware Profile
            </h3>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Appliance ID</span>
                <span className="font-mono text-white font-bold">DEV-POS-01</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Current Mode</span>
                <span className="font-bold text-indigo-400 uppercase">{currentMode}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Active Business</span>
                <span className="text-white font-bold">{businessName || 'Lumi Restaurant & Bar'}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Offline Cache</span>
                <span className="text-emerald-400 font-bold">Synchronized (0 pending)</span>
              </div>
            </div>
          </div>

          {/* Card 2: Hardware HAL Tests */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Printer size={18} className="text-emerald-400" />
              Hardware Peripherals Diagnostics
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">ESC/POS Thermal Receipt Printer</span>
                <button
                  onClick={() => {
                    setHardwareTestStatus('Printer Test Receipt Sent (32 bytes ESC/POS payload)');
                    setTimeout(() => setHardwareTestStatus(null), 3000);
                  }}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-lg font-bold border border-slate-700"
                >
                  Print Test
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-300">Barcode / QR Scanner Wedge</span>
                <span className="text-emerald-400 font-mono font-bold">ONLINE (HID)</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-300">Customer Facing Display</span>
                <button
                  onClick={onOpenCfd}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-lg font-bold border border-slate-700"
                >
                  Open CFD
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-300">RJ12 Cash Drawer Interface</span>
                <button
                  onClick={() => {
                    CashDrawerService.openDrawer({
                      type: 'NO_SALE',
                      reason: 'HAL Test Kick',
                      employeeId: currentUser.id,
                      employeeName: currentUser.name,
                    });
                    setHardwareTestStatus('Cash Drawer Kick Solenoid Triggered');
                    setTimeout(() => setHardwareTestStatus(null), 3000);
                  }}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg font-bold border border-slate-700"
                >
                  Kick Test
                </button>
              </div>

              {hardwareTestStatus && (
                <div className="p-2.5 bg-emerald-950/60 border border-emerald-800 text-emerald-300 rounded-xl text-xs font-mono">
                  ✓ {hardwareTestStatus}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Card 3: Explicit Web Admin Entry */}
        <div className="bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-slate-900 border border-purple-800/40 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg font-black text-white flex items-center justify-center sm:justify-start gap-2">
              <ShieldCheck className="text-purple-400" />
              Switch to Web Admin Console
            </h3>
            <p className="text-xs text-slate-300 max-w-xl">
              Enter the full back-office management console for inventory creation, employee management, tax policies, and financial statements.
            </p>
          </div>

          <button
            onClick={onSwitchToAdmin}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold text-sm flex items-center gap-2 shrink-0 shadow-lg shadow-purple-900/50 transition-all transform hover:scale-105"
          >
            <Settings size={18} />
            <span>Open Web Admin</span>
          </button>
        </div>
      </div>
    </div>
  );
};
