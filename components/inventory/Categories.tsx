import React, { useState } from 'react';
import { Category, InventoryItem } from '../../types';
import { Plus, Search, Layers, Grid, List, Eye, EyeOff, Edit2, Trash2 } from 'lucide-react';
import { CategoryDetailView } from './CategoryDetailView';

interface CategoriesProps {
  categories?: Category[];
  setCategories?: React.Dispatch<React.SetStateAction<Category[]>>;
  inventory?: InventoryItem[];
  setInventory?: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  currentBusinessId?: string;
}

const Categories: React.FC<CategoriesProps> = ({ 
  categories = [], 
  setCategories,
  inventory = [],
  setInventory,
  currentBusinessId
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'List' | 'Grid'>('List');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCat, setNewCat] = useState({ name: '', pos: true, online: true });
  const [validationError, setValidationError] = useState('');

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCategory = () => {
    setValidationError('');
    const trimmedName = newCat.name.trim();
    if (!trimmedName) {
      setValidationError('Category name is required.');
      return;
    }

    if (categories.some(c => c.name.toLowerCase() === trimmedName.toLowerCase())) {
      setValidationError('A category with this name already exists.');
      return;
    }

    if (!setCategories) return;
    
    const category: Category = {
      id: `CAT-${Date.now()}`,
      name: trimmedName,
      itemsCount: 0,
      modifierGroups: [],
      showOnPos: newCat.pos,
      showOnline: newCat.online,
      businessId: currentBusinessId || 'B001'
    };
    
    setCategories(prev => [...prev, category]);
    setShowAddModal(false);
    setNewCat({ name: '', pos: true, online: true });
  };

  const handleDeleteCategory = (catId: string, catName: string) => {
    if (confirm(`Are you sure you want to delete category "${catName}"?`)) {
      if (setCategories) {
        setCategories(prev => prev.filter(c => c.id !== catId));
      }
      if (setInventory) {
        setInventory(prev => prev.map(i => i.category === catName ? { ...i, category: 'Uncategorized' } : i));
      }
      if (selectedCategory?.id === catId) {
        setSelectedCategory(null);
      }
    }
  };

  const handleUpdateCategory = (updated: Category, oldName?: string) => {
    if (setCategories) {
      setCategories(prev => prev.map(c => c.id === updated.id ? updated : c));
    }
    if (oldName && setInventory) {
      setInventory(prev => prev.map(i => i.category === oldName ? { ...i, category: updated.name } : i));
    }
    setSelectedCategory(updated);
  };

  const handleAddItemToCategory = (itemId: string) => {
    if (!selectedCategory || !setInventory) return;
    setInventory(prev => prev.map(item => item.id === itemId ? { ...item, category: selectedCategory.name } : item));
    
  };

  const removeItemFromCategory = (itemId: string) => {
    if (!selectedCategory || !setInventory) return;
    setInventory(prev => prev.map(item => item.id === itemId ? { ...item, category: 'Uncategorized' } : item));
    
  };

  if (selectedCategory) {
    return (
      <CategoryDetailView
        selectedCategory={selectedCategory}
        inventory={inventory}
        onBack={() => setSelectedCategory(null)}
        onUpdateCategory={handleUpdateCategory}
        onAddItemToCategory={handleAddItemToCategory}
        onRemoveItemFromCategory={removeItemFromCategory}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fade-in h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Categories</h1>
          <p className="text-slate-500 text-xs font-medium mt-0.5">Organize items for POS display, online store & printing</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-sm font-bold text-sm transition-all"
        >
          <Plus size={18} /> CREATE CATEGORY
        </button>
      </div>

      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search categories..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button onClick={() => setViewMode('List')} className={`p-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'List' ? 'bg-white shadow-xs text-indigo-600' : 'text-slate-500'}`}><List size={16} /></button>
          <button onClick={() => setViewMode('Grid')} className={`p-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'Grid' ? 'bg-white shadow-xs text-indigo-600' : 'text-slate-500'}`}><Grid size={16} /></button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {viewMode === 'List' ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-4">Category Name</th>
                  <th className="p-4">Items Count</th>
                  <th className="p-4">POS Visibility</th>
                  <th className="p-4">Online Store</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredCategories.map(cat => (
                  <tr key={cat.id} className="hover:bg-slate-50 cursor-pointer transition-colors" onClick={() => setSelectedCategory(cat)}>
                    <td className="p-4 font-bold text-slate-900 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
                        <Layers size={16} />
                      </div>
                      {cat.name}
                    </td>
                    <td className="p-4 text-slate-500">{(inventory || []).filter(i => i.category === cat.name).length} items</td>
                    <td className="p-4">{cat.showOnPos ? <span className="text-emerald-600 font-bold flex items-center gap-1 text-xs"><Eye size={14} /> Visible</span> : <span className="text-slate-400 flex items-center gap-1 text-xs"><EyeOff size={14} /> Hidden</span>}</td>
                    <td className="p-4">{cat.showOnline ? <span className="text-emerald-600 font-bold flex items-center gap-1 text-xs"><Eye size={14} /> Visible</span> : <span className="text-slate-400 flex items-center gap-1 text-xs"><EyeOff size={14} /> Hidden</span>}</td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button onClick={(e) => { e.stopPropagation(); setSelectedCategory(cat); }} className="p-2 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100" title="Edit Category"><Edit2 size={16} /></button>
                        <button onClick={(e) => { e.stopPropagation(); handleDeleteCategory(cat.id, cat.name); }} className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50" title="Delete Category"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCategories.map(cat => (
              <div key={cat.id} onClick={() => setSelectedCategory(cat)} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md cursor-pointer transition-all space-y-3 relative group">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
                    <Layers size={20} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400">{(inventory || []).filter(i => i.category === cat.name).length} items</span>
                    <button onClick={(e) => { e.stopPropagation(); handleDeleteCategory(cat.id, cat.name); }} className="p-1.5 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" title="Delete Category">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg">{cat.name}</h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <h3 className="text-xl font-black text-slate-800 tracking-tight">New Category</h3>
            {validationError && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-bold flex items-start gap-2">
                <span className="mt-0.5 shrink-0">⚠️</span>
                <span>{validationError}</span>
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-1">Category Name *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Appetizers, Desserts, Specials" 
                  value={newCat.name}
                  onChange={e => setNewCat({ ...newCat, name: e.target.value })}
                  onKeyDown={e => e.key === 'Enter' && handleAddCategory()}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800"
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-700">Show on POS Display</span>
                <input 
                  type="checkbox" 
                  checked={newCat.pos}
                  onChange={e => setNewCat({ ...newCat, pos: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-700">Show in Online Store</span>
                <input 
                  type="checkbox" 
                  checked={newCat.online}
                  onChange={e => setNewCat({ ...newCat, online: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button onClick={() => { setShowAddModal(false); setValidationError(''); }} className="px-4 py-2 text-slate-500 font-bold text-sm hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
              <button onClick={handleAddCategory} className="px-5 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 shadow-sm transition-colors">Save Category</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
