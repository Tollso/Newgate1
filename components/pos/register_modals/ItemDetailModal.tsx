import React, { useState } from 'react';
import { CartItem, DiscountCode } from '../../../types';
import { ChevronLeft, X, Tag, Percent, DollarSign, Trash2 } from 'lucide-react';
import { Numpad } from './Numpad';

interface ItemDetailModalProps {
  item: CartItem;
  discounts: DiscountCode[];
  onClose: () => void;
  onSave: (item: CartItem) => void;
  onVoid?: (item: CartItem) => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  item,
  discounts,
  onClose,
  onSave,
  onVoid
}) => {
  const [localItem, setLocalItem] = useState({ ...item });
  const [view, setView] = useState<'DETAILS' | 'DISCOUNT'>('DETAILS');
  const [customValue, setCustomValue] = useState('');
  const [customType, setCustomType] = useState<'Percentage' | 'Fixed'>('Percentage');

  const modifiers = ['Extra Cheese', 'No Onions', 'Gluten Free', 'Spicy', 'Sauce on Side', 'Well Done', 'Medium Rare', 'Add Bacon', 'Sub Salad'];

  const toggleModifier = (mod: string) => {
    const mods = localItem.modifiers || [];
    setLocalItem({
      ...localItem,
      modifiers: mods.includes(mod) ? mods.filter(m => m !== mod) : [...mods, mod]
    });
  };

  const applyCustomDiscount = () => {
    const val = parseFloat(customValue);
    if (!val || isNaN(val)) return;

    setLocalItem({
      ...localItem,
      discount: {
        name: 'Custom Disc.',
        type: customType,
        value: val
      }
    });
    setCustomValue('');
    setView('DETAILS');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scale-in">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/80 backdrop-blur">
          {view === 'DISCOUNT' ? (
            <div className="flex items-center gap-2">
              <button onClick={() => setView('DETAILS')} className="p-2 -ml-2 hover:bg-slate-200 rounded-full transition-colors">
                <ChevronLeft size={24} className="text-slate-600" />
              </button>
              <h3 className="text-xl font-black text-slate-800 tracking-tight">Apply Discount</h3>
            </div>
          ) : (
            <div>
              <h3 className="text-xl font-black text-slate-800 tracking-tight">{localItem.name}</h3>
              <p className="text-sm text-slate-500 font-mono font-bold">${localItem.price.toFixed(2)}</p>
            </div>
          )}
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          {view === 'DETAILS' && (
            <div className="space-y-8 animate-fade-in">
              {/* Qty & Seat */}
              <div className="flex gap-6">
                <div className="flex-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Quantity</label>
                  <div className="flex items-center gap-4 bg-slate-100 rounded-2xl p-1.5 w-fit border border-slate-200">
                    <button 
                      onClick={() => setLocalItem({ ...localItem, quantity: Math.max(1, localItem.quantity - 1) })} 
                      className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center font-bold text-slate-700 hover:bg-slate-50 text-xl"
                    >
                      -
                    </button>
                    <span className="font-black text-2xl w-10 text-center text-slate-800">{localItem.quantity}</span>
                    <button 
                      onClick={() => setLocalItem({ ...localItem, quantity: localItem.quantity + 1 })} 
                      className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center font-bold text-slate-700 hover:bg-slate-50 text-xl"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Seat Assignment</label>
                  <div className="flex gap-2 flex-wrap">
                    {[1, 2, 3, 4].map(s => (
                      <button 
                        key={s} 
                        onClick={() => setLocalItem({ ...localItem, seatId: localItem.seatId === s ? undefined : s })}
                        className={`h-12 w-12 rounded-xl font-bold border-2 transition-all flex items-center justify-center ${
                          localItem.seatId === s 
                            ? 'border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                            : 'border-slate-200 text-slate-400 hover:border-indigo-300'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Applied Discount Badge */}
              {localItem.discount && (
                <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                      <Tag size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-emerald-900 text-sm">{localItem.discount.name}</p>
                      <p className="text-xs text-emerald-600 font-medium">
                        {localItem.discount.type === 'Percentage' ? `${localItem.discount.value}% Off` : `$${localItem.discount.value.toFixed(2)} Off`}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => setLocalItem({ ...localItem, discount: undefined })} className="text-emerald-600 hover:text-emerald-800">
                    <X size={18} />
                  </button>
                </div>
              )}

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Modifiers</label>
                <div className="flex flex-wrap gap-2">
                  {modifiers.map(mod => (
                    <button
                      key={mod}
                      onClick={() => toggleModifier(mod)}
                      className={`px-4 py-3 rounded-xl text-xs font-bold border-2 transition-all ${
                        localItem.modifiers?.includes(mod) 
                          ? 'bg-indigo-50 border-indigo-600 text-indigo-700' 
                          : 'bg-white text-slate-600 border-slate-100 hover:border-slate-300'
                      }`}
                    >
                      {mod}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Special Request</label>
                <textarea 
                  value={localItem.specialRequest || ''} 
                  onChange={e => setLocalItem({ ...localItem, specialRequest: e.target.value })}
                  className="w-full border-2 border-slate-200 rounded-2xl p-4 text-sm font-medium focus:border-indigo-500 outline-none focus:ring-0 transition-colors"
                  placeholder="Allergies, preparation notes..."
                  rows={2}
                />
              </div>
            </div>
          )}

          {view === 'DISCOUNT' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Admin Presets</label>
                <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto">
                  {discounts.filter(d => d.applicability !== 'Order').map(d => (
                    <button 
                      key={d.id}
                      onClick={() => {
                        setLocalItem({ 
                          ...localItem, 
                          discount: { type: d.type, value: d.value, name: d.name || d.code || 'Discount' }
                        });
                        setView('DETAILS');
                      }}
                      className="p-4 rounded-xl border-2 bg-white border-slate-100 hover:border-indigo-500 hover:bg-indigo-50 text-left transition-all group"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <div className="font-bold text-slate-800 text-sm group-hover:text-indigo-700">{d.name}</div>
                        {d.type === 'Percentage' ? <Percent size={14} className="text-slate-400 group-hover:text-indigo-500"/> : <DollarSign size={14} className="text-slate-400 group-hover:text-indigo-500"/>}
                      </div>
                      <div className="text-xs font-medium text-slate-500">{d.type === 'Percentage' ? `${d.value}%` : `$${d.value}`} Off</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">Custom Discount</label>
                <div className="flex gap-4 mb-4">
                  <div className="relative flex-1">
                    <input 
                      type="text" 
                      readOnly 
                      value={customValue} 
                      className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-3 px-10 text-right font-mono font-black text-2xl text-slate-800 focus:border-indigo-500 outline-none"
                      placeholder="0"
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black">
                      {customType === 'Fixed' ? '$' : '%'}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => setCustomType('Percentage')} 
                      className={`px-4 py-2 rounded-xl font-bold text-xs transition-all border-2 ${
                        customType === 'Percentage' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-500 border-slate-200'
                      }`}
                    >
                      %
                    </button>
                    <button 
                      onClick={() => setCustomType('Fixed')} 
                      className={`px-4 py-2 rounded-xl font-bold text-xs transition-all border-2 ${
                        customType === 'Fixed' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-500 border-slate-200'
                      }`}
                    >
                      $
                    </button>
                  </div>
                </div>
                
                <div className="h-56">
                  <Numpad value={customValue} onChange={setCustomValue} onClear={() => setCustomValue('')} />
                </div>
                
                <button 
                  onClick={applyCustomDiscount}
                  disabled={!customValue}
                  className="w-full mt-4 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50 disabled:shadow-none"
                >
                  Apply Custom
                </button>
              </div>
            </div>
          )}
        </div>

        {view === 'DETAILS' && (
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex gap-3">
            <button 
              onClick={() => { 
                if (onVoid && !localItem.isVoided) {
                  onVoid(localItem);
                } else {
                  onSave({ ...localItem, isVoided: !localItem.isVoided }); 
                  onClose(); 
                }
              }}
              className={`px-4 py-3.5 font-bold rounded-xl border-2 transition-all ${
                localItem.isVoided ? 'bg-slate-200 text-slate-500 border-transparent' : 'border-red-100 text-red-600 bg-red-50 hover:bg-red-100'
              }`}
            >
              {localItem.isVoided ? 'Un-Void' : <Trash2 size={20} />}
            </button>
            <button 
              onClick={() => setView('DISCOUNT')}
              className="px-6 py-3.5 font-bold rounded-xl border-2 border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-all flex items-center gap-2"
            >
              <Tag size={18} /> Discount
            </button>
            <button 
              onClick={() => { onSave(localItem); onClose(); }}
              className="flex-1 py-3.5 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg hover:bg-indigo-700 active:scale-95 transition-all"
            >
              Update Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
