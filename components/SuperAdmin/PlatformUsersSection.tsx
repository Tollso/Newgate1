import React, { useState } from 'react';
import { Users, UserPlus, Shield, Key, Mail, CheckCircle, XCircle, Search, X } from 'lucide-react';

interface PlatformAdmin {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Support Specialist' | 'Compliance Auditor' | 'Billing Operator';
  status: 'Active' | 'Suspended';
  mfaEnabled: boolean;
  lastLogin: string;
}

const INITIAL_ADMINS: PlatformAdmin[] = [
  { id: 'ADM-101', name: 'Alex Rivera', email: 'alex@bytepos.io', role: 'Super Admin', status: 'Active', mfaEnabled: true, lastLogin: '2026-08-03 13:10' },
  { id: 'ADM-102', name: 'Sarah Chen', email: 'sarah.c@bytepos.io', role: 'Compliance Auditor', status: 'Active', mfaEnabled: true, lastLogin: '2026-08-02 16:45' },
  { id: 'ADM-103', name: 'Marcus Vance', email: 'marcus.v@bytepos.io', role: 'Support Specialist', status: 'Active', mfaEnabled: true, lastLogin: '2026-08-03 11:20' },
  { id: 'ADM-104', name: 'Elena Rostova', email: 'elena@bytepos.io', role: 'Billing Operator', status: 'Suspended', mfaEnabled: false, lastLogin: '2026-07-28 09:15' }
];

export const PlatformUsersSection: React.FC = () => {
  const [admins, setAdmins] = useState<PlatformAdmin[]>(INITIAL_ADMINS);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New admin state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'Super Admin' | 'Support Specialist' | 'Compliance Auditor' | 'Billing Operator'>('Support Specialist');

  const filteredAdmins = admins.filter(a =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleStatus = (id: string) => {
    setAdmins(prev => prev.map(a => a.id === id ? { ...a, status: a.status === 'Active' ? 'Suspended' : 'Active' } : a));
  };

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const newAdmin: PlatformAdmin = {
      id: `ADM-${Math.floor(100 + Math.random() * 900)}`,
      name,
      email,
      role,
      status: 'Active',
      mfaEnabled: true,
      lastLogin: 'Never'
    };

    setAdmins(prev => [newAdmin, ...prev]);
    setName('');
    setEmail('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-black text-slate-800 tracking-tighter uppercase">Platform Operator Management</h3>
          <p className="text-slate-500 font-medium text-sm">Control administrative access and permission scopes for platform staff</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-2xl flex items-center gap-2 hover:bg-indigo-700 shadow-md font-bold text-xs uppercase tracking-wider transition-all"
        >
          <UserPlus size={16} /> Invite Platform Admin
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <div className="relative w-72">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search platform operators..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{filteredAdmins.length} Operators Registered</span>
        </div>

        <table className="w-full text-left text-xs whitespace-nowrap">
          <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-500 uppercase font-black tracking-wider">
            <tr>
              <th className="px-6 py-4">Operator Name</th>
              <th className="px-6 py-4">Role Scope</th>
              <th className="px-6 py-4">MFA Security</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Last Active</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {filteredAdmins.map(admin => (
              <tr key={admin.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-900 text-sm">{admin.name}</div>
                  <div className="text-slate-400 font-mono text-[11px]">{admin.email}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg text-[10px] font-black uppercase">
                    {admin.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {admin.mfaEnabled ? (
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <Shield size={14} /> 2FA Active
                    </span>
                  ) : (
                    <span className="text-rose-500 font-bold flex items-center gap-1">
                      <Key size={14} /> Unenforced
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase ${admin.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                    {admin.status}
                  </span>
                </td>
                <td className="px-6 py-4 font-mono text-slate-500">{admin.lastLogin}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => toggleStatus(admin.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${admin.status === 'Active' ? 'bg-rose-50 text-rose-600 hover:bg-rose-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}
                  >
                    {admin.status === 'Active' ? 'Suspend' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Invite Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-slate-100 animate-scale-in">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
              <h4 className="font-black text-slate-900 uppercase tracking-tight text-base">Invite Platform Admin</h4>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleAddAdmin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Jordan Miller"
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Work Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="jordan@bytepos.io"
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Role Scope</label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value as any)}
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                >
                  <option value="Super Admin">Super Admin</option>
                  <option value="Support Specialist">Support Specialist</option>
                  <option value="Compliance Auditor">Compliance Auditor</option>
                  <option value="Billing Operator">Billing Operator</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-xs font-bold text-slate-500">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm">Send Invite</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
