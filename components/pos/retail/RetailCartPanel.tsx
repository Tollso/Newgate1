import React from 'react';
import { Barcode, Plus, Minus, Trash2, CreditCard } from 'lucide-react';
import { RetailCartItem } from './RetailTypes';

interface RetailCartPanelProps {
  cart: RetailCartItem[];
  subtotal: number;
  tax: number;
  total: number;
  onClearCart: () => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onStartCheckout: () => void;
}

export const RetailCartPanel: React.FC<RetailCartPanelProps> = ({
  cart,
  subtotal,
  tax,
  total,
  onClearCart,
  onUpdateQuantity,
  onRemoveItem,
  onStartCheckout,
}) => {
  return (
    <div className="w-96 bg-slate-900 flex flex-col justify-between overflow-hidden shrink-0">
      {/* Cart Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <h3 className="font-bold text-sm text-white">Current Sale ({cart.length})</h3>
        {cart.length > 0 && (
          <button
            onClick={onClearCart}
            className="text-xs text-rose-400 hover:text-rose-300 font-semibold"
          >
            Clear Cart
          </button>
        )}
      </div>

      {/* Cart Line Items */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-slate-500">
            <Barcode size={48} className="mb-2 opacity-40" />
            <p className="text-sm font-semibold">Cart is empty</p>
            <p className="text-xs">Scan items or tap products on the left</p>
          </div>
        ) : (
          cart.map(item => (
            <div
              key={item.id}
              className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/50 flex flex-col space-y-2"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-xs text-white">{item.name}</h4>
                  {item.variantLabel && (
                    <span className="text-[11px] text-indigo-400 block font-medium">
                      {item.variantLabel}
                    </span>
                  )}
                  <span className="text-[10px] text-slate-500 font-mono">SKU: {item.sku}</span>
                </div>
                <span className="font-mono font-bold text-sm text-white">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center space-x-1 bg-slate-900 rounded-lg p-0.5 border border-slate-700">
                  <button
                    onClick={() => onUpdateQuantity(item.id, -1)}
                    className="p-1 hover:bg-slate-800 rounded text-slate-300"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="px-2 text-xs font-mono font-bold text-white">{item.quantity}</span>
                  <button
                    onClick={() => onUpdateQuantity(item.id, 1)}
                    className="p-1 hover:bg-slate-800 rounded text-slate-300"
                  >
                    <Plus size={12} />
                  </button>
                </div>

                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="p-1 text-slate-500 hover:text-rose-400"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Cart Totals & Checkout Button */}
      <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-3">
        <div className="space-y-1.5 text-xs text-slate-400">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Sales Tax (8.25%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-slate-800">
            <span>Total Due</span>
            <span className="font-mono text-emerald-400">${total.toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={onStartCheckout}
          disabled={cart.length === 0}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-black text-sm rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2"
        >
          <CreditCard size={18} />
          Charge ${total.toFixed(2)}
        </button>
      </div>
    </div>
  );
};
