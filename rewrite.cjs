const fs = require('fs');

const content = `import React, { useState } from 'react';
import { DiningTable } from '../../types';
import { X, CreditCard, DollarSign, Tag, SplitSquareHorizontal, Percent, CheckCircle } from 'lucide-react';
import { playBeep } from '../../utils';

interface TableServicePaymentModalProps {
  showPayment: boolean;
  setShowPayment: (val: boolean) => void;
  tableCardPaymentStep: 'NONE' | 'TAP' | 'TIP' | 'GIFT_CARD';
  setTableCardPaymentStep: (val: 'NONE' | 'TAP' | 'TIP' | 'GIFT_CARD') => void;
  tableSelectedTip: number;
  setTableSelectedTip: (val: number) => void;
  tableCustomTipInput: string;
  setTableCustomTipInput: (val: string) => void;
  total: number;
  activeTable: DiningTable | undefined;
  billDiscount: { type: 'Percentage' | 'Fixed'; value: number; name: string } | null;
  setShowDiscountModal: (val: boolean) => void;
  handleCloseCheck: (paymentMethod: string, tipAmount?: number) => void;
  handleSplitCheck: () => void;
  giftCards?: any[];
  setGiftCards?: any;
}

export const TableServicePaymentModal: React.FC<TableServicePaymentModalProps> = ({
  showPayment,
  setShowPayment,
  tableCardPaymentStep,
  setTableCardPaymentStep,
  tableSelectedTip,
  setTableSelectedTip,
  tableCustomTipInput,
  setTableCustomTipInput,
  total,
  activeTable,
  billDiscount,
  setShowDiscountModal,
  handleCloseCheck,
  handleSplitCheck,
  giftCards = [],
  setGiftCards
}) => {
  const [gcCode, setGcCode] = useState('');
  const [gcError, setGcError] = useState('');

  const finalTotal = total + tableSelectedTip;

  const handleGiftCardPay = () => {
    setGcError('');
    if (!gcCode.trim()) {
      setGcError('Please enter a gift card code');
      playBeep('error');
      return;
    }
    const gc = giftCards.find(g => g.code === gcCode.trim());
    if (!gc) {
      setGcError('Gift card not found');
      playBeep('error');
      return;
    }
    if (gc.status !== 'Active') {
      setGcError(\`Gift card is \${gc.status}\`);
      playBeep('error');
      return;
    }
    if (gc.balance < finalTotal) {
      setGcError(\`Insufficient funds (Balance: $\${gc.balance.toFixed(2)})\`);
      playBeep('error');
      return;
    }
    
    // Deduct
    if (setGiftCards) {
      const updated = giftCards.map(g => {
        if (g.id === gc.id) {
          const newBal = g.balance - finalTotal;
          return { ...g, balance: newBal, status: newBal <= 0 ? 'Redeemed' : 'Active' };
        }
        return g;
      });
      setGiftCards(updated);
    }
    
    playBeep('success');
    handleCloseCheck('Gift Card', tableSelectedTip);
  };

  if (!showPayment && tableCardPaymentStep === 'NONE') {
    return null;
  }

  if (showPayment) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm animate-fade-in">
        <div className="bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl animate-scale-in">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-slate-900">\${total.toFixed(2)}</h2>
            <p className="text-slate-500 font-medium">Total Due for Table {activeTable?.name}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            {['Card', 'Cash', 'Gift Card'].map(m => (
              <button 
                key={m} 
                onClick={() => {
                  if (m === 'Card') {
                    setShowPayment(false);
                    setTableCardPaymentStep('TAP');
                  } else if (m === 'Gift Card') {
                    setShowPayment(false);
                    setTableCardPaymentStep('GIFT_CARD');
                  } else {
                    handleCloseCheck(m, 0);
                  }
                }} 
                className="p-6 border border-slate-200 rounded-2xl font-bold text-slate-700 hover:border-slate-400 hover:bg-slate-50 hover:text-slate-900 transition-all flex flex-col items-center gap-3"
              >
                {m === 'Card' ? <CreditCard size={28} className="text-slate-500" /> : m === 'Cash' ? <DollarSign size={28} className="text-emerald-500" /> : <Tag size={28} className="text-indigo-500" />}
                <span className="font-bold text-sm">{m}</span>
              </button>
            ))}
            <button onClick={handleSplitCheck} className="p-6 border border-slate-200 rounded-2xl font-bold text-slate-700 hover:border-slate-400 hover:bg-slate-50 hover:text-slate-900 transition-all flex flex-col items-center gap-3">
              <SplitSquareHorizontal size={28} className="text-amber-500" />
              <span className="font-bold text-sm">Split Bill</span>
            </button>
          </div>
          <div className="mb-8">
            <button 
              onClick={() => setShowDiscountModal(true)}
              className={\`w-full py-4 border rounded-2xl font-bold transition-all flex items-center justify-center gap-2 \${billDiscount ? 'bg-emerald-50 border-emerald-200 text-emerald-800 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-100'}\`}
            >
              <Percent size={20} />
              <span className="text-sm font-semibold">{billDiscount ? \`Discount Applied: \${billDiscount.name}\` : 'Apply Bill Discount'}</span>
            </button>
          </div>
          <button onClick={() => { playBeep('error'); setShowPayment(false); }} className="w-full py-4 font-bold text-slate-500 hover:text-slate-800 text-sm">Cancel Payment</button>
        </div>
      </div>
    );
  }

  if (tableCardPaymentStep !== 'NONE') {
    return (
      <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm animate-fade-in">
        <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl animate-scale-in">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-black text-slate-800 uppercase tracking-wide">
              {tableCardPaymentStep === 'TAP' ? 'Terminal Card Tap' : tableCardPaymentStep === 'GIFT_CARD' ? 'Gift Card Pay' : 'Select Gratuity'}
            </h3>
            <button onClick={() => { playBeep('error'); setTableCardPaymentStep('NONE'); setTableSelectedTip(0); }}>
              <X size={24} className="text-slate-400 hover:text-slate-600" />
            </button>
          </div>

          {tableCardPaymentStep === 'GIFT_CARD' ? (
            <div className="flex flex-col items-center justify-center gap-6 py-6">
              <div className="w-full">
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Enter Gift Card Code</label>
                <div className="relative">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    type="text" 
                    value={gcCode}
                    onChange={(e) => { setGcCode(e.target.value.toUpperCase()); setGcError(''); }}
                    className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-200 rounded-2xl font-black text-lg tracking-widest uppercase focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
                    placeholder="GC-XXXX-XXXX-XXXX"
                    autoFocus
                  />
                </div>
                {gcError && (
                  <p className="text-red-500 text-sm font-bold mt-2 animate-shake">{gcError}</p>
                )}
              </div>
              
              <div className="text-center w-full py-3 bg-slate-50 rounded-2xl border border-slate-200 mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Total Due</span>
                <span className="text-2xl font-black text-slate-900">\${finalTotal.toFixed(2)}</span>
              </div>
              
              <div className="w-full flex gap-3">
                <button 
                  onClick={() => { setTableCardPaymentStep('NONE'); setShowPayment(true); }}
                  className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-slate-200 transition-all active:scale-95"
                >
                  Back
                </button>
                <button 
                  onClick={handleGiftCardPay}
                  className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
                >
                  Process Pay
                </button>
              </div>
            </div>
          ) : tableCardPaymentStep === 'TAP' ? (
            <div className="flex flex-col items-center justify-center text-center gap-6 py-6">
              <div className="w-24 h-24 rounded-full bg-indigo-50 border-4 border-indigo-200 flex items-center justify-center text-indigo-600 animate-pulse">
                <CreditCard size={48} />
              </div>
              <div>
                <h4 className="text-xl font-black text-slate-800 mb-1">Tap, Swipe or Insert Card</h4>
                <p className="text-xs text-slate-500 font-medium">Card Reader Active • Table {activeTable?.name} (\${total.toFixed(2)})</p>
              </div>
              <button 
                onClick={() => { playBeep('success'); setTableCardPaymentStep('TIP'); }}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
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
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Bill Total</span>
                <span className="text-3xl font-black text-slate-900">\${total.toFixed(2)}</span>
                {tableSelectedTip > 0 && (
                  <span className="text-xs font-bold text-indigo-600 block mt-1">+ \${tableSelectedTip.toFixed(2)} Tip = \${(total + tableSelectedTip).toFixed(2)}</span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[15, 18, 20, 25].map(pct => {
                  const tipVal = Math.round(total * (pct / 100) * 100) / 100;
                  const isSelected = tableSelectedTip === tipVal;
                  return (
                    <button
                      key={pct}
                      onClick={() => setTableSelectedTip(tipVal)}
                      className={\`p-4 rounded-2xl border-2 font-black text-center transition-all \${isSelected ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-300'}\`}
                    >
                      <div className="text-xs opacity-80">{pct}% Tip</div>
                      <div className="text-base font-black">\${tipVal.toFixed(2)}</div>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-slate-500 whitespace-nowrap">Custom $</span>
                <input
                  type="number"
                  value={tableCustomTipInput}
                  onChange={(e) => {
                    setTableCustomTipInput(e.target.value);
                    setTableSelectedTip(Number(e.target.value));
                  }}
                  className="w-full p-4 border-2 border-slate-200 rounded-2xl font-black text-lg focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
                  placeholder="0.00"
                />
              </div>

              <button
                onClick={() => {
                  playBeep('success');
                  handleCloseCheck('Card', tableSelectedTip);
                }}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
              >
                Complete Payment (\${(total + tableSelectedTip).toFixed(2)})
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};
`;

fs.writeFileSync('components/dining/TableServicePaymentModal.tsx', content);
