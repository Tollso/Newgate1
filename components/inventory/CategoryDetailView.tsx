import React, { useState } from 'react';
import { Category, InventoryItem } from '../../types';
import { ChevronLeft, Plus, X } from 'lucide-react';

interface CategoryDetailViewProps {
  selectedCategory: Category;
  inventory: InventoryItem[];
  onBack: () => void;
  onUpdateCategory: (updated: Category, oldName?: string) => void;
  onAddItemToCategory: (itemId: string) => void;
  onRemoveItemFromCategory: (itemId: string) => void;
}

export const CategoryDetailView: React.FC<CategoryDetailViewProps> = ({
  selectedCategory,
  inventory = [],
  onBack,
  onUpdateCategory,
  onAddItemToCategory,
  onRemoveItemFromCategory
}) => {
  const [showItemPicker, setShowItemPicker] = useState(false);
  const [itemSearch, setItemSearch] = useState('');

  const categoryItems = inventory.filter(i => i.category === selectedCategory.name);
  const availableItems = inventory.filter(i => i.category !== selectedCategory.name && 
    i.name.toLowerCase().includes(itemSearch.toLowerCase()));

  return (
    <div className="space-y-6 animate-fade-in h-full flex flex-col">
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-colors"
        >
          <ChevronLeft size={20} /> BACK TO CATEGORIES
        </button>
        <button 
          onClick={() => setShowItemPicker(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm font-bold text-sm"
        >
          <Plus size={18} /> ADD ITEMS
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-6 lg:gap-0 lg:items-center mb-6 border-b border-slate-100 pb-6">
          <div className="flex-1 w-full lg:w-auto">
            <input 
              type="text" 
              value={selectedCategory.name}
              onChange={(e) => {
                const oldName = selectedCategory.name;
                onUpdateCategory({ ...selectedCategory, name: e.target.value }, oldName);
              }}
              className="text-3xl w-full font-black text-slate-900 tracking-tight bg-transparent border-b-2 border-transparent hover:border-slate-200 focus:border-indigo-500 outline-none transition-colors px-1 py-1"
            />
            <p className="text-slate-500 font-medium px-1 mt-1">{(categoryItems || []).length} Items in this category</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <label className="flex items-center justify-between sm:justify-start gap-4 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer w-full sm:w-auto">
              <span className="text-xs font-black text-slate-800 uppercase tracking-tight">Show on POS</span>
              <button 
                onClick={() => onUpdateCategory({ ...selectedCategory, showOnPos: !selectedCategory.showOnPos })}
                className={`w-10 h-5 rounded-full relative transition-all ${selectedCategory.showOnPos ? 'bg-indigo-600' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${selectedCategory.showOnPos ? 'translate-x-5' : ''}`} />
              </button>
            </label>
            <label className="flex items-center justify-between sm:justify-start gap-4 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer w-full sm:w-auto">
              <span className="text-xs font-black text-slate-800 uppercase tracking-tight">Show Online</span>
              <button 
                onClick={() => onUpdateCategory({ ...selectedCategory, showOnline: !selectedCategory.showOnline })}
                className={`w-10 h-5 rounded-full relative transition-all ${selectedCategory.showOnline ? 'bg-indigo-600' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${selectedCategory.showOnline ? 'translate-x-5' : ''}`} />
              </button>
            </label>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Current Items</h3>
          {(categoryItems || []).length === 0 ? (
            <div className="p-12 text-center border-2 border-dashed border-slate-100 rounded-2xl text-slate-400 font-medium">
              No items currently assigned to this category.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(categoryItems || []).map(item => (
                <div key={item.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center group">
                  <div>
                    <p className="font-bold text-slate-900">{item.name}</p>
                    <p className="text-xs text-slate-500">${item.price.toFixed(2)}</p>
                  </div>
                  <button 
                    onClick={() => onRemoveItemFromCategory(item.id)}
                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showItemPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xl font-black text-slate-800 tracking-tight">ADD ITEMS TO {selectedCategory.name}</h3>
              <button onClick={() => setShowItemPicker(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg">
                <X size={20} />
              </button>
            </div>
            <div className="p-4 border-b border-slate-100">
              <input 
                type="text" 
                placeholder="Search items..." 
                value={itemSearch}
                onChange={e => setItemSearch(e.target.value)}
                className="w-full pl-4 pr-4 py-2 border border-slate-200 rounded-xl text-sm"
              />
            </div>
            <div className="p-6 overflow-y-auto space-y-2 flex-1">
              {availableItems.map(item => (
                <div key={item.id} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-xl border border-slate-100">
                  <div>
                    <p className="font-bold text-slate-800">{item.name}</p>
                    <p className="text-xs text-slate-400">{item.category || 'Uncategorized'}</p>
                  </div>
                  <button 
                    onClick={() => { onAddItemToCategory(item.id); }}
                    className="px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-lg text-xs font-bold transition-all"
                  >
                    + Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
