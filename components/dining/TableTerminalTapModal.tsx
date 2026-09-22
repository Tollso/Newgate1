import React, { useState } from 'react';
import { CreditCard, Tag, CheckCircle, X } from 'lucide-react';
import { playBeep } from '../../utils';
import { ReceiptPromptModal } from '../receipt/ReceiptPromptModal';
import { ReceiptOrderContext, ReceiptDeliveryOption } from '../receipt/receiptTypes';

interface TableTerminalTapModalProps {
  tableCardPaymentStep: 'NONE' | 'TAP' | 'TIP' | 'GIFT_CARD';
  setTableCardPaymentStep: (val: 'NONE' | 'TAP' | 'TIP' | 'GIFT_CARD') => void;
  tableSelectedTip: number;
  setTableSelectedTip: (val: number) => void;
  amountToPay: number;
  total: number;
  gcCode: string;
  setGcCode: (code: string) => void;
  gcError: string;
  setGcError: (err: string) => void;
  handleGiftCardPay: () => void;
  handleCloseCheck: (paymentMethod: string, tipAmount?: number, amountPaid?: number) => void;
  paymentMode: string;
  setSplitChecks: React.Dispatch<React.SetStateAction<any[]>>;
  activeSplitCheckId: string;
  setShowPayment: (val: boolean) => void;
  tableName?: string;
}

export const TableTerminalTapModal: React.FC<TableTerminalTapModalProps> = ({
  tableCardPaymentStep, setTableCardPaymentStep, tableSelectedTip, setTableSelectedTip,
  amountToPay, total, gcCode, setGcCode, gcError, setGcError, handleGiftCardPay,
  handleCloseCheck, paymentMode, setSplitChecks, activeSplitCheckId, setShowPayment, tableName
}) => {
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const receiptContext: ReceiptOrderContext = {
    total: amountToPay + tableSelectedTip,
    subtotal: amountToPay,
    tip: tableSelectedTip,
    paymentMethod: 'Card',
    tableTentOrName: tableName ? `Table ${tableName}` : 'Dining Table',
    appName: 'Dining App'
  };

  const handleFinishCardPayment = (_option: ReceiptDeliveryOption) => {
    setShowReceiptModal(false);
    handleCloseCheck('Card', tableSelectedTip, amountToPay);
    if (amountToPay < total - 0.01) {
      setTableCardPaymentStep('NONE');
      setTableSelectedTip(0);
      if (paymentMode === 'SPLIT_ITEM') {
        setSplitChecks(checks => checks.map(c => c.id === activeSplitCheckId ? { ...c, paid: true } : c));
      }
    } else {
      setShowPayment(false);
    }
  };

  if (showReceiptModal) {
    return (
      <ReceiptPromptModal
        isOpen={showReceiptModal}
        orderContext={receiptContext}
        onComplete={handleFinishCardPayment}
        onClose={() => handleFinishCardPayment('NONE')}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm animate-fade-in p-4">
      <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl animate-scale-in">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-black text-slate-800 uppercase tracking-wide">
            {tableCardPaymentStep === 'TAP' ? 'Terminal Card Tap' : tableCardPaymentStep === 'GIFT_CARD' ? 'Gift Card Pay' : 'Select Gratuity'}
          </h3>
          <button onClick={() => { playBeep('error'); setTableCardPaymentStep('NONE'); setTableSelectedTip(0); }} className="p-1 hover:bg-slate-100 rounded-full cursor-pointer">
            <X size={24} className="text-slate-400 hover:text-slate-600" />
          </button>
        </div>

        {tableCardPaymentStep === 'GIFT_CARD' ? (
          <div className="flex flex-col items-center justify-center gap-6 py-6">
            <div className="w-full">
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Enter 16-Digit Gift Card Code</label>
              <div className="relative">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="text" value={gcCode} onChange={(e) => { setGcCode(e.target.value.toUpperCase()); setGcError(''); }}
                  className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-200 rounded-2xl font-black text-lg tracking-widest uppercase focus:border-indigo-500 outline-none"
                  placeholder="1234-5678-9012-3456" autoFocus
                />
              </div>
              {gcError && <p className="text-red-500 text-sm font-bold mt-2 animate-shake">{gcError}</p>}
            </div>
            
            <div className="w-full flex gap-3">
              <button onClick={() => { setTableCardPaymentStep('NONE'); setShowPayment(true); }} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-slate-200 cursor-pointer">Back</button>
              <button onClick={handleGiftCardPay} className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-lg hover:bg-indigo-700 cursor-pointer">Process Pay</button>
            </div>
          </div>
        ) : tableCardPaymentStep === 'TAP' ? (
          <div className="flex flex-col items-center justify-center text-center gap-6 py-6">
            <div className="w-24 h-24 rounded-full bg-indigo-50 border-4 border-indigo-200 flex items-center justify-center text-indigo-600 animate-pulse">
              <CreditCard size={48} />
            </div>
            <div>
              <h4 className="text-xl font-black text-slate-800 mb-1">Tap, Swipe or Insert Card</h4>
              <p className="text-xs text-slate-500 font-medium">Paying ${amountToPay.toFixed(2)}</p>
            </div>
            <button 
              onClick={() => { playBeep('success'); setTableCardPaymentStep('TIP'); }}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl hover:bg-indigo-700 cursor-pointer"
            >
              Simulate Card Tapped ✓
            </button>
          </div>
        ) : (
          <div className="flex flex-col justify-between space-y-6">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 text-center text-emerald-800 text-xs font-bold flex items-center justify-center gap-2">
              <CheckCircle size={16} className="text-emerald-600" /> Card Approved • Add Tip
            </div>
            <div className="text-center py-2 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Amount Paid</span>
              <span className="text-3xl font-black text-slate-900">${amountToPay.toFixed(2)}</span>
              {tableSelectedTip > 0 && (
                <span className="text-xs font-bold text-indigo-600 block mt-1">+ ${tableSelectedTip.toFixed(2)} Tip = ${(amountToPay + tableSelectedTip).toFixed(2)}</span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[15, 18, 20, 25].map(pct => {
                const tipVal = Math.round(amountToPay * (pct / 100) * 100) / 100;
                const isSelected = tableSelectedTip === tipVal;
                return (
                  <button
                    key={pct}
                    onClick={() => setTableSelectedTip(tipVal)}
                    className={`p-4 rounded-2xl border-2 font-black text-center transition-all cursor-pointer ${isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200 text-slate-700'}`}
                  >
                    <div className="text-xs opacity-80">{pct}% Tip</div>
                    <div className="text-base font-black">${tipVal.toFixed(2)}</div>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => {
                playBeep('success');
                setShowReceiptModal(true);
              }}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl hover:bg-indigo-700 cursor-pointer"
            >
              Complete Payment (${(amountToPay + tableSelectedTip).toFixed(2)})
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
