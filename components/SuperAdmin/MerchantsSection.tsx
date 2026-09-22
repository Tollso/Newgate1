import React, { useState } from 'react';
import { Plus, CheckCircle, ExternalLink } from 'lucide-react';
import { Business, Employee } from '../../types';
import { NewProvisionModal } from './NewProvisionModal';

interface MerchantsSectionProps {
  businesses?: Business[];
  onAddBusiness?: (business: Business, owner: Partial<Employee>) => void;
  onSwitchMerchant?: (business: Business) => void;
}

const MerchantsSection: React.FC<MerchantsSectionProps> = ({ businesses = [], onAddBusiness, onSwitchMerchant }) => {
  const [selectedMerchant, setSelectedMerchant] = useState<Business | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newBizName, setNewBizName] = useState('');
  const [newBizPlan, setNewBizPlan] = useState<'Starter' | 'Growth' | 'Enterprise'>('Growth');
  const [newBizMode, setNewBizMode] = useState<'RESTAURANT' | 'RETAIL' | 'NONPROFIT'>('RESTAURANT');
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPasscode, setOwnerPasscode] = useState('');

  const handleCreate = () => {
    if (!newBizName || !ownerName || !ownerEmail || !ownerPasscode) return;
    
    const newBusiness: Business = {
      id: '',
      name: newBizName,
      ownerName: ownerName,
      plan: newBizPlan,
      status: 'Active',
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      revenueYTD: 0,
      merchantMode: newBizMode,
      varConfig: {
        provider: 'None',
        merchantId: 'PENDING',
        status: 'Not Configured'
      }
    };

    const newOwner: Partial<Employee> = {
      name: ownerName,
      email: ownerEmail,
      passcode: ownerPasscode
    };

    if (onAddBusiness) {
      onAddBusiness(newBusiness, newOwner);
    }

    setNewBizName('');
    setNewBizMode('RESTAURANT');
    setOwnerName('');
    setOwnerEmail('');
    setOwnerPasscode('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      <NewProvisionModal
        showAddModal={showAddModal}
        setShowAddModal={setShowAddModal}
        newBizName={newBizName}
        setNewBizName={setNewBizName}
        newBizPlan={newBizPlan}
        setNewBizPlan={setNewBizPlan}
        newBizMode={newBizMode}
        setNewBizMode={setNewBizMode}
        ownerName={ownerName}
        setOwnerName={setOwnerName}
        ownerEmail={ownerEmail}
        setOwnerEmail={setOwnerEmail}
        ownerPasscode={ownerPasscode}
        setOwnerPasscode={setOwnerPasscode}
        handleCreate={handleCreate}
      />

      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-black text-slate-800 tracking-tighter uppercase">Merchant Ecosystem</h3>
          <p className="text-slate-500 font-medium">Provision and supervise gateway connectivity</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-2xl flex items-center gap-3 hover:bg-indigo-700 shadow-xl font-black text-xs uppercase tracking-widest transition-all active:scale-95"
        >
          <Plus size={18} /> NEW PROVISION
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase border-b border-slate-100">
            <tr>
              <th className="px-8 py-6">Merchant Identity</th>
              <th className="px-8 py-6">Owner</th>
              <th className="px-8 py-6">Subscription</th>
              <th className="px-8 py-6">Gateway Status</th>
              <th className="px-8 py-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {businesses.map(biz => (
              <tr key={biz.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg">
                      {biz.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-base">{biz.name}</p>
                      <p className="text-xs text-slate-400 font-mono">ID: {biz.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <p className="font-bold text-slate-700 text-sm">{biz.ownerName}</p>
                </td>
                <td className="px-8 py-6">
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg text-xs font-bold uppercase">
                    {biz.plan}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-emerald-500" />
                    <span className="text-xs font-bold text-slate-700">{biz.varConfig?.status || 'Active'}</span>
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  {onSwitchMerchant && (
                    <button
                      onClick={() => onSwitchMerchant(biz)}
                      className="px-4 py-2 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl font-bold text-xs flex items-center gap-2 ml-auto transition-colors"
                    >
                      Impersonate <ExternalLink size={14} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MerchantsSection;
