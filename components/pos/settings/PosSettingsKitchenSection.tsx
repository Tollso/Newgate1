import React, { useState, useEffect } from 'react';
import { ChefHat, Plus, Trash2, Save, CheckCircle2, Volume2, Monitor, Printer } from 'lucide-react';
import { Employee } from '../../../types';
import { KitchenRoutingService, StationConfig, KDSRoutingMode } from '../../../services/kitchenRoutingService';

interface PosSettingsKitchenSectionProps {
  currentUser: Employee;
}

export const PosSettingsKitchenSection: React.FC<PosSettingsKitchenSectionProps> = ({
  currentUser,
}) => {
  const [stations, setStations] = useState<StationConfig[]>([]);
  const [newStationName, setNewStationName] = useState('');
  const [newStationMode, setNewStationMode] = useState<KDSRoutingMode>('BOTH');
  const [newStationColor, setNewStationColor] = useState('indigo');
  const [soundAlertEnabled, setSoundAlertEnabled] = useState(true);
  const [savedNotification, setSavedNotification] = useState<string | null>(null);

  useEffect(() => {
    KitchenRoutingService.getStations().then(setStations);
  }, []);

  const handleAddStation = async () => {
    if (!newStationName.trim()) return;
    const newId = newStationName.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const created: StationConfig = {
      id: newId,
      name: newStationName.trim(),
      deliveryMode: newStationMode,
      color: newStationColor,
    };
    await KitchenRoutingService.registerCustomStation(created);
    setStations(await KitchenRoutingService.getStations());
    setNewStationName('');
    setSavedNotification(`Created kitchen station "${created.name}".`);
    setTimeout(() => setSavedNotification(null), 3000);
  };

  const handleModeChange = async (stId: string, mode: KDSRoutingMode) => {
    const updated = stations.map(s => s.id === stId ? { ...s, deliveryMode: mode } : s);
    setStations(updated);
    const target = updated.find(s => s.id === stId);
    if (target) {
      await KitchenRoutingService.registerCustomStation(target);
    }
    setSavedNotification(`Routing policy updated for ${stId}.`);
    setTimeout(() => setSavedNotification(null), 2500);
  };

  const colors = ['indigo', 'emerald', 'amber', 'rose', 'cyan', 'purple'];

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ChefHat className="text-indigo-400" size={24} />
            <h3 className="text-xl font-black text-white">Kitchen Display & Routing Stations</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Configure line prep stations, Expo ticket controllers, and independent station delivery policies (KDS vs. Impact Printer).
          </p>
        </div>

        {savedNotification && (
          <div className="px-4 py-2 bg-emerald-950/80 border border-emerald-600/60 rounded-xl flex items-center gap-2 text-emerald-300 text-xs font-semibold">
            <CheckCircle2 size={16} />
            <span>{savedNotification}</span>
          </div>
        )}
      </div>

      {/* Station List */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <h4 className="text-sm font-black uppercase tracking-wider text-slate-300">
          Configured Preparation Stations ({stations.length})
        </h4>

        <div className="space-y-3">
          {stations.map(st => (
            <div
              key={st.id}
              className="p-4 bg-slate-800/70 rounded-2xl border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/30 text-indigo-300 font-bold flex items-center justify-center text-sm border border-indigo-500/30">
                  {st.name.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-white text-sm flex items-center gap-2">
                    {st.name}
                    <span className="text-[10px] font-mono text-slate-400 font-normal">({st.id})</span>
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                    <span>Delivery Mode: <strong className="text-indigo-300">{st.deliveryMode}</strong></span>
                  </div>
                </div>
              </div>

              {/* Delivery policy selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-semibold mr-1">Policy:</span>
                {(['KDS_ONLY', 'PRINTER_ONLY', 'BOTH'] as KDSRoutingMode[]).map(mode => (
                  <button
                    key={mode}
                    onClick={() => handleModeChange(st.id, mode)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      st.deliveryMode === mode
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-700/80 text-slate-400 hover:text-white'
                    }`}
                  >
                    {mode === 'KDS_ONLY' ? 'KDS Only' : mode === 'PRINTER_ONLY' ? 'Printer Only' : 'Both'}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Custom Station Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <h4 className="text-sm font-black uppercase tracking-wider text-slate-300">
          Create New Kitchen Station
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          <div className="sm:col-span-5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Station Name
            </label>
            <input
              type="text"
              placeholder="e.g. Pizza Deck, Cold Apps, Dessert"
              value={newStationName}
              onChange={(e) => setNewStationName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="sm:col-span-4">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Initial Delivery Mode
            </label>
            <select
              value={newStationMode}
              onChange={(e) => setNewStationMode(e.target.value as KDSRoutingMode)}
              className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="BOTH">KDS & Impact Printer</option>
              <option value="KDS_ONLY">KDS Screen Only</option>
              <option value="PRINTER_ONLY">Kitchen Printer Only</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <button
              onClick={handleAddStation}
              disabled={!newStationName.trim()}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/20"
            >
              <Plus size={16} />
              Add Station
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
