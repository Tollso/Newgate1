import React from 'react';
import { DollarSign } from 'lucide-react';
import { Employee } from '../../../types';
import { CashDrawerService } from '../../../services/cashDrawerService';

interface PosShellCashDrawerProps {
  drawerBalance: string;
  businessDate: string;
  currentUser: Employee;
  onRefreshStatus: () => void;
  onExitToHub: () => void;
}

export const PosShellCashDrawer: React.FC<PosShellCashDrawerProps> = ({
  drawerBalance,
  businessDate,
  currentUser,
  onRefreshStatus,
  onExitToHub,
}) => {
  return (
    <div className="h-full bg-slate-950 p-6 flex items-center justify-center">
      <div className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-600/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
              <DollarSign size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">Cash Drawer Operations</h2>
              <p className="text-xs text-slate-400">Manage shift float, drops, and physical drawer kicks</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 mb-6 text-center">
          <div className="text-xs text-slate-400 uppercase font-mono tracking-widest font-bold">Current Expected Drawer Cash</div>
          <div className="text-5xl font-mono font-black text-emerald-400 my-2">{drawerBalance}</div>
          <div className="text-xs text-slate-500 font-mono">Shift opened: {businessDate} by {currentUser.name}</div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={async () => {
              await CashDrawerService.paidIn(100, 'Mid-shift float addition', currentUser.id, currentUser.name);
              onRefreshStatus();
            }}
            className="p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-left transition-colors"
          >
            <div className="text-emerald-400 font-bold text-sm mb-1">+ Pay In / Float</div>
            <div className="text-xs text-slate-400">Add cash funds to register drawer</div>
          </button>

          <button
            onClick={async () => {
              await CashDrawerService.paidOut(100, 'Safe deposit drop', currentUser.id, currentUser.name);
              onRefreshStatus();
            }}
            className="p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-left transition-colors"
          >
            <div className="text-amber-400 font-bold text-sm mb-1">- Pay Out / Drop</div>
            <div className="text-xs text-slate-400">Remove excess cash to back-office safe</div>
          </button>
        </div>

        <div className="flex gap-3">
          <button
            onClick={async () => {
              await CashDrawerService.openDrawer({
                type: 'NO_SALE',
                reason: 'Manual No-Sale Kick',
                employeeId: currentUser.id,
                employeeName: currentUser.name,
              });
            }}
            className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm transition-colors shadow-lg"
          >
            Kick Drawer (No Sale)
          </button>
          <button
            onClick={onExitToHub}
            className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold text-sm transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
