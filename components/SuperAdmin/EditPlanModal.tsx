import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

interface PlanConfig {
  id: string;
  name: string;
  price: number;
  billingCycle: 'Monthly' | 'Annual';
  features: string[];
}

interface EditPlanModalProps {
  plan: PlanConfig | null;
  onClose: () => void;
  onSave: (updatedPlan: PlanConfig) => void;
}

export const EditPlanModal: React.FC<EditPlanModalProps> = ({ plan, onClose, onSave }) => {
  if (!plan) return null;

  const [price, setPrice] = useState<number>(plan.price);
  const [billingCycle, setBillingCycle] = useState<'Monthly' | 'Annual'>(plan.billingCycle);
  const [featureText, setFeatureText] = useState<string>(plan.features.join('\n'));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedFeatures = featureText.split('\n').map(f => f.trim()).filter(Boolean);
    onSave({
      ...plan,
      price: Number(price),
      billingCycle,
      features: updatedFeatures
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 border border-slate-100 animate-scale-in">
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">Tier Configuration</span>
            <h4 className="font-black text-slate-900 text-lg uppercase tracking-tight mt-1">Edit {plan.name} Tier</h4>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Tier Price ($)</label>
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={e => setPrice(parseFloat(e.target.value) || 0)}
              className="w-full border border-slate-300 rounded-xl p-2.5 text-base font-bold font-mono outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Billing Interval</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setBillingCycle('Monthly')}
                className={`py-2 rounded-xl text-xs font-bold uppercase ${billingCycle === 'Monthly' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('Annual')}
                className={`py-2 rounded-xl text-xs font-bold uppercase ${billingCycle === 'Annual' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}
              >
                Annual
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Included Tier Features (One per line)</label>
            <textarea
              rows={4}
              value={featureText}
              onChange={e => setFeatureText(e.target.value)}
              className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-medium outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
            />
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-bold text-slate-500">Cancel</button>
            <button type="submit" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5">
              <Check size={16} /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
