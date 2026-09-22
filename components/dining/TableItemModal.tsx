import React, { useState } from 'react';
import { DiningOrderItem } from '../../types';
import { X } from 'lucide-react';
import { ItemDiscountSelector } from './item_modal/ItemDiscountSelector';

interface TableItemModalProps {
  item: DiningOrderItem;
  onClose: () => void;
  onSave: (item: DiningOrderItem) => void;
  guests: { id: number }[];
}

export const TableItemModal: React.FC<TableItemModalProps> = ({
  item,
  onClose,
  onSave,
  guests
}) => {
  const [localItem, setLocalItem] = useState({ ...item });

  const modifiers = ['Extra Cheese', 'No Onions', 'Gluten Free', 'Spicy', 'Sauce on Side', 'Well Done', 'Medium Rare'];

  const toggleModifier = (mod: string) => {
    const mods = localItem.modifiers || [];
    setLocalItem({
      ...localItem,
      modifiers: mods.includes(mod) ? mods.filter(m => m !== mod) : [...mods, mod]
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50">
          <div>
            <h3 className="text-xl font-black text-slate-800">{localItem.name}</h3>
            <p className="text-sm text-slate-500 font-bold">${localItem.price.toFixed(2)}</p>
          </div>
          <button onClick={onClose}>
            <X size={24} className="text-slate-400" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Quantity</label>
              <div className="flex items-center gap-4 bg-slate-100 rounded-xl p-2 w-fit">
                <button 
                  onClick={() => setLocalItem({ ...localItem, quantity: Math.max(1, localItem.quantity - 1) })} 
                  className="w-8 h-8 bg-white rounded shadow-sm font-bold"
                >
                  -
                </button>
                <span className="font-bold text-xl">{localItem.quantity}</span>
                <button 
                  onClick={() => setLocalItem({ ...localItem, quantity: localItem.quantity + 1 })} 
                  className="w-8 h-8 bg-white rounded shadow-sm font-bold"
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Seat</label>
              <div className="flex gap-2 flex-wrap">
                {[0, ...guests.map(g => g.id)].map(s => (
                  <button 
                    key={s} 
                    onClick={() => setLocalItem({ ...localItem, seatNumber: s })}
                    className={`h-10 w-10 rounded-lg font-bold border-2 transition-all ${localItem.seatNumber === s ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-200 text-slate-400'}`}
                  >
                    {s === 0 ? 'S' : s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Modifiers</label>
            <div className="flex flex-wrap gap-2">
              {modifiers.map(mod => (
                <button
                  key={mod}
                  onClick={() => toggleModifier(mod)}
                  className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all ${localItem.modifiers?.includes(mod) ? 'bg-indigo-50 border-indigo-600 text-indigo-700' : 'bg-white border-slate-200 text-slate-600'}`}
                >
                  {mod}
                </button>
              ))}
            </div>
          </div>

          <ItemDiscountSelector localItem={localItem} setLocalItem={setLocalItem} />

          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Course</label>
            <div className="flex gap-2 mb-4">
              {['Appetizer', 'Entree', 'Dessert'].map(c => (
                <button 
                  key={c}
                  onClick={() => setLocalItem({ ...localItem, course: c as any })}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${localItem.course === c ? 'bg-indigo-50 border-indigo-600 text-indigo-700' : 'bg-white border-slate-200 text-slate-500'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {localItem.isVoided && (
            <div className="animate-slide-up bg-red-50/50 p-3 rounded-xl border border-red-100 mb-2">
              <label className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-1.5 block">Reason for Void</label>
              <select 
                value={localItem.voidReason || "Customer Changed Mind"} 
                onChange={(e) => setLocalItem({ ...localItem, voidReason: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-red-500"
              >
                {["Customer Changed Mind", "Sent in Error", "Kitchen Backed Up / Long Wait", "Item Unavailable / Out of Stock", "Ordered Double by Mistake", "Wrong Item Selected", "Spilled / Damaged before Serving"].map((r, idx) => (
                  <option key={idx} value={r}>{r}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-200 bg-slate-50 flex gap-3">
          <button 
            onClick={() => { 
              const nextVoid = !localItem.isVoided;
              setLocalItem({ ...localItem, isVoided: nextVoid, voidReason: nextVoid ? "Customer Changed Mind" : undefined }); 
            }} 
            className={`flex-1 py-3 font-bold rounded-xl border-2 transition-all ${localItem.isVoided ? 'bg-red-50 border-red-200 text-red-600' : 'bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200'}`}
          >
            {localItem.isVoided ? 'VOIDED ✓' : 'VOID ITEM'}
          </button>
          <button 
            onClick={() => { onSave(localItem); onClose(); }} 
            className="flex-[2] py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg"
          >
            SAVE
          </button>
        </div>
      </div>
    </div>
  );
};
