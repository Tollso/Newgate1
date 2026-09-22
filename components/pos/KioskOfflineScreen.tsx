import React, { useState, useEffect } from 'react';
import { WifiOff, RefreshCw, ShieldAlert, MonitorSmartphone } from 'lucide-react';

interface KioskOfflineScreenProps {
  isOffline: boolean;
  onRetryConnection: () => void;
  theme: { bg: string; text: string; light: string };
}

export const KioskOfflineScreen: React.FC<KioskOfflineScreenProps> = ({
  isOffline,
  onRetryConnection,
  theme
}) => {
  const [isRetrying, setIsRetrying] = useState(false);

  if (!isOffline) return null;

  const handleManualRetry = () => {
    setIsRetrying(true);
    setTimeout(() => {
      onRetryConnection();
      setIsRetrying(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[110] flex flex-col items-center justify-center bg-slate-900 text-white p-8 animate-fade-in">
      <div className="max-w-md w-full text-center space-y-6">
        
        {/* Offline Icon Badge */}
        <div className="w-24 h-24 rounded-3xl bg-rose-500/10 border-2 border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto shadow-2xl animate-pulse">
          <WifiOff size={44} />
        </div>

        <div>
          <span className="text-xs font-black uppercase tracking-[0.3em] text-rose-400">Connection Interrupted</span>
          <h2 className="text-3xl font-black mt-1">Terminal Temporarily Unavailable</h2>
          <p className="text-sm font-medium text-slate-400 mt-2">
            The kiosk has lost communication with the store network. Please inform venue staff or try reconnecting below.
          </p>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 text-left text-xs text-slate-300 space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-mono text-slate-400">POS Network Node:</span>
            <span className="font-bold text-amber-400">Offline / Unreachable</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-mono text-slate-400">Auto-Reconnect:</span>
            <span className="font-bold text-emerald-400">Active (Polling 5s)</span>
          </div>
        </div>

        <button
          onClick={handleManualRetry}
          disabled={isRetrying}
          className={`w-full min-h-[56px] py-4 px-6 rounded-2xl font-black text-base flex items-center justify-center gap-3 bg-white text-slate-900 hover:bg-slate-100 transition-all shadow-xl active:scale-98 ${
            isRetrying ? 'opacity-80 cursor-wait' : ''
          }`}
        >
          <RefreshCw size={20} className={isRetrying ? 'animate-spin text-indigo-600' : 'text-slate-700'} />
          {isRetrying ? 'Testing Connection...' : 'Retry Connection Now'}
        </button>

      </div>
    </div>
  );
};
