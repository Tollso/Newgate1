import React, { useState } from 'react';
import { Customer } from '../../../types';
import { X, Search, UserPlus } from 'lucide-react';
import { MOCK_CUSTOMERS } from '../../../constants';

interface CustomerModalProps {
  onClose: () => void;
  onSelect: (name: string) => void;
  onAdd?: (customer: Customer) => void;
}

export const CustomerModal: React.FC<CustomerModalProps> = ({ onClose, onSelect, onAdd }) => {
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'Search' | 'Add'>('Search');
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '', phone: '' });

  const handleCreate = () => {
    if (newCustomer.name && onAdd) {
      const c: Customer = {
        id: `C-${Date.now()}`,
        name: newCustomer.name,
        email: newCustomer.email,
        phone: newCustomer.phone,
        totalSpent: 0,
        segment: 'New',
        lastVisit: new Date().toLocaleDateString(),
        ordersCount: 0
      };
      onAdd(c);
      onSelect(c.name);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[600px] animate-scale-in">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
          <h3 className="font-bold text-lg">{view === 'Add' ? 'New Customer' : 'Select Customer'}</h3>
          <button onClick={onClose}>
            <X size={24} className="text-slate-400 hover:text-slate-600" />
          </button>
        </div>
        
        {view === 'Search' ? (
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-slate-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  autoFocus
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Search name, email or phone..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-slate-50/50">
              {MOCK_CUSTOMERS.filter(c => c.name.toLowerCase().includes(search.toLowerCase())).map(c => (
                <button 
                  key={c.id} 
                  onClick={() => { onSelect(c.name); onClose(); }} 
                  className="w-full text-left p-4 bg-white border border-slate-200 hover:border-indigo-500 hover:shadow-md rounded-2xl flex justify-between items-center group transition-all"
                >
                  <div>
                    <p className="font-bold text-slate-800">{c.name}</p>
                    <p className="text-xs text-slate-500 font-medium">{c.phone} • {c.email}</p>
                  </div>
                  <span className="text-[10px] font-black uppercase bg-indigo-50 text-indigo-600 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Select</span>
                </button>
              ))}
              {onAdd && (
                <button 
                  onClick={() => setView('Add')} 
                  className="w-full p-4 text-indigo-600 font-bold flex items-center gap-2 justify-center mt-4 border-2 border-dashed border-indigo-200 rounded-2xl hover:bg-indigo-50 transition-colors"
                >
                  <UserPlus size={18} /> Create New Customer
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="p-6 flex flex-col h-full">
            <div className="space-y-4 flex-1">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="John Doe"
                  value={newCustomer.name}
                  onChange={e => setNewCustomer({ ...newCustomer, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
                <input 
                  type="email" 
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="john@example.com"
                  value={newCustomer.email}
                  onChange={e => setNewCustomer({ ...newCustomer, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Phone</label>
                <input 
                  type="tel" 
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="(555) 123-4567"
                  value={newCustomer.phone}
                  onChange={e => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-3 pt-6 border-t border-slate-100">
              <button onClick={() => setView('Search')} className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-xl">Cancel</button>
              <button onClick={handleCreate} disabled={!newCustomer.name} className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg hover:bg-indigo-700 disabled:opacity-50">Save Customer</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
