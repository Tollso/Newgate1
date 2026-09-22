import React, { useState } from 'react';
import { CreditCard, DollarSign, Tag, DivideSquare, Users, Utensils, ShieldCheck, Database } from 'lucide-react';
import { playBeep } from '../../../utils';
import { PreAuthData } from '../PreAuthModal';
import { SplitCheckItem } from './TablePaymentModalTypes';

interface TablePaymentSelectModeProps {
  preAuthInfo?: PreAuthData | null;
  finalTotal: number;
  total: number;
  handleCloseCheck: (paymentMethod: string, tipAmount?: number, amountPaid?: number) => void;
  setAmountToPay: (val: number) => void;
  setTableCardPaymentStep: (val: 'NONE' | 'TAP' | 'TIP' | 'GIFT_CARD') => void;
  setPaymentMode: (mode: 'SELECT' | 'SPLIT_EVEN' | 'SPLIT_GUEST' | 'SPLIT_ITEM') => void;
  paymentMode: 'SELECT' | 'SPLIT_EVEN' | 'SPLIT_GUEST' | 'SPLIT_ITEM';
  setSplitChecks: React.Dispatch<React.SetStateAction<SplitCheckItem[]>>;
  activeSplitCheckId: string;
}

export const TablePaymentSelectMode: React.FC<TablePaymentSelectModeProps> = ({
  preAuthInfo,
  finalTotal,
  total,
  handleCloseCheck,
  setAmountToPay,
  setTableCardPaymentStep,
  setPaymentMode,
  paymentMode,
  setSplitChecks,
  activeSplitCheckId,
}) => {
  const [customPayMode, setCustomPayMode] = useState<'FULL' | 'CUSTOM'>('FULL');
  const [customPayInput, setCustomPayInput] = useState<string>('');

  const parsedCustom = parseFloat(customPayInput);
  const currentEffectivePay =
    customPayMode === 'CUSTOM' && !isNaN(parsedCustom) && parsedCustom > 0
      ? Math.min(finalTotal, Math.round(parsedCustom * 100) / 100)
      : finalTotal;

  return (
    <div className="space-y-5">
      {preAuthInfo && (
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 border-2 border-blue-500/50 rounded-2xl p-4 shadow-xl text-white relative overflow-hidden animate-fade-in-down">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-blue-400" size={20} />
              <span className="font-black text-xs uppercase tracking-wider text-blue-300">Pre-Auth Card on File</span>
            </div>
            {preAuthInfo.isCardStored && (
              <span className="px-2.5 py-0.5 bg-blue-500/30 text-blue-200 border border-blue-400/30 rounded-full text-[10px] font-bold flex items-center gap-1">
                <Database size={11} /> Card Stored
              </span>
            )}
          </div>
          <div className="flex justify-between items-center my-1">
            <div>
              <p className="text-lg font-black tracking-wide font-mono text-white">**** **** **** {preAuthInfo.cardLast4}</p>
              <p className="text-xs font-semibold text-slate-300">{preAuthInfo.cardName || 'Guest'} • {preAuthInfo.cardBrand || 'Visa'}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-slate-400">Hold Amount</p>
              <p className="text-base font-black text-blue-300">${preAuthInfo.amount.toFixed(2)}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              playBeep('success');
              handleCloseCheck(`Pre-Auth Card (**** ${preAuthInfo.cardLast4})`, 0, finalTotal);
            }}
            className="w-full mt-3 py-3 bg-blue-600 hover:bg-blue-500 text-white font-black text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <CreditCard size={18} /> Pay ${finalTotal.toFixed(2)} with Pre-Auth Card
          </button>
        </div>
      )}

      <div className="bg-slate-100 p-1 rounded-2xl flex gap-1 mb-4">
        <button
          type="button"
          onClick={() => { setCustomPayMode('FULL'); setCustomPayInput(''); }}
          className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
            customPayMode === 'FULL' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Full Balance (${finalTotal.toFixed(2)})
        </button>
        <button
          type="button"
          onClick={() => setCustomPayMode('CUSTOM')}
          className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
            customPayMode === 'CUSTOM' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Custom Amount
        </button>
      </div>

      {customPayMode === 'CUSTOM' ? (
        <div className="bg-indigo-50/50 border border-indigo-200 rounded-2xl p-4 mb-4 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-slate-700">Custom amount to pay:</span>
            <span className="font-mono text-slate-500">Balance: ${finalTotal.toFixed(2)}</span>
          </div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-400">$</span>
            <input
              type="number" step="0.01" min="0.01" max={finalTotal} placeholder="0.00"
              value={customPayInput} onChange={(e) => setCustomPayInput(e.target.value)}
              className="w-full bg-white border-2 border-indigo-200 focus:border-indigo-600 rounded-xl pl-10 pr-4 py-3 text-2xl font-black text-slate-900 outline-none transition-all shadow-inner"
            />
          </div>
          <div className="flex gap-2">
            {[10, 20, 50].map((preset) => (
              <button
                key={preset} type="button" onClick={() => setCustomPayInput(Math.min(finalTotal, preset).toFixed(2))}
                className="px-3 py-1.5 bg-white border border-slate-200 hover:border-indigo-400 text-xs font-black rounded-lg text-slate-700 transition-colors"
              >
                ${preset}
              </button>
            ))}
            <button
              type="button" onClick={() => setCustomPayInput((finalTotal / 2).toFixed(2))}
              className="px-3 py-1.5 bg-white border border-slate-200 hover:border-indigo-400 text-xs font-black rounded-lg text-slate-700 transition-colors"
            >
              50% (${(finalTotal / 2).toFixed(2)})
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center bg-slate-50 border border-slate-200 rounded-2xl py-6 mb-4">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Total Balance</p>
          <p className="text-4xl font-black text-slate-900">${finalTotal.toFixed(2)}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => { setAmountToPay(currentEffectivePay); setTableCardPaymentStep('TAP'); }}
          className="py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <CreditCard size={20} /> Pay ${currentEffectivePay.toFixed(2)} by Card
        </button>
        <button
          onClick={() => {
            setAmountToPay(currentEffectivePay);
            handleCloseCheck('Cash', 0, currentEffectivePay);
            if (currentEffectivePay < total - 0.01) {
              setTableCardPaymentStep('NONE');
              if (paymentMode === 'SPLIT_ITEM') {
                setSplitChecks((checks) => checks.map((c) => c.id === activeSplitCheckId ? { ...c, paid: true } : c));
              }
            }
          }}
          className="py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-100 flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <DollarSign size={20} /> Pay ${currentEffectivePay.toFixed(2)} by Cash
        </button>
        <button
          onClick={() => { setAmountToPay(currentEffectivePay); setTableCardPaymentStep('GIFT_CARD'); }}
          className="col-span-2 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl flex items-center justify-center gap-2 transition-all text-sm"
        >
          <Tag size={18} /> Gift Card / Store Credit
        </button>
      </div>

      <div className="border-t border-slate-100 pt-5 mt-5">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Split Options</p>
        <div className="grid grid-cols-3 gap-3">
          <button onClick={() => setPaymentMode('SPLIT_EVEN')} className="p-3.5 border-2 border-slate-100 hover:border-indigo-500 rounded-2xl flex flex-col items-center justify-center gap-2 transition-colors group text-slate-600 hover:text-indigo-600">
            <DivideSquare size={22} className="text-slate-400 group-hover:text-indigo-500" />
            <span className="text-xs font-bold">Split Evenly</span>
          </button>
          <button onClick={() => setPaymentMode('SPLIT_GUEST')} className="p-3.5 border-2 border-slate-100 hover:border-indigo-500 rounded-2xl flex flex-col items-center justify-center gap-2 transition-colors group text-slate-600 hover:text-indigo-600">
            <Users size={22} className="text-slate-400 group-hover:text-indigo-500" />
            <span className="text-xs font-bold">By Guest</span>
          </button>
          <button onClick={() => setPaymentMode('SPLIT_ITEM')} className="p-3.5 border-2 border-slate-100 hover:border-indigo-500 rounded-2xl flex flex-col items-center justify-center gap-2 transition-colors group text-slate-600 hover:text-indigo-600">
            <Utensils size={22} className="text-slate-400 group-hover:text-indigo-500" />
            <span className="text-xs font-bold">By Item</span>
          </button>
        </div>
      </div>
    </div>
  );
};
