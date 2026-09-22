/**
 * CustomerFacingDisplayModal
 * Real-time projection of active order, running total, tip prompt, and thank-you screen for customer-facing displays.
 * Implements Section 12 of the Newgate Platform Architecture.
 */

import React, { useState, useEffect } from 'react';
import { Monitor, X, Heart, CreditCard, CheckCircle2 } from 'lucide-react';
import { CustomerDisplayService, CustomerDisplayState } from '../../services/customerDisplayService';

interface CustomerFacingDisplayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomerFacingDisplayModal: React.FC<CustomerFacingDisplayModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [displayState, setDisplayState] = useState<CustomerDisplayState>({
    screenMode: 'IDLE',
    merchantName: 'The Newgate POS',
    items: [],
    subtotal: 0,
    tax: 0,
    tip: 0,
    total: 0,
    customMessage: 'Welcome to The Newgate POS',
  });

  useEffect(() => {
    const unsub = CustomerDisplayService.subscribe((state) => {
      setDisplayState(state);
    });
    return unsub;
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      {/* Outer tablet/screen frame */}
      <div className="bg-slate-900 text-white rounded-3xl shadow-2xl w-full max-w-2xl border-4 border-slate-800 overflow-hidden flex flex-col h-[580px] relative">
        {/* Top screen header */}
        <div className="bg-slate-950 px-6 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-mono text-slate-400 tracking-wider uppercase">
              {displayState.merchantName} • Customer Display
            </span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X size={18} />
          </button>
        </div>

        {/* Display Body */}
        <div className="flex-1 flex flex-col p-6 justify-between overflow-hidden">
          {displayState.screenMode === 'IDLE' && (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Monitor size={40} />
              </div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                {displayState.customMessage || 'Welcome'}
              </h2>
              <p className="text-sm text-slate-400 max-w-xs">
                Your order items will appear here as they are scanned or entered.
              </p>
            </div>
          )}

          {displayState.screenMode === 'ACTIVE_ORDER' && (
            <div className="flex-1 flex flex-col justify-between overflow-hidden">
              <div className="overflow-y-auto max-h-[300px] space-y-2 pr-1">
                {displayState.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-800/60 rounded-xl flex items-center justify-between border border-slate-700/50"
                  >
                    <div>
                      <span className="font-semibold text-white block text-sm">{item.name}</span>
                      <span className="text-xs text-slate-400">Qty: {item.quantity}</span>
                    </div>
                    <span className="font-mono font-bold text-white text-base">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Running Totals */}
              <div className="pt-4 border-t border-slate-800 space-y-1.5">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Subtotal</span>
                  <span>${displayState.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Tax</span>
                  <span>${displayState.tax.toFixed(2)}</span>
                </div>
                {displayState.tip > 0 && (
                  <div className="flex justify-between text-xs text-indigo-400 font-semibold">
                    <span>Tip</span>
                    <span>${displayState.tip.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-bold text-white pt-2 border-t border-slate-800">
                  <span>Total Due</span>
                  <span className="font-mono text-emerald-400">${displayState.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {displayState.screenMode === 'TIP_PROMPT' && (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
              <div>
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block mb-1">
                  Add Tip
                </span>
                <h3 className="text-2xl font-black text-white">Select a Tip Amount</h3>
              </div>

              <div className="grid grid-cols-4 gap-3 w-full max-w-md">
                {(displayState.suggestedTips || [15, 18, 20, 25]).map((pct) => (
                  <button
                    key={pct}
                    onClick={() => {
                      const tipAmt = (displayState.subtotal * pct) / 100;
                      CustomerDisplayService.updateDisplay({
                        tip: tipAmt,
                        total: displayState.subtotal + displayState.tax + tipAmt,
                        screenMode: 'ACTIVE_ORDER',
                      });
                    }}
                    className="p-4 bg-slate-800 hover:bg-indigo-600 border border-slate-700 hover:border-indigo-500 rounded-2xl transition-all text-center"
                  >
                    <span className="text-lg font-bold block">{pct}%</span>
                    <span className="text-xs text-slate-400 block mt-0.5">
                      ${((displayState.subtotal * pct) / 100).toFixed(2)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {displayState.screenMode === 'THANK_YOU' && (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <CheckCircle2 size={44} />
              </div>
              <h2 className="text-3xl font-extrabold text-white">Thank You!</h2>
              <p className="text-sm text-slate-400 max-w-sm">
                Your payment was processed successfully. We hope to see you again soon!
              </p>
            </div>
          )}
        </div>

        {/* Bottom Hardware Bezel Info */}
        <div className="bg-slate-950 px-6 py-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
          <span>Tap, insert, or swipe card on reader</span>
          <span className="flex items-center gap-1">
            <CreditCard size={14} /> EMV & NFC Enabled
          </span>
        </div>
      </div>
    </div>
  );
};
