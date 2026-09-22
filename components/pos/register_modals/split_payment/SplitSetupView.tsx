import React, { useState } from 'react';
import { CreditCard, Plus, Trash2, DivideSquare, Sliders, CheckCircle2, AlertCircle } from 'lucide-react';
import { SplitPart } from './splitTypes';

interface SplitSetupViewProps {
  total: number;
  splitCount: number;
  splitParts: SplitPart[];
  onUpdateSplitCount: (newCount: number) => void;
  onSetSplitParts: (parts: SplitPart[]) => void;
  onStartSplitPayments: () => void;
  onCancelSplit: () => void;
  getOrdinal: (n: number) => string;
}

export const SplitSetupView: React.FC<SplitSetupViewProps> = ({
  total,
  splitCount,
  splitParts,
  onUpdateSplitCount,
  onSetSplitParts,
  onStartSplitPayments,
  onCancelSplit,
  getOrdinal,
}) => {
  const [splitStrategy, setSplitStrategy] = useState<'EVEN' | 'CUSTOM'>('EVEN');

  // Calculate sum of custom parts
  const allocatedSum = splitParts.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const diff = Math.round((total - allocatedSum) * 100) / 100;
  const isBalanced = Math.abs(diff) < 0.01;

  const handleCustomAmountChange = (index: number, valStr: string) => {
    const num = parseFloat(valStr);
    const updated = splitParts.map((p, idx) =>
      idx === index ? { ...p, amount: isNaN(num) ? 0 : Math.max(0, num) } : p
    );
    onSetSplitParts(updated);
  };

  const handleAddCustomPart = () => {
    const nextPartNumber = splitParts.length + 1;
    const remainingToGive = Math.max(0, diff);
    const updated: SplitPart[] = [
      ...splitParts,
      { partNumber: nextPartNumber, amount: remainingToGive, status: 'Pending' },
    ];
    onSetSplitParts(updated);
  };

  const handleRemoveCustomPart = (index: number) => {
    if (splitParts.length <= 2) return;
    const updated = splitParts
      .filter((_, idx) => idx !== index)
      .map((p, idx) => ({ ...p, partNumber: idx + 1 }));
    onSetSplitParts(updated);
  };

  const handleAutoBalanceLast = () => {
    if (splitParts.length < 2) return;
    const lastIndex = splitParts.length - 1;
    const sumExceptLast = splitParts
      .slice(0, lastIndex)
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    const newLastAmount = Math.max(0, Math.round((total - sumExceptLast) * 100) / 100);

    const updated = splitParts.map((p, idx) =>
      idx === lastIndex ? { ...p, amount: newLastAmount } : p
    );
    onSetSplitParts(updated);
  };

  return (
    <div className="flex-1 flex flex-col justify-between py-1 animate-fade-in">
      <div className="space-y-3">
        {/* Strategy Switcher: Even vs Custom */}
        <div className="flex bg-slate-200/80 p-1 rounded-2xl gap-1">
          <button
            type="button"
            onClick={() => {
              setSplitStrategy('EVEN');
              onUpdateSplitCount(splitCount);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              splitStrategy === 'EVEN'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <DivideSquare size={15} />
            Even Split ({splitCount} Parts)
          </button>
          <button
            type="button"
            onClick={() => setSplitStrategy('CUSTOM')}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              splitStrategy === 'CUSTOM'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sliders size={15} />
            Custom Amounts Split
          </button>
        </div>

        {/* EVEN SPLIT CONFIGURATION */}
        {splitStrategy === 'EVEN' ? (
          <div className="space-y-3">
            <div className="bg-white border-2 border-indigo-100 rounded-2xl p-4 text-center space-y-2 shadow-xs">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Split entire order into how many equal parts?
              </p>
              <div className="flex items-center justify-center gap-6">
                <button
                  type="button"
                  onClick={() => onUpdateSplitCount(splitCount - 1)}
                  className="h-10 w-10 bg-slate-100 border-2 border-slate-200 rounded-xl flex items-center justify-center font-black text-xl text-slate-600 hover:border-indigo-500 hover:text-indigo-600 transition-all active:scale-95 cursor-pointer"
                >
                  -
                </button>
                <span className="text-4xl font-black text-indigo-600 tabular-nums">{splitCount}</span>
                <button
                  type="button"
                  onClick={() => onUpdateSplitCount(splitCount + 1)}
                  className="h-10 w-10 bg-slate-100 border-2 border-slate-200 rounded-xl flex items-center justify-center font-black text-xl text-slate-600 hover:border-indigo-500 hover:text-indigo-600 transition-all active:scale-95 cursor-pointer"
                >
                  +
                </button>
              </div>
              <p className="text-sm font-black text-indigo-700">
                ${(total / splitCount).toFixed(2)} per payment part
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
              {splitParts.map((p) => (
                <div
                  key={p.partNumber}
                  className="p-2.5 bg-white border border-slate-200 rounded-xl flex justify-between items-center text-xs"
                >
                  <span className="font-bold text-slate-700">{getOrdinal(p.partNumber)} Payment</span>
                  <span className="font-mono font-black text-indigo-600">${p.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* CUSTOM AMOUNTS CONFIGURATION */
          <div className="space-y-2.5">
            {/* Balance Status Indicator */}
            <div
              className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between ${
                isBalanced
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}
            >
              <div className="flex items-center gap-1.5">
                {isBalanced ? (
                  <CheckCircle2 size={16} className="text-emerald-600" />
                ) : (
                  <AlertCircle size={16} className="text-amber-600" />
                )}
                <span>
                  {isBalanced
                    ? `✓ 100% of $${total.toFixed(2)} Allocated`
                    : diff > 0
                    ? `$${diff.toFixed(2)} Remaining to allocate`
                    : `$${Math.abs(diff).toFixed(2)} Over total ($${total.toFixed(2)})`}
                </span>
              </div>
              {!isBalanced && (
                <button
                  type="button"
                  onClick={handleAutoBalanceLast}
                  className="px-2 py-0.5 bg-amber-200 hover:bg-amber-300 text-amber-900 rounded-lg text-[10px] font-black transition-colors cursor-pointer"
                >
                  Auto-Balance
                </button>
              )}
            </div>

            {/* Editable Custom Parts List */}
            <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
              {splitParts.map((p, idx) => (
                <div
                  key={p.partNumber}
                  className="p-2.5 bg-white border-2 border-slate-200 rounded-xl flex items-center justify-between gap-3 text-xs shadow-xs"
                >
                  <span className="font-bold text-slate-700 w-24 shrink-0">
                    {getOrdinal(p.partNumber)} Part:
                  </span>
                  <div className="relative flex-1">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                      $
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={p.amount}
                      onChange={(e) => handleCustomAmountChange(idx, e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 focus:border-indigo-500 rounded-lg pl-6 pr-2 py-1 text-sm font-black font-mono text-slate-800 outline-none"
                    />
                  </div>
                  {splitParts.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveCustomPart(idx)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Remove this part"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddCustomPart}
              className="w-full py-1.5 border border-dashed border-indigo-300 bg-indigo-50/50 hover:bg-indigo-100/70 text-indigo-700 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus size={14} /> Add Another Custom Split Part
            </button>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="space-y-2 pt-3 border-t border-slate-100">
        <button
          type="button"
          disabled={splitStrategy === 'CUSTOM' && !isBalanced}
          onClick={onStartSplitPayments}
          className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-black uppercase tracking-wider text-sm shadow-xl shadow-indigo-100 transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
        >
          <CreditCard size={18} /> Take 1st Payment (${(splitParts[0]?.amount || 0).toFixed(2)})
        </button>
        <button
          type="button"
          onClick={onCancelSplit}
          className="w-full py-2 bg-slate-200 hover:bg-slate-300 text-slate-600 rounded-xl font-bold text-xs transition-colors cursor-pointer"
        >
          Cancel Split & Pay Entire Order in Full
        </button>
      </div>
    </div>
  );
};

