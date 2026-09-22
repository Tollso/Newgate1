import React, { useState } from 'react';
import { Layers, Plus, Trash2, Edit2, Eye, EyeOff, Clock, ArrowUp, ArrowDown, Save } from 'lucide-react';
import { Category, KioskCategoryConfig } from '../../../types';

interface CategoryManagerProps {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  kioskCategories?: KioskCategoryConfig[];
  onUpdateKioskCategories?: (configs: KioskCategoryConfig[]) => void;
}

export const CategoryManager: React.FC<CategoryManagerProps> = ({
  categories,
  setCategories,
  kioskCategories = [],
  onUpdateKioskCategories
}) => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    const id = 'cat_' + Date.now();
    const newCat: Category = {
      id,
      name: newCategoryName.trim(),
      itemsCount: 0,
      modifierGroups: [],
      showOnPos: true,
      showOnline: true
    };
    setCategories(prev => [...prev, newCat]);
    setNewCategoryName('');
  };

  const handleStartEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditName(cat.name);
  };

  const handleSaveEdit = (catId: string) => {
    if (!editName.trim()) return;
    setCategories(prev =>
      prev.map(c => (c.id === catId ? { ...c, name: editName.trim() } : c))
    );
    setEditingId(null);
  };

  const handleDeleteCategory = (catId: string) => {
    setCategories(prev => prev.filter(c => c.id !== catId));
  };

  const handleMoveCategory = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= categories.length) return;
    const updated = [...categories];
    const [moved] = updated.splice(index, 1);
    updated.splice(newIndex, 0, moved);
    setCategories(updated);
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Layers className="text-indigo-600" size={20} />
            Category CRUD & Layout Management
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Add, reorder, edit, and configure visibility switches for menu sections on the kiosk interface.
          </p>
        </div>
      </div>

      {/* Add Category Bar */}
      <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
        <input
          type="text"
          value={newCategoryName}
          onChange={e => setNewCategoryName(e.target.value)}
          placeholder="Enter new kiosk section name (e.g. Seasonal Cold Brews)..."
          className="flex-1 p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-indigo-600"
        />
        <button
          onClick={handleAddCategory}
          className="min-h-[42px] px-5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl flex items-center gap-2 transition-all shadow-md active:scale-95 shrink-0"
        >
          <Plus size={16} />
          Add Section
        </button>
      </div>

      {/* Categories List */}
      <div className="space-y-3">
        {categories.map((cat, idx) => (
          <div
            key={cat.id}
            className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl hover:border-indigo-200 transition-all shadow-xs"
          >
            {editingId === cat.id ? (
              <div className="flex items-center gap-2 flex-1 mr-4">
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="flex-1 p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 outline-none"
                />
                <button
                  onClick={() => handleSaveEdit(cat.id)}
                  className="p-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700"
                >
                  <Save size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 font-black text-xs flex items-center justify-center">
                  {idx + 1}
                </span>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{cat.name}</h4>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {cat.itemsCount || 0} items mapped
                  </span>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              {/* Reorder Buttons */}
              <button
                disabled={idx === 0}
                onClick={() => handleMoveCategory(idx, 'up')}
                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl disabled:opacity-40 transition-colors"
                title="Move Up"
              >
                <ArrowUp size={14} />
              </button>
              <button
                disabled={idx === categories.length - 1}
                onClick={() => handleMoveCategory(idx, 'down')}
                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl disabled:opacity-40 transition-colors"
                title="Move Down"
              >
                <ArrowDown size={14} />
              </button>

              {/* Edit Button */}
              <button
                onClick={() => handleStartEdit(cat)}
                className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl transition-colors"
                title="Edit Category Name"
              >
                <Edit2 size={14} />
              </button>

              {/* Delete Button */}
              <button
                onClick={() => handleDeleteCategory(cat.id)}
                className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-colors"
                title="Delete Category"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
