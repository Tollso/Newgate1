import React, { useState } from 'react';
import { InventoryItem, ModifierGroup, Category, PrinterLabel } from '../../types';
import { X, Box, Tag, DollarSign, Monitor, AlertTriangle } from 'lucide-react';
import { ItemModalGeneralTab, ItemModalOptionsTab, ItemModalPricingTab, ItemModalVisibilityTab } from './ItemModalTabs';
import { MOCK_PRINTER_LABELS } from '../../constants';

interface ItemModalProps {
  editingItem: InventoryItem | null;
  categories: Category[];
  modifierGroups: ModifierGroup[];
  allCategoryNames: string[];
  onClose: () => void;
  onSave: (item: InventoryItem) => void;
  printerLabels?: PrinterLabel[];
}

export const ItemModal: React.FC<ItemModalProps> = ({
  editingItem,
  categories = [],
  modifierGroups = [],
  allCategoryNames = [],
  onClose,
  onSave,
  printerLabels
}) => {
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'General' | 'Options' | 'Pricing' | 'Visibility'>('General');
  
  const defaultCategory = (categories || []).length > 0 ? categories[0].name : 'Uncategorized';
  const availableLabels = (printerLabels && printerLabels.length > 0) ? printerLabels : MOCK_PRINTER_LABELS;
  
  const rawInitial = editingItem ? Array.from(new Set([
    ...(editingItem.printerLabels || []),
    ...(editingItem.prepStations || [])
  ])) : [];

  const initialStationIds = availableLabels
    .filter(label => rawInitial.includes(label.id) || rawInitial.includes(label.name))
    .map(label => label.id);

  const initialStationNames = availableLabels
    .filter(label => rawInitial.includes(label.id) || rawInitial.includes(label.name))
    .map(label => label.name);

  const [formData, setFormData] = useState<Partial<InventoryItem>>(
    editingItem ? {
      ...editingItem,
      printerLabels: initialStationIds,
      prepStations: initialStationNames
    } : {
      name: '', price: 0, cost: 0, category: defaultCategory, printerLabels: [], 
      inStock: true, showOnPos: true, showOnline: true, showOnKiosk: true, 
      containsAlcohol: false, prepStations: [], posName: '', description: ''
    }
  );

  const selectedStationsCount = (formData.printerLabels || []).length;

  const toggleModifierGroup = (groupId: string) => {
    const groups = formData.modifierGroups || [];
    setFormData({
      ...formData,
      modifierGroups: groups.includes(groupId) ? groups.filter(g => g !== groupId) : [...groups, groupId]
    });
  };

  const handleSave = () => {
    if (!formData.name || !formData.name.trim()) {
      setErrorMsg('Item name is required.');
      return;
    }

    const currentStationIds = formData.printerLabels || [];
    const currentStationNames = availableLabels
      .filter(l => currentStationIds.includes(l.id))
      .map(l => l.name);

    const itemToSave: InventoryItem = {
      id: editingItem ? editingItem.id : `ITEM-${Date.now()}`,
      name: formData.name.trim(),
      price: formData.price || 0,
      cost: formData.cost || 0,
      category: formData.category || ((categories || []).length > 0 ? categories[0].name : 'Uncategorized'),
      printerLabels: currentStationIds,
      prepStations: currentStationNames,
      inStock: formData.inStock ?? true,
      showOnPos: formData.showOnPos ?? true,
      showOnline: formData.showOnline ?? true,
      showOnKiosk: formData.showOnKiosk ?? true,
      modifierGroups: formData.modifierGroups || [],
      posName: formData.posName || formData.name.trim(),
      description: formData.description || '',
      containsAlcohol: formData.containsAlcohol || false,
      imageUrl: formData.imageUrl
    };
    onSave(itemToSave);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-scale-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-lg text-slate-800">{editingItem ? 'Edit Item' : 'Add New Item'}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        </div>

        <div className="flex border-b border-slate-200 bg-white shrink-0">
          {(['General', 'Options', 'Pricing', 'Visibility'] as const).map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors flex items-center justify-center gap-2 ${
                activeTab === tab ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:bg-slate-50'
              }`}
            >
              {tab === 'General' && <Box size={16} />}
              {tab === 'Options' && (
                <div className="flex items-center gap-1.5">
                  <Tag size={16} />
                  <span>Options</span>
                  {selectedStationsCount > 0 && (
                    <span className="px-1.5 py-0.5 text-[10px] font-black bg-emerald-600 text-white rounded-full">
                      {selectedStationsCount}
                    </span>
                  )}
                </div>
              )}
              {tab === 'Pricing' && <DollarSign size={16} />}
              {tab === 'Visibility' && <Monitor size={16} />}
              {tab !== 'Options' && tab}
            </button>
          ))}
        </div>

        <div className="p-6 overflow-y-auto flex-1 bg-white">
          {errorMsg && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-3 text-rose-800 text-sm animate-shake">
              <AlertTriangle size={20} className="shrink-0" />
              <p className="font-medium">{errorMsg}</p>
            </div>
          )}

          {activeTab === 'General' && <ItemModalGeneralTab formData={formData} setFormData={setFormData} errorMsg={errorMsg} setErrorMsg={setErrorMsg} allCategoryNames={allCategoryNames} />}
          {activeTab === 'Options' && <ItemModalOptionsTab formData={formData} setFormData={setFormData} modifierGroups={modifierGroups} toggleModifierGroup={toggleModifierGroup} printerLabels={availableLabels} />}
          {activeTab === 'Pricing' && <ItemModalPricingTab formData={formData} setFormData={setFormData} />}
          {activeTab === 'Visibility' && <ItemModalVisibilityTab formData={formData} setFormData={setFormData} />}

        </div>
        
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 shrink-0">
          <button 
            onClick={onClose} 
            className="px-6 py-2 rounded-lg font-bold text-slate-600 hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            className="px-6 py-2 rounded-lg font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm"
          >
            Save Item
          </button>
        </div>

      </div>
    </div>
  );
};
