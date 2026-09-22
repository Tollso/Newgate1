
import React, { useState } from 'react';
import { MOCK_SUBSCRIPTION_PLANS } from '../../constants';
import { CheckCircle, Settings } from 'lucide-react';
import { EditPlanModal } from './EditPlanModal';

const SubscriptionsSection: React.FC = () => {
  const [plans, setPlans] = useState(MOCK_SUBSCRIPTION_PLANS);
  const [editingPlan, setEditingPlan] = useState<any | null>(null);

  const handleSavePlan = (updated: any) => {
    setPlans(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <EditPlanModal
        plan={editingPlan}
        onClose={() => setEditingPlan(null)}
        onSave={handleSavePlan}
      />

      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-black text-slate-800 tracking-tighter uppercase">Subscriptions & Plans</h3>
          <p className="text-slate-500 font-medium">Control pricing tiers and merchant access</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map(plan => (
          <div key={plan.id} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="flex justify-between items-start mb-6">
              <h4 className="text-xl font-black text-slate-900 tracking-tight">{plan.name}</h4>
              {plan.name === 'Enterprise' && <span className="bg-indigo-600 text-white text-[10px] px-2 py-1 rounded-lg font-black uppercase tracking-widest">Premium</span>}
            </div>
            <div className="mb-8">
              <span className="text-5xl font-black text-slate-900 tracking-tighter">${plan.price}</span>
              <span className="text-slate-400 font-bold ml-1 uppercase text-sm">/{plan.billingCycle === 'Monthly' ? 'mo' : 'yr'}</span>
            </div>
            <div className="flex-1 space-y-4 mb-8">
              {plan.features.map((feat: string, idx: number) => (
                <li key={idx} className="flex items-center gap-3 text-sm font-bold text-slate-500 list-none">
                  <CheckCircle size={18} className="text-emerald-500 shrink-0" /> {feat}
                </li>
              ))}
            </div>
            <button
              onClick={() => setEditingPlan(plan)}
              className="w-full py-3 bg-slate-50 text-slate-900 rounded-2xl font-black text-sm border border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all flex items-center justify-center gap-2"
            >
              <Settings size={16} /> EDIT CONFIG
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionsSection;
