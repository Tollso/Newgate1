import React from 'react';
import { InventoryItem, ModifierGroup } from '../../types';
import { Image as ImageIcon, AlertTriangle, CheckCircle2, Circle, Printer, Check } from 'lucide-react';
import { MOCK_PRINTER_LABELS } from '../../constants';

export const ItemModalGeneralTab = ({ formData, setFormData, errorMsg, setErrorMsg, allCategoryNames }: any) => {
  const handleImageUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex gap-4 items-center">
        <div className="w-24 h-24 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 overflow-hidden relative shrink-0">
          {formData.imageUrl ? (
            <img src={formData.imageUrl} alt="Item" className="w-full h-full object-cover" />
          ) : (
            <>
              <ImageIcon size={24} className="mb-1" />
              <span className="text-[10px] font-bold">Image</span>
            </>
          )}
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700 mb-1">Item Image</label>
          <input 
            type="file" 
            accept="image/*"
            onChange={handleImageUpload}
            className="block w-full text-xs text-slate-500 file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
          {formData.imageUrl && (
            <button 
              onClick={() => setFormData({ ...formData, imageUrl: undefined })}
              className="text-xs text-red-500 mt-2 font-medium hover:underline"
            >
              Remove Image
            </button>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Menu Item Name *</label>
        <input 
          type="text" 
          value={formData.name || ''} 
          onChange={e => { setFormData({...formData, name: e.target.value}); if (errorMsg) setErrorMsg(''); }} 
          className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-900" 
          placeholder="e.g. Mezze Plate" 
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">POS Display Name</label>
          <input 
            type="text" 
            value={formData.posName || ''} 
            onChange={e => setFormData({...formData, posName: e.target.value})} 
            className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-900" 
            placeholder="Short name for buttons" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
          <select 
            value={formData.category || ((allCategoryNames || []).length > 0 ? allCategoryNames[0] : 'Uncategorized')}
            onChange={e => setFormData({...formData, category: e.target.value})}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-900"
          >
            {(allCategoryNames || []).map((catName: string) => (
              <option key={catName} value={catName}>{catName}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
        <textarea 
          value={formData.description || ''} 
          onChange={e => setFormData({...formData, description: e.target.value})} 
          className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-900 h-24 resize-none" 
          placeholder="Item description for online menus..."
        ></textarea>
      </div>
    </div>
  );
};

export const ItemModalOptionsTab = ({ formData, setFormData, modifierGroups, toggleModifierGroup, printerLabels }: any) => {
  const activePrinterLabels = (printerLabels && printerLabels.length > 0) ? printerLabels : MOCK_PRINTER_LABELS;

  const rawList = Array.from(new Set([
    ...(formData.printerLabels || []),
    ...(formData.prepStations || [])
  ]));

  const selectedStationIds = activePrinterLabels
    .filter((label: any) => rawList.includes(label.id) || rawList.includes(label.name))
    .map((label: any) => label.id);

  const toggleStation = (stationId: string) => {
    const isCurrentlySelected = selectedStationIds.includes(stationId);
    
    let nextIds: string[];
    if (isCurrentlySelected) {
      nextIds = selectedStationIds.filter((id: string) => id !== stationId);
    } else {
      nextIds = [...selectedStationIds, stationId];
    }

    const nextNames = activePrinterLabels
      .filter((l: any) => nextIds.includes(l.id))
      .map((l: any) => l.name);

    setFormData({
      ...formData,
      printerLabels: nextIds,
      prepStations: nextNames
    });
  };

  const handleSelectAll = () => {
    const allIds = activePrinterLabels.map((l: any) => l.id);
    const allNames = activePrinterLabels.map((l: any) => l.name);
    setFormData({
      ...formData,
      printerLabels: allIds,
      prepStations: allNames
    });
  };

  const handleClearAll = () => {
    setFormData({
      ...formData,
      printerLabels: [],
      prepStations: []
    });
  };

  const selectedCount = selectedStationIds.length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Modifier Groups</label>
        <div className="flex flex-wrap gap-2">
          {modifierGroups.length === 0 ? (
            <span className="text-sm text-slate-500 italic">No modifier groups available.</span>
          ) : (
            modifierGroups.map((group: any) => (
              <button
                key={group.id}
                type="button"
                onClick={() => toggleModifierGroup(group.id)}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors cursor-pointer ${
                  (formData.modifierGroups || []).includes(group.id)
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-bold'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                {group.name}
              </button>
            ))
          )}
        </div>
      </div>
      
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <label className="text-base font-bold text-slate-900">Prep Stations (Routing)</label>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border transition-all ${
                selectedCount > 0 
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                  : 'bg-slate-200 text-slate-600 border-slate-300'
              }`}>
                {selectedCount > 0 ? `✓ ${selectedCount} Station${selectedCount > 1 ? 's' : ''} Selected` : 'No Stations Selected'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Select stations where tickets print or route on KDS screens</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleSelectAll}
              className="px-2.5 py-1 text-xs font-bold bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
            >
              Select All ({activePrinterLabels.length})
            </button>
            {selectedCount > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="px-2.5 py-1 text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {activePrinterLabels.map((label: any) => {
            const isSelected = selectedStationIds.includes(label.id);

            return (
              <button
                key={label.id}
                type="button"
                onClick={() => toggleStation(label.id)}
                className={`p-3.5 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer relative ${
                  isSelected
                    ? 'bg-slate-900 border-slate-900 text-white shadow-lg ring-2 ring-emerald-400'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100/80'
                }`}
              >
                {isSelected ? (
                  <CheckCircle2 size={20} className="text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <Circle size={20} className="text-slate-300 shrink-0 mt-0.5" />
                )}
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className={`font-bold text-sm ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                      {label.name}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-emerald-500 text-white rounded-full shrink-0">
                        ASSIGNED
                      </span>
                    )}
                  </div>
                  <div className={`flex items-center gap-1.5 text-xs mt-1 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                    <Printer size={12} className="shrink-0" />
                    <span className="truncate">{label.assignedPrinter || 'Kitchen Printer'}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Track Inventory</label>
          <p className="text-xs text-slate-500">Deduct stock on sale</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            className="sr-only peer" 
            checked={formData.trackInventory || false}
            onChange={e => setFormData({...formData, trackInventory: e.target.checked})}
          />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
        </label>
      </div>
    </div>
  );
};

export const ItemModalPricingTab = ({ formData, setFormData }: any) => (
  <div className="space-y-4 animate-fade-in">
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Price ($) *</label>
        <input 
          type="number" 
          value={formData.price || ''} 
          onChange={e => setFormData({...formData, price: parseFloat(e.target.value) || 0})} 
          className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-900" 
          step="0.01"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Cost ($)</label>
        <input 
          type="number" 
          value={formData.cost || ''} 
          onChange={e => setFormData({...formData, cost: parseFloat(e.target.value) || 0})} 
          className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-900" 
          step="0.01"
        />
      </div>
    </div>
    
    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mt-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-slate-600 font-medium">Margin</span>
        <span className={`font-bold ${((formData.price || 0) - (formData.cost || 0)) / (formData.price || 1) < 0.2 ? 'text-red-500' : 'text-emerald-600'}`}>
          {formData.price && formData.price > 0 ? (((formData.price - (formData.cost || 0)) / formData.price) * 100).toFixed(1) : '0'}%
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-slate-600 font-medium">Gross Profit</span>
        <span className="font-bold text-slate-800">
          ${((formData.price || 0) - (formData.cost || 0)).toFixed(2)}
        </span>
      </div>
    </div>
  </div>
);

export const ItemModalVisibilityTab = ({ formData, setFormData }: any) => (
  <div className="space-y-4 animate-fade-in">
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
      <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={20} />
      <div>
        <h4 className="text-amber-800 font-bold text-sm mb-1">Visibility Settings</h4>
        <p className="text-amber-700 text-xs leading-relaxed">
          Control where this item appears. Turning off POS visibility will hide it from staff, while hiding from Kiosk will prevent customers from ordering it themselves.
        </p>
      </div>
    </div>
    
    <div className="space-y-3 mt-4">
      <label className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
        <div>
          <span className="block font-bold text-slate-800 text-sm mb-0.5">Show on POS</span>
          <span className="block text-xs text-slate-500">Available on register and tables</span>
        </div>
        <div className="relative inline-flex items-center">
          <input 
            type="checkbox" 
            className="sr-only peer" 
            checked={formData.showOnPos !== false}
            onChange={e => setFormData({...formData, showOnPos: e.target.checked})}
          />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
        </div>
      </label>
      
      <label className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
        <div>
          <span className="block font-bold text-slate-800 text-sm mb-0.5">Show on Kiosk & Online</span>
          <span className="block text-xs text-slate-500">Available for self-service</span>
        </div>
        <div className="relative inline-flex items-center">
          <input 
            type="checkbox" 
            className="sr-only peer" 
            checked={formData.showOnKiosk !== false}
            onChange={e => setFormData({...formData, showOnKiosk: e.target.checked})}
          />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
        </div>
      </label>
    </div>
  </div>
);
