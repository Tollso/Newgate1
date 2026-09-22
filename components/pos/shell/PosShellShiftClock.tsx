import React from 'react';
import { Coffee } from 'lucide-react';
import { Employee } from '../../../types';

interface PosShellShiftClockProps {
  currentUser: Employee;
  isClockedIn: boolean;
  setIsClockedIn: (val: boolean) => void;
  onBreak: boolean;
  setOnBreak: (val: boolean) => void;
  clockInTime: string;
  setClockInTime: (time: string) => void;
  shiftHours: string;
  onExitToHub: () => void;
}

export const PosShellShiftClock: React.FC<PosShellShiftClockProps> = ({
  currentUser,
  isClockedIn,
  setIsClockedIn,
  onBreak,
  setOnBreak,
  clockInTime,
  setClockInTime,
  shiftHours,
  onExitToHub,
}) => {
  return (
    <div className="h-full bg-slate-950 p-6 flex items-center justify-center">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center">
        <div className="h-16 w-16 bg-blue-600/20 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
          <Coffee size={32} />
        </div>
        <h2 className="text-2xl font-black text-white">{currentUser.name}</h2>
        <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-6">{currentUser.role} • Shift Clock</p>

        <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 mb-6">
          <div className="text-xs text-slate-400 uppercase font-mono tracking-widest">Shift Status</div>
          <div className="text-3xl font-mono font-black text-white my-2">
            {onBreak ? 'ON BREAK' : isClockedIn ? 'CLOCKED IN' : 'CLOCKED OUT'}
          </div>
          <div className="text-xs text-slate-400 font-mono">
            {isClockedIn ? `In at ${clockInTime} • ${shiftHours} elapsed` : 'No active shift'}
          </div>
        </div>

        <div className="space-y-3">
          {isClockedIn && (
            <button
              onClick={() => setOnBreak(!onBreak)}
              className={`w-full py-3 rounded-xl font-bold text-sm transition-colors ${
                onBreak ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              {onBreak ? 'End Break' : 'Start Meal / Rest Break'}
            </button>
          )}

          <button
            onClick={() => {
              setIsClockedIn(!isClockedIn);
              setOnBreak(false);
              if (!isClockedIn) setClockInTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
            }}
            className={`w-full py-3 rounded-xl font-bold text-sm transition-colors shadow-lg ${
              isClockedIn ? 'bg-rose-600 hover:bg-rose-500 text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {isClockedIn ? 'Clock Out' : 'Clock In'}
          </button>

          <button
            onClick={onExitToHub}
            className="w-full py-3 text-slate-400 hover:text-white text-xs font-bold"
          >
            Close to Hub
          </button>
        </div>
      </div>
    </div>
  );
};
