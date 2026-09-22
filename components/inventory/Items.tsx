import React, { useState } from 'react';
import { InventoryItem, ModifierGroup, Category, PrinterLabel } from '../../types';
import { Search, Plus, Edit2, Trash2, Tag, Layers } from 'lucide-react';
import { MOCK_PRINTER_LABELS } from '../../constants';
import { ItemModal } from './ItemModal';

interface ItemsProps {
  items: InventoryItem[];
  categories?: Category[];
  modifierGroups?: ModifierGroup[];
  onSaveItem?: (item: InventoryItem) => void;
  onDeleteItem?: (id: string) => void;
  printerLabels?: PrinterLabel[];
}

const Items: React.FC<ItemsProps> = ({ items = [], categories = [], modifierGroups = [], onSaveItem, onDeleteItem, printerLabels }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('ALL');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  const safeItems = items || [];
  const safeCategories = categories || [];

  const allCategoryNames = Array.from(new Set([
    ...safeCategories.map(c => c.name),
    ...safeItems.map(i => i.category)
  ])).filter(Boolean);

  const filteredItems = safeItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategoryFilter === 'ALL' || item.category === selectedCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setShowModal(true);
  };

  const handleOpenEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleSave = (itemToSave: InventoryItem) => {
    if (onSaveItem) onSaveItem(itemToSave);
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this item?") && onDeleteItem) {
      onDeleteItem(id);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      {showModal && (
        <ItemModal
          editingItem={editingItem}
          categories={categories}
          modifierGroups={modifierGroups}
          allCategoryNames={allCategoryNames}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
          printerLabels={printerLabels}
        />
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Item Library</h1>
          <p className="text-slate-500">Manage products, pricing, modifiers, and inventory</p>
        </div>
        <button onClick={handleOpenAdd} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm transition-colors font-medium">
          <Plus size={18} /> Add Item
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or category..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
        <div className="flex gap-2 items-center">
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-medium outline-none cursor-pointer"
          >
            <option value="ALL">All Categories ({allCategoryNames.length})</option>
            {allCategoryNames.map(cName => (
              <option key={cName} value={cName}>{cName}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
            <tr>
              <th className="px-6 py-3 font-semibold">Item Name</th>
              <th className="px-6 py-3 font-semibold">Category</th>
              <th className="px-6 py-3 font-semibold text-right">Price</th>
              <th className="px-6 py-3 font-semibold text-center">In Stock</th>
              <th className="px-6 py-3 font-semibold text-center">POS</th>
              <th className="px-6 py-3 font-semibold text-center">Online</th>
              <th className="px-6 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredItems.map(item => (
              <tr key={item.id} className="hover:bg-slate-50 group">
                
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                        <Tag size={16} className="text-slate-400" />
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-900 text-base">{item.name}</span>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1">
                        {item.modifierGroups && item.modifierGroups.length > 0 && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                            <Layers size={12} /> {item.modifierGroups.length} Modifiers
                          </span>
                        )}
                        {(() => {
                          const stations = Array.from(new Set([
                            ...(item.printerLabels || []),
                            ...(item.prepStations || [])
                          ]));
                          if (stations.length === 0) return null;
                          return (
                            <div className="flex flex-wrap gap-1">
                              {stations.map(st => {
                                const activeLabels = printerLabels && printerLabels.length > 0 ? printerLabels : MOCK_PRINTER_LABELS;
                                const stObj = activeLabels.find(l => l.id === st || l.name === st);
                                const displayName = stObj ? stObj.name : st;
                                return (
                                  <span key={st} className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-100">
                                    {displayName}
                                  </span>
                                );
                              })}
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-slate-100 rounded-full text-xs text-slate-600 font-medium border border-slate-200">
                    <Tag size={10} /> {item.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-mono text-slate-900 font-medium text-base">
                  ${item.price.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-center">
                  <button 
                    onClick={() => onSaveItem && onSaveItem({...item, inStock: !item.inStock})}
                    className={`mx-auto w-10 h-5 rounded-full relative transition-all ${item.inStock ? 'bg-emerald-500' : 'bg-slate-300'}`}
                  >
                    <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${item.inStock ? 'translate-x-5' : ''}`} />
                  </button>
                </td>
                <td className="px-6 py-4 text-center">
                  <button 
                    onClick={() => onSaveItem && onSaveItem({...item, showOnPos: !item.showOnPos})}
                    className={`mx-auto w-10 h-5 rounded-full relative transition-all ${item.showOnPos ? 'bg-indigo-500' : 'bg-slate-300'}`}
                  >
                    <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${item.showOnPos ? 'translate-x-5' : ''}`} />
                  </button>
                </td>
                <td className="px-6 py-4 text-center">
                  <button 
                    onClick={() => onSaveItem && onSaveItem({...item, showOnline: !item.showOnline})}
                    className={`mx-auto w-10 h-5 rounded-full relative transition-all ${item.showOnline ? 'bg-indigo-500' : 'bg-slate-300'}`}
                  >
                    <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${item.showOnline ? 'translate-x-5' : ''}`} />
                  </button>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleOpenEdit(item)} className="p-1.5 text-slate-500 hover:text-indigo-600 rounded">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="p-1.5 text-slate-500 hover:text-red-600 rounded">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Items;
