import React, { useEffect } from 'react';
import { Utensils, ShoppingBag, Coffee, Sun, Sunset, Moon } from 'lucide-react';
import { OperatingMode } from '../../types';

interface KioskSplashViewProps {
  welcomeMessage: string;
  operatingMode?: OperatingMode;
  orderType: 'Dine In' | 'Takeout' | null;
  setOrderType: (type: 'Dine In' | 'Takeout' | null) => void;
  intentMode: 'QUICK_CAFE' | 'FULL_MENU' | null;
  setIntentMode: (mode: 'QUICK_CAFE' | 'FULL_MENU' | null) => void;
  timePeriodLabel: string;
  isMorning: boolean;
  isAfternoon: boolean;
}

export const KioskSplashView: React.FC<KioskSplashViewProps> = ({
  welcomeMessage,
  operatingMode,
  orderType,
  setOrderType,
  intentMode,
  setIntentMode,
  timePeriodLabel,
  isMorning,
  isAfternoon
}) => {
  // Auto-route based on configured Operating Mode when orderType is chosen
  useEffect(() => {
    if (orderType && !intentMode) {
      if (operatingMode === 'Coffee Only') {
        setIntentMode('QUICK_CAFE');
      } else if (operatingMode === 'Restaurant Only') {
        setIntentMode('FULL_MENU');
      }
    }
  }, [orderType, intentMode, operatingMode, setIntentMode]);

  return (
    <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-8 text-white relative overflow-hidden select-none">
      {/* Dynamic Time Badge */}
      <div className="absolute top-8 left-8 flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-xs font-bold text-amber-300">
        {isMorning ? <Sun size={16} /> : isAfternoon ? <Sunset size={16} /> : <Moon size={16} />}
        <span>{timePeriodLabel}</span>
      </div>

      <div className="max-w-2xl text-center z-10 animate-fade-in space-y-8">
        <div>
          <span className="text-xs font-black uppercase tracking-[0.3em] text-indigo-400">Welcome to Byte Venue</span>
          <h1 className="text-5xl font-black tracking-tight mt-2">{welcomeMessage || 'Tap below to start your order'}</h1>
        </div>

        {!orderType ? (
          /* STEP A: Dine In vs Takeout */
          <div className="space-y-4">
            <p className="text-slate-300 text-sm font-semibold">Step 1: Where will you be dining today?</p>
            <div className="grid grid-cols-2 gap-6">
              <button
                onClick={() => setOrderType('Dine In')}
                className="p-8 min-h-[140px] rounded-3xl bg-white/10 hover:bg-white/20 border-2 border-white/20 hover:border-indigo-400 transition-all flex flex-col items-center gap-4 group hover:scale-105 shadow-2xl active:scale-98"
              >
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/30 flex items-center justify-center group-hover:scale-110 transition-transform text-indigo-300">
                  <Utensils size={36} />
                </div>
                <span className="text-2xl font-black">Dine-In</span>
                <span className="text-xs text-slate-300 font-medium">Table service with tent delivery</span>
              </button>

              <button
                onClick={() => setOrderType('Takeout')}
                className="p-8 min-h-[140px] rounded-3xl bg-white/10 hover:bg-white/20 border-2 border-white/20 hover:border-emerald-400 transition-all flex flex-col items-center gap-4 group hover:scale-105 shadow-2xl active:scale-98"
              >
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/30 flex items-center justify-center group-hover:scale-110 transition-transform text-emerald-300">
                  <ShoppingBag size={36} />
                </div>
                <span className="text-2xl font-black">Takeout</span>
                <span className="text-xs text-slate-300 font-medium">Counter pickup to go</span>
              </button>
            </div>
          </div>
        ) : (
          /* STEP B: Fork in the Road - Quick Cafe vs Full Menu */
          <div className="space-y-4 animate-scale-in">
            <div className="flex items-center justify-center gap-2">
              <span className="text-xs font-bold text-slate-400">Selected: <strong className="text-white uppercase">{orderType}</strong></span>
              <button onClick={() => setOrderType(null)} className="text-xs font-bold text-indigo-400 underline hover:text-indigo-300 min-h-[48px] px-2 flex items-center">Change</button>
            </div>

            <p className="text-slate-200 text-sm font-semibold">Step 2: How would you like to browse our menu?</p>
            <div className="grid grid-cols-2 gap-6">
              <button
                onClick={() => setIntentMode('QUICK_CAFE')}
                className="p-8 min-h-[160px] rounded-3xl bg-gradient-to-br from-amber-500/20 to-amber-700/30 hover:from-amber-500/30 hover:to-amber-700/40 border-2 border-amber-400/50 hover:border-amber-400 transition-all flex flex-col items-center text-center gap-4 group hover:scale-105 shadow-2xl relative overflow-hidden active:scale-98"
              >
                {isMorning && (
                  <span className="absolute top-3 right-3 bg-amber-400 text-slate-900 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Morning Peak
                  </span>
                )}
                <div className="w-16 h-16 rounded-2xl bg-amber-400/20 text-amber-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Coffee size={36} />
                </div>
                <div>
                  <span className="text-2xl font-black block">Quick Drinks & Pastries</span>
                  <span className="text-xs text-amber-200/80 font-medium mt-1 block">Rapid 3-tap coffee, lattes, teas & bakery items</span>
                </div>
              </button>

              <button
                onClick={() => setIntentMode('FULL_MENU')}
                className="p-8 min-h-[160px] rounded-3xl bg-gradient-to-br from-indigo-500/20 to-indigo-700/30 hover:from-indigo-500/30 hover:to-indigo-700/40 border-2 border-indigo-400/50 hover:border-indigo-400 transition-all flex flex-col items-center text-center gap-4 group hover:scale-105 shadow-2xl active:scale-98"
              >
                <div className="w-16 h-16 rounded-2xl bg-indigo-400/20 text-indigo-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Utensils size={36} />
                </div>
                <div>
                  <span className="text-2xl font-black block">Full Restaurant Menu</span>
                  <span className="text-xs text-indigo-200/80 font-medium mt-1 block">Burgers, combos, entrees, sides & beverages</span>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
