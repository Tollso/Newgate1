import React from 'react';
import { CreditCard, SplitSquareHorizontal, Percent, ShieldCheck, QrCode } from 'lucide-react';

interface OrderDropdownPaymentsProps {
  onPayEntireBill: () => void;
  onSplitBill: () => void;
  onApplyDiscount?: () => void;
  onAddPreAuth: () => void;
  onPrintQrCode: () => void;
  handleAction: (action: () => void) => void;
}

export const OrderDropdownPayments: React.FC<OrderDropdownPaymentsProps> = ({
  onPayEntireBill,
  onSplitBill,
  onApplyDiscount,
  onAddPreAuth,
  onPrintQrCode,
  handleAction,
}) => {
  return (
    <div>
      <div className="px-3 py-1 text-[11px] font-black uppercase tracking-wider text-indigo-400">
        Payments
      </div>
      <div className="space-y-0.5 mt-0.5">
        <button
          onClick={() => handleAction(onPayEntireBill)}
          className="w-full text-left px-3 py-2 text-xs font-bold hover:bg-slate-800 rounded-xl flex items-center gap-2.5 text-slate-200 hover:text-white transition-colors"
        >
          <CreditCard size={15} className="text-emerald-400" /> Pay Entire Bill
        </button>
        <button
          onClick={() => handleAction(onSplitBill)}
          className="w-full text-left px-3 py-2 text-xs font-bold hover:bg-slate-800 rounded-xl flex items-center gap-2.5 text-slate-200 hover:text-white transition-colors"
        >
          <SplitSquareHorizontal size={15} className="text-indigo-400" /> Split the Bill
        </button>
        <button
          onClick={() => handleAction(onApplyDiscount || onPayEntireBill)}
          className="w-full text-left px-3 py-2 text-xs font-bold hover:bg-slate-800 rounded-xl flex items-center gap-2.5 text-slate-200 hover:text-white transition-colors"
        >
          <Percent size={15} className="text-teal-400" /> Apply Discount
        </button>
        <button
          onClick={() => handleAction(onAddPreAuth)}
          className="w-full text-left px-3 py-2 text-xs font-bold hover:bg-slate-800 rounded-xl flex items-center gap-2.5 text-slate-200 hover:text-white transition-colors"
        >
          <ShieldCheck size={15} className="text-blue-400" /> Add Pre-Auth
        </button>
        <button
          onClick={() => handleAction(onPrintQrCode)}
          className="w-full text-left px-3 py-2 text-xs font-bold hover:bg-slate-800 rounded-xl flex items-center gap-2.5 text-slate-200 hover:text-white transition-colors"
        >
          <QrCode size={15} className="text-amber-400" /> Print QR Code
        </button>
      </div>
    </div>
  );
};
