import React from 'react';
import { CreditCard, DollarSign, CheckCircle2 } from 'lucide-react';

interface RetailCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  paymentSuccess: boolean;
  onCheckout: (method: 'CARD' | 'CASH') => void;
}

export const RetailCheckoutModal: React.FC<RetailCheckoutModalProps> = ({
  isOpen,
  onClose,
  total,
  paymentSuccess,
  onCheckout,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-5 text-center">
        {paymentSuccess ? (
          <div className="py-8 space-y-3">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full mx-auto flex items-center justify-center">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="text-2xl font-black text-white">Payment Approved</h3>
            <p className="text-xs text-slate-400">Printing receipt and updating inventory ledger...</p>
          </div>
        ) : (
          <>
            <div>
              <h3 className="text-xl font-black text-white">Select Payment Tender</h3>
              <p className="text-xs text-slate-400">Total Amount: ${total.toFixed(2)}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onCheckout('CARD')}
                className="p-5 bg-indigo-600 hover:bg-indigo-500 rounded-xl flex flex-col items-center justify-center gap-2 text-white font-bold transition-transform active:scale-95"
              >
                <CreditCard size={28} />
                <span>Card / EMV</span>
              </button>

              <button
                onClick={() => onCheckout('CASH')}
                className="p-5 bg-emerald-700 hover:bg-emerald-600 rounded-xl flex flex-col items-center justify-center gap-2 text-white font-bold transition-transform active:scale-95"
              >
                <DollarSign size={28} />
                <span>Cash</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 font-bold rounded-xl text-xs"
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
};
