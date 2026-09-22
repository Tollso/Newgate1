
import React, { useState } from 'react';
import { InventoryItem, Category } from '../../../types';
import { Search, Tag, Box, Plus, X } from 'lucide-react';

interface MenuGridProps {
    items: InventoryItem[];
    categories: Category[];
    activeCategory: string;
    onCategoryChange: (category: string) => void;
    onItemSelect: (item: InventoryItem) => void;
    searchTerm: string;
    onSearchChange: (term: string) => void;
    onSaveItem?: (item: InventoryItem) => void;
}

const MenuGrid: React.FC<MenuGridProps> = ({ 
    items = [], categories = [], activeCategory, onCategoryChange, 
    onItemSelect, searchTerm, onSearchChange, onSaveItem
}) => {
    const displayCategories = ['All', ...(categories || []).map(c => c.name)];
    
    // Quick Add Item Modal State
    const [showQuickAdd, setShowQuickAdd] = useState(false);
    const [newItemName, setNewItemName] = useState('');
    const [newItemPrice, setNewItemPrice] = useState('');
    const [newItemCategory, setNewItemCategory] = useState(activeCategory !== 'All' ? activeCategory : (categories[0]?.name || 'Uncategorized'));
    const [quickAddError, setQuickAddError] = useState('');

    const handleQuickAdd = () => {
        if (!newItemName.trim()) {
            setQuickAddError('Please enter an item name');
            return;
        }

        const priceNum = parseFloat(newItemPrice) || 0;
        const newItem: InventoryItem = {
            id: `ITEM-${Date.now()}`,
            name: newItemName.trim(),
            price: priceNum,
            cost: 0,
            category: newItemCategory || 'Uncategorized',
            printerLabels: [],
            inStock: true,
            showOnPos: true,
            showOnline: true,
            showOnKiosk: true,
            modifierGroups: [],
            posName: newItemName.trim(),
            description: '',
            containsAlcohol: false,
            prepStations: []
        };

        if (onSaveItem) {
            onSaveItem(newItem);
        }

        // Reset & Close
        setNewItemName('');
        setNewItemPrice('');
        setQuickAddError('');
        setShowQuickAdd(false);
    };

    return (
        <div className="flex-1 flex flex-col bg-slate-50/50 overflow-hidden relative">
            {/* Quick Add Item Modal */}
            {showQuickAdd && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="font-black text-lg text-slate-800 uppercase tracking-tight">Quick Add New Item</h3>
                            <button onClick={() => setShowQuickAdd(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            {quickAddError && (
                                <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold">
                                    {quickAddError}
                                </div>
                            )}
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Item Name *</label>
                                <input 
                                    type="text" 
                                    value={newItemName} 
                                    onChange={e => { setNewItemName(e.target.value); setQuickAddError(''); }} 
                                    placeholder="e.g. Calimisyor / Burger" 
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Price ($)</label>
                                <input 
                                    type="number" 
                                    step="0.01"
                                    value={newItemPrice} 
                                    onChange={e => setNewItemPrice(e.target.value)} 
                                    placeholder="0.00" 
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-mono font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Category</label>
                                <select 
                                    value={newItemCategory} 
                                    onChange={e => setNewItemCategory(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    {categories.length > 0 ? (
                                        categories.map(c => (
                                            <option key={c.id} value={c.name}>{c.name}</option>
                                        ))
                                    ) : (
                                        <option value="Uncategorized">Uncategorized</option>
                                    )}
                                </select>
                            </div>
                        </div>
                        <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
                            <button onClick={() => setShowQuickAdd(false)} className="flex-1 py-3 text-slate-500 font-bold text-xs uppercase">Cancel</button>
                            <button onClick={handleQuickAdd} className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all">Save & Add</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Search Header */}
            <div className="p-6 bg-white border-b border-slate-100 flex gap-4 items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search menu items or scan barcode..." 
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all font-medium"
                    />
                </div>
                {onSaveItem && (
                    <button 
                        onClick={() => {
                            setNewItemCategory(activeCategory !== 'All' ? activeCategory : (categories[0]?.name || 'Uncategorized'));
                            setShowQuickAdd(true);
                        }}
                        className="flex items-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 shadow-md transition-all active:scale-95 shrink-0"
                    >
                        <Plus size={16} /> Add Item
                    </button>
                )}
            </div>

            {/* Category Selector */}
            <div className="px-6 py-4 bg-white border-b border-slate-100 flex gap-2 overflow-x-auto scrollbar-hide shrink-0">
                {displayCategories.map(cat => (
                    <button 
                        key={cat} 
                        onClick={() => onCategoryChange(cat)} 
                        className={`px-6 py-2 rounded-full whitespace-nowrap text-xs font-black uppercase tracking-widest transition-all
                            ${activeCategory === cat 
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Product Grid */}
            <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {items.map(item => (
                        <button 
                            key={item.id} 
                            onClick={() => onItemSelect(item)} 
                            disabled={!item.inStock}
                            className={`group bg-white p-5 rounded-[2rem] shadow-sm border border-slate-200 transition-all flex flex-col items-center justify-center text-center aspect-square relative
                                ${item.inStock 
                                    ? 'hover:border-indigo-500 hover:shadow-xl hover:-translate-y-1 active:scale-95' 
                                    : 'opacity-50 grayscale cursor-not-allowed'}`}
                        >
                            
                            <div className={`h-14 w-14 rounded-3xl bg-slate-50 flex items-center justify-center mb-4 text-indigo-600 group-hover:scale-110 transition-transform shadow-inner overflow-hidden
                                ${!item.inStock ? 'bg-slate-200 text-slate-400' : ''}`}>
                                {item.imageUrl ? (
                                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                ) : (
                                    <Tag size={24} />
                                )}
                            </div>

                            <span className="font-black text-slate-800 line-clamp-2 leading-tight uppercase text-[11px] tracking-tight">{item.name}</span>
                            <span className="text-xs font-black text-slate-400 mt-2 font-mono">${item.price.toFixed(2)}</span>
                            
                            {!item.inStock && (
                                <div className="absolute inset-0 flex items-center justify-center bg-white/60 rounded-[2rem]">
                                    <span className="bg-slate-900 text-white text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full flex items-center gap-1">
                                        <Box size={10} /> SOLD OUT
                                    </span>
                                </div>
                            )}
                        </button>
                    ))}
                </div>
                
                {(items || []).length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4 py-20">
                        <Search size={64} strokeWidth={1} className="opacity-50" />
                        <p className="font-black uppercase tracking-widest text-sm text-slate-500">No items found matching criteria</p>
                        {onSaveItem && (
                            <button 
                                onClick={() => setShowQuickAdd(true)} 
                                className="px-5 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-md hover:bg-indigo-700 transition-all"
                            >
                                + Add New Item Here
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MenuGrid;
