import React, { useState } from 'react';
import { Search, ChevronRight, CheckCircle2 } from 'lucide-react';
import { ALL_SETTINGS_CATEGORIES, searchSettingsOptions, SettingCategory } from '../categoriesIndex';

interface SettingsSidebarV2Props {
  selectedCategoryId: string;
  setSelectedCategoryId: (id: string) => void;
  selectedPageId: string | null;
  setSelectedPageId: (pageId: string | null) => void;
}

export const SettingsSidebarV2: React.FC<SettingsSidebarV2Props> = ({
  selectedCategoryId,
  setSelectedCategoryId,
  selectedPageId,
  setSelectedPageId
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const searchResults = searchSettingsOptions(searchQuery);

  return (
    <div className="w-80 border-r border-slate-200 bg-white flex flex-col shrink-0 h-full overflow-hidden">
      {/* Search Header */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-black text-slate-800 tracking-tight uppercase">System Settings</h2>
          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">
            20 Categories
          </span>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={15} className="text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search all 20 categories & options..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs font-bold text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        {searchQuery ? (
          /* Search Results View */
          searchResults.length > 0 ? (
            <div className="space-y-1">
              <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Search Matches ({searchResults.length})
              </div>
              {searchResults.map((res, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSelectedCategoryId(res.categoryId);
                    setSelectedPageId(res.pageId);
                    setSearchQuery('');
                  }}
                  className="w-full text-left p-2.5 rounded-xl transition-all border border-transparent hover:border-slate-200 hover:bg-slate-50 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-800 group-hover:text-indigo-600">{res.pageName}</span>
                    <span className="text-[10px] font-semibold text-slate-400">{res.categoryTitle}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{res.description}</p>
                  {res.matchedOption && (
                    <span className="inline-block mt-1 text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-medium">
                      Matched: {res.matchedOption}
                    </span>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-slate-400 font-medium">
              No matching setting options found for "{searchQuery}".
            </div>
          )
        ) : (
          /* 20 Categories Accordion/List */
          ALL_SETTINGS_CATEGORIES.map((cat) => {
            const isSelected = selectedCategoryId === cat.id;

            return (
              <div key={cat.id} className="mb-0.5">
                <button
                  onClick={() => {
                    setSelectedCategoryId(cat.id);
                    setSelectedPageId(null);
                  }}
                  className={`w-full text-left p-3 rounded-xl transition-all flex items-start gap-3 border ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-md border-indigo-600'
                      : 'border-transparent text-slate-700 hover:bg-slate-100/80 hover:text-slate-900'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 font-black text-xs mt-0.5 ${
                    isSelected ? 'bg-indigo-500/50 text-white' : 'bg-slate-200/70 text-slate-600'
                  }`}>
                    {cat.num}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`font-bold text-xs truncate ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                        {cat.title}
                      </span>
                      {isSelected && <CheckCircle2 size={14} className="text-indigo-200 shrink-0" />}
                    </div>
                    <p className={`text-[11px] line-clamp-1 mt-0.5 ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                      {cat.pages.length} options inside
                    </p>
                  </div>
                </button>

                {/* Expanded Sub-pages inside selected category */}
                {isSelected && (
                  <div className="ml-9 my-1 space-y-0.5 border-l-2 border-indigo-200 pl-2">
                    {cat.pages.map((p) => {
                      const isPageSelected = selectedPageId === p.id;
                      return (
                        <button
                          key={p.id}
                          onClick={() => setSelectedPageId(p.id)}
                          className={`w-full text-left py-1.5 px-2.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-between ${
                            isPageSelected
                              ? 'bg-indigo-50 text-indigo-700 font-bold'
                              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                          }`}
                        >
                          <span className="truncate">{p.name}</span>
                          <ChevronRight size={12} className={isPageSelected ? 'text-indigo-600' : 'text-slate-300'} />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </nav>
    </div>
  );
};
