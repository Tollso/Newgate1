const fs = require('fs');
let content = fs.readFileSync('components/dining/OrderItemRow.tsx', 'utf-8');

const replacement = `
import React, { useState } from 'react';
import { DiningOrderItem } from '../../types';
import { CheckCircle, Tag, Flame, AlertCircle, Trash2, Edit3, MoveRight, Percent } from 'lucide-react';

interface OrderItemRowProps {
  item: DiningOrderItem;
  onClick?: () => void;
  isSelected?: boolean;
  isSelectionMode?: boolean;
  onQuantityChange?: (cartId: string, qty: number) => void;
  onEdit?: () => void;
  onVoid?: () => void;
  onMove?: () => void;
  onDiscount?: () => void;
}

export const OrderItemRow: React.FC<OrderItemRowProps> = ({
  item,
  onClick,
  isSelected,
  isSelectionMode,
  onQuantityChange,
  onEdit,
  onVoid,
  onMove,
  onDiscount
}) => {
  const [showActions, setShowActions] = useState(false);

  const discountedPrice = item.discount 
    ? (item.discount.type === 'Percentage' 
        ? item.price * (1 - item.discount.value / 100) 
        : Math.max(0, item.price - (item.discount.value / item.quantity))) 
    : item.price;

  return (
    <div className="flex flex-col gap-1">
      <div 
        onClick={() => {
          if (onClick) onClick();
          else setShowActions(!showActions);
        }}
        className={\`relative p-3 bg-white border rounded-xl cursor-pointer group transition-all \${item.isVoided ? 'opacity-50 grayscale' : ''} \${isSelected || showActions ? 'border-indigo-500 shadow-sm' : 'border-slate-100 hover:border-slate-300 hover:shadow-sm'}\`}
      >
        {isSelectionMode && (
          <div className={\`absolute -left-2 -top-2 w-6 h-6 rounded-full flex items-center justify-center shadow-md transition-all \${isSelected ? 'bg-indigo-600 text-white scale-110' : 'bg-white text-slate-300 border border-slate-200'}\`}>
            <CheckCircle size={14} />
          </div>
        )}
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-2.5">
            <span className="font-bold text-slate-500 text-xs bg-slate-100 px-2 py-1 rounded-md self-start">{item.quantity}×</span>
            <div>
              <p className={\`font-semibold text-sm \${item.isVoided ? 'line-through text-slate-400' : 'text-slate-900'}\`}>{item.name}</p>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {item.discount && (
                  <span className="text-xs bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-medium border border-emerald-100 flex items-center gap-1">
                    <Tag size={10} />
                    {item.discount.name}
                  </span>
                )}
                {item.modifiers?.map((m, i) => <span key={i} className="text-[11px] bg-slate-50 px-1.5 py-0.5 rounded-md text-slate-600 border border-slate-200">{m}</span>)}
                {item.course && <span className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">{item.course}</span>}
              </div>
              {item.specialRequest && <p className="text-xs text-orange-600 font-medium mt-1.5 italic flex items-start gap-1"><AlertCircle size={12} className="mt-0.5 shrink-0" /> "{item.specialRequest}"</p>}
            </div>
          </div>
          <div className="text-right shrink-0 ml-2">
            <p className={\`font-mono font-bold text-sm \${item.discount ? 'text-emerald-700' : 'text-slate-800'}\`}>
              \${(discountedPrice * item.quantity).toFixed(2)}
            </p>
            {item.discount && (
              <p className="text-[10px] text-slate-400 line-through font-mono">
                \${(item.price * item.quantity).toFixed(2)}
              </p>
            )}
            {item.fired && <Flame size={12} className="text-orange-500 ml-auto mt-1" />}
          </div>
        </div>
      </div>
      
      {showActions && !item.isVoided && (
        <div className="flex gap-2 p-1 animate-scale-in">
          <button onClick={() => { if(onVoid) onVoid(); setShowActions(false); }} className="flex-1 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors">
            <Trash2 size={14} /> Remove
          </button>
          <button onClick={() => { if(onDiscount) onDiscount(); setShowActions(false); }} className="flex-1 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors">
            <Percent size={14} /> Discount
          </button>
          <button onClick={() => { if(onMove) onMove(); setShowActions(false); }} className="flex-1 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors">
            <MoveRight size={14} /> Move
          </button>
        </div>
      )}
    </div>
  );
};
`;

fs.writeFileSync('components/dining/OrderItemRow.tsx', replacement);
console.log('OrderItemRow patched for inline actions.');
