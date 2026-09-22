import React, { useState } from 'react';
import { ArrowUp, ArrowDown, Trash2, HelpCircle, ChevronDown, ChevronUp, Plus, ShieldCheck } from 'lucide-react';

interface PoolCardProps {
  pool: any;
  index: number;
  totalPools: number;
  onChange: (updated: any) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
}

export const TipPoolingPoolCard: React.FC<PoolCardProps> = ({
  pool,
  index,
  totalPools,
  onChange,
  onMoveUp,
  onMoveDown,
  onRemove
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const availableJobs = ['Server', 'Bartender', 'Runner', 'Cook', 'Host', 'Busser', 'Online Ordering'];
  const contributionCategories = ['Food', 'Liquor', 'Bottled Beer', 'Draft Beer', 'Cash tips', 'Non-cash tips'];

  const updateContributor = (idx: number, key: string, value: any) => {
    const contributors = [...pool.contributors];
    contributors[idx] = { ...contributors[idx], [key]: value };
    onChange({ ...pool, contributors });
  };

  const addContributor = () => {
    const contributors = [...pool.contributors, { job: 'Server', amount: 5, source: 'Food' }];
    onChange({ ...pool, contributors });
  };

  const removeContributor = (idx: number) => {
    const contributors = pool.contributors.filter((_: any, i: number) => i !== idx);
    onChange({ ...pool, contributors });
  };

  const updateRecipient = (idx: number, key: string, value: any) => {
    const recipients = [...pool.recipients];
    recipients[idx] = { ...recipients[idx], [key]: value };
    onChange({ ...pool, recipients });
  };

  const addRecipient = () => {
    const recipients = [...pool.recipients, { job: 'Runner', amount: 1 }];
    onChange({ ...pool, recipients });
  };

  const removeRecipient = (idx: number) => {
    const recipients = pool.recipients.filter((_: any, i: number) => i !== idx);
    onChange({ ...pool, recipients });
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl shadow-sm overflow-hidden p-6 space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Pool #{index + 1}</span>
          <h4 className="font-extrabold text-slate-900 text-base">{pool.name}</h4>
        </div>
        
        <div className="flex items-center gap-1.5">
          <button 
            disabled={index === 0} 
            onClick={onMoveUp}
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 disabled:opacity-40 transition-colors cursor-pointer"
          >
            <ArrowUp size={16} />
          </button>
          <button 
            disabled={index === totalPools - 1} 
            onClick={onMoveDown}
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 disabled:opacity-40 transition-colors cursor-pointer"
          >
            <ArrowDown size={16} />
          </button>
          <button 
            onClick={onRemove}
            className="p-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Contributors Section */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">
          Which jobs contribute tips to the pool?
        </label>
        
        <div className="space-y-2">
          {pool.contributors.map((contrib: any, idx: number) => (
            <div key={idx} className="flex flex-wrap items-center gap-2 bg-white p-3 rounded-xl border border-slate-200">
              <select
                value={contrib.job}
                onChange={e => updateContributor(idx, 'job', e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 outline-none"
              >
                {availableJobs.map(j => <option key={j} value={j}>{j}</option>)}
              </select>

              <span className="text-xs text-slate-400 font-bold">contributes</span>
              
              <div className="relative w-20">
                <input
                  type="number"
                  value={contrib.amount}
                  onChange={e => updateContributor(idx, 'amount', parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-mono font-bold text-slate-800 text-center outline-none"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">%</span>
              </div>

              <span className="text-xs text-slate-400 font-bold">of</span>

              <select
                value={contrib.source || 'Food'}
                onChange={e => updateContributor(idx, 'source', e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 outline-none"
              >
                {contributionCategories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              {pool.contributors.length > 1 && (
                <button 
                  onClick={() => removeContributor(idx)}
                  className="text-slate-400 hover:text-rose-600 transition-colors ml-auto cursor-pointer"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
        </div>

        <button 
          onClick={addContributor}
          className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer pt-1"
        >
          <Plus size={14} /> Add contributing job
        </button>
      </div>

      {/* Recipients Section */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">
          Which jobs receive tips from the pool?
        </label>
        
        <div className="space-y-2">
          {pool.recipients.map((recip: any, idx: number) => (
            <div key={idx} className="flex flex-wrap items-center gap-2 bg-white p-3 rounded-xl border border-slate-200">
              <select
                value={recip.job}
                onChange={e => updateRecipient(idx, 'job', e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 outline-none"
              >
                {availableJobs.filter(j => j !== 'Online Ordering').map(j => <option key={j} value={j}>{j}</option>)}
              </select>

              <span className="text-xs text-slate-400 font-bold">receives</span>

              <div className="relative w-20">
                <input
                  type="number"
                  value={recip.amount}
                  onChange={e => updateRecipient(idx, 'amount', parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-mono font-bold text-slate-800 text-center outline-none"
                />
              </div>

              <span className="text-xs text-slate-400 font-medium">
                {pool.calculationType === 'Percentage' ? '% share of tips from the pool.' : 'points worth of tips from the pool.'}
              </span>

              {pool.recipients.length > 1 && (
                <button 
                  onClick={() => removeRecipient(idx)}
                  className="text-slate-400 hover:text-rose-600 transition-colors ml-auto cursor-pointer"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
        </div>

        <button 
          onClick={addRecipient}
          className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer pt-1"
        >
          <Plus size={14} /> Add recipient job
        </button>
      </div>

      {/* Advanced Options collapsible */}
      <div className="border-t border-slate-200 pt-4">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center justify-between w-full text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
        >
          <span>Advanced options</span>
          {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 p-4 bg-white rounded-xl border border-slate-200 text-xs animate-fade-in">
            <div className="space-y-2">
              <span className="font-bold text-slate-800 block">How are tip shares calculated?</span>
              <div className="space-y-1.5">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="radio"
                    name={`calc-${index}`}
                    checked={pool.calculationType === 'Points'}
                    onChange={() => onChange({ ...pool, calculationType: 'Points' })}
                    className="mt-0.5"
                  />
                  <div>
                    <span className="font-bold text-slate-700 block">Points</span>
                    <span className="text-slate-400 text-[11px]">Employees with different jobs will receive tips proportional to each other</span>
                  </div>
                </label>
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="radio"
                    name={`calc-${index}`}
                    checked={pool.calculationType === 'Percentage'}
                    onChange={() => onChange({ ...pool, calculationType: 'Percentage' })}
                    className="mt-0.5"
                  />
                  <div>
                    <span className="font-bold text-slate-700 block">Percentage</span>
                    <span className="text-slate-400 text-[11px]">Receiving jobs will get a fixed percentage of the tips regardless of how many employees worked</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-slate-800 block">How are tips divided among pool recipients?</span>
              <div className="space-y-1.5">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="radio"
                    name={`divide-${index}`}
                    checked={pool.divisionStyle === 'Proportional'}
                    onChange={() => onChange({ ...pool, divisionStyle: 'Proportional' })}
                    className="mt-0.5"
                  />
                  <div>
                    <span className="font-bold text-slate-700 block">Proportionally by hours worked</span>
                    <span className="text-slate-400 text-[11px]">Employees who work more hours will receive a greater share of the pooled tips</span>
                  </div>
                </label>
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="radio"
                    name={`divide-${index}`}
                    checked={pool.divisionStyle === 'Equal'}
                    onChange={() => onChange({ ...pool, divisionStyle: 'Equal' })}
                    className="mt-0.5"
                  />
                  <div>
                    <span className="font-bold text-slate-700 block">Equally regardless of hours worked</span>
                    <span className="text-slate-400 text-[11px]">Employees with the same job will receive the same share of the tips regardless of how long they worked</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="text-[11px] text-slate-400 font-medium">
        Any contributions not captured in this pool will remain with the contributing job.
      </div>

    </div>
  );
};
