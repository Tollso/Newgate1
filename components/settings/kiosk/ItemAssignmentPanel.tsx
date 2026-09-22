import React, { useState } from 'react';
import { ShoppingBag, Eye, EyeOff, Search, Tag, DollarSign, Filter } from 'lucide-react';
import { InventoryItem, Category } from '../../../types';

interface ItemAssignmentPanelProps {
  inventory: InventoryItem[];
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  categories: Category[];
}

export const ItemAssignmentPanel: React.FC<ItemAssignmentPanelProps> = ({
  inventory = [],
  setInventory,
  categories = []
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');

  const filteredItems = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = selectedCategoryFilter === 'All' || item.category === selectedCategoryFilter;
    return matchesSearch && matchesCat;
  });

  const handleToggleKioskVisibility = (itemId: string) => {
    setInventory(prev =>
      prev.map(item => {
        if (item.id === itemId) {
          const currentVis = item.showOnKiosk !== false;
          return { ...item, showOnKiosk: !currentVis };
        }
        return item;
      })
    );
  };

  const handleChangeItemCategory = (itemId: string, newCategory: string) => {
    setInventory(prev =>
      prev.map(item => (item.id === itemId ? { ...item, category: newCategory } : item))
    );
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <ShoppingBag className="text-emerald-600" size={20} />
            Item Mapping & Kiosk Visibility Switches
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Assign menu items to categories and instantly show or hide individual items on the self-service kiosk.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search item name..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-indigo-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={16} className="text-slate-400 shrink-0" />
          <select
            value={selectedCategoryFilter}
            onChange={e => setSelectedCategoryFilter(e.target.value)}
            className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-indigo-600 cursor-pointer w-full"
          >
            <option value="All">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Item List Cards */}
      <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
        {filteredItems.map(item => {
          const isVisibleOnKiosk = item.showOnKiosk !== false;

          return (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isVisibleOnKiosk
                  ? 'bg-white border-slate-200 hover:border-indigo-200'
                  : 'bg-slate-50 border-slate-200/60 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                    isVisibleOnKiosk ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  ${item.price.toFixed(2)}
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{item.posName || item.name}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md">
                      {item.category || 'Uncategorized'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      In Stock: {item.inStock !== false ? 'Yes' : 'Out of Stock'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Category Re-assignment Dropdown */}
                <select
                  value={item.category}
                  onChange={e => handleChangeItemCategory(item.id, e.target.value)}
                  className="p-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>

                {/* Quick Kiosk Visibility Toggle */}
                <button
                  onClick={() => handleToggleKioskVisibility(item.id)}
                  className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                    isVisibleOnKiosk
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                  }`}
                >
                  {isVisibleOnKiosk ? <Eye size={14} /> : <EyeOff size={14} />}
                  <span>{isVisibleOnKiosk ? 'Visible' : 'Hidden'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
