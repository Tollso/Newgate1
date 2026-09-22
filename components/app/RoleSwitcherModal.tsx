import React from 'react';
import { Shield, Briefcase, Users, Coffee, Calendar, User, RefreshCw, X } from 'lucide-react';
import { UserRole } from '../../types';

interface RoleSwitcherModalProps {
  onClose: () => void;
  onSwitchRole: (roleName: string) => void;
}

export const RoleSwitcherModal: React.FC<RoleSwitcherModalProps> = ({
  onClose,
  onSwitchRole,
}) => {
  const rolesList = [
    { role: 'Admin', icon: <Shield size={20} />, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { role: 'Manager', icon: <Briefcase size={20} />, color: 'text-purple-600', bg: 'bg-purple-50' },
    { role: 'Server Lead', icon: <Users size={20} />, color: 'text-orange-600', bg: 'bg-orange-50' },
    { role: 'Server', icon: <Coffee size={20} />, color: 'text-blue-600', bg: 'bg-blue-50' },
    { role: 'Host', icon: <Calendar size={20} />, color: 'text-rose-600', bg: 'bg-rose-50' },
    { role: 'Employee', icon: <User size={20} />, color: 'text-slate-600', bg: 'bg-slate-100' },
    { role: UserRole.SUPER_ADMIN, label: 'Platform Owner', icon: <Shield size={20} />, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-scale-in">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-black text-xl text-slate-800 tracking-tight">Switch Role</h3>
          <button onClick={onClose} className="hover:bg-slate-200 rounded-full p-2 transition-colors">
            <X size={24} className="text-slate-400" />
          </button>
        </div>
        <div className="p-6 grid grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
          {rolesList.map((roleItem, idx) => (
            <button
              key={idx}
              onClick={() => onSwitchRole(roleItem.role)}
              className="flex flex-col items-center gap-3 p-4 rounded-2xl border-2 border-slate-100 hover:border-indigo-500 hover:bg-slate-50 transition-all group"
            >
              <div className={`p-4 rounded-xl ${roleItem.bg} ${roleItem.color} group-hover:scale-110 transition-transform`}>
                {roleItem.icon}
              </div>
              <span className="font-bold text-slate-700 text-sm group-hover:text-slate-900">
                {roleItem.label || roleItem.role}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
