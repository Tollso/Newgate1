import React from 'react';
import { Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { ModifierOption } from '../../types';

interface ModifierOptionRowProps {
  modifier: ModifierOption;
  index: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onChange: (updated: ModifierOption) => void;
  onDelete: () => void;
}

export const ModifierOptionRow: React.FC<ModifierOptionRowProps> = ({
  modifier,
  index,
  isExpanded,
  onToggleExpand,
  onChange,
  onDelete,
}) => {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-3 transition-all hover:border-slate-300">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 text-xs font-black flex items-center justify-center shrink-0">
            {index + 1}
          </span>
          <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-0.5">
                Modifier name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={modifier.name}
                onChange={(e) => onChange({ ...modifier, name: e.target.value })}
                placeholder="e.g. Extra Cheese, Almond Milk"
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-0.5">
                Price<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={modifier.price}
                  onChange={(e) => onChange({ ...modifier, price: parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                  className="w-full pl-6 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={onToggleExpand}
            className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-200 transition-colors"
            title="Toggle All Options"
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            title="Delete Modifier"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Primary Toggles Summary */}
      <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-700 pt-1 border-t border-slate-200/60">
        <label className="inline-flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={!!modifier.required}
            onChange={(e) => onChange({ ...modifier, required: e.target.checked })}
            className="w-3.5 h-3.5 text-indigo-600 rounded accent-indigo-600 cursor-pointer"
          />
          <span className="text-[11px] font-extrabold text-indigo-700">*Required</span>
        </label>

        <label className="inline-flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={modifier.inStock}
            onChange={(e) => onChange({ ...modifier, inStock: e.target.checked })}
            className="w-3.5 h-3.5 text-emerald-600 rounded accent-emerald-600 cursor-pointer"
          />
          <span className="text-[11px] font-bold text-slate-700">In stock</span>
        </label>

        <label className="inline-flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={modifier.onlineOrdering}
            onChange={(e) => onChange({ ...modifier, onlineOrdering: e.target.checked })}
            className="w-3.5 h-3.5 text-blue-600 rounded accent-blue-600 cursor-pointer"
          />
          <span className="text-[11px] font-bold text-slate-700">Online ordering</span>
        </label>

        <label className="inline-flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={modifier.showOnline}
            onChange={(e) => onChange({ ...modifier, showOnline: e.target.checked })}
            className="w-3.5 h-3.5 text-purple-600 rounded accent-purple-600 cursor-pointer"
          />
          <span className="text-[11px] font-bold text-slate-700">Show online</span>
        </label>
      </div>

      {/* Expanded Extra Details (Online Name & Label) */}
      {isExpanded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200 animate-fade-in">
          <div>
            <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
              Online name
            </label>
            <input
              type="text"
              value={modifier.onlineName || ''}
              onChange={(e) => onChange({ ...modifier, onlineName: e.target.value })}
              placeholder="e.g. Organic Oat Milk (Online)"
              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
              label
            </label>
            <input
              type="text"
              value={modifier.label || ''}
              onChange={(e) => onChange({ ...modifier, label: e.target.value })}
              placeholder="e.g. Gluten-Free, Vegan, Extra, Dairy Free"
              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      )}
    </div>
  );
};
