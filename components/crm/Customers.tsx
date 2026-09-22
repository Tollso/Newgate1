import React, { useState } from 'react';
import { Customer, CustomerSegment } from '../../types';
import { Search, Plus, Mail, Phone, MoreHorizontal, Download, Edit2, Trash2, Eye } from 'lucide-react';
import { CustomerModal } from './CustomerModal';

interface CustomersProps {
  customers: Customer[];
  onAddCustomer?: (customer: Customer) => void;
  onUpdateCustomer?: (customer: Customer) => void;
  onDeleteCustomer?: (id: string) => void;
}

const SegmentBadge = ({ segment }: { segment: CustomerSegment }) => {
  const colors: Record<string, string> = {
    'VIP': 'bg-purple-100 text-purple-700 border-purple-200',
    'Regular': 'bg-blue-100 text-blue-700 border-blue-200',
    'New': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'At Risk': 'bg-orange-100 text-orange-700 border-orange-200',
    'Subscriber': 'bg-indigo-100 text-indigo-700 border-indigo-200',
    'Abandoned': 'bg-red-100 text-red-700 border-red-200',
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${colors[segment] || 'bg-gray-100 text-gray-700'}`}>
      {segment}
    </span>
  );
};

const Customers: React.FC<CustomersProps> = ({ customers, onAddCustomer, onUpdateCustomer, onDeleteCustomer }) => {
  const [activeSegment, setActiveSegment] = useState<CustomerSegment | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const filteredCustomers = customers.filter(c => {
    const matchesSegment = activeSegment === 'All' || c.segment === activeSegment;
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSegment && matchesSearch;
  });

  const handleSaveCustomer = (name: string, email: string, phone: string) => {
    if (editingCustomer && onUpdateCustomer) {
      onUpdateCustomer({ ...editingCustomer, name, email, phone });
    } else if (onAddCustomer && name) {
      const customer: Customer = {
        id: `C-${Date.now()}`,
        name,
        email,
        phone,
        totalSpent: 0,
        segment: 'New',
        lastVisit: new Date().toLocaleDateString(),
        ordersCount: 0,
        businessId: 'B001'
      };
      onAddCustomer(customer);
    }
    setShowAddModal(false);
    setEditingCustomer(null);
  };

  return (
    <div className="space-y-6 relative">
      {showAddModal && (
        <CustomerModal
          editingCustomer={editingCustomer}
          onClose={() => { setShowAddModal(false); setEditingCustomer(null); }}
          onSave={handleSaveCustomer}
        />
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Customer Management</h1>
          <p className="text-slate-500">Track customer profiles, purchase history, and engagement</p>
        </div>
        <button onClick={() => { setEditingCustomer(null); setShowAddModal(true); }} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">
          <Plus size={18} /> Add Customer
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
            <tr>
              <th className="px-6 py-3 font-semibold">Customer</th>
              <th className="px-6 py-3 font-semibold">Segment</th>
              <th className="px-6 py-3 font-semibold">Orders</th>
              <th className="px-6 py-3 font-semibold">Total Spent</th>
              <th className="px-6 py-3 font-semibold">Last Visit</th>
              <th className="px-6 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredCustomers.map(customer => (
              <tr key={customer.id} className="hover:bg-slate-50 group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                      {customer.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{customer.name}</p>
                      <p className="text-xs text-slate-400">{customer.email || customer.phone}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <SegmentBadge segment={customer.segment} />
                </td>
                <td className="px-6 py-4 font-medium">{customer.ordersCount}</td>
                <td className="px-6 py-4 font-bold text-slate-900">${customer.totalSpent.toFixed(2)}</td>
                <td className="px-6 py-4 text-slate-500">{customer.lastVisit}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setEditingCustomer(customer); setShowAddModal(true); }} className="p-1.5 text-slate-500 hover:text-indigo-600 rounded">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => onDeleteCustomer && onDeleteCustomer(customer.id)} className="p-1.5 text-slate-500 hover:text-red-600 rounded">
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

export default Customers;
