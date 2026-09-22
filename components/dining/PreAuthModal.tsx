import React, { useState } from 'react';
import { ShieldCheck, X } from 'lucide-react';
import { PreAuthSuccessView } from './pre_auth/PreAuthSuccessView';
import { PreAuthCardForm } from './pre_auth/PreAuthCardForm';

export interface PreAuthData {
  amount: number;
  cardLast4: string;
  cardName?: string;
  cardBrand?: string;
  isCardStored?: boolean;
}

interface PreAuthModalProps {
  tableName: string;
  onAddPreAuth: (data: PreAuthData) => void;
  onClose: () => void;
}

export const PreAuthModal: React.FC<PreAuthModalProps> = ({
  tableName,
  onAddPreAuth,
  onClose,
}) => {
  const [amount, setAmount] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [cardLast4, setCardLast4] = useState<string>('4242');
  const [cardName, setCardName] = useState<string>('Alex Johnson');
  const [cardBrand, setCardBrand] = useState<string>('Visa');
  const [storeCardData, setStoreCardData] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const presetAmounts = [25, 50, 100, 200];

  const handleProcess = () => {
    const finalAmount = customAmount ? parseFloat(customAmount) : amount;
    if (!finalAmount || finalAmount <= 0) return;

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        onAddPreAuth({
          amount: finalAmount,
          cardLast4: cardLast4 || '4242',
          cardName: cardName || 'Guest',
          cardBrand,
          isCardStored: storeCardData
        });
        onClose();
      }, 900);
    }, 1000);
  };

  const finalAmount = customAmount ? parseFloat(customAmount) : amount;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/70 backdrop-blur-sm animate-fade-in text-slate-800 p-4">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl animate-scale-in relative overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 className="font-black text-xl text-slate-900">Pre-Auth Hold</h3>
              <p className="text-xs font-bold text-slate-400">Table {tableName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {isSuccess ? (
          <PreAuthSuccessView
            finalAmount={finalAmount}
            cardBrand={cardBrand}
            cardLast4={cardLast4}
            storeCardData={storeCardData}
          />
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Select Pre-Auth Amount
              </label>
              <div className="grid grid-cols-4 gap-2 mb-2">
                {presetAmounts.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setAmount(preset);
                      setCustomAmount('');
                    }}
                    className={`py-2.5 rounded-xl font-black text-sm border-2 transition-all ${
                      amount === preset && !customAmount
                        ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    ${preset}
                  </button>
                ))}
              </div>
              <input
                type="number"
                placeholder="Custom Pre-Auth Amount ($)"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 text-sm"
              />
            </div>

            <PreAuthCardForm
              cardName={cardName}
              setCardName={setCardName}
              cardLast4={cardLast4}
              setCardLast4={setCardLast4}
              cardBrand={cardBrand}
              setCardBrand={setCardBrand}
              storeCardData={storeCardData}
              setStoreCardData={setStoreCardData}
              tableName={tableName}
            />

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-2xl transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleProcess}
                disabled={isProcessing}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-300 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-900/20 text-sm flex items-center justify-center gap-2"
              >
                {isProcessing ? 'Processing...' : `Hold $${finalAmount.toFixed(2)}`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
