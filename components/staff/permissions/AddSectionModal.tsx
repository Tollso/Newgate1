import React, { useState } from 'react';
import { Plus, Trash2, FolderPlus } from 'lucide-react';
import { PermissionCategoryDef, PermissionDef } from './types';

interface AddSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  nextNumber: number;
  onAddSection: (newSection: PermissionCategoryDef) => void;
}

export const AddSectionModal: React.FC<AddSectionModalProps> = ({
  isOpen,
  onClose,
  nextNumber,
  onAddSection,
}) => {
  const [sectionName, setSectionName] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState<Array<{ name: string; description: string }>>([
    { name: '', description: '' },
  ]);

  if (!isOpen) return null;

  const handleAddOptionField = () => {
    setOptions((prev) => [...prev, { name: '', description: '' }]);
  };

  const handleRemoveOptionField = (index: number) => {
    if (options.length <= 1) return;
    setOptions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleOptionChange = (
    index: number,
    field: 'name' | 'description',
    value: string
  ) => {
    setOptions((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sectionName.trim()) return;

    const validOptions = options.filter((opt) => opt.name.trim().length > 0);
    const sectionId = `custom-sec-${Date.now()}`;

    const permissionDefs: PermissionDef[] = validOptions.map((opt, idx) => ({
      id: `${sectionId}-opt-${idx + 1}`,
      name: opt.name.trim(),
      description: opt.description.trim() || `Permission for ${opt.name.trim()}`,
    }));

    // If user provided no options, create at least one default option for the section
    if (permissionDefs.length === 0) {
      permissionDefs.push({
        id: `${sectionId}-opt-1`,
        name: `Access ${sectionName.trim()}`,
        description: `Allows access and operations within ${sectionName.trim()}`,
      });
    }

    const newCategory: PermissionCategoryDef = {
      id: sectionId,
      number: nextNumber,
      name: sectionName.trim(),
      description: description.trim() || `Custom section for ${sectionName.trim()}`,
      permissions: permissionDefs,
    };

    onAddSection(newCategory);
    setSectionName('');
    setDescription('');
    setOptions([{ name: '', description: '' }]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b pb-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FolderPlus size={18} />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">Add New Permission Section</h3>
              <p className="text-xs text-slate-500">Create a new section and add all its options</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl font-bold">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto flex-1 pr-1">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Section Title *
            </label>
            <input
              type="text"
              required
              value={sectionName}
              onChange={(e) => setSectionName(e.target.value)}
              placeholder="e.g. VIP Lounge, Catering, Curbside Pickup..."
              className="w-full text-xs border border-slate-300 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Section Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of what this section controls..."
              className="w-full text-xs border border-slate-300 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700">
                Section Options / Permissions ({options.length})
              </label>
              <button
                type="button"
                onClick={handleAddOptionField}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1"
              >
                <Plus size={14} /> Add Option
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto border border-slate-200 rounded-xl p-3 bg-slate-50/50">
              {options.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200 shadow-2xs">
                  <div className="flex-1 space-y-1">
                    <input
                      type="text"
                      value={opt.name}
                      onChange={(e) => handleOptionChange(idx, 'name', e.target.value)}
                      placeholder={`Option #${idx + 1} Name (e.g. Access Register)`}
                      className="w-full text-xs border border-slate-200 rounded-md px-2 py-1 outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <input
                      type="text"
                      value={opt.description}
                      onChange={(e) => handleOptionChange(idx, 'description', e.target.value)}
                      placeholder="What this option allows/controls..."
                      className="w-full text-[11px] text-slate-500 border border-slate-200 rounded-md px-2 py-0.5 outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  {options.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveOptionField(idx)}
                      className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                      title="Remove option"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 shadow-xs flex items-center gap-1.5"
            >
              <Plus size={14} /> Save Section & Options
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
