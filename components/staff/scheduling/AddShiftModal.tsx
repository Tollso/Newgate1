import React, { useState } from 'react';
import { Schedule, Employee } from '../../../types';
import { X, Check } from 'lucide-react';

interface AddShiftModalProps {
  employees: Employee[];
  isOpen: boolean;
  onClose: () => void;
  onAddSchedule?: (schedule: Schedule) => void;
}

export const AddShiftModal: React.FC<AddShiftModalProps> = ({
  employees,
  isOpen,
  onClose,
  onAddSchedule
}) => {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [shiftStart, setShiftStart] = useState('');
  const [shiftEnd, setShiftEnd] = useState('');
  const [role, setRole] = useState('');
  const [section, setSection] = useState('');

  if (!isOpen) return null;

  const handleAddShift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployeeId || !shiftStart || !shiftEnd || !role) return;

    const employee = employees.find(emp => emp.id === selectedEmployeeId);
    if (!employee) return;

    const newSchedule: Schedule = {
      id: `SCH-${Date.now()}`,
      employeeId: employee.id,
      employeeName: employee.name,
      shiftStart,
      shiftEnd,
      role,
      assignedSection: section || undefined,
      source: 'POS'
    };

    onAddSchedule?.(newSchedule);
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setSelectedEmployeeId('');
    setShiftStart('');
    setShiftEnd('');
    setRole('');
    setSection('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="text-xl font-bold text-slate-800">Add New Shift</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleAddShift} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Employee</label>
            <select 
              value={selectedEmployeeId}
              onChange={(e) => setSelectedEmployeeId(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="">Select Employee</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.name} ({emp.role})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Start Time</label>
              <input 
                type="time" 
                value={shiftStart}
                onChange={(e) => setShiftStart(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">End Time</label>
              <input 
                type="time" 
                value={shiftEnd}
                onChange={(e) => setShiftEnd(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Role</label>
            <select 
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="">Select Role</option>
              <option value="Server">Server</option>
              <option value="Bartender">Bartender</option>
              <option value="Host">Host</option>
              <option value="Chef">Chef</option>
              <option value="Manager">Manager</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Section (Optional)</label>
            <input 
              type="text" 
              value={section}
              onChange={(e) => setSection(e.target.value)}
              placeholder="e.g. Patio, Main Dining"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-3 text-slate-600 font-bold hover:bg-slate-50 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg flex justify-center items-center gap-2"
            >
              <Check size={18} />
              Save Shift
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
