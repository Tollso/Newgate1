import React from 'react';
import { DiningOrderItem } from '../../types';
import { Plus, CheckCircle2 } from 'lucide-react';

interface SplitItemModeProps {
  orderItems: DiningOrderItem[];
  splitChecks: { id: string; name: string; items: { cartId: string; qty: number }[]; paid: boolean }[];
  activeSplitCheckId: string;
  setActiveSplitCheckId: (id: string) => void;
  assignItemToCheck: (cartId: string, qty: number) => void;
  unassignItemFromCheck: (cartId: string, qty: number) => void;
  addSplitCheck: () => void;
  activeSplitCheck: { id: string; name: string; items: { cartId: string; qty: number }[]; paid: boolean } | undefined;
  getCheckBreakdown: (checkSubtotal: number) => {
    subtotal: number;
    serviceFee: number;
    tax: number;
    autoGratuity: number;
    discount: number;
    total: number;
  };
  orderSubtotal: number;
  orderServiceFee: number;
  serviceFeeName?: string;
  setAmountToPay: (val: number) => void;
  setTableCardPaymentStep: (step: 'NONE' | 'TAP' | 'TIP' | 'GIFT_CARD') => void;
  setPaymentMode: (mode: 'SELECT' | 'SPLIT_EVEN' | 'SPLIT_GUEST' | 'SPLIT_ITEM') => void;
  onApplySplit?: (mode: 'SPLIT_ITEM', count: number) => void;
}

export const SplitItemMode: React.FC<SplitItemModeProps> = ({
  orderItems,
  splitChecks,
  activeSplitCheckId,
  setActiveSplitCheckId,
  assignItemToCheck,
  unassignItemFromCheck,
  addSplitCheck,
  activeSplitCheck,
  getCheckBreakdown,
  orderSubtotal,
  orderServiceFee,
  serviceFeeName = 'Service Fee',
  setAmountToPay,
  setTableCardPaymentStep,
  setPaymentMode,
  onApplySplit
}) => {
  const activeSubtotal = activeSplitCheck?.items.reduce((sum, ci) => {
    const originalItem = orderItems.find(i => i.cartId === ci.cartId);
    return sum + ((originalItem ? originalItem.price : 0) * ci.qty);
  }, 0) || 0;

  const activeBreakdown = getCheckBreakdown(activeSubtotal);

  const handleApplyAllItemSplits = () => {
    if (activeBreakdown.total > 0) {
      setAmountToPay(activeBreakdown.total);
    }
    if (onApplySplit) {
      onApplySplit('SPLIT_ITEM', splitChecks.length);
    }
    setTableCardPaymentStep('TAP');
  };

  return (
    <div className="animate-fade-in flex flex-col h-[480px]">
      <div className="flex justify-between items-center bg-slate-50 border border-slate-200 rounded-xl p-3.5 mb-2.5">
        <div>
          <span className="font-bold text-slate-800 text-sm block">Split by Item</span>
          <span className="text-[10px] text-slate-500 font-medium">Assign items to separate checks. Fees & taxes share proportionally.</span>
        </div>
        <button onClick={() => setPaymentMode('SELECT')} className="text-xs font-bold text-slate-500 hover:text-slate-800 bg-slate-200/60 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors">Cancel</button>
      </div>

      <div className="flex-1 flex gap-2.5 overflow-hidden">
        {/* Unassigned Items List */}
        <div className="flex-1 flex flex-col border border-slate-200 rounded-xl overflow-hidden bg-white">
          <div className="bg-slate-100 p-2.5 border-b border-slate-200 font-bold text-[11px] uppercase tracking-wider text-slate-600 flex justify-between items-center">
            <span>Unassigned Items</span>
            {orderServiceFee > 0 && <span className="text-[10px] text-amber-700 font-bold">Fee Included</span>}
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            {orderItems.filter(i => !i.isVoided).map((item) => {
              const assignedQty = splitChecks.reduce((sum, c) => sum + (c.items.find(ci => ci.cartId === item.cartId)?.qty || 0), 0);
              const remainingQty = item.quantity - assignedQty;
              if (remainingQty <= 0) return null;
              const itemFeeShare = orderSubtotal > 0 ? (item.price / orderSubtotal) * orderServiceFee : 0;

              return (
                <div key={item.cartId} onClick={() => assignItemToCheck(item.cartId, 1)} className="p-2 bg-white border border-slate-200 rounded-xl hover:border-indigo-500 cursor-pointer flex justify-between items-center transition-colors shadow-sm">
                  <div>
                    <span className="font-bold text-slate-800 text-xs block">{item.name}</span>
                    <span className="text-[10px] text-slate-500 font-medium">${item.price.toFixed(2)} x {remainingQty}</span>
                    {itemFeeShare > 0 && (
                      <span className="text-[9px] text-amber-700 font-semibold block">
                        +${itemFeeShare.toFixed(2)} {serviceFeeName}
                      </span>
                    )}
                  </div>
                  <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">+</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Split Checks Area */}
        <div className="flex-[1.25] flex flex-col border border-indigo-200 rounded-xl overflow-hidden bg-indigo-50/20">
          <div className="flex border-b border-indigo-200 overflow-x-auto bg-indigo-50/50">
            {splitChecks.map(c => (
              <button key={c.id} onClick={() => setActiveSplitCheckId(c.id)} className={`px-3.5 py-2.5 font-bold text-xs whitespace-nowrap border-b-2 transition-colors ${activeSplitCheckId === c.id ? 'border-indigo-600 text-indigo-700 bg-white' : 'border-transparent text-slate-500 hover:bg-white/50'}`}>
                {c.name} {c.paid && '✓'}
              </button>
            ))}
            <button onClick={addSplitCheck} className="px-3 py-2 text-indigo-600 hover:bg-indigo-100 transition-colors" title="Add Split Check"><Plus size={16} /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            {activeSplitCheck?.items.map(ci => {
              const originalItem = orderItems.find(i => i.cartId === ci.cartId);
              if (!originalItem) return null;
              const ciSubtotal = originalItem.price * ci.qty;
              const ciFeeShare = orderSubtotal > 0 ? (ciSubtotal / orderSubtotal) * orderServiceFee : 0;

              return (
                <div key={ci.cartId} onClick={() => unassignItemFromCheck(ci.cartId, 1)} className={`p-2 bg-white border rounded-xl flex justify-between items-center shadow-sm ${activeSplitCheck.paid ? 'border-slate-200 opacity-70' : 'border-indigo-100 hover:border-red-300 cursor-pointer'}`}>
                  <div className="w-5 h-5 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 mr-1.5 font-bold text-xs">-</div>
                  <div className="flex-1">
                    <span className="font-bold text-slate-800 text-xs block">{originalItem.name}</span>
                    <span className="text-[10px] text-slate-500 font-medium">${originalItem.price.toFixed(2)} x {ci.qty}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-slate-800 text-xs block">${ciSubtotal.toFixed(2)}</span>
                    {ciFeeShare > 0 && <span className="text-[9px] text-amber-700 font-semibold block">+${ciFeeShare.toFixed(2)} fee</span>}
                  </div>
                </div>
              );
            })}
            {activeSplitCheck?.items.length === 0 && (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs font-medium">Tap items on left to add</div>
            )}
          </div>

          <div className="p-2.5 bg-white border-t border-indigo-200 space-y-1.5">
            <div className="space-y-0.5 text-[11px] font-medium text-slate-600">
              <div className="flex justify-between"><span>Items Subtotal</span><span className="font-mono">${activeBreakdown.subtotal.toFixed(2)}</span></div>
              {activeBreakdown.serviceFee > 0 && (
                <div className="flex justify-between text-amber-800 font-bold"><span>{serviceFeeName} share</span><span className="font-mono">+${activeBreakdown.serviceFee.toFixed(2)}</span></div>
              )}
              <div className="flex justify-between text-slate-500"><span>Tax share</span><span className="font-mono">+${activeBreakdown.tax.toFixed(2)}</span></div>
            </div>

            <div className="flex justify-between items-center pt-1 border-t border-slate-100">
              <span className="font-bold text-slate-800 text-xs">Check Total</span>
              <span className="font-black text-lg text-indigo-900">${activeBreakdown.total.toFixed(2)}</span>
            </div>

            <div className="flex flex-col gap-1.5 pt-1">
              {!activeSplitCheck?.paid ? (
                <button
                  type="button"
                  onClick={() => { setAmountToPay(activeBreakdown.total); setTableCardPaymentStep('TAP'); }}
                  disabled={activeBreakdown.total === 0}
                  className="w-full py-2 bg-indigo-600 disabled:bg-indigo-300 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors text-xs shadow"
                >
                  Pay Active Check (${activeBreakdown.total.toFixed(2)})
                </button>
              ) : (
                <div className="w-full py-2 bg-emerald-100 text-emerald-700 rounded-xl font-bold text-center text-xs">Paid ✓</div>
              )}

              <button
                type="button"
                onClick={handleApplyAllItemSplits}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black transition-all text-xs shadow-md flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 size={16} /> Apply Split Across All {splitChecks.length} Checks
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
