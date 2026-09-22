import React, { useState } from 'react';
import { Users, Plus, Shield, CheckCircle2, Trash2 } from 'lucide-react';
import { Role } from '../../../types';



interface EmployeeRolesSubProps {
  renderSectionHeader: (title: string, description: string, parentSection?: string) => React.ReactNode;
  roles?: Role[];
  setRoles?: React.Dispatch<React.SetStateAction<Role[]>>;
}

export const EmployeeRolesSub: React.FC<EmployeeRolesSubProps> = ({ 
  renderSectionHeader,
  roles = [],
  setRoles
}) => {


  const [showAddModal, setShowAddModal] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleRate, setNewRoleRate] = useState<number>(18.00);
  const [toast, setToast] = useState<string | null>(null);

  const handleAddRole = () => {
    if (newRoleName.trim()) {
      const newR: Role = {
        id: `R-${Date.now()}`,
        name: newRoleName.trim(),
        type: 'Custom',
        isSystem: false,
        hourlyRate: newRoleRate,
        pinRequired: true
      };
      if (setRoles) setRoles([...roles, newR]);
      setNewRoleName('');
      setNewRoleRate(18.00);
      setShowAddModal(false);
      setToast("New employee role added successfully!");
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleDeleteRole = (id: string) => {
    if (setRoles) setRoles(roles.filter(r => r.id !== id));
  };

  return (
    <div className="max-w-4xl animate-fade-in pb-20 space-y-8">
      <div className="flex justify-between items-end">
        {renderSectionHeader("Employee Roles", "Define store positions, default hourly wage bases, and security requirements.", "Employees")}
        <button
          onClick={() => setShowAddModal(!showAddModal)}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-indigo-700 transition-all shadow-md mb-8"
        >
          <Plus size={16} /> Add Custom Role
        </button>
      </div>

      {toast && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 text-sm font-bold animate-fade-in">
          <CheckCircle2 size={18} /> {toast}
        </div>
      )}

      {showAddModal && (
        <div className="bg-white rounded-2xl border border-indigo-200 shadow-lg p-6 space-y-4 animate-fade-in">
          <h4 className="font-bold text-sm text-slate-800">Add New Employee Role</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Role Title</label>
              <input
                type="text"
                value={newRoleName}
                onChange={e => setNewRoleName(e.target.value)}
                placeholder="e.g. Bartender, Delivery Driver"
                className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-bold bg-white outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Default Base Rate ($/hr)</label>
              <input
                type="number"
                value={newRoleRate}
                onChange={e => setNewRoleRate(parseFloat(e.target.value) || 0)}
                className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-bold bg-white outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={handleAddRole}
              className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold text-xs shadow-md"
            >
              Save Role
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-100">
          {roles.map(r => (
            <div key={r.id} className="p-6 flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Users size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-sm">{r.name}</h4>
                    {r.isSystem && (
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-black uppercase">Core System Role</span>
                    )}
                  </div>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">Base Rate: <span className="font-bold text-slate-800">${(r.hourlyRate || 0).toFixed(2)} / hr</span></p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={r.pinRequired}
                    onChange={e => {
                      const updated = roles.map(item => item.id === r.id ? { ...item, pinRequired: e.target.checked } : item);
                      if (setRoles) setRoles(updated);
                    }}
                    className="h-4 w-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                  />
                  <span className="text-xs font-bold text-slate-600">PIN Login Required</span>
                </label>

                {!r.isSystem && (
                  <button
                    onClick={() => handleDeleteRole(r.id)}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete Role"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
