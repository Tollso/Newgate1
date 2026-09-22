import React, { useState } from 'react';
import { DiningOrderItem } from '../../../types';

interface ItemDiscountSelectorProps {
  localItem: DiningOrderItem;
  setLocalItem: React.Dispatch<React.SetStateAction<DiningOrderItem>>;
}

export const ItemDiscountSelector: React.FC<ItemDiscountSelectorProps> = ({
  localItem,
  setLocalItem
}) => {
  const [showCustomDiscount, setShowCustomDiscount] = useState(false);
  const [customValue, setCustomValue] = useState('');
  const [customType, setCustomType] = useState<'Percentage' | 'Fixed'>('Percentage');

  const discounts = [
    { name: 'None', type: 'Fixed' as const, value: 0 },
    { name: '10% OFF', type: 'Percentage' as const, value: 10 },
    { name: '20% OFF', type: 'Percentage' as const, value: 20 },
    { name: '50% OFF', type: 'Percentage' as const, value: 50 },
    { name: '$5 OFF', type: 'Fixed' as const, value: 5 },
  ];

  const applyCustomDiscount = () => {
    const val = parseFloat(customValue);
    if (isNaN(val)) return;
    setLocalItem({
      ...localItem,
      discount: {
        name: customType === 'Percentage' ? `${val}% Custom` : `$${val} Custom`,
        type: customType,
        value: val
      }
    });
    setShowCustomDiscount(false);
  };

  return (
    <div>
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Item Discount</label>
      <div className="flex flex-wrap gap-2">
        {discounts.map(d => (
          <button
            key={d.name}
            type="button"
            onClick={() => {
              setLocalItem({ ...localItem, discount: d.value === 0 ? undefined : d });
              setShowCustomDiscount(false);
            }}
            className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all ${
              (!showCustomDiscount && ((d.value === 0 && !localItem.discount) || (localItem.discount?.name === d.name)))
              ? 'bg-emerald-50 border-emerald-600 text-emerald-700' 
              : 'bg-white border-slate-200 text-slate-600'
            }`}
          >
            {d.name}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setShowCustomDiscount(true)}
          className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all ${
            showCustomDiscount ? 'bg-emerald-50 border-emerald-600 text-emerald-700' : 'bg-white border-slate-200 text-slate-600'
          }`}
        >
          Custom
        </button>
      </div>
      
      {showCustomDiscount && (
        <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 animate-slide-up">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input 
                type="number" 
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                placeholder="Enter value"
                className="w-full pl-8 pr-4 py-2 rounded-lg border border-slate-200 bg-white text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
                {customType === 'Percentage' ? '%' : '$'}
              </div>
            </div>
            <div className="flex bg-white rounded-lg border border-slate-200 overflow-hidden">
              <button 
                type="button"
                onClick={() => setCustomType('Percentage')} 
                className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest ${customType === 'Percentage' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-50'}`}
              >
                %
              </button>
              <button 
                type="button"
                onClick={() => setCustomType('Fixed')} 
                className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest ${customType === 'Fixed' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-50'}`}
              >
                $
              </button>
            </div>
            <button 
              type="button"
              onClick={applyCustomDiscount}
              disabled={!customValue}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold shadow-sm hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              APPLY
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
