import React from 'react';
import { InventoryItem, Category } from '../../types';
import { History } from 'lucide-react';

interface TableMenuGridProps {
  searchTerm: string;
  setSearchTerm: (s: string) => void;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  categories: Category[];
  filteredMenu: InventoryItem[];
  onAddToOrder: (item: InventoryItem) => void;
}

export const TableMenuGrid: React.FC<TableMenuGridProps> = ({
  searchTerm,
  setSearchTerm,
  activeCategory,
  setActiveCategory,
  categories,
  filteredMenu,
  onAddToOrder
}) => {
  return (
    <div className="flex-1 flex flex-col bg-slate-900 relative">
      <div className="p-3 md:p-6 border-b border-slate-800 flex flex-col gap-3 md:gap-4 sticky top-0 z-10 bg-slate-900/90 backdrop-blur-md shrink-0">
        <div className="flex justify-between items-center gap-4">
          <input
            type="text"
            placeholder="Search menu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-[140px] sm:max-w-xs bg-slate-950 border border-slate-800 px-3 py-2 md:px-4 md:py-3 rounded-xl text-sm font-medium outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
          />
          <div className="flex gap-1.5 md:gap-2 shrink-0">
            <button className="p-2 md:p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-400 hover:text-white transition-colors" title="Order History">
              <History size={18} className="md:w-5 md:h-5" />
            </button>
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
          <button 
            onClick={() => setActiveCategory('All')} 
            className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${activeCategory === 'All' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'}`}
          >
            All
          </button>
          {categories.map(cat => (
            <button 
              key={cat.name} 
              onClick={() => setActiveCategory(cat.name)} 
              className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${activeCategory === cat.name ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 p-3 md:p-6 overflow-y-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 auto-rows-max">
          {filteredMenu.map(item => (
            <button
              key={item.id}
              onClick={() => onAddToOrder(item)}
              className="bg-slate-800 hover:bg-slate-700 p-3 md:p-5 rounded-2xl border border-slate-700 flex flex-col justify-between text-left h-28 md:h-36 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/50 active:scale-95 group relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="font-bold text-slate-200 text-sm leading-tight line-clamp-3">{item.name}</span>
              <span className="font-mono text-emerald-400 font-black tracking-tight">${item.price.toFixed(2)}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
