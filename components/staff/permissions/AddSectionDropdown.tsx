import React, { useState, useRef, useEffect } from 'react';
import { Layers, ChevronDown, Plus, Check, ArrowRight, Search } from 'lucide-react';
import { PermissionCategoryDef } from './types';

interface AddSectionDropdownProps {
  categories: PermissionCategoryDef[];
  selectedCategoryId: string;
  onSelectAndJumpToSection: (categoryId: string) => void;
  onFilterSection: (categoryId: string) => void;
  onOpenCreateSectionModal: () => void;
}

export const AddSectionDropdown: React.FC<AddSectionDropdownProps> = ({
  categories,
  selectedCategoryId,
  onSelectAndJumpToSection,
  onFilterSection,
  onOpenCreateSectionModal,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownSearch, setDropdownSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(dropdownSearch.toLowerCase()) ||
      cat.number.toString().includes(dropdownSearch) ||
      cat.description.toLowerCase().includes(dropdownSearch.toLowerCase())
  );

  const activeCategory = categories.find((c) => c.id === selectedCategoryId);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-xs cursor-pointer"
        title="Browse 15 sections or add new custom section"
      >
        <div className="w-5 h-5 rounded-md bg-indigo-600 text-white flex items-center justify-center text-[10px] font-extrabold">
          {categories.length}
        </div>
        <span className="truncate max-w-[150px] sm:max-w-[180px]">
          {selectedCategoryId === 'ALL'
            ? `Sections (${categories.length})`
            : activeCategory
            ? `${activeCategory.number}. ${activeCategory.name}`
            : `Sections (${categories.length})`}
        </span>
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 text-indigo-500 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 sm:right-0 sm:left-auto mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-fade-in flex flex-col max-h-[85vh]">
          {/* Top action header: Add Section & View All */}
          <div className="p-3 bg-slate-50 border-b border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Layers size={13} className="text-indigo-600" /> 15 Permission Sections
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenCreateSectionModal();
                }}
                className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors shadow-xs"
              >
                <Plus size={13} /> Add Section
              </button>
            </div>

            {/* Quick Search inside Dropdown */}
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={dropdownSearch}
                onChange={(e) => setDropdownSearch(e.target.value)}
                placeholder="Find section (e.g. Orders, Cash, POS)..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Show All Sections Button */}
          <div className="px-2 pt-2 pb-1 border-b border-slate-100">
            <button
              type="button"
              onClick={() => {
                onFilterSection('ALL');
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCategoryId === 'ALL'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-2xs'
                  : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-bold">
                  ★
                </span>
                <span>View All 15 Sections & Options</span>
              </div>
              {selectedCategoryId === 'ALL' && <Check size={14} className="text-indigo-600" />}
            </button>
          </div>

          {/* 15 Separate Sections List */}
          <div className="p-2 overflow-y-auto flex-1 divide-y divide-slate-100 space-y-1">
            <div className="px-2 py-1 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex justify-between items-center">
              <span>Click to Go Directly to Section</span>
              <span>{filteredCategories.length} sections</span>
            </div>

            {filteredCategories.map((cat) => {
              const isCurrent = selectedCategoryId === cat.id;
              return (
                <div
                  key={cat.id}
                  className={`group pt-1 first:pt-0 ${
                    isCurrent ? 'bg-indigo-50/60 rounded-xl' : ''
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      onSelectAndJumpToSection(cat.id);
                      setIsOpen(false);
                    }}
                    className="w-full flex items-start justify-between px-2.5 py-2 rounded-xl text-left hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-start gap-2.5 min-w-0 pr-2">
                      <span className="w-5 h-5 rounded-full bg-indigo-600 text-white shrink-0 flex items-center justify-center text-[10px] font-extrabold mt-0.5 shadow-2xs">
                        {cat.number}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {cat.name}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          {cat.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="text-[10px] bg-slate-100 group-hover:bg-indigo-100 text-slate-600 group-hover:text-indigo-700 px-2 py-0.5 rounded-full font-bold border border-slate-200 group-hover:border-indigo-200 transition-colors">
                        {cat.permissions.length} options
                      </span>
                      <span className="text-[10px] text-indigo-500 font-semibold opacity-0 group-hover:opacity-100 flex items-center gap-0.5 transition-opacity">
                        Go to <ArrowRight size={10} />
                      </span>
                    </div>
                  </button>
                </div>
              );
            })}

            {filteredCategories.length === 0 && (
              <div className="py-6 text-center text-xs text-slate-400">
                No sections matched &ldquo;{dropdownSearch}&rdquo;
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
