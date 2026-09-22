import React, { useState } from 'react';
import { Employee } from '../../types';
import { Search, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';

interface EmployeesTableProps {
  employees: Employee[];
  onOpenEdit: (emp: Employee) => void;
  onDeleteEmployee?: (id: string) => void;
}

export const EmployeesTable: React.FC<EmployeesTableProps> = ({ employees, onOpenEdit, onDeleteEmployee }) => {
  const [showPasscodes, setShowPasscodes] = useState<Record<string, boolean>>({});

  const toggleShowPasscode = (id: string) => {
    setShowPasscodes(prev => ({ ...prev, [id]: !prev[id] }));
  };
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-fade-in">
      <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search employees..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold tracking-wider">
              <th className="px-6 py-4">Employee</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Passcode</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {employees.map((emp) => (
              <tr key={emp.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold mr-3 border border-indigo-200">
                      {emp.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">{emp.name}</div>
                      <div className="text-sm text-slate-500">{emp.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                    {emp.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-sm ${emp.status === 'Active' ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600 bg-slate-100'}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${emp.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                    {emp.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-600 font-mono tracking-wider">
                  <div className="flex items-center gap-2">
                    <span>{showPasscodes[emp.id] ? (emp.passcode || '****') : '••••'}</span>
                    <button 
                      onClick={() => toggleShowPasscode(emp.id)}
                      className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                      title={showPasscodes[emp.id] ? "Hide PIN" : "Show PIN"}
                    >
                      {showPasscodes[emp.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => onOpenEdit(emp)}
                      className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => onDeleteEmployee && onDeleteEmployee(emp.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
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
