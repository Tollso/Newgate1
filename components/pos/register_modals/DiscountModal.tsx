import React, { useState } from 'react';
import { DiscountCode } from '../../../types';
import { X, Percent, DollarSign } from 'lucide-react';
import { Numpad } from './Numpad';

interface DiscountModalProps {
  discounts: DiscountCode[];
  onClose: () => void;
  onApply: (d: DiscountCode) => void;
}

export const DiscountModal: React.FC<DiscountModalProps> = ({ discounts, onClose, onApply }) => {
  const [mode, setMode] = useState<'Presets' | 'Custom'>('Presets');
  const [customValue, setCustomValue] = useState('');
  const [customType, setCustomType] = useState<'Percentage' | 'Fixed'>('Percentage');

  const handleCustomApply = () => {
    const val = parseFloat(customValue);
    if (!val || isNaN(val)) return;
    
    onApply({
      id: `temp-${Date.now()}`,
      name: 'Order Discount',
      code: 'CUSTOM',
      type: customType,
      value: val,
      status: 'Active',
      applicability: 'Order'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-scale-in flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-xl font-black text-slate-800 tracking-tight">Apply Order Discount</h3>
          <button onClick={onClose}><X size={24} className="text-slate-400 hover:text-slate-600" /></button>
        </div>
        
        {/* Tabs */}
        <div className="flex p-2 bg-slate-50 mx-6 mt-4 rounded-xl border border-slate-200">
          <button 
            onClick={() => setMode('Presets')}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'Presets' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
          >
            Presets
          </button>
          <button 
            onClick={() => setMode('Custom')}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'Custom' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
          >
            Custom
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          {mode === 'Presets' ? (
            <div className="grid grid-cols-2 gap-4">
              {discounts.filter(d => d.applicability === 'Order').map(d => (
                <button 
                  key={d.id} 
                  onClick={() => { onApply(d); onClose(); }}
                  className="p-6 border-2 border-slate-100 rounded-2xl hover:border-indigo-500 hover:bg-indigo-50 group text-left transition-all"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg group-hover:bg-indigo-200 transition-colors">
                      {d.type === 'Percentage' ? <Percent size={20} /> : <DollarSign size={20} />}
                    </div>
                    <span className="text-[10px] font-black uppercase text-slate-400 bg-white px-2 py-1 rounded border border-slate-200">{d.code}</span>
                  </div>
                  <h4 className="font-bold text-slate-800 text-lg">{d.name}</h4>
                  <p className="text-xs text-slate-500 font-medium">{d.type === 'Percentage' ? `${d.value}% Off` : `$${d.value.toFixed(2)} Off`} Order</p>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <input 
                    type="text" 
                    readOnly
                    value={customValue}
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-4 px-10 text-right font-mono font-black text-3xl text-slate-800 focus:border-indigo-500 outline-none"
                    placeholder="0.00"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black">
                    {customType === 'Fixed' ? '$' : '%'}
                  </span>
                </div>
                <div className="flex flex-col gap-2 w-24">
                  <button 
                    onClick={() => setCustomType('Percentage')} 
                    className={`flex-1 rounded-xl font-black text-xs border-2 transition-all ${customType === 'Percentage' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-400 border-slate-200'}`}
                  >
                    PERCENT %
                  </button>
                  <button 
                    onClick={() => setCustomType('Fixed')} 
                    className={`flex-1 rounded-xl font-black text-xs border-2 transition-all ${customType === 'Fixed' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-400 border-slate-200'}`}
                  >
                    AMOUNT $
                  </button>
                </div>
              </div>
              
              <div className="h-64">
                <Numpad value={customValue} onChange={setCustomValue} onClear={() => setCustomValue('')} />
              </div>

              <button 
                onClick={handleCustomApply}
                disabled={!customValue}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50 disabled:shadow-none"
              >
                Apply Discount
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
