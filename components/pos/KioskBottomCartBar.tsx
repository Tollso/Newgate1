import React, { useState } from 'react';
import { CartItem } from '../../types';
import { ShoppingBag, ChevronUp, ChevronDown, Plus, Minus, CreditCard, X, Utensils } from 'lucide-react';
import { KioskCartContent } from './KioskCartContent';

interface KioskBottomCartBarProps {
  cart: CartItem[];
  theme: any;
  updateQuantity: (index: number, delta: number) => void;
  subtotal: number;
  tax: number;
  total: number;
  setIsCheckout: (val: boolean) => void;
}

export const KioskBottomCartBar: React.FC<KioskBottomCartBarProps> = ({
  cart,
  theme,
  updateQuantity,
  subtotal,
  tax,
  total,
  setIsCheckout
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      {/* Expanded Bottom Sheet Overlay */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 transition-opacity animate-fade-in"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Slide-Up Bottom Drawer when expanded */}
      <div 
        className={`fixed bottom-0 left-0 right-0 bg-white shadow-2xl border-t-2 border-slate-200 z-50 transition-all duration-300 ease-in-out flex flex-col ${
          isExpanded ? 'max-h-[85vh] h-[600px]' : 'h-24'
        }`}
      >
        {/* Bar Header / Collapsed Bar View */}
        <div className="h-24 px-6 bg-white border-b border-slate-100 flex items-center justify-between shrink-0 gap-4">
          {/* Left: Icon & Item Count & Expand Toggle */}
          <div className="flex items-center gap-4 min-w-max">
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="relative p-3 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-md hover:scale-105 transition-transform"
            >
              <ShoppingBag size={24} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs font-black rounded-full w-6 h-6 flex items-center justify-center border-2 border-white shadow-sm">
                  {itemCount}
                </span>
              )}
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-slate-900 text-lg">Your Cart</span>
                <span className="text-xs font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">
                  {itemCount} {itemCount === 1 ? 'Item' : 'Items'}
                </span>
              </div>
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 mt-0.5"
              >
                {isExpanded ? (
                  <>Hide details <ChevronDown size={14} /></>
                ) : (
                  <>View details <ChevronUp size={14} /></>
                )}
              </button>
            </div>
          </div>

          {/* Middle: Horizontal Cart Items Chips (when collapsed & has items) */}
          {!isExpanded && (
            <div className="flex-1 overflow-x-auto py-2 flex items-center gap-3 scrollbar-hide">
              {cart.length === 0 ? (
                <span className="text-slate-400 font-medium text-sm italic">Your cart is empty. Select items to start ordering.</span>
              ) : (
                cart.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center gap-2 bg-slate-100 border border-slate-200/80 rounded-2xl px-3 py-2 shrink-0 shadow-sm"
                  >
                    <span className="font-bold text-slate-800 text-sm max-w-[120px] truncate">{item.name}</span>
                    <span className="text-xs font-bold text-slate-500">${(item.price * item.quantity).toFixed(2)}</span>
                    <div className="flex items-center gap-1 bg-white rounded-lg p-0.5 border border-slate-200 ml-1">
                      <button 
                        onClick={(e) => { e.stopPropagation(); updateQuantity(idx, -1); }}
                        className="w-6 h-6 flex items-center justify-center text-slate-600 hover:text-rose-600 rounded"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-5 text-center font-black text-xs text-slate-900">{item.quantity}</span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); updateQuantity(idx, 1); }}
                        className="w-6 h-6 flex items-center justify-center text-slate-600 hover:text-indigo-600 rounded"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Right: Subtotal / Total & Checkout Button */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="text-right">
              <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Total</span>
              <span className="text-2xl font-black text-slate-900">${total.toFixed(2)}</span>
            </div>

            <button
              onClick={() => {
                if (cart.length > 0) {
                  setIsCheckout(true);
                }
              }}
              disabled={cart.length === 0}
              className={`py-4 px-8 rounded-2xl font-black text-lg transition-all flex items-center gap-3 shadow-lg ${
                cart.length > 0 
                  ? `${theme.bg} text-white ${theme.bgHover} active:scale-95 shadow-indigo-200` 
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <CreditCard size={20} />
              Checkout
            </button>
          </div>
        </div>

        {/* Expanded View Content */}
        {isExpanded && (
          <div className="flex-1 overflow-hidden flex flex-col bg-slate-50">
            <div className="px-6 py-3 bg-slate-100 border-b border-slate-200 flex justify-between items-center">
              <span className="font-black text-slate-700 text-sm uppercase tracking-wider">Order Items Breakdown</span>
              <button 
                onClick={() => setIsExpanded(false)}
                className="p-1.5 bg-white border border-slate-200 rounded-full text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <KioskCartContent 
                cart={cart} 
                theme={theme} 
                updateQuantity={updateQuantity} 
                subtotal={subtotal} 
                tax={tax} 
                total={total} 
                setIsCheckout={setIsCheckout} 
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};
