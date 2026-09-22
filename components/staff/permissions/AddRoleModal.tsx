import React, { useState } from 'react';
import { Role } from '../../../types';

interface AddRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  roles: Role[];
  onAddRole: (roleName: string, cloneFromRoleId?: string) => string | void;
}

export const AddRoleModal: React.FC<AddRoleModalProps> = ({
  isOpen,
  onClose,
  roles,
  onAddRole,
}) => {
  const [newRoleName, setNewRoleName] = useState('');
  const [cloneRoleId, setCloneRoleId] = useState<string>('R-SERVER');

  if (!isOpen) return null;

  const handleCreate = () => {
    if (!newRoleName.trim()) return;
    onAddRole(newRoleName.trim(), cloneRoleId);
    setNewRoleName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="font-bold text-base text-slate-800">Add New Role</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xl"
          >
            ×
          </button>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Role Title *
          </label>
          <input
            type="text"
            value={newRoleName}
            onChange={(e) => setNewRoleName(e.target.value)}
            placeholder="e.g. Lead Bartender, Event Coordinator..."
            className="w-full text-xs border border-slate-300 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Copy Default Permissions From
          </label>
          <select
            value={cloneRoleId}
            onChange={(e) => setCloneRoleId(e.target.value)}
            className="w-full text-xs border border-slate-300 rounded-xl p-2.5 bg-white outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 shadow-xs"
          >
            Create Role
          </button>
        </div>
      </div>
    </div>
  );
};
