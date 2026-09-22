import React from 'react';
import { Category } from '../../types';

interface KioskCategoriesProps {
  categories: Category[];
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  layout: 'top' | 'sidebar';
}

export const KioskCategories: React.FC<KioskCategoriesProps> = ({ categories, activeCategory, setActiveCategory, layout }) => {
  if (layout === 'top') {
    return (
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setActiveCategory('All')}
          className={`px-6 py-3 rounded-full font-bold whitespace-nowrap transition-all ${
            activeCategory === 'All' 
              ? 'bg-slate-900 text-white shadow-md' 
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          All Items
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.name)}
            className={`px-6 py-3 rounded-full font-bold whitespace-nowrap transition-all ${
              activeCategory === cat.name 
                ? 'bg-slate-900 text-white shadow-md' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="w-64 bg-white border-r border-slate-200 overflow-y-auto shrink-0 p-4 space-y-2">
      <button
        onClick={() => setActiveCategory('All')}
        className={`w-full text-left px-4 py-4 rounded-xl font-bold transition-all ${
          activeCategory === 'All' 
            ? 'bg-slate-900 text-white shadow-md' 
            : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
        }`}
      >
        All Items
      </button>
      {categories.map(cat => (
        <button
          key={cat.id}
          onClick={() => setActiveCategory(cat.name)}
          className={`w-full text-left px-4 py-4 rounded-xl font-bold transition-all ${
            activeCategory === cat.name 
              ? 'bg-slate-900 text-white shadow-md' 
              : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
};
