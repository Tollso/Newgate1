import React from 'react';
import { Coffee, Utensils, GitFork, Sliders, Zap, Sparkles } from 'lucide-react';
import { OperatingMode, KioskConfig } from '../../../types';

interface OperatingModeSelectorProps {
  kioskConfig?: KioskConfig;
  setKioskConfig?: React.Dispatch<React.SetStateAction<KioskConfig>>;
}

export const OperatingModeSelector: React.FC<OperatingModeSelectorProps> = ({
  kioskConfig,
  setKioskConfig
}) => {
  const currentMode = kioskConfig?.operatingMode || 'Hybrid (Both)';

  const modes: Array<{
    id: OperatingMode;
    title: string;
    description: string;
    icon: any;
    badge: string;
    flowPreview: string;
  }> = [
    {
      id: 'Coffee Only',
      title: 'Fast-Tap Coffee & Bakery',
      description: 'Streamlined 3-tap ordering optimized for rapid espresso, cold brews, and pastry rushes.',
      icon: Coffee,
      badge: 'High Velocity',
      flowPreview: 'Bypasses fork screen -> Opens directly into 1-tap beverage grid.'
    },
    {
      id: 'Restaurant Only',
      title: 'Guided Restaurant Wizard',
      description: 'Course-based step-by-step wizard for combos, proteins, sides, and table tent delivery.',
      icon: Utensils,
      badge: 'Full Service',
      flowPreview: 'Opens directly into structured course & combo customization flow.'
    },
    {
      id: 'Hybrid (Both)',
      title: 'Dual-Intent Fork in Road',
      description: 'Presents guests with a split welcome fork ("Quick Drinks" vs "Full Restaurant Menu").',
      icon: GitFork,
      badge: 'Most Popular',
      flowPreview: 'Welcome Fork Screen -> Guest picks Quick Cafe or Full Dining Menu.'
    },
    {
      id: 'Custom',
      title: 'Custom Venue Flow',
      description: 'Define custom flow names and rules for pop-ups, events, or multi-tenant venues.',
      icon: Sliders,
      badge: 'Flexible',
      flowPreview: 'Custom rules configured via specialized business logic routes.'
    }
  ];

  const handleModeChange = (mode: OperatingMode) => {
    if (setKioskConfig) {
      setKioskConfig(prev => ({
        ...(prev || {
          welcomeMessage: 'Welcome! What are you craving?',
          themeColor: 'indigo',
          layout: 'bottom-cart',
          requireCustomerName: false,
          showItemImages: true,
          timeoutSeconds: 60
        }),
        operatingMode: mode
      }));
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Zap className="text-amber-500" size={20} />
            Venue Operating Mode Selector
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Controls the primary guest interaction flow, splash screen architecture, and ordering path.
          </p>
        </div>
        <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full border border-indigo-100">
          Active: {currentMode}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {modes.map(mode => {
          const Icon = mode.icon;
          const isSelected = currentMode === mode.id;

          return (
            <div
              key={mode.id}
              onClick={() => handleModeChange(mode.id)}
              className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/50 shadow-md ring-2 ring-indigo-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      isSelected ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Icon size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">{mode.title}</h4>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      {mode.badge}
                    </span>
                  </div>
                </div>

                <input
                  type="radio"
                  name="operatingMode"
                  checked={isSelected}
                  onChange={() => handleModeChange(mode.id)}
                  className="w-5 h-5 text-indigo-600 border-slate-300 focus:ring-indigo-500 mt-1 cursor-pointer"
                />
              </div>

              <p className="text-xs text-slate-600 font-medium leading-relaxed mb-4">
                {mode.description}
              </p>

              <div className="pt-3 border-t border-slate-200/60 flex items-center gap-2 text-[11px] font-semibold text-slate-500">
                <Sparkles size={14} className="text-amber-500 shrink-0" />
                <span>{mode.flowPreview}</span>
              </div>
            </div>
          );
        })}
      </div>

      {currentMode === 'Custom' && (
        <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl animate-fade-in space-y-2">
          <label className="block text-xs font-bold text-slate-700">Custom Flow Name</label>
          <input
            type="text"
            value={kioskConfig?.customFlowName || ''}
            onChange={e => {
              if (setKioskConfig) {
                setKioskConfig(prev => ({
                  ...(prev || {
                    operatingMode: 'Custom',
                    welcomeMessage: 'Welcome! What are you craving?',
                    themeColor: 'indigo',
                    layout: 'bottom-cart',
                    requireCustomerName: false,
                    showItemImages: true,
                    timeoutSeconds: 60
                  }),
                  customFlowName: e.target.value
                }));
              }
            }}
            placeholder="e.g. Festival VIP Bar Express"
            className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-indigo-600"
          />
        </div>
      )}
    </div>
  );
};
