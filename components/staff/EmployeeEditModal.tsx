import React from 'react';
import { Employee, Role } from '../../types';
import { X, User, Shield, DollarSign, Lock, Key, BadgeAlert } from 'lucide-react';

interface EmployeeEditModalProps {
  showModal: boolean;
  setShowModal: (val: boolean) => void;
  isEditing: boolean;
  activeTab: 'Profile' | 'Role' | 'Payroll' | 'Security';
  setActiveTab: (val: 'Profile' | 'Role' | 'Payroll' | 'Security') => void;
  currentEmployee: Partial<Employee>;
  setCurrentEmployee: React.Dispatch<React.SetStateAction<Partial<Employee>>>;
  formError: string | null;
  roles: Role[];
  handleSaveEmployee: () => void;
}

export const EmployeeEditModal: React.FC<EmployeeEditModalProps> = ({
  showModal,
  setShowModal,
  isEditing,
  activeTab,
  setActiveTab,
  currentEmployee,
  setCurrentEmployee,
  formError,
  roles,
  handleSaveEmployee
}) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-scale-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-lg text-slate-800">{isEditing ? 'Edit Team Member' : 'Add New Team Member'}</h3>
          <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        </div>
        
        <div className="flex border-b border-slate-200">
          {(['Profile', 'Role', 'Payroll', 'Security'] as const).map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors flex items-center justify-center gap-2 ${
                activeTab === tab ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:bg-slate-50'
              }`}
            >
              {tab === 'Profile' && <User size={16} />}
              {tab === 'Role' && <Shield size={16} />}
              {tab === 'Payroll' && <DollarSign size={16} />}
              {tab === 'Security' && <Lock size={16} />}
              {tab}
            </button>
          ))}
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {formError && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-3 text-rose-800 text-sm animate-shake">
              <BadgeAlert size={20} className="shrink-0" />
              <p className="font-medium">{formError}</p>
            </div>
          )}

          {activeTab === 'Profile' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                  <input type="text" value={currentEmployee.name || ''} onChange={e => setCurrentEmployee({...currentEmployee, name: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nickname</label>
                  <input type="text" value={currentEmployee.nickname || ''} onChange={e => setCurrentEmployee({...currentEmployee, nickname: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Johnny" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email Address *</label>
                  <input type="email" value={currentEmployee.email || ''} onChange={e => setCurrentEmployee({...currentEmployee, email: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                  <input type="tel" value={currentEmployee.phone || ''} onChange={e => setCurrentEmployee({...currentEmployee, phone: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="555-0199" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select value={currentEmployee.status} onChange={e => setCurrentEmployee({...currentEmployee, status: e.target.value as any})} className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white">
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Terminated">Terminated</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'Role' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Role Assignment *</label>
                <select value={currentEmployee.role} onChange={e => setCurrentEmployee({...currentEmployee, role: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
                  {roles.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                </select>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3">
                <Shield size={18} className="text-blue-600 mt-0.5 shrink-0" />
                <p className="text-xs text-blue-700 leading-relaxed">
                  Permissions for this employee are inherited from their assigned role. Managers can override role-based permissions in the 'Matrix' view.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'Payroll' && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Pay Type</label>
                  <select value={currentEmployee.payType} onChange={e => setCurrentEmployee({...currentEmployee, payType: e.target.value as any})} className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white">
                    <option value="Hourly">Hourly</option>
                    <option value="Salary">Salary</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{currentEmployee.payType === 'Salary' ? 'Annual Salary' : 'Hourly Rate ($)'}</label>
                  <div className="relative">
                    <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="number" value={currentEmployee.hourlyRate || ''} onChange={e => setCurrentEmployee({...currentEmployee, hourlyRate: parseFloat(e.target.value)})} className="w-full border border-slate-300 rounded-lg pl-9 pr-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Security' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Device Access Passcode *</label>
                <div className="relative">
                  <Key size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    maxLength={8}
                    value={currentEmployee.passcode || ''} 
                    onChange={e => setCurrentEmployee({...currentEmployee, passcode: e.target.value.replace(/\D/g, '')})} 
                    className="w-full border border-slate-300 rounded-lg pl-9 pr-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 font-mono tracking-widest text-lg" 
                    placeholder="----"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">Passcodes must be unique across all employees.</p>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Allow Device Login</h4>
                  <p className="text-xs text-slate-500">Enable this user to log into registers.</p>
                </div>
                <button 
                  onClick={() => setCurrentEmployee({...currentEmployee, deviceAccess: !currentEmployee.deviceAccess})}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${currentEmployee.deviceAccess ? 'bg-indigo-600' : 'bg-slate-200'}`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${currentEmployee.deviceAccess ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
          <button onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors">Cancel</button>
          <button onClick={handleSaveEmployee} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium shadow-sm transition-all active:scale-95">
            {isEditing ? 'Update Employee' : 'Create Employee'}
          </button>
        </div>
      </div>
    </div>
  );
};
