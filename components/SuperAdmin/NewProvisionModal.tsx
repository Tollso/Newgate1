import React from 'react';
import { X, Briefcase, User, Mail, Key } from 'lucide-react';
import { Business, Employee } from '../../types';

interface NewProvisionModalProps {
  showAddModal: boolean;
  setShowAddModal: (show: boolean) => void;
  newBizName: string;
  setNewBizName: (val: string) => void;
  newBizPlan: 'Starter' | 'Growth' | 'Enterprise';
  setNewBizPlan: (val: 'Starter' | 'Growth' | 'Enterprise') => void;
  newBizMode: 'RESTAURANT' | 'RETAIL' | 'NONPROFIT';
  setNewBizMode: (val: 'RESTAURANT' | 'RETAIL' | 'NONPROFIT') => void;
  ownerName: string;
  setOwnerName: (val: string) => void;
  ownerEmail: string;
  setOwnerEmail: (val: string) => void;
  ownerPasscode: string;
  setOwnerPasscode: (val: string) => void;
  handleCreate: () => void;
}

export const NewProvisionModal: React.FC<NewProvisionModalProps> = ({
  showAddModal,
  setShowAddModal,
  newBizName,
  setNewBizName,
  newBizPlan,
  setNewBizPlan,
  newBizMode,
  setNewBizMode,
  ownerName,
  setOwnerName,
  ownerEmail,
  setOwnerEmail,
  ownerPasscode,
  setOwnerPasscode,
  handleCreate
}) => {
  if (!showAddModal) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-in">
        <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <h3 className="font-black text-slate-800 text-lg uppercase tracking-tight">New Provisioning</h3>
          <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600"><X size={24}/></button>
        </div>
        <div className="p-8 space-y-6">
          <div>
            <h4 className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Briefcase size={14} /> Organization Details
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Business Name</label>
                <input 
                  type="text" 
                  value={newBizName}
                  onChange={e => setNewBizName(e.target.value)}
                  placeholder="e.g. Downtown Bistro"
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Merchant Operating Mode</label>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { id: 'RESTAURANT', label: 'Restaurant' },
                    { id: 'RETAIL', label: 'Retail Store' },
                    { id: 'NONPROFIT', label: 'Nonprofit' }
                  ] as const).map(mode => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setNewBizMode(mode.id)}
                      className={`py-2 rounded-lg text-xs font-black uppercase tracking-wide border-2 transition-all ${newBizMode === mode.id ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Subscription Plan</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Starter', 'Growth', 'Enterprise'] as const).map(plan => (
                    <button
                      key={plan}
                      onClick={() => setNewBizPlan(plan)}
                      className={`py-2 rounded-lg text-xs font-black uppercase tracking-wide border-2 transition-all ${newBizPlan === plan ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                    >
                      {plan}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          <div>
            <h4 className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-4 flex items-center gap-2">
              <User size={14} /> Primary Admin (Owner)
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Owner Name</label>
                <input 
                  type="text" 
                  value={ownerName}
                  onChange={e => setOwnerName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="email" 
                      value={ownerEmail}
                      onChange={e => setOwnerEmail(e.target.value)}
                      className="w-full border border-slate-300 rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-sm"
                      placeholder="admin@biz.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Passcode</label>
                  <div className="relative">
                    <Key size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text" 
                      value={ownerPasscode}
                      onChange={e => setOwnerPasscode(e.target.value)}
                      maxLength={6}
                      className="w-full border border-slate-300 rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm tracking-widest"
                      placeholder="1234"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
          <button onClick={() => setShowAddModal(false)} className="px-6 py-3 font-bold text-slate-500 hover:text-slate-700">Cancel</button>
          <button 
            onClick={handleCreate}
            disabled={!newBizName || !ownerName || !ownerEmail || !ownerPasscode}
            className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg hover:bg-indigo-700 disabled:opacity-50 transition-all active:scale-95"
          >
            Provision Tenant
          </button>
        </div>
      </div>
    </div>
  );
};
