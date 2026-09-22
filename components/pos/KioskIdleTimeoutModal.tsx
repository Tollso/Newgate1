import React from 'react';
import { AlertCircle, RotateCcw, Check } from 'lucide-react';

interface KioskIdleTimeoutModalProps {
  showWarning: boolean;
  countdownSeconds: number;
  onExtendSession: () => void;
  onResetSession: () => void;
  theme: { bg: string; bgHover: string; text: string; light: string };
}

export const KioskIdleTimeoutModal: React.FC<KioskIdleTimeoutModalProps> = ({
  showWarning,
  countdownSeconds,
  onExtendSession,
  onResetSession,
  theme
}) => {
  if (!showWarning) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-lg animate-fade-in p-6">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 text-center animate-scale-in border border-slate-200">
        
        {/* Animated Countdown Ring / Icon */}
        <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-amber-200 animate-ping opacity-40" />
          <div className="w-24 h-24 rounded-full bg-amber-50 border-4 border-amber-500 flex flex-col items-center justify-center text-amber-600 shadow-lg">
            <span className="text-3xl font-black">{countdownSeconds}</span>
            <span className="text-[10px] font-extrabold uppercase tracking-widest -mt-1">Sec</span>
          </div>
        </div>

        <h3 className="text-2xl font-black text-slate-900 mb-2">Are you still there?</h3>
        <p className="text-sm font-medium text-slate-500 mb-8 max-w-xs mx-auto">
          Your order will reset in <strong className="text-amber-600 font-bold">{countdownSeconds} seconds</strong> to protect your privacy and clear the kiosk for the next guest.
        </p>

        <div className="space-y-3">
          <button
            onClick={onExtendSession}
            className={`w-full min-h-[56px] py-4 px-6 rounded-2xl font-black text-base flex items-center justify-center gap-2 ${theme.bg} text-white ${theme.bgHover} shadow-xl active:scale-98 transition-all`}
          >
            <Check size={22} />
            I'm Still Ordering!
          </button>

          <button
            onClick={onResetSession}
            className="w-full min-h-[52px] py-3 px-6 rounded-2xl font-bold text-sm text-slate-500 bg-slate-100 hover:bg-slate-200 hover:text-slate-800 flex items-center justify-center gap-2 transition-all"
          >
            <RotateCcw size={18} />
            Reset & Start Over
          </button>
        </div>

      </div>
    </div>
  );
};
