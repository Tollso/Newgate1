import React, { useState } from 'react';
import { HelpCircle, Plus, Sparkles, CheckCircle2, FileText, Info } from 'lucide-react';
import { TipPoolingPoolCard } from './TipPoolingPoolCard';
import { TipPoolingReport } from './TipPoolingReport';

export const TipPoolingConfig: React.FC = () => {
  const [interval, setInterval] = useState<'Full workday' | 'Shift' | 'Order'>('Full workday');
  const [showHelp, setShowHelp] = useState(true);
  const [showReport, setShowReport] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const [pools, setPools] = useState<any[]>([
    {
      id: 'pool-online',
      name: 'Online Ordering Pool',
      type: 'online',
      calculationType: 'Points',
      divisionStyle: 'Proportional',
      contributors: [
        { job: 'Online Ordering', amount: 100, source: 'Non-cash tips' }
      ],
      recipients: [
        { job: 'Runner', amount: 30 },
        { job: 'Cook', amount: 30 },
        { job: 'Host', amount: 20 },
        { job: 'Busser', amount: 20 }
      ]
    },
    {
      id: 'pool-support',
      name: 'Support Staff',
      type: 'custom',
      calculationType: 'Percentage',
      divisionStyle: 'Proportional',
      contributors: [
        { job: 'Server', amount: 3, source: 'Food' },
        { job: 'Server', amount: 5, source: 'Liquor' },
        { job: 'Bartender', amount: 2, source: 'Food' }
      ],
      recipients: [
        { job: 'Busser', amount: 50 },
        { job: 'Runner', amount: 30 },
        { job: 'Host', amount: 20 }
      ]
    }
  ]);

  const handleUpdatePool = (idx: number, updated: any) => {
    const list = [...pools];
    list[idx] = updated;
    setPools(list);
  };

  const handleMoveUp = (idx: number) => {
    if (idx === 0) return;
    const list = [...pools];
    const temp = list[idx - 1];
    list[idx - 1] = list[idx];
    list[idx] = temp;
    setPools(list);
  };

  const handleMoveDown = (idx: number) => {
    if (idx === pools.length - 1) return;
    const list = [...pools];
    const temp = list[idx + 1];
    list[idx + 1] = list[idx];
    list[idx] = temp;
    setPools(list);
  };

  const handleRemovePool = (idx: number) => {
    setPools(pools.filter((_, i) => i !== idx));
  };

  const addOnlineOrderingPool = () => {
    setPools([
      ...pools,
      {
        id: `pool-online-${Date.now()}`,
        name: 'Online Ordering Pool',
        type: 'online',
        calculationType: 'Points',
        divisionStyle: 'Proportional',
        contributors: [{ job: 'Online Ordering', amount: 100, source: 'Non-cash tips' }],
        recipients: [{ job: 'Runner', amount: 50 }]
      }
    ]);
  };

  const addCustomPool = () => {
    setPools([
      ...pools,
      {
        id: `pool-custom-${Date.now()}`,
        name: 'Custom Tip Pool',
        type: 'custom',
        calculationType: 'Percentage',
        divisionStyle: 'Proportional',
        contributors: [{ job: 'Server', amount: 3, source: 'Food' }],
        recipients: [{ job: 'Busser', amount: 100 }]
      }
    ]);
  };

  const handleSavePolicy = () => {
    setSavedMessage("Tip pooling policy saved & activated successfully!");
    setTimeout(() => setSavedMessage(null), 3500);
  };

  return (
    <div className="space-y-6 max-w-4xl animate-fade-in pb-16">
      
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h3 className="font-extrabold text-slate-950 text-lg flex items-center gap-2">
            <Sparkles className="text-indigo-600" size={20} /> Tip Pooling Policy
          </h3>
          <p className="text-xs text-slate-500 mt-1 font-medium">Define logic for auto-contributions and payouts between servers and support roles</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2.5">
          <button 
            onClick={() => setShowReport(true)} 
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold uppercase rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
          >
            <FileText size={15} /> View pooling report
          </button>
          <button 
            onClick={handleSavePolicy}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase rounded-xl shadow-md shadow-indigo-100 hover:shadow-indigo-200 transition-all cursor-pointer"
          >
            Save Policy
          </button>
        </div>
      </div>

      {savedMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 text-sm font-bold animate-fade-in">
          <CheckCircle2 size={18} /> {savedMessage}
        </div>
      )}

      {/* Help Wizard */}
      {showHelp && (
        <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-5 relative animate-fade-in">
          <button 
            onClick={() => setShowHelp(false)}
            className="absolute top-4 right-4 text-indigo-400 hover:text-indigo-600 font-bold text-xs uppercase cursor-pointer"
          >
            Dismiss
          </button>
          <h4 className="font-extrabold text-indigo-950 text-sm flex items-center gap-2">
            <HelpCircle size={16} /> Need help with your tip policy?
          </h4>
          <p className="text-xs text-indigo-900/80 leading-relaxed mt-2 max-w-2xl">
            Tip pools distribute incoming staff gratuities proportionally or equally. First set the timing interval, then add contributing jobs (who gives tips, such as Servers giving 3% of Food Sales), and specify recipients (such as Bussers or Runners) who receive weighted shares.
          </p>
        </div>
      )}

      {/* Interval Setup */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">
          Tip pooling interval
        </label>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { id: 'Full workday', desc: 'Tips will be pooled between employees who work the same day' },
            { id: 'Shift', desc: 'Tips will be pooled between employees who work the same service' },
            { id: 'Order', desc: 'Tips will be pooled between employees clocked in when the order is opened' }
          ].map((opt) => (
            <label 
              key={opt.id}
              className={`p-4 rounded-xl border-2 cursor-pointer flex flex-col justify-between transition-all ${
                interval === opt.id 
                  ? 'border-indigo-600 bg-indigo-50/20 shadow-sm' 
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-900 text-sm">{opt.id}</span>
                <input 
                  type="radio" 
                  name="pooling-interval" 
                  checked={interval === opt.id}
                  onChange={() => setInterval(opt.id as any)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                />
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">{opt.desc}</p>
            </label>
          ))}
        </div>
      </div>

      {/* Pools List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">
            Tip pools list
          </label>
        </div>

        <div className="space-y-5">
          {pools.map((pool, idx) => (
            <TipPoolingPoolCard
              key={pool.id}
              pool={pool}
              index={idx}
              totalPools={pools.length}
              onChange={(updated) => handleUpdatePool(idx, updated)}
              onMoveUp={() => handleMoveUp(idx)}
              onMoveDown={() => handleMoveDown(idx)}
              onRemove={() => handleRemovePool(idx)}
            />
          ))}
        </div>

        {/* Add Pool Buttons */}
        <div className="flex flex-wrap gap-3 pt-2">
          <button
            onClick={addOnlineOrderingPool}
            className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <Plus size={14} /> Add online ordering pool
          </button>
          <button
            onClick={addCustomPool}
            className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <Plus size={14} /> Add pool
          </button>
        </div>
      </div>

      {/* Footer warning */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-slate-500 text-[11px] leading-relaxed flex items-center gap-2">
        <Info size={14} className="text-slate-400 shrink-0" />
        <span>Any tips not allocated by the policy are distributed in full to the employee who originally received them.</span>
      </div>

      {/* Report Modal */}
      {showReport && (
        <TipPoolingReport 
          onClose={() => setShowReport(false)} 
          interval={interval}
          pools={pools}
        />
      )}

    </div>
  );
};
