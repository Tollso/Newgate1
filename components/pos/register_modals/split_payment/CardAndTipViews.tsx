import React from 'react';
import { CreditCard, CheckCircle, Wallet } from 'lucide-react';

interface CardTapViewProps {
  isSplitMode: boolean;
  currentPartIndex: number;
  currentPayableAmount: number;
  getOrdinal: (n: number) => string;
  onBack: () => void;
  onCardTapped: () => void;
}

export const CardTapView: React.FC<CardTapViewProps> = ({
  isSplitMode,
  currentPartIndex,
  currentPayableAmount,
  getOrdinal,
  onBack,
  onCardTapped,
}) => {
  const ordinalLabel = getOrdinal(currentPartIndex + 1);

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center gap-5 p-4 animate-fade-in">
      <div className="w-20 h-20 rounded-full bg-indigo-50 border-4 border-indigo-200 flex items-center justify-center text-indigo-600 animate-pulse">
        <CreditCard size={40} />
      </div>
      <div>
        <h4 className="text-lg font-black text-slate-800 mb-1">
          {isSplitMode ? `Tap Card for ${ordinalLabel} Payment` : 'Tap, Swipe or Insert Card'}
        </h4>
        <p className="text-xs text-slate-500 font-semibold font-mono">
          Amount: ${currentPayableAmount.toFixed(2)}
        </p>
      </div>
      <div className="w-full flex gap-3 mt-2">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-3.5 bg-slate-200 text-slate-700 rounded-2xl font-bold text-xs hover:bg-slate-300 transition-all cursor-pointer"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onCardTapped}
          className="flex-[2] py-3.5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-wider text-xs shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 cursor-pointer"
        >
          Simulate Card Tapped ✓
        </button>
      </div>
    </div>
  );
};

interface TipPromptViewProps {
  isSplitMode: boolean;
  currentPartIndex: number;
  currentPayableAmount: number;
  selectedTip: number;
  customTipInput: string;
  selectedMethod: string;
  getOrdinal: (n: number) => string;
  onSetSelectedTip: (val: number) => void;
  onSetCustomTipInput: (val: string) => void;
  onCompletePayment: () => void;
}

export const TipPromptView: React.FC<TipPromptViewProps> = ({
  isSplitMode,
  currentPartIndex,
  currentPayableAmount,
  selectedTip,
  customTipInput,
  getOrdinal,
  onSetSelectedTip,
  onSetCustomTipInput,
  onCompletePayment,
}) => {
  const ordinalLabel = getOrdinal(currentPartIndex + 1);

  return (
    <div className="flex-1 flex flex-col justify-between animate-fade-in">
      <div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 mb-3 text-center text-emerald-800 text-xs font-bold flex items-center justify-center gap-2">
          <CheckCircle size={15} className="text-emerald-600" />
          {isSplitMode
            ? `Card Authorized for ${ordinalLabel} Payment ($${currentPayableAmount.toFixed(2)})`
            : 'Card Authorized • Select Gratuity'}
        </div>
        <div className="grid grid-cols-4 gap-2 mb-3">
          {[15, 18, 20, 25].map((pct) => {
            const tipVal = Math.round(currentPayableAmount * (pct / 100) * 100) / 100;
            const isSelected = selectedTip === tipVal;
            return (
              <button
                key={pct}
                type="button"
                onClick={() => onSetSelectedTip(tipVal)}
                className={`p-2.5 rounded-xl border-2 font-black text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-300'
                }`}
              >
                <div className="text-[10px] opacity-80">{pct}%</div>
                <div className="text-xs font-extrabold">${tipVal.toFixed(2)}</div>
              </button>
            );
          })}
        </div>

        <div className="flex gap-2 mb-2">
          <input
            type="number"
            placeholder="Custom tip ($)"
            value={customTipInput}
            onChange={(e) => {
              onSetCustomTipInput(e.target.value);
              const val = parseFloat(e.target.value);
              onSetSelectedTip(!isNaN(val) && val >= 0 ? val : 0);
            }}
            className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-indigo-500"
          />
          <button
            type="button"
            onClick={() => {
              onSetSelectedTip(0);
              onSetCustomTipInput('');
            }}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
              selectedTip === 0
                ? 'bg-slate-800 text-white border-slate-800'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            No Tip
          </button>
        </div>
      </div>

      <div className="space-y-2 pt-2">
        <button
          type="button"
          onClick={onCompletePayment}
          className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-wider text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all cursor-pointer active:scale-98"
        >
          {isSplitMode
            ? `Complete ${ordinalLabel} Payment • $${(currentPayableAmount + selectedTip).toFixed(2)}`
            : `Complete Payment • $${(currentPayableAmount + selectedTip).toFixed(2)}`}
        </button>
      </div>
    </div>
  );
};

interface GiftCardViewProps {
  isSplitMode: boolean;
  currentPartIndex: number;
  currentPayableAmount: number;
  gcCode: string;
  gcError: string;
  getOrdinal: (n: number) => string;
  onSetGcCode: (val: string) => void;
  onBack: () => void;
  onProcessPay: () => void;
}

export const GiftCardView: React.FC<GiftCardViewProps> = ({
  isSplitMode,
  currentPartIndex,
  currentPayableAmount,
  gcCode,
  gcError,
  getOrdinal,
  onSetGcCode,
  onBack,
  onProcessPay,
}) => {
  const ordinalLabel = getOrdinal(currentPartIndex + 1);

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-5 p-4 animate-fade-in">
      <div className="w-full max-w-sm">
        <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">
          Gift Card Code {isSplitMode && `(For ${ordinalLabel} Payment: $${currentPayableAmount.toFixed(2)})`}
        </label>
        <div className="relative">
          <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            value={gcCode}
            onChange={(e) => onSetGcCode(e.target.value.toUpperCase())}
            className="w-full pl-11 pr-4 py-3.5 bg-white border-2 border-slate-200 rounded-2xl font-black text-base tracking-widest uppercase focus:border-purple-500 outline-none"
            placeholder="1234-5678-9012-3456"
            autoFocus
          />
        </div>
        {gcError && <p className="text-red-500 text-xs font-bold mt-2">{gcError}</p>}
      </div>
      <div className="w-full max-w-sm flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-3 bg-slate-200 text-slate-600 rounded-2xl font-bold text-xs hover:bg-slate-300 transition-all cursor-pointer"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onProcessPay}
          className="flex-[2] py-3 bg-purple-600 text-white rounded-2xl font-black uppercase tracking-wider text-xs shadow-lg hover:bg-purple-700 transition-all cursor-pointer"
        >
          Process Pay
        </button>
      </div>
    </div>
  );
};
