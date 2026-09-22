import React from 'react';
import { CheckCircle2, CreditCard, Banknote } from 'lucide-react';

interface SplitEvenModeProps {
  splitWays: number;
  setSplitWays: (val: number | ((prev: number) => number)) => void;
  finalTotal: number;
  setAmountToPay: (val: number) => void;
  setTableCardPaymentStep: (step: 'NONE' | 'TAP' | 'TIP' | 'GIFT_CARD') => void;
  setPaymentMode: (mode: 'SELECT' | 'SPLIT_EVEN' | 'SPLIT_GUEST' | 'SPLIT_ITEM') => void;
  onApplySplit?: (mode: 'SPLIT_EVEN', ways: number) => void;
  totals?: {
    subtotal: number;
    tax: number;
    discountAmount: number;
    autoGratuityAmount: number;
    serviceFeeAmount: number;
    total: number;
    totalPaidSoFar: number;
    remainingTotal: number;
  };
}

export const SplitEvenMode: React.FC<SplitEvenModeProps> = ({
  splitWays,
  setSplitWays,
  finalTotal,
  setAmountToPay,
  setTableCardPaymentStep,
  setPaymentMode,
  onApplySplit,
  totals
}) => {
  const amountPerSplit = finalTotal / splitWays;
  const totalPaidSoFar = totals?.totalPaidSoFar ?? 0;
  
  // Calculate how many splits are completed based on amount paid so far
  const completedSplitsCount = Math.min(
    splitWays,
    Math.floor((totalPaidSoFar + 0.009) / (amountPerSplit - 0.001))
  );

  const currentUnpaidIndex = completedSplitsCount;
  const isAllPaid = completedSplitsCount >= splitWays;

  const getOrdinal = (n: number) => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  const handleApplySplit = (targetIndex: number = currentUnpaidIndex) => {
    setAmountToPay(amountPerSplit);
    if (onApplySplit) {
      onApplySplit('SPLIT_EVEN', splitWays);
    }
    setTableCardPaymentStep('TAP');
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex justify-between items-center bg-slate-50 border border-slate-200 rounded-2xl p-5">
        <div>
          <span className="font-bold text-slate-600 uppercase tracking-widest text-xs block">Ways to Split</span>
          <span className="text-xs text-slate-400 font-medium">
            {completedSplitsCount > 0 ? `${completedSplitsCount} of ${splitWays} paid` : 'Split equally'}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            disabled={completedSplitsCount > 0}
            onClick={() => setSplitWays(prev => Math.max(2, prev - 1))}
            className="w-10 h-10 rounded-full bg-slate-200 hover:bg-slate-300 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 font-black text-xl flex items-center justify-center transition-colors cursor-pointer"
          >
            -
          </button>
          <span className="text-2xl font-black text-slate-800">{splitWays}</span>
          <button
            type="button"
            disabled={completedSplitsCount > 0}
            onClick={() => setSplitWays(prev => prev + 1)}
            className="w-10 h-10 rounded-full bg-slate-200 hover:bg-slate-300 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 font-black text-xl flex items-center justify-center transition-colors cursor-pointer"
          >
            +
          </button>
        </div>
      </div>

      <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
        {Array.from({ length: splitWays }).map((_, i) => {
          const isPaid = i < completedSplitsCount;
          const isCurrent = i === currentUnpaidIndex;

          return (
            <div 
              key={i} 
              className={`flex justify-between items-center p-3.5 border rounded-xl transition-all ${
                isPaid 
                  ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900' 
                  : isCurrent 
                    ? 'bg-indigo-50/80 border-indigo-300 shadow-sm ring-1 ring-indigo-200' 
                    : 'bg-slate-50/50 border-slate-200 text-slate-500'
              }`}
            >
              <div className="flex items-center gap-2">
                {isPaid ? (
                  <CheckCircle2 size={18} className="text-emerald-600" />
                ) : isCurrent ? (
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse" />
                ) : (
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                )}
                <div>
                  <span className="font-bold text-sm block text-slate-800">
                    Split {i + 1} of {splitWays} {isCurrent && '(Next Due)'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">
                    {isPaid ? '✓ Paid' : isCurrent ? 'Ready to Pay' : 'Pending'}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-base text-slate-900">${amountPerSplit.toFixed(2)}</span>
                {!isPaid && (
                  <button
                    type="button"
                    onClick={() => {
                      setAmountToPay(amountPerSplit);
                      setTableCardPaymentStep('TAP');
                    }}
                    className={`px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                      isCurrent 
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md' 
                        : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                    }`}
                  >
                    Pay
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-2 space-y-2 border-t border-slate-100">
        {!isAllPaid ? (
          <button
            type="button"
            onClick={() => handleApplySplit(currentUnpaidIndex)}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 transition-all active:scale-98 text-sm cursor-pointer"
          >
            <CreditCard size={18} /> Take {getOrdinal(currentUnpaidIndex + 1)} Payment (${amountPerSplit.toFixed(2)})
          </button>
        ) : (
          <div className="w-full py-3.5 bg-emerald-100 text-emerald-800 font-black rounded-2xl text-center text-sm flex items-center justify-center gap-2">
            <CheckCircle2 size={18} className="text-emerald-600" /> All {splitWays} Split Payments Completed
          </div>
        )}

        <button
          type="button"
          onClick={() => setPaymentMode('SELECT')}
          className="w-full py-3 bg-slate-100 font-bold rounded-2xl text-slate-500 hover:bg-slate-200 text-xs transition-colors cursor-pointer"
        >
          Back to Payment Modes
        </button>
      </div>
    </div>
  );
};
