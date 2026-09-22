import React, { useState } from 'react';
import { Customer } from '../../types';
import { X } from 'lucide-react';

interface CustomerModalProps {
  editingCustomer: Customer | null;
  onClose: () => void;
  onSave: (name: string, email: string, phone: string) => void;
}

export const CustomerModal: React.FC<CustomerModalProps> = ({ editingCustomer, onClose, onSave }) => {
  const [newCustomer, setNewCustomer] = useState({
    name: editingCustomer?.name || '',
    email: editingCustomer?.email || '',
    phone: editingCustomer?.phone || ''
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-lg text-slate-800">{editingCustomer ? 'Edit Customer' : 'Add New Customer'}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input 
              type="text" 
              value={newCustomer.name}
              onChange={e => setNewCustomer({ ...newCustomer, name: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Jane Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input 
              type="email" 
              value={newCustomer.email}
              onChange={e => setNewCustomer({ ...newCustomer, email: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="jane@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
            <input 
              type="tel" 
              value={newCustomer.phone}
              onChange={e => setNewCustomer({ ...newCustomer, phone: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="(555) 123-4567"
            />
          </div>
        </div>
        <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium">Cancel</button>
          <button onClick={() => onSave(newCustomer.name, newCustomer.email, newCustomer.phone)} disabled={!newCustomer.name} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium disabled:opacity-50">
            Save Customer
          </button>
        </div>
      </div>
    </div>
  );
};
