import React, { useState } from 'react';
import { Tag, Percent, DollarSign, X, Check, ShieldCheck } from 'lucide-react';

export interface DiscountOption {
  name: string;
  type: 'Percentage' | 'Fixed';
  value: number;
}

export const ADMIN_DISCOUNT_RATES: DiscountOption[] = [
  { name: '10% Off', type: 'Percentage', value: 10 },
  { name: '15% Promo', type: 'Percentage', value: 15 },
  { name: '20% Staff Rate', type: 'Percentage', value: 20 },
  { name: '25% Family & Friends', type: 'Percentage', value: 25 },
  { name: '50% VIP Discount', type: 'Percentage', value: 50 },
  { name: '100% Comp / House', type: 'Percentage', value: 100 },
  { name: '$5.00 Voucher', type: 'Fixed', value: 5 },
  { name: '$10.00 Credit', type: 'Fixed', value: 10 }
];

interface AdminDiscountModalProps {
  title: string;
  subtitle?: string;
  onApplyDiscount: (discount: DiscountOption | null) => void;
  onClose: () => void;
}

export const AdminDiscountModal: React.FC<AdminDiscountModalProps> = ({
  title,
  subtitle,
  onApplyDiscount,
  onClose
}) => {
  const [selectedDiscount, setSelectedDiscount] = useState<DiscountOption | null>(ADMIN_DISCOUNT_RATES[0]);
  const [isCustom, setIsCustom] = useState(false);
  const [customType, setCustomType] = useState<'Percentage' | 'Fixed'>('Percentage');
  const [customVal, setCustomVal] = useState<string>('15');
  const [customName, setCustomName] = useState<string>('Custom Discount');

  const handleApply = () => {
    if (isCustom) {
      const valNum = parseFloat(customVal) || 0;
      if (valNum <= 0) return;
      onApplyDiscount({
        name: customName || 'Custom Discount',
        type: customType,
        value: valNum
      });
    } else {
      onApplyDiscount(selectedDiscount);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in p-4 text-slate-800">
      <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-scale-in flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-emerald-400" size={18} />
              <h3 className="font-black text-lg">{title}</h3>
            </div>
            {subtitle && <p className="text-xs text-slate-400 font-medium mt-0.5">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto max-h-[70vh] space-y-4">
          <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
            <button
              onClick={() => setIsCustom(false)}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${!isCustom ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Admin Presets
            </button>
            <button
              onClick={() => setIsCustom(true)}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${isCustom ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Custom Rate
            </button>
          </div>

          {!isCustom ? (
            <div className="grid grid-cols-2 gap-2.5">
              {ADMIN_DISCOUNT_RATES.map((rate, idx) => {
                const isSelected = selectedDiscount?.name === rate.name && !isCustom;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedDiscount(rate)}
                    className={`p-3.5 border-2 rounded-2xl flex flex-col items-start gap-1 transition-all text-left ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/60 shadow-md ring-2 ring-emerald-500/20'
                        : 'border-slate-100 hover:border-slate-200 bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-black text-slate-900">{rate.name}</span>
                      {isSelected && <Check size={16} className="text-emerald-600 shrink-0" />}
                    </div>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-100/80 px-2 py-0.5 rounded-md font-mono">
                      {rate.type === 'Percentage' ? `${rate.value}% OFF` : `$${rate.value.toFixed(2)} OFF`}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-3.5 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Discount Label</label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. VIP Promo"
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCustomType('Percentage')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    customType === 'Percentage' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200'
                  }`}
                >
                  <Percent size={14} /> Percentage (%)
                </button>
                <button
                  type="button"
                  onClick={() => setCustomType('Fixed')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    customType === 'Fixed' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200'
                  }`}
                >
                  <DollarSign size={14} /> Dollar Amount ($)
                </button>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Discount Value {customType === 'Percentage' ? '(%)' : '($)'}
                </label>
                <input
                  type="number"
                  min="0"
                  max={customType === 'Percentage' ? 100 : 1000}
                  value={customVal}
                  onChange={(e) => setCustomVal(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-lg font-mono font-black text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          <button
            onClick={() => {
              onApplyDiscount(null);
              onClose();
            }}
            className="w-full py-2 text-xs font-bold text-slate-400 hover:text-red-500 transition-colors text-center block"
          >
            Remove / Clear Discount
          </button>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-2">
          <button onClick={onClose} className="flex-1 py-3 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-sm transition-colors">
            Cancel
          </button>
          <button onClick={handleApply} className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-emerald-200 transition-all active:scale-95 flex items-center justify-center gap-2">
            <Tag size={16} /> Apply Discount
          </button>
        </div>
      </div>
    </div>
  );
};
