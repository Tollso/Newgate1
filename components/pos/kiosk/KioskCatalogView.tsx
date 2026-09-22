import React from 'react';
import { InventoryItem, Category } from '../../../types';
import { KioskCategories } from '../KioskCategories';
import { Plus, Utensils } from 'lucide-react';

interface KioskCatalogViewProps {
  categories: Category[];
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  filteredItems: InventoryItem[];
  handleSelectItem: (item: InventoryItem) => void;
  theme: any;
  showItemImages?: boolean;
}

export const KioskCatalogView: React.FC<KioskCatalogViewProps> = ({
  categories,
  activeCategory,
  setActiveCategory,
  filteredItems,
  handleSelectItem,
  theme,
  showItemImages = true
}) => {
  return (
    <div className="flex-1 flex overflow-hidden pb-24">
      <KioskCategories
        categories={categories}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        layout="sidebar"
      />

      <div className="flex-1 flex flex-col h-full overflow-hidden relative p-6">
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleSelectItem(item)}
                className="bg-white rounded-3xl p-6 text-left border border-slate-200 shadow-xs hover:shadow-xl hover:border-indigo-300 hover:-translate-y-1 transition-all group flex flex-col h-full min-h-[220px] active:scale-98 cursor-pointer"
              >
                {showItemImages && (
                  <div className={`w-full aspect-square rounded-2xl ${theme.light} mb-5 flex items-center justify-center shrink-0 overflow-hidden`}>
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <Utensils size={44} className={theme.text} />
                    )}
                  </div>
                )}

                <h3 className="text-xl font-black text-slate-900 mb-1 leading-tight">{item.posName || item.name}</h3>
                {item.description && (
                  <p className="text-slate-500 text-sm font-medium line-clamp-2 mb-4 flex-1">{item.description}</p>
                )}
                <div className="mt-auto pt-4 flex items-center justify-between">
                  <span className="text-xl font-black text-slate-800">${item.price.toFixed(2)}</span>
                  <div className={`w-12 h-12 rounded-full ${theme.bg} text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-md`}>
                    <Plus size={22} />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
