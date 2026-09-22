import React, { useState } from 'react';
import { BookOpen, ChefHat, Printer, AlertCircle } from 'lucide-react';

interface EditorProps {
  categoryId: string;
  selectedPageId: string | null;
  onFieldChange: () => void;
}

export const MenuAndKitchenEditor: React.FC<EditorProps> = ({
  categoryId,
  selectedPageId,
  onFieldChange
}) => {
  const [happyHourEnabled, setHappyHourEnabled] = useState(true);
  const [auto86Behavior, setAuto86Behavior] = useState('Label Sold-Out');
  const [standalonePrepStations, setStandalonePrepStations] = useState(true);

  if (categoryId === 'menus_pricing') {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-indigo-600 font-bold">
            <BookOpen size={18} />
            <h3 className="text-sm uppercase tracking-wider text-slate-800">7. Menu Availability & Scheduled Happy Hour Pricing</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Happy Hour Auto-Schedule</label>
              <select
                value={happyHourEnabled ? 'Active' : 'Disabled'}
                onChange={(e) => { setHappyHourEnabled(e.target.value === 'Active'); onFieldChange(); }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
              >
                <option value="Active">Mon-Fri 4:00 PM - 7:00 PM (Active)</option>
                <option value="Disabled">Disabled</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Sold-Out (86'd) Touchscreen Display Rule</label>
              <select
                value={auto86Behavior}
                onChange={(e) => { setAuto86Behavior(e.target.value); onFieldChange(); }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
              >
                <option value="Label Sold-Out">Label as Sold-Out (Greyed out tile)</option>
                <option value="Hide Completely">Hide Item completely from menu</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-indigo-50/70 border border-indigo-200 p-5 rounded-2xl space-y-3">
        <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs">
          <ChefHat size={16} className="text-indigo-600" />
          <span>Kitchen System Design: Independent Prep Stations & Item Routing</span>
        </div>
        <p className="text-xs text-indigo-950 leading-relaxed font-medium">
          Toast's kitchen configuration includes preparation stations, routing, and fulfillment behavior; your app should give these their own settings instead of placing everything under "Printers."
        </p>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="standalonePrep"
            checked={standalonePrepStations}
            onChange={(e) => { setStandalonePrepStations(e.target.checked); onFieldChange(); }}
            className="rounded text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="standalonePrep" className="text-xs font-bold text-slate-900">
            Maintain independent Preparation Stations & KDS Routing matrix decoupled from physical printer hardware
          </label>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-indigo-600 font-bold">
          <ChefHat size={18} />
          <h3 className="text-sm uppercase tracking-wider text-slate-800">8. Kitchen Preparation Stations & Target Turn Times</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="font-bold text-xs text-slate-800 block">Grill Station</span>
            <span className="text-[10px] text-slate-500">Target Prep Time: 12 mins</span>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="font-bold text-xs text-slate-800 block">Cold / Pantry Station</span>
            <span className="text-[10px] text-slate-500">Target Prep Time: 6 mins</span>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="font-bold text-xs text-slate-800 block">Main Bar Station</span>
            <span className="text-[10px] text-slate-500">Target Prep Time: 3 mins</span>
          </div>
        </div>
      </div>
    </div>
  );
};
