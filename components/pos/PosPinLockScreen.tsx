import React, { useState } from 'react';
import { Lock, Delete, ArrowRight, Shield, RefreshCw, UserCheck, AlertCircle } from 'lucide-react';
import { Employee } from '../../types';
import { NativeBridge } from '../../services/nativeBridge';

interface PosPinLockScreenProps {
  employees: Employee[];
  terminalName?: string;
  merchantName?: string;
  onUnlock: (employee: Employee) => void;
  onResetDevice?: () => void;
}

export const PosPinLockScreen: React.FC<PosPinLockScreenProps> = ({
  employees,
  terminalName = 'Front Register 1 (DEV-POS-01)',
  merchantName = 'Lumi Restaurant & Bar',
  onUnlock,
  onResetDevice,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleKeyPress = (num: string) => {
    if (pin.length >= 6) return;
    NativeBridge.beep(2200, 40);
    setError(null);
    const newPin = pin + num;
    setPin(newPin);

    // Auto-check if 4 digits
    if (newPin.length === 4) {
      verifyPin(newPin);
    }
  };

  const handleBackspace = () => {
    NativeBridge.beep(1800, 40);
    setError(null);
    setPin(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    NativeBridge.beep(1600, 50);
    setError(null);
    setPin('');
  };

  const verifyPin = (candidatePin: string) => {
    // 1. Check exact pin match in employee list
    const found = employees.find(e => {
      const ePin = (e as any).pin || (e as any).passcode || '1234';
      return ePin === candidatePin;
    });

    if (found) {
      NativeBridge.beep(2800, 80);
      onUnlock(found);
      return;
    }

    // Default master or standard test PINs
    if (candidatePin === '1234' || candidatePin === '0000' || candidatePin === '1111') {
      const fallback = employees[0] || {
        id: 'EMP-01',
        name: 'Manager Alex',
        role: 'Admin',
        permissions: ['*'],
      };
      NativeBridge.beep(2800, 80);
      onUnlock(fallback as Employee);
      return;
    }

    // Invalid PIN
    NativeBridge.beep(800, 200);
    setError('Invalid Employee PIN. Try 1234 or your staff PIN.');
    setTimeout(() => {
      setPin('');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-between p-6 select-none text-white">
      {/* Top Terminal Info */}
      <header className="w-full max-w-md flex items-center justify-between text-xs text-slate-400 font-mono pt-4">
        <div>
          <div className="text-white font-bold text-sm tracking-tight">{merchantName}</div>
          <div className="text-indigo-400">{terminalName}</div>
        </div>
        <div className="text-right">
          <div>{new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</div>
          <div className="text-slate-500 font-bold">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
      </header>

      {/* Main PIN Pad Area */}
      <div className="w-full max-w-sm flex flex-col items-center space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center mx-auto shadow-lg shadow-indigo-950/50">
            <Lock size={26} />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white">
            Employee PIN Login
          </h2>
          <p className="text-xs text-slate-400">
            Enter your 4-digit staff PIN to unlock terminal session
          </p>
        </div>

        {/* PIN Indicators */}
        <div className="flex items-center gap-4 py-2">
          {[0, 1, 2, 3].map((index) => {
            const isFilled = pin.length > index;
            return (
              <div
                key={index}
                className={`w-4 h-4 rounded-full transition-all duration-150 ${
                  isFilled
                    ? 'bg-indigo-400 scale-125 shadow-lg shadow-indigo-500/50'
                    : 'bg-slate-800 border border-slate-700'
                }`}
              />
            );
          })}
        </div>

        {error && (
          <div className="p-2.5 bg-rose-950/70 border border-rose-800 text-rose-300 rounded-xl text-xs flex items-center gap-2 animate-shake">
            <AlertCircle size={15} className="text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Numeric Keypad Grid */}
        <div className="grid grid-cols-3 gap-3.5 w-full">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              onClick={() => handleKeyPress(digit)}
              className="h-16 rounded-2xl bg-slate-900/90 hover:bg-slate-800 active:bg-indigo-600 active:text-white border border-slate-800/80 text-2xl font-black text-white shadow-md transition-all transform active:scale-95 flex items-center justify-center"
            >
              {digit}
            </button>
          ))}

          <button
            onClick={handleClear}
            className="h-16 rounded-2xl bg-slate-900/40 hover:bg-slate-850 border border-slate-800/60 text-xs font-bold text-slate-400 active:text-white uppercase transition-all flex items-center justify-center"
          >
            Clear
          </button>

          <button
            onClick={() => handleKeyPress('0')}
            className="h-16 rounded-2xl bg-slate-900/90 hover:bg-slate-800 active:bg-indigo-600 active:text-white border border-slate-800/80 text-2xl font-black text-white shadow-md transition-all transform active:scale-95 flex items-center justify-center"
          >
            0
          </button>

          <button
            onClick={handleBackspace}
            className="h-16 rounded-2xl bg-slate-900/40 hover:bg-slate-850 border border-slate-800/60 text-slate-400 active:text-white transition-all flex items-center justify-center"
            title="Backspace"
          >
            <Delete size={22} />
          </button>
        </div>

        {/* Quick Staff Fast-Select for Testing */}
        <div className="w-full pt-2">
          <div className="text-[10px] uppercase font-mono tracking-wider text-slate-500 text-center mb-2">
            Quick Shift Unlock (Active Staff)
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {employees.slice(0, 4).map((emp) => (
              <button
                key={emp.id}
                onClick={() => {
                  NativeBridge.beep(2800, 80);
                  onUnlock(emp);
                }}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-bold text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>{emp.name}</span>
                <span className="text-[10px] text-slate-500 uppercase font-mono">({emp.role})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer / Reset Action */}
      <footer className="w-full max-w-md flex items-center justify-between text-[11px] text-slate-600 py-3 border-t border-slate-900">
        <span>Security: Local PIN Auth • Device Bound</span>
        {onResetDevice && (
          <button
            onClick={onResetDevice}
            className="text-slate-500 hover:text-rose-400 transition-colors"
          >
            Re-provision Terminal
          </button>
        )}
      </footer>
    </div>
  );
};
