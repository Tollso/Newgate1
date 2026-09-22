import React, { useState } from 'react';
import { EyeOff, Search } from 'lucide-react';
import { InventoryItem, Category } from '../../../types';

interface PosShell86AvailabilityProps {
  inventory: InventoryItem[];
  categories: Category[];
  onSaveItem?: (item: InventoryItem) => void;
}

export const PosShell86Availability: React.FC<PosShell86AvailabilityProps> = ({
  inventory,
  categories,
  onSaveItem,
}) => {
  const [search86, setSearch86] = useState('');
  const [selected86Category, setSelected86Category] = useState<string>('ALL');

  const filteredItems = inventory.filter(item => {
    const matchCat = selected86Category === 'ALL' || item.category === selected86Category;
    const matchQuery = !search86 || item.name.toLowerCase().includes(search86.toLowerCase());
    return matchCat && matchQuery;
  });

  return (
    <div className="h-full bg-slate-950 p-6 md:p-10 flex flex-col overflow-hidden">
      <div className="max-w-6xl mx-auto w-full flex flex-col h-full">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              <EyeOff className="text-amber-400" />
              86 / Item Availability Control
            </h2>
            <p className="text-xs text-slate-400">
              Instantly mark menu items Out of Stock (86'd) or restore them across Register, Tables, and Kiosk.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                placeholder="Search items to 86..."
                value={search86}
                onChange={e => setSearch86(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:ring-2 focus:ring-amber-500 outline-none w-64"
              />
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-4 shrink-0">
          <button
            onClick={() => setSelected86Category('ALL')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors uppercase ${
              selected86Category === 'ALL' ? 'bg-amber-600 text-white shadow-xs' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            All Items ({inventory.length})
          </button>
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setSelected86Category(c.name)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors uppercase whitespace-nowrap ${
                selected86Category === c.name ? 'bg-amber-600 text-white shadow-xs' : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto bg-slate-900/60 rounded-2xl border border-slate-800 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredItems.map(item => {
              const isAvailable = item.inStock !== false;

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                    isAvailable
                      ? 'bg-slate-900 border-slate-800'
                      : 'bg-rose-950/20 border-rose-900/40 text-slate-400'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`font-bold text-sm ${isAvailable ? 'text-white' : 'text-slate-400 line-through'}`}>
                        {item.name}
                      </span>
                      {!isAvailable && (
                        <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded bg-rose-600 text-white shadow-xs">
                          86'D
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      ${item.price.toFixed(2)} • {item.category}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const updated = { ...item, inStock: !isAvailable };
                      if (onSaveItem) onSaveItem(updated);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase transition-colors shadow-sm ${
                      isAvailable
                        ? 'bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/60'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}
                  >
                    {isAvailable ? "86 Item" : "Restore"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
