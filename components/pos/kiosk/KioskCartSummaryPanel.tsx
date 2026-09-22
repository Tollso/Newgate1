import React from 'react';
import { CartItem } from '../../../types';
import { Coffee, Utensils } from 'lucide-react';

interface KioskCartSummaryPanelProps {
  cart: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
}

export const KioskCartSummaryPanel: React.FC<KioskCartSummaryPanelProps> = ({
  cart,
  subtotal,
  tax,
  total
}) => {
  const drinkItems = cart.filter(item => 
    /coffee|drink|beverage|tea|espresso|barista|pastry|bakery/i.test(item.category + ' ' + item.name)
  );

  const kitchenItems = cart.filter(item => 
    !/coffee|drink|beverage|tea|espresso|barista|pastry|bakery/i.test(item.category + ' ' + item.name)
  );

  return (
    <div className="w-96 bg-white border-l border-slate-200 flex flex-col shadow-2xl shrink-0">
      <div className="p-6 border-b border-slate-200 bg-slate-50">
        <h2 className="text-2xl font-black text-slate-800">Split Cart Summary</h2>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Automated routing to Barista & Kitchen stations</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {drinkItems.length > 0 && (
          <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-amber-900 font-black text-xs uppercase tracking-wider mb-3">
              <Coffee size={16} className="text-amber-600" />
              Barista & Drink Station ({drinkItems.length})
            </div>
            <div className="space-y-3">
              {drinkItems.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start text-xs border-b border-amber-100/60 pb-2 last:border-0 last:pb-0">
                  <div>
                    <span className="font-bold text-slate-800">{item.quantity}x {item.name}</span>
                    {item.modifiers && item.modifiers.length > 0 && (
                      <p className="text-[10px] text-slate-500 mt-0.5">{item.modifiers.join(', ')}</p>
                    )}
                  </div>
                  <span className="font-black text-slate-900">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {kitchenItems.length > 0 && (
          <div className="bg-indigo-50/60 border border-indigo-200/80 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-indigo-900 font-black text-xs uppercase tracking-wider mb-3">
              <Utensils size={16} className="text-indigo-600" />
              Kitchen & Grill Station ({kitchenItems.length})
            </div>
            <div className="space-y-3">
              {kitchenItems.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start text-xs border-b border-indigo-100/60 pb-2 last:border-0 last:pb-0">
                  <div>
                    <span className="font-bold text-slate-800">{item.quantity}x {item.name}</span>
                    {item.modifiers && item.modifiers.length > 0 && (
                      <p className="text-[10px] text-slate-500 mt-0.5">{item.modifiers.join(', ')}</p>
                    )}
                  </div>
                  <span className="font-black text-slate-900">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-slate-200 bg-slate-50">
        <div className="space-y-2 mb-4 text-sm font-medium">
          <div className="flex justify-between text-slate-500">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-2xl font-black text-slate-900 pt-3 border-t border-slate-200">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
