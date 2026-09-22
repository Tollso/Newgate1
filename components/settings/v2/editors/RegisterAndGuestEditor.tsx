import React, { useState } from 'react';
import { ShoppingCart, Utensils, Layout, CheckCircle, Info } from 'lucide-react';

interface EditorProps {
  categoryId: string;
  selectedPageId: string | null;
  onFieldChange: () => void;
}

export const RegisterAndGuestEditor: React.FC<EditorProps> = ({
  categoryId,
  selectedPageId,
  onFieldChange
}) => {
  const [registerMode, setRegisterMode] = useState('Table Service');
  const [reqTableNumber, setReqTableNumber] = useState(true);
  const [reqGuestCount, setReqGuestCount] = useState(true);
  const [separateGuestAreas, setSeparateGuestAreas] = useState(true);

  if (categoryId === 'register_order_behavior') {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-indigo-600 font-bold">
            <ShoppingCart size={18} />
            <h3 className="text-sm uppercase tracking-wider text-slate-800">5. Register Mode & Order Requirements</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Primary Register Mode</label>
              <select
                value={registerMode}
                onChange={(e) => { setRegisterMode(e.target.value); onFieldChange(); }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
              >
                <option value="Table Service">Table Service (Full Service Dining)</option>
                <option value="Quick Service">Quick Service / Counter Order</option>
                <option value="Bar Mode">Bar Tab Mode</option>
                <option value="Kiosk Mode">Self-Ordering Kiosk</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Order Number Prefix</label>
              <input
                type="text"
                defaultValue="ORD-"
                onChange={onFieldChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
              />
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-700">Mandatory Order Creation Prompts</h4>
            <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-700">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={reqTableNumber}
                  onChange={(e) => { setReqTableNumber(e.target.checked); onFieldChange(); }}
                  className="rounded text-indigo-600"
                />
                <span>Require Table Number</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={reqGuestCount}
                  onChange={(e) => { setReqGuestCount(e.target.checked); onFieldChange(); }}
                  className="rounded text-indigo-600"
                />
                <span>Require Guest Count</span>
              </label>
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
          <Utensils size={16} className="text-indigo-600" />
          <span>Architecture: Service Areas, Floor Setup & Table Access Separation</span>
        </div>
        <p className="text-xs text-indigo-950 leading-relaxed font-medium">
          Toast separates service areas, table configuration, and table-service access. That is a useful foundation for your Guest Manager settings.
        </p>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="sepGuestAreas"
            checked={separateGuestAreas}
            onChange={(e) => { setSeparateGuestAreas(e.target.checked); onFieldChange(); }}
            className="rounded text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="sepGuestAreas" className="text-xs font-bold text-slate-900">
            Separate physical service area layout configuration from staff table-service order access roles
          </label>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-indigo-600 font-bold">
          <Layout size={18} />
          <h3 className="text-sm uppercase tracking-wider text-slate-800">6. Floor Plans & Room Areas</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="font-bold text-xs text-slate-800 block">Main Dining Room</span>
            <span className="text-[10px] text-slate-500">18 Tables • Active</span>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="font-bold text-xs text-slate-800 block">Outdoor Patio</span>
            <span className="text-[10px] text-slate-500">12 Tables • Active</span>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="font-bold text-xs text-slate-800 block">Bar & High Tops</span>
            <span className="text-[10px] text-slate-500">14 Stools/Tables • Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};
