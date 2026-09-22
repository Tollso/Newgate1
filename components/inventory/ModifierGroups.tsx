import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Layers, AlertTriangle } from 'lucide-react';
import { ModifierGroup, InventoryItem } from '../../types';
import { ModifierGroupModal } from './ModifierGroupModal';

interface ModifierGroupsProps {
  inventory?: InventoryItem[];
  modifierGroups: ModifierGroup[];
  setModifierGroups: React.Dispatch<React.SetStateAction<ModifierGroup[]>>;
}

const ModifierGroups: React.FC<ModifierGroupsProps> = ({ modifierGroups, setModifierGroups, inventory = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState<ModifierGroup | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredGroups = modifierGroups.filter(grp => 
    grp.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingGroup(null);
    setShowModal(true);
  };

  const handleOpenEdit = (group: ModifierGroup) => {
    setEditingGroup(group);
    setShowModal(true);
  };

  const handleSave = (groupData: ModifierGroup) => {
    if (!groupData.name?.trim()) return;

    if (editingGroup) {
      setModifierGroups(prev => prev.map(g => g.id === editingGroup.id ? groupData : g));
    } else {
      setModifierGroups(prev => [...prev, groupData]);
    }

    setShowModal(false);
  };

  const confirmDelete = () => {
    if (deletingId) {
      setModifierGroups(prev => prev.filter(g => g.id !== deletingId));
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      {deletingId && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm border border-slate-100 p-6 text-center">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={24} />
            </div>
            <h3 className="font-bold text-lg text-slate-800 mb-2">Delete Modifier Group?</h3>
            <p className="text-sm text-slate-500 mb-6">This action cannot be undone.</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setDeletingId(null)} className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-xl text-sm">Cancel</button>
              <button onClick={confirmDelete} className="px-5 py-2 bg-red-600 text-white font-semibold rounded-xl text-sm">Delete</button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <ModifierGroupModal
          editingGroup={editingGroup}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Modifier Groups</h1>
          <p className="text-slate-500 text-xs font-medium mt-0.5">Manage customization options, toppings, and item add-ons</p>
        </div>
        <button onClick={handleOpenAdd} className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-bold text-sm rounded-xl hover:bg-indigo-700">
          <Plus size={18} /> Add Modifier Group
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative max-w-md">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search modifier groups..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
            <tr>
              <th className="p-4">Group Name</th>
              <th className="p-4">Modifiers Count</th>
              <th className="p-4">Required</th>
              <th className="p-4">Online Ordering</th>
              <th className="p-4">Linked Items</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {filteredGroups.map(grp => (
              <tr key={grp.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 font-extrabold text-slate-900">
                  <div className="flex items-center gap-2">
                    <Layers size={16} className="text-indigo-600 shrink-0" />
                    <span>{grp.name}</span>
                  </div>
                </td>
                <td className="p-4 font-bold text-slate-700">
                  {grp.modifiers?.length || grp.modifiersCount || 0} option{(grp.modifiers?.length || grp.modifiersCount) !== 1 ? 's' : ''}
                </td>
                <td className="p-4">
                  {grp.required ? (
                    <span className="px-2.5 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-lg text-xs font-black uppercase tracking-wider">
                      *Required
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400 font-medium">Optional</span>
                  )}
                </td>
                <td className="p-4 text-xs font-bold">
                  {grp.onlineOrdering ?? true ? (
                    <span className="text-emerald-600">Enabled</span>
                  ) : (
                    <span className="text-slate-400">Disabled</span>
                  )}
                </td>
                <td className="p-4 font-semibold">{inventory.filter(i => (i.modifierGroups || []).includes(grp.id)).length} items</td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => handleOpenEdit(grp)} className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50" title="Edit Group"><Edit2 size={16} /></button>
                    <button onClick={() => setDeletingId(grp.id)} className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50" title="Delete Group"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ModifierGroups;
