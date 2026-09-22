import React from 'react';
import { CartItem } from '../../types';
import { Minus, Plus, Utensils } from 'lucide-react';

interface KioskCartContentProps {
  cart: CartItem[];
  theme: any;
  updateQuantity: (index: number, delta: number) => void;
  subtotal: number;
  tax: number;
  total: number;
  setIsCheckout: (val: boolean) => void;
}

export const KioskCartContent: React.FC<KioskCartContentProps> = ({
  cart, theme, updateQuantity, subtotal, tax, total, setIsCheckout
}) => (
  <>
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {cart.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
          <Utensils size={48} className="opacity-20" />
          <p className="font-bold text-lg">Your cart is empty</p>
        </div>
      ) : (
        cart.map((item, idx) => (
          <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-bold text-slate-800 text-lg">{item.name}</h4>
                {item.modifiers && item.modifiers.length > 0 && (
                  <p className="text-sm text-slate-500 mt-1">{item.modifiers.join(', ')}</p>
                )}
              </div>
              <span className="font-black text-lg text-slate-900">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
            
            <div className="flex items-center gap-4 bg-slate-50 rounded-xl p-1 w-max">
              <button 
                onClick={() => updateQuantity(idx, -1)}
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-white text-slate-600 shadow-sm hover:text-indigo-600 transition-colors"
              >
                <Minus size={20} />
              </button>
              <span className="w-8 text-center font-black text-lg">{item.quantity}</span>
              <button 
                onClick={() => updateQuantity(idx, 1)}
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-white text-slate-600 shadow-sm hover:text-indigo-600 transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>
        ))
      )}
    </div>

    {cart.length > 0 && (
      <div className="p-6 border-t border-slate-200 bg-slate-50 shrink-0">
        <div className="space-y-3 mb-6 font-medium">
          <div className="flex justify-between text-slate-500">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-2xl font-black text-slate-900 pt-4 border-t border-slate-200">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <button 
          onClick={() => setIsCheckout(true)}
          className={`w-full py-5 rounded-2xl font-black text-xl transition-all flex items-center justify-center gap-2 ${theme.bg} text-white ${theme.bgHover} shadow-lg hover:shadow-xl`}
        >
          Checkout
        </button>
      </div>
    )}
  </>
);
