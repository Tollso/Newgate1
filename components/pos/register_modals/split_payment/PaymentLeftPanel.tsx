import React from 'react';
import { SplitSquareHorizontal, CheckCircle } from 'lucide-react';
import { SplitPart } from './splitTypes';
import { CartItem } from '../../../../types';

interface PaymentLeftPanelProps {
  total: number;
  currentDue: number;
  cart: CartItem[];
  isSplitMode: boolean;
  splitParts: SplitPart[];
  currentPartIndex: number;
  selectedTip: number;
  partialPaidMessage: string;
  partialPayments?: { amount: number; method: string; tip?: number }[];
  getOrdinal: (n: number) => string;
}

export const PaymentLeftPanel: React.FC<PaymentLeftPanelProps> = ({
  total,
  currentDue,
  cart,
  isSplitMode,
  splitParts,
  currentPartIndex,
  selectedTip,
  partialPaidMessage,
  partialPayments = [],
  getOrdinal,
}) => {
  const activePart = isSplitMode && splitParts[currentPartIndex] ? splitParts[currentPartIndex] : null;
  const currentPayableAmount = isSplitMode && activePart ? activePart.amount : currentDue;
  const finalTotal = currentPayableAmount + selectedTip;
  const totalPaidSoFar = isSplitMode
    ? splitParts.filter((p) => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0)
    : partialPayments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="md:w-1/3 bg-slate-900 text-white p-7 flex flex-col justify-between rounded-t-[2.5rem] md:rounded-l-[2.5rem] md:rounded-tr-none">
      <div>
        {isSplitMode ? (
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/30 border border-indigo-400/40 text-indigo-300 rounded-full text-[11px] font-black uppercase tracking-wider mb-3">
              <SplitSquareHorizontal size={14} />
              Split Order ({splitParts.length} Parts)
            </div>

            <p className="text-xs font-black uppercase tracking-widest text-indigo-300 mb-1">
              Take {getOrdinal(currentPartIndex + 1)} Payment
            </p>
            <h2 className="text-3xl font-black tracking-tighter text-emerald-400">
              ${currentPayableAmount.toFixed(2)}
            </h2>

            <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
              <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                <span>Total Order:</span>
                <span className="text-slate-200 font-bold font-mono">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                <span>Collected So Far:</span>
                <span className="text-emerald-400 font-bold font-mono">${totalPaidSoFar.toFixed(2)}</span>
              </div>

              {/* Split Parts Visual Progress List */}
              <div className="space-y-1.5 pt-2 max-h-48 overflow-y-auto pr-1">
                {splitParts.map((p, idx) => (
                  <div
                    key={p.partNumber}
                    className={`px-3 py-2 rounded-xl text-xs flex justify-between items-center transition-all ${
                      p.status === 'Paid'
                        ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold'
                        : idx === currentPartIndex
                        ? 'bg-indigo-500/30 border-2 border-indigo-400 text-white font-black shadow-md'
                        : 'bg-white/5 text-slate-400'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      {p.status === 'Paid' ? (
                        <CheckCircle size={14} className="text-emerald-400" />
                      ) : (
                        <span className={`w-2 h-2 rounded-full ${idx === currentPartIndex ? 'bg-indigo-400 animate-ping' : 'bg-slate-600'}`} />
                      )}
                      {getOrdinal(p.partNumber)} Payment
                    </span>
                    <span className="font-mono text-[11px]">
                      {p.status === 'Paid' ? `✓ $${p.amount.toFixed(2)} (${p.method})` : `$${p.amount.toFixed(2)}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Remaining Due</p>
            <h2 className="text-4xl font-black tracking-tighter text-emerald-400">${currentDue.toFixed(2)}</h2>
            
            {partialPayments.length > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-800 space-y-1.5">
                <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                  <span>Order Original Total:</span>
                  <span className="text-slate-200 font-bold font-mono">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                  <span>Total Collected:</span>
                  <span className="text-emerald-400 font-bold font-mono">${totalPaidSoFar.toFixed(2)}</span>
                </div>

                <div className="pt-2 space-y-1 max-h-36 overflow-y-auto">
                  {partialPayments.map((pmt, idx) => (
                    <div key={idx} className="flex justify-between items-center px-2.5 py-1.5 bg-white/5 rounded-lg text-[11px]">
                      <span className="text-slate-300 font-semibold flex items-center gap-1">
                        <CheckCircle size={12} className="text-emerald-400" />
                        {pmt.method}
                      </span>
                      <span className="font-mono text-emerald-300 font-bold">
                        ${pmt.amount.toFixed(2)}{pmt.tip ? ` (+$${pmt.tip.toFixed(2)} tip)` : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedTip > 0 && (
              <div className="mt-3 text-xs text-indigo-300 font-bold">
                + ${selectedTip.toFixed(2)} Tip = <span className="text-white text-lg font-black">${finalTotal.toFixed(2)}</span>
              </div>
            )}
            {partialPaidMessage && (
              <div className="mt-3 p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 font-bold leading-relaxed">
                {partialPaidMessage}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="space-y-2 pt-4 border-t border-slate-800 text-xs text-slate-400">
        <div className="flex justify-between font-medium">
          <span>Tax</span>
          <span>Included</span>
        </div>
        <div className="flex justify-between font-medium">
          <span>Items in Order</span>
          <span>{cart.length}</span>
        </div>
      </div>
    </div>
  );
};
