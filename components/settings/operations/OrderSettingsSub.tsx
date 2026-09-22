import React, { useState, useEffect } from 'react';
import { CheckCircle2, Utensils, Flame, UserCheck, Printer, RefreshCw } from 'lucide-react';

interface OrderSettings {
  autoFireOnPay: boolean;
  autoFireOnBack: boolean;
  requireSeatSelection: boolean;
  printOnFire: boolean;
  autoClearOnPayment: boolean;
}

const DEFAULT_SETTINGS: OrderSettings = {
  autoFireOnPay: true,
  autoFireOnBack: true,
  requireSeatSelection: false,
  printOnFire: true,
  autoClearOnPayment: true
};

interface OrderSettingsSubProps {
  renderSectionHeader: (title: string, description: string, parentSection?: string) => React.ReactNode;
}

export const OrderSettingsSub: React.FC<OrderSettingsSubProps> = ({ renderSectionHeader }) => {
  const [settings, setSettings] = useState<OrderSettings>(DEFAULT_SETTINGS);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('byte_dining_order_settings');
      if (stored) {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(stored) });
      }
    } catch (e) {
      console.error('Error loading order settings', e);
    }
  }, []);

  const handleToggle = (key: keyof OrderSettings) => {
    const next = { ...settings, [key]: !settings[key] };
    setSettings(next);
    localStorage.setItem('byte_dining_order_settings', JSON.stringify(next));
    
    setSavedNotice("Order settings auto-saved!");
    const timer = setTimeout(() => setSavedNotice(null), 2500);
    return () => clearTimeout(timer);
  };

  return (
    <div className="max-w-4xl animate-fade-in pb-20 space-y-8">
      {renderSectionHeader("Dining & Order Settings", "Configure automated service rules, kitchen printing, and automatic firing policies for table orders.", "Business operations")}

      {savedNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 text-sm font-bold animate-fade-in">
          <CheckCircle2 size={18} className="text-emerald-600" /> {savedNotice}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
        <h3 className="font-black text-slate-900 uppercase tracking-wider text-xs text-slate-400 mb-2">Automated Kitchen Policies</h3>
        
        <div className="space-y-4">
          {/* Auto-fire when Pay clicked */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
            <div className="flex items-start gap-3.5 pr-4">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shrink-0 mt-0.5">
                <Flame size={18} />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Auto-fire Order on Pay Click</h4>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Automatically fire all pending items to the kitchen when checking out or processing a payment.</p>
              </div>
            </div>
            <button
              onClick={() => handleToggle('autoFireOnPay')}
              className={`w-12 h-6 rounded-full relative transition-colors shrink-0 ${settings.autoFireOnPay ? 'bg-indigo-600' : 'bg-slate-200'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.autoFireOnPay ? 'right-1' : 'left-1'}`} />
            </button>
          </div>

          {/* Auto-fire when exiting/going back */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
            <div className="flex items-start gap-3.5 pr-4">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0 mt-0.5">
                <RefreshCw size={18} />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Auto-fire Order on Back / Exit</h4>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Automatically send all pending dining items to the kitchen upon exiting an order or going back to the floor plan.</p>
              </div>
            </div>
            <button
              onClick={() => handleToggle('autoFireOnBack')}
              className={`w-12 h-6 rounded-full relative transition-colors shrink-0 ${settings.autoFireOnBack ? 'bg-indigo-600' : 'bg-slate-200'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.autoFireOnBack ? 'right-1' : 'left-1'}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
        <h3 className="font-black text-slate-900 uppercase tracking-wider text-xs text-slate-400 mb-2">Service & Seat Settings</h3>

        <div className="space-y-4">
          {/* Require Seat Selection */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
            <div className="flex items-start gap-3.5 pr-4">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0 mt-0.5">
                <UserCheck size={18} />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Require Seat Assignment</h4>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Force servers to select or assign a guest seat number for every item added to the ticket.</p>
              </div>
            </div>
            <button
              onClick={() => handleToggle('requireSeatSelection')}
              className={`w-12 h-6 rounded-full relative transition-colors shrink-0 ${settings.requireSeatSelection ? 'bg-indigo-600' : 'bg-slate-200'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.requireSeatSelection ? 'right-1' : 'left-1'}`} />
            </button>
          </div>

          {/* Print on Fire */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
            <div className="flex items-start gap-3.5 pr-4">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg shrink-0 mt-0.5">
                <Printer size={18} />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Print Ticket Automatically</h4>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Instantly print a physical kitchen receipt/chit when items are fired to the hot line or expo station.</p>
              </div>
            </div>
            <button
              onClick={() => handleToggle('printOnFire')}
              className={`w-12 h-6 rounded-full relative transition-colors shrink-0 ${settings.printOnFire ? 'bg-indigo-600' : 'bg-slate-200'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.printOnFire ? 'right-1' : 'left-1'}`} />
            </button>
          </div>

          {/* Auto-clear tables on payment */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
            <div className="flex items-start gap-3.5 pr-4">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg shrink-0 mt-0.5">
                <Utensils size={18} />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Auto-clear Table on Paid</h4>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Automatically mark table status as Available once the transaction balance reaches zero.</p>
              </div>
            </div>
            <button
              onClick={() => handleToggle('autoClearOnPayment')}
              className={`w-12 h-6 rounded-full relative transition-colors shrink-0 ${settings.autoClearOnPayment ? 'bg-indigo-600' : 'bg-slate-200'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.autoClearOnPayment ? 'right-1' : 'left-1'}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
