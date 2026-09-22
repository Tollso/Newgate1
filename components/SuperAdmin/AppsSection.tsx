
import React from 'react';
import { Link } from 'lucide-react';
import { MOCK_SYSTEM_MODULES } from '../../constants';
import { AppIntegrationConfig } from '../../types';

interface AppsSectionProps {
  integrationConfig?: AppIntegrationConfig;
  onToggleIntegration?: (key: keyof AppIntegrationConfig) => void;
}

const AppsSection: React.FC<AppsSectionProps> = ({ integrationConfig, onToggleIntegration }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="text-2xl font-black text-slate-800 tracking-tighter uppercase">App Orchestration</h3>
        <p className="text-slate-500 font-medium">Connect platform micro-services</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
          <h4 className="font-black text-slate-800 text-sm uppercase tracking-widest mb-6">Module Registry</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_SYSTEM_MODULES.map(mod => (
              <div key={mod.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <p className="font-bold text-slate-900 leading-tight">{mod.name}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{mod.category}</p>
                </div>
                <div className={`h-2.5 w-2.5 rounded-full ${mod.isEnabled ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-300'}`} />
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1 bg-indigo-900 text-white rounded-3xl shadow-2xl p-8 flex flex-col">
          <div className="p-3 bg-white/10 rounded-2xl w-fit mb-6">
            <Link size={24} className="text-indigo-300" />
          </div>
          <h4 className="text-2xl font-black tracking-tight mb-2">Sync Engine</h4>
          <p className="text-indigo-200 text-sm font-medium mb-8">Establish secure data flows between core POS and auxiliary services.</p>
          
          {integrationConfig && onToggleIntegration && (
            <div className="space-y-4">
              {[
                { key: 'reservation_pos', label: 'Reservation ↔ POS', desc: 'Sync floor state' },
                { key: 'scheduling_pos', label: 'Scheduling ↔ POS', desc: 'Login enforcement' },
                { key: 'kdsEnabled', label: 'Kitchen ↔ POS', desc: 'Order routing' }
              ].map(item => (
                <div key={item.key} className="bg-indigo-800/40 p-4 rounded-2xl border border-indigo-700/50">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-black text-xs uppercase tracking-widest">{item.label}</span>
                    <button 
                      onClick={() => onToggleIntegration(item.key as any)}
                      className={`w-10 h-5 rounded-full relative transition-all ${integrationConfig[item.key as keyof AppIntegrationConfig] ? 'bg-emerald-500' : 'bg-indigo-950'}`}
                    >
                      <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${integrationConfig[item.key as keyof AppIntegrationConfig] ? 'translate-x-5' : ''}`}></div>
                    </button>
                  </div>
                  <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-tighter">{item.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppsSection;
