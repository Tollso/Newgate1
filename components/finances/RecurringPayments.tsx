
import React, { useState } from 'react';
import { MOCK_RECURRING_PLANS } from '../../constants';
import { Plus, PauseCircle, PlayCircle, XCircle, X } from 'lucide-react';

interface RecurringPaymentsProps {
    plans?: any[];
    onAddPlan?: (plan: any) => void;
}

const RecurringPayments: React.FC<RecurringPaymentsProps> = ({ plans = MOCK_RECURRING_PLANS, onAddPlan }) => {
  const [showModal, setShowModal] = useState(false);
  const [newPlan, setNewPlan] = useState({ name: '', customerName: '', amount: '', frequency: 'Monthly' });

  const handleAdd = () => {
      if (!newPlan.name || !onAddPlan) return;
      onAddPlan({
          id: `PLAN-${Date.now()}`,
          name: newPlan.name,
          customerName: newPlan.customerName || 'Guest',
          frequency: newPlan.frequency,
          nextRun: new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString(),
          status: 'Active',
          amount: parseFloat(newPlan.amount) || 0
      });
      setShowModal(false);
      setNewPlan({ name: '', customerName: '', amount: '', frequency: 'Monthly' });
  };

  return (
    <div className="space-y-6 relative">
      {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
              <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 animate-scale-in">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-lg">New Recurring Plan</h3>
                      <button onClick={() => setShowModal(false)}><X size={20} className="text-slate-400" /></button>
                  </div>
                  <div className="space-y-4">
                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Plan Name</label>
                          <input type="text" value={newPlan.name} onChange={e => setNewPlan({...newPlan, name: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500" />
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Customer</label>
                          <input type="text" value={newPlan.customerName} onChange={e => setNewPlan({...newPlan, customerName: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500" />
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Amount ($)</label>
                          <input type="number" value={newPlan.amount} onChange={e => setNewPlan({...newPlan, amount: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500" />
                      </div>
                      <button onClick={handleAdd} className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 shadow-lg mt-4">Create Plan</button>
                  </div>
              </div>
          </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Recurring Payments</h1>
          <p className="text-slate-500">Manage subscriptions and retainers</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm transition-colors font-medium">
            <Plus size={18} /> New Plan
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Plan Name</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Customer</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Frequency</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Next Run</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Amount</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {plans.map(plan => (
              <tr key={plan.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 text-sm font-medium text-slate-900">{plan.name}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{plan.customerName}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{plan.frequency}</td>
                <td className="px-6 py-4 text-sm font-mono text-slate-500">{plan.nextRun}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium
                    ${plan.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 
                      plan.status === 'Paused' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}`}>
                    {plan.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-mono font-bold text-slate-900">
                  ${plan.amount.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 text-slate-400">
                        {plan.status === 'Active' ? (
                            <button className="hover:text-amber-600"><PauseCircle size={18} /></button>
                        ) : (
                            <button className="hover:text-emerald-600"><PlayCircle size={18} /></button>
                        )}
                        <button className="hover:text-red-600"><XCircle size={18} /></button>
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

export default RecurringPayments;
