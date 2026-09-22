import React from 'react';
import { DiningOrderItem } from '../../types';
import { CheckCircle2, Users } from 'lucide-react';

interface SplitGuestModeProps {
  guests: { id: number; name?: string }[];
  orderItems: DiningOrderItem[];
  getCheckBreakdown: (checkSubtotal: number) => {
    subtotal: number;
    serviceFee: number;
    tax: number;
    autoGratuity: number;
    discount: number;
    total: number;
  };
  serviceFeeName?: string;
  setAmountToPay: (val: number) => void;
  setTableCardPaymentStep: (step: 'NONE' | 'TAP' | 'TIP' | 'GIFT_CARD') => void;
  setPaymentMode: (mode: 'SELECT' | 'SPLIT_EVEN' | 'SPLIT_GUEST' | 'SPLIT_ITEM') => void;
  onApplySplit?: (mode: 'SPLIT_GUEST', count: number) => void;
}

export const SplitGuestMode: React.FC<SplitGuestModeProps> = ({
  guests,
  orderItems,
  getCheckBreakdown,
  serviceFeeName = 'Service Fee',
  setAmountToPay,
  setTableCardPaymentStep,
  setPaymentMode,
  onApplySplit
}) => {
  const guestBreakdowns = guests.map(g => {
    const guestItems = orderItems.filter(i => i.seatNumber === g.id && !i.isVoided);
    const guestSubtotal = guestItems.reduce((acc, i) => acc + (i.price * i.quantity), 0);
    const sharedSubtotal = orderItems.filter(i => i.seatNumber === 0 && !i.isVoided).reduce((acc, i) => acc + (i.price * i.quantity), 0);
    const sharedPerGuest = guests.length > 0 ? (sharedSubtotal / guests.length) : 0;
    const totalGuestSubtotal = guestSubtotal + sharedPerGuest;
    const breakdown = getCheckBreakdown(totalGuestSubtotal);
    return { guest: g, itemsCount: guestItems.length, breakdown };
  });

  const handleApplySplitAll = () => {
    if (guestBreakdowns.length > 0) {
      setAmountToPay(guestBreakdowns[0].breakdown.total);
    }
    if (onApplySplit) {
      onApplySplit('SPLIT_GUEST', guests.length);
    }
    setTableCardPaymentStep('TAP');
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
        {guestBreakdowns.map(({ guest: g, itemsCount, breakdown }) => (
          <div key={g.id} className="p-3.5 border border-slate-200 rounded-2xl bg-slate-50/80 space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-900 block text-sm">{g.name || `Guest ${g.id}`}</span>
                <span className="text-[11px] font-semibold text-slate-500">{itemsCount} items + shared share</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono font-black text-base text-emerald-700">${breakdown.total.toFixed(2)}</span>
                <button
                  type="button"
                  onClick={() => {
                    setAmountToPay(breakdown.total);
                    setTableCardPaymentStep('TAP');
                  }}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-sm transition-all"
                >
                  Pay Guest
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/60 grid grid-cols-2 text-[11px] font-medium text-slate-500 gap-y-0.5">
              <div>Subtotal: <span className="font-mono text-slate-700">${breakdown.subtotal.toFixed(2)}</span></div>
              <div>Tax share: <span className="font-mono text-slate-700">${breakdown.tax.toFixed(2)}</span></div>
              {breakdown.serviceFee > 0 && (
                <div className="col-span-2 text-amber-700 font-semibold flex justify-between">
                  <span>{serviceFeeName} share:</span>
                  <span className="font-mono">+${breakdown.serviceFee.toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2 space-y-2 border-t border-slate-100">
        <button
          type="button"
          onClick={handleApplySplitAll}
          className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 transition-all active:scale-98 text-sm"
        >
          <CheckCircle2 size={18} /> Apply Split to All {guests.length} Guest Invoices
        </button>

        <button
          type="button"
          onClick={() => setPaymentMode('SELECT')}
          className="w-full py-3 bg-slate-100 font-bold rounded-2xl text-slate-500 hover:bg-slate-200 text-xs transition-colors"
        >
          Back to Payment Modes
        </button>
      </div>
    </div>
  );
};
