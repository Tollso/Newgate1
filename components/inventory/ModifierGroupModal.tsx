import React, { useState } from 'react';
import { ModifierGroup, ModifierOption } from '../../types';
import { X, Plus, Layers } from 'lucide-react';
import { ModifierOptionRow } from './ModifierOptionRow';

interface ModifierGroupModalProps {
  editingGroup: ModifierGroup | null;
  onClose: () => void;
  onSave: (formData: ModifierGroup) => void;
}

export const ModifierGroupModal: React.FC<ModifierGroupModalProps> = ({
  editingGroup,
  onClose,
  onSave,
}) => {
  const [groupName, setGroupName] = useState<string>(editingGroup?.name || '');
  const [required, setRequired] = useState<boolean>(editingGroup?.required || false);
  const [showOnPos, setShowOnPos] = useState<boolean>(editingGroup?.showOnPos ?? true);
  const [showOnline, setShowOnline] = useState<boolean>(editingGroup?.showOnline ?? true);
  const [onlineOrdering, setOnlineOrdering] = useState<boolean>(editingGroup?.onlineOrdering ?? true);

  const [modifiers, setModifiers] = useState<ModifierOption[]>(() => {
    if (editingGroup?.modifiers && editingGroup.modifiers.length > 0) {
      return editingGroup.modifiers;
    }
    // Default initial modifier option if creating new
    return [
      {
        id: `MOD-${Date.now()}-1`,
        name: 'Standard Option',
        price: 0,
        required: false,
        inStock: true,
        onlineOrdering: true,
        onlineName: 'Standard Option',
        label: '',
        showOnline: true,
      },
    ];
  });

  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleAddModifierRow = () => {
    const newMod: ModifierOption = {
      id: `MOD-${Date.now()}-${modifiers.length + 1}`,
      name: '',
      price: 0,
      required: false,
      inStock: true,
      onlineOrdering: true,
      onlineName: '',
      label: '',
      showOnline: true,
    };
    const updated = [...modifiers, newMod];
    setModifiers(updated);
    setExpandedIndex(updated.length - 1);
  };

  const handleUpdateModifier = (index: number, updatedMod: ModifierOption) => {
    const updated = [...modifiers];
    updated[index] = updatedMod;
    setModifiers(updated);
  };

  const handleDeleteModifier = (index: number) => {
    if (modifiers.length <= 1) {
      setErrorMsg('A modifier group must have at least one modifier option.');
      return;
    }
    setErrorMsg('');
    setModifiers(modifiers.filter((_, i) => i !== index));
    if (expandedIndex === index) setExpandedIndex(null);
  };

  const handleSubmit = () => {
    setErrorMsg('');
    if (!groupName.trim()) {
      setErrorMsg('Modifier Group Name is required.');
      return;
    }

    // Check individual modifiers
    for (let i = 0; i < modifiers.length; i++) {
      if (!modifiers[i].name.trim()) {
        setErrorMsg(`Modifier #${i + 1} requires a valid Modifier name.`);
        return;
      }
    }

    const savedGroup: ModifierGroup = {
      id: editingGroup?.id || `MODG-${Date.now()}`,
      name: groupName.trim(),
      required,
      modifiersCount: modifiers.length,
      itemsCount: editingGroup?.itemsCount || 0,
      showOnPos,
      showOnline,
      onlineOrdering,
      modifiers,
    };

    onSave(savedGroup);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-3 md:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl my-auto overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl">
              <Layers size={18} />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-800 tracking-tight">
                {editingGroup ? 'Edit Modifier Group' : 'Add Modifier Group'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">Configure options, prices, stock, and online visibility</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-200">
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {errorMsg && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-600 text-xs font-bold rounded-2xl flex items-center gap-2">
              <span>⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Group General Configuration */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <div>
              <label className="block text-xs font-extrabold text-slate-600 uppercase tracking-wider mb-1.5">
                Modifier Group Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Pizza Toppings, Dressing Choice, Size"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl outline-none font-bold text-slate-800 focus:border-indigo-500 text-sm"
                autoFocus
              />
            </div>

            {/* Group Level Controls */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              <label className="flex items-center gap-2 p-2.5 bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-indigo-300">
                <input
                  type="checkbox"
                  checked={required}
                  onChange={(e) => setRequired(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded accent-indigo-600 cursor-pointer"
                />
                <span className="text-xs font-extrabold text-indigo-900">*Required</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-indigo-300">
                <input
                  type="checkbox"
                  checked={showOnPos}
                  onChange={(e) => setShowOnPos(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded accent-indigo-600 cursor-pointer"
                />
                <span className="text-xs font-bold text-slate-700">Show on POS</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-indigo-300">
                <input
                  type="checkbox"
                  checked={onlineOrdering}
                  onChange={(e) => setOnlineOrdering(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded accent-indigo-600 cursor-pointer"
                />
                <span className="text-xs font-bold text-slate-700">Online ordering</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-indigo-300">
                <input
                  type="checkbox"
                  checked={showOnline}
                  onChange={(e) => setShowOnline(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded accent-indigo-600 cursor-pointer"
                />
                <span className="text-xs font-bold text-slate-700">Show online</span>
              </label>
            </div>
          </div>

          {/* Individual Modifiers List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-extrabold text-slate-800 text-sm">Modifier Options ({modifiers.length})</h4>
                <p className="text-[11px] text-slate-500 font-medium">Add choices with name, price, stock status, label & online availability</p>
              </div>
              <button
                type="button"
                onClick={handleAddModifierRow}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-xl font-bold text-xs hover:bg-indigo-100 transition-colors cursor-pointer"
              >
                <Plus size={15} /> Add Option
              </button>
            </div>

            <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
              {modifiers.map((mod, idx) => (
                <ModifierOptionRow
                  key={mod.id || idx}
                  modifier={mod}
                  index={idx}
                  isExpanded={expandedIndex === idx}
                  onToggleExpand={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
                  onChange={(updated) => handleUpdateModifier(idx, updated)}
                  onDelete={() => handleDeleteModifier(idx)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center shrink-0">
          <span className="text-xs font-bold text-slate-500">
            {modifiers.length} option{modifiers.length !== 1 ? 's' : ''} in group
          </span>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 font-bold text-sm hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2 bg-indigo-600 text-white font-black text-sm rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all cursor-pointer active:scale-98"
            >
              Save Modifier Group
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
