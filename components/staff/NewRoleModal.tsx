import React from 'react';
import { Role, Employee } from '../../types';
import { X, Search, ChevronDown } from 'lucide-react';

interface NewRoleModalProps {
  showNewRoleModal: boolean;
  setShowNewRoleModal: (val: boolean) => void;
  newRoleName: string;
  setNewRoleName: (val: string) => void;
  cloneRoleId: string;
  setCloneRoleId: (val: string) => void;
  roles: Role[];
  employees: Employee[];
  selectedEmployeeIds: string[];
  setSelectedEmployeeIds: React.Dispatch<React.SetStateAction<string[]>>;
  employeeSearch: string;
  setEmployeeSearch: (val: string) => void;
  viewSelectedOnly: boolean;
  setViewSelectedOnly: (val: boolean) => void;
  handleSaveNewRole: () => void;
}

export const NewRoleModal: React.FC<NewRoleModalProps> = ({
  showNewRoleModal,
  setShowNewRoleModal,
  newRoleName,
  setNewRoleName,
  cloneRoleId,
  setCloneRoleId,
  roles = [],
  employees = [],
  selectedEmployeeIds = [],
  setSelectedEmployeeIds,
  employeeSearch,
  setEmployeeSearch,
  viewSelectedOnly,
  setViewSelectedOnly,
  handleSaveNewRole
}) => {
  if (!showNewRoleModal) return null;

  const toggleEmployeeSelection = (id: string) => {
    setSelectedEmployeeIds(prev => 
      prev.includes(id) ? prev.filter(eid => eid !== id) : [...prev, id]
    );
  };

  const filteredEmployees = employees.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(employeeSearch.toLowerCase());
    const matchesView = viewSelectedOnly ? selectedEmployeeIds.includes(e.id) : true;
    return matchesSearch && matchesView;
  });

  const toggleSelectAll = () => {
    const visible = employees.filter(e => e.name.toLowerCase().includes(employeeSearch.toLowerCase())).map(e => e.id);
    const allSelected = visible.every(id => selectedEmployeeIds.includes(id));
    if (allSelected) {
      setSelectedEmployeeIds(prev => prev.filter(id => !visible.includes(id)));
    } else {
      const newIds = new Set([...selectedEmployeeIds, ...visible]);
      setSelectedEmployeeIds(Array.from(newIds));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-scale-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-8 py-6 border-b border-slate-200 flex justify-between items-center bg-white sticky top-0 z-10">
          <h3 className="font-black text-2xl text-slate-800 tracking-tight">New role</h3>
          <button onClick={() => setShowNewRoleModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={28} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          <div className="space-y-6">
            <h4 className="font-bold text-lg text-slate-800 border-b border-slate-100 pb-2">Role details</h4>
            <p className="text-xs text-slate-500 italic">*Indicates a required field.</p>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Role name*</label>
              <input 
                type="text" 
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                placeholder="e.g. Senior Server"
              />
              <p className="text-xs text-slate-500 mt-2">Examples: Accountant, bartender, host, server</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">By default, this role will have the same permissions as:</label>
              <div className="relative">
                <select 
                  value={cloneRoleId}
                  onChange={(e) => setCloneRoleId(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm font-medium bg-white appearance-none focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {roles.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-2">
              <h4 className="font-bold text-lg text-slate-800">Employees</h4>
              <p className="text-sm text-slate-500 mt-1">Select employees to be assigned to this role</p>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{(employees || []).length} options are available.</span>
              <div className="flex gap-4 text-sm font-bold">
                <button 
                  onClick={() => setViewSelectedOnly(false)}
                  className={`${!viewSelectedOnly ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  View all ({(employees || []).length})
                </button>
                <button 
                  onClick={() => setViewSelectedOnly(true)}
                  className={`${viewSelectedOnly ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  View selected ({(selectedEmployeeIds || []).length})
                </button>
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                value={employeeSearch}
                onChange={(e) => setEmployeeSearch(e.target.value)}
                placeholder="Search employee" 
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              />
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-50 p-3 border-b border-slate-200 flex items-center gap-3">
                <input 
                  type="checkbox" 
                  checked={filteredEmployees.length > 0 && filteredEmployees.every(e => selectedEmployeeIds.includes(e.id))}
                  onChange={toggleSelectAll}
                  className="h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <span className="text-sm font-bold text-slate-700">Select all</span>
              </div>
              <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 bg-white">
                {filteredEmployees.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-sm italic">No employees found.</div>
                ) : (
                  filteredEmployees.map(emp => (
                    <label key={emp.id} className="flex items-center gap-3 p-4 hover:bg-slate-50 cursor-pointer transition-colors">
                      <input 
                        type="checkbox" 
                        checked={selectedEmployeeIds.includes(emp.id)}
                        onChange={() => toggleEmployeeSelection(emp.id)}
                        className="h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                          {emp.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{emp.name}</p>
                          <p className="text-xs text-slate-500">{emp.email}</p>
                        </div>
                      </div>
                    </label>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-200 bg-white flex justify-end gap-3 sticky bottom-0 z-10">
          <button 
            onClick={() => setShowNewRoleModal(false)}
            className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSaveNewRole}
            disabled={!newRoleName}
            className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg disabled:opacity-50 disabled:shadow-none"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
