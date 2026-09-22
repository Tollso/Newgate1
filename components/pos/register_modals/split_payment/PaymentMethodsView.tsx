import React from 'react';
import { CreditCard, Banknote, Wallet, SplitSquareHorizontal, DollarSign, Calculator, ArrowRight } from 'lucide-react';
import { SplitPart } from './splitTypes';

interface PaymentMethodsViewProps {
  isSplitMode: boolean;
  splitParts: SplitPart[];
  currentPartIndex: number;
  currentPayableAmount: number;
  amountMode: 'FULL' | 'CUSTOM';
  setAmountMode: (mode: 'FULL' | 'CUSTOM') => void;
  customAmount: string;
  setCustomAmount: (val: string) => void;
  effectivePayAmount: number;
  onSelectCard: (method: string) => void;
  onSelectCash: () => void;
  onSelectGiftCard: () => void;
  onInitiateSplit: () => void;
  onChangeSplit: () => void;
  getOrdinal: (n: number) => string;
}

export const PaymentMethodsView: React.FC<PaymentMethodsViewProps> = ({
  isSplitMode,
  splitParts,
  currentPartIndex,
  currentPayableAmount,
  amountMode,
  setAmountMode,
  customAmount,
  setCustomAmount,
  effectivePayAmount,
  onSelectCard,
  onSelectCash,
  onSelectGiftCard,
  onInitiateSplit,
  onChangeSplit,
  getOrdinal,
}) => {
  const ordinalLabel = getOrdinal(currentPartIndex + 1);

  // Quick percentage / preset amounts for custom payment
  const quickPresets = [
    { label: '50%', value: Math.round((currentPayableAmount / 2) * 100) / 100 },
    { label: '25%', value: Math.round((currentPayableAmount / 4) * 100) / 100 },
    { label: '$10', value: 10 },
    { label: '$20', value: 20 },
    { label: '$50', value: 50 },
    { label: '$100', value: 100 },
  ].filter((p) => p.value > 0 && p.value < currentPayableAmount);

  const isValidAmount = effectivePayAmount > 0 && effectivePayAmount <= currentPayableAmount + 0.001;
  const remainingAfterPayment = Math.max(0, currentPayableAmount - effectivePayAmount);

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Split Mode Banner */}
      {isSplitMode && (
        <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs font-bold text-indigo-900 flex items-center justify-between shadow-sm">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
            Now processing {ordinalLabel} Payment:
          </span>
          <span className="font-mono text-indigo-700 text-sm font-black">${currentPayableAmount.toFixed(2)}</span>
        </div>
      )}

      {/* Amount Selector: Full vs Custom Amount (Available for standard and split payments) */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl p-3 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Calculator size={13} className="text-indigo-600" />
            Payment Amount
          </span>
          <div className="flex bg-slate-100 p-0.5 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setAmountMode('FULL');
                setCustomAmount('');
              }}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                amountMode === 'FULL'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Full (${currentPayableAmount.toFixed(2)})
            </button>
            <button
              type="button"
              onClick={() => {
                setAmountMode('CUSTOM');
                if (!customAmount) {
                  setCustomAmount((Math.floor(currentPayableAmount / 2) || 10).toString());
                }
              }}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                amountMode === 'CUSTOM'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <DollarSign size={13} />
              Custom Amount
            </button>
          </div>
        </div>

        {/* Custom Amount Controls */}
        {amountMode === 'CUSTOM' && (
          <div className="space-y-2.5 pt-1 border-t border-slate-100 animate-fade-in">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-black text-lg">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  max={currentPayableAmount}
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-slate-50 border-2 border-indigo-200 focus:border-indigo-600 rounded-xl pl-8 pr-3 py-2 text-lg font-black text-slate-900 font-mono outline-none transition-all focus:ring-2 focus:ring-indigo-100"
                  autoFocus
                />
              </div>

              <div className="text-right">
                <p className="text-[10px] uppercase font-bold text-slate-400">Remaining After</p>
                <p className="text-sm font-black font-mono text-amber-600">
                  ${remainingAfterPayment.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Quick Preset Buttons */}
            {quickPresets.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-bold text-slate-400 mr-1">Quick:</span>
                {quickPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCustomAmount(preset.value.toFixed(2))}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 transition-colors cursor-pointer"
                  >
                    {preset.label} (${preset.value.toFixed(2)})
                  </button>
                ))}
              </div>
            )}

            {!isValidAmount && (
              <p className="text-[11px] font-bold text-rose-600 animate-shake">
                Please enter a valid amount between $0.01 and ${currentPayableAmount.toFixed(2)}.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Payment Action Buttons */}
      <div className="grid grid-cols-2 gap-3.5">
        <button
          type="button"
          disabled={!isValidAmount}
          onClick={() => onSelectCard('Card')}
          className="p-4 bg-white border-2 border-slate-200 rounded-2xl hover:border-indigo-500 hover:shadow-lg transition-all flex flex-col items-center gap-2 group text-center active:scale-98 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <CreditCard size={22} />
          </div>
          <span className="font-bold text-sm text-slate-800 group-hover:text-indigo-700">
            {amountMode === 'CUSTOM'
              ? `Pay $${effectivePayAmount.toFixed(2)} (Card)`
              : isSplitMode
              ? `Take ${ordinalLabel} Pay (Card)`
              : 'Card'}
          </span>
          <span className="text-[11px] text-indigo-600 font-mono font-black">
            ${effectivePayAmount.toFixed(2)}
          </span>
        </button>

        <button
          type="button"
          disabled={!isValidAmount}
          onClick={onSelectCash}
          className="p-4 bg-white border-2 border-slate-200 rounded-2xl hover:border-emerald-500 hover:shadow-lg transition-all flex flex-col items-center gap-2 group text-center active:scale-98 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            <Banknote size={22} />
          </div>
          <span className="font-bold text-sm text-slate-800 group-hover:text-emerald-700">
            {amountMode === 'CUSTOM'
              ? `Pay $${effectivePayAmount.toFixed(2)} (Cash)`
              : isSplitMode
              ? `Take ${ordinalLabel} Pay (Cash)`
              : 'Cash'}
          </span>
          <span className="text-[11px] text-emerald-600 font-mono font-black">
            ${effectivePayAmount.toFixed(2)}
          </span>
        </button>

        <button
          type="button"
          onClick={onSelectGiftCard}
          className="p-4 bg-white border-2 border-slate-200 rounded-2xl hover:border-purple-500 hover:shadow-lg transition-all flex flex-col items-center gap-2 group text-center active:scale-98 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
            <Wallet size={22} />
          </div>
          <span className="font-bold text-sm text-slate-700 group-hover:text-purple-700">
            Gift Card / Credit
          </span>
          <span className="text-[11px] text-slate-400">Store Credit Code</span>
        </button>

        {!isSplitMode ? (
          <button
            type="button"
            onClick={onInitiateSplit}
            className="p-4 bg-white border-2 border-orange-200 rounded-2xl hover:border-orange-500 hover:shadow-lg transition-all flex flex-col items-center gap-2 group text-center active:scale-98 cursor-pointer bg-orange-50/20"
          >
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors">
              <SplitSquareHorizontal size={22} />
            </div>
            <span className="font-bold text-sm text-slate-800 group-hover:text-orange-700">
              Split Order
            </span>
            <span className="text-[11px] text-orange-600 font-bold">
              Custom or Even Split
            </span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onChangeSplit}
            className="p-4 bg-white border-2 border-indigo-200 rounded-2xl hover:border-indigo-500 hover:shadow-lg transition-all flex flex-col items-center gap-2 group text-center active:scale-98 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <SplitSquareHorizontal size={22} />
            </div>
            <span className="font-bold text-sm text-indigo-700">Modify Split</span>
            <span className="text-[11px] text-indigo-500 font-medium">
              Part {currentPartIndex + 1} of {splitParts.length}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

