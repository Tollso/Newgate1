import React from 'react';
import { Search } from 'lucide-react';
import { RetailProduct } from '../../../types/retail';

interface RetailCatalogGridProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  filteredProducts: RetailProduct[];
  onProductClick: (p: RetailProduct) => void;
}

export const RetailCatalogGrid: React.FC<RetailCatalogGridProps> = ({
  searchQuery,
  setSearchQuery,
  categories,
  selectedCategory,
  setSelectedCategory,
  filteredProducts,
  onProductClick,
}) => {
  return (
    <div className="flex-1 flex flex-col border-r border-slate-800 bg-slate-900/40 overflow-hidden">
      {/* Search & Category Pills */}
      <div className="p-4 border-b border-slate-800 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-slate-500" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Scan barcode or search product name / SKU..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="flex-1 p-4 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
        {filteredProducts.map(p => (
          <button
            key={p.id}
            onClick={() => onProductClick(p)}
            className="p-4 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 rounded-xl flex flex-col justify-between text-left transition-all hover:scale-[1.02]"
          >
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                {p.brand || p.category}
              </span>
              <h4 className="font-bold text-sm text-white line-clamp-2">{p.name}</h4>
              <span className="text-[11px] font-mono text-slate-400 mt-1 block">SKU: {p.primarySku}</span>
            </div>

            <div className="mt-4 pt-2 border-t border-slate-700/50 flex items-center justify-between">
              <span className="text-base font-extrabold text-indigo-400">${p.basePrice.toFixed(2)}</span>
              {p.hasVariants ? (
                <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full font-bold">
                  {p.variants.length} Variants
                </span>
              ) : (
                <span className="text-[10px] text-slate-400">Stock: {p.totalStockQuantity}</span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
