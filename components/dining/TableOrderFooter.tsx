import React from 'react';
import { Printer, Flame, CreditCard, MoreHorizontal } from 'lucide-react';
import { OrderOptionsDropdown } from './OrderOptionsDropdown';
import { DiningOrderItem } from '../../types';

interface TableOrderFooterProps {
  onOpenPayment: (initialMode?: 'SELECT' | 'SPLIT_EVEN' | 'SPLIT_GUEST' | 'SPLIT_ITEM') => void;
  onFire: () => void;
  subtotal: number;
  tax: number;
  total: number;
  isAllFired: boolean;
  handlePrintBill: () => void;
  autoGratuityApplied?: boolean;
  autoGratuityAmount?: number;
  serviceFeeApplied?: boolean;
  serviceFeeAmount?: number;
  // Options Dropdown props
  showOrderOptions: boolean;
  setShowOrderOptions: (show: boolean) => void;
  setActiveModal: (modal: 'PRE_AUTH' | 'QR_CODE' | 'PRINT_BILL' | 'PRINT_INDIVIDUAL' | 'MOVE_ORDER' | 'COMBINE_ORDERS' | 'TRANSFER_SERVER' | 'DELETE_ORDER' | null) => void;
  onUpdateOrderItems: (items: DiningOrderItem[]) => void;
  orderItems: DiningOrderItem[];
  showNotice: (msg: string) => void;
  onToggleAutoGratuity?: () => void;
  autoGratuityRate?: number;
  onToggleServiceFee?: () => void;
  serviceFeeName?: string;
  serviceFeeValue?: number;
  serviceFeeType?: 'Percentage' | 'Fixed';
  onOpenSettings?: () => void;
}

export const TableOrderFooter: React.FC<TableOrderFooterProps> = ({
  onOpenPayment,
  onFire,
  subtotal,
  tax,
  total,
  isAllFired,
  handlePrintBill,
  autoGratuityApplied = false,
  autoGratuityAmount = 0,
  serviceFeeApplied = false,
  serviceFeeAmount = 0,
  showOrderOptions,
  setShowOrderOptions,
  setActiveModal,
  onUpdateOrderItems,
  orderItems,
  showNotice,
  onToggleAutoGratuity,
  autoGratuityRate = 18,
  onToggleServiceFee,
  serviceFeeName = 'Service Fee',
  serviceFeeValue = 3.5,
  serviceFeeType = 'Percentage',
  onOpenSettings
}) => {
  return (
    <div className="p-4 border-t border-slate-800 bg-slate-950 flex flex-col gap-3 shrink-0 relative text-slate-100">
      {/* Subtotal & Totals Summary Card */}
      <div className="flex justify-between items-center text-slate-400 px-3 py-2.5 bg-slate-900/90 rounded-2xl border border-slate-800 text-xs">
         <div>
           <p className="font-bold uppercase tracking-wider mb-0.5 text-[9px] text-slate-500">Subtotal</p>
           <p className="font-mono font-bold text-slate-200">${subtotal.toFixed(2)}</p>
         </div>
         <div>
           <p className="font-bold uppercase tracking-wider mb-0.5 text-[9px] text-slate-500">Tax</p>
           <p className="font-mono font-bold text-slate-200">${tax.toFixed(2)}</p>
         </div>
         {autoGratuityApplied && autoGratuityAmount > 0 && (
           <div>
             <p className="font-bold uppercase tracking-wider mb-0.5 text-[9px] text-amber-400">Gratuity</p>
             <p className="font-mono font-bold text-amber-300">${autoGratuityAmount.toFixed(2)}</p>
           </div>
         )}
         {serviceFeeApplied && serviceFeeAmount > 0 && (
           <div>
             <p className="font-bold uppercase tracking-wider mb-0.5 text-[9px] text-indigo-400">Service Fee</p>
             <p className="font-mono font-bold text-indigo-300">${serviceFeeAmount.toFixed(2)}</p>
           </div>
         )}
         <div className="text-right pl-3 border-l border-slate-800">
           <p className="font-bold uppercase tracking-wider mb-0.5 text-[9px] text-slate-400">Total</p>
           <p className="font-mono font-black text-xl text-emerald-400 leading-none">${total.toFixed(2)}</p>
         </div>
      </div>

      {/* Main Bottom Action Buttons */}
      <div className="flex gap-2 relative items-center">
        {isAllFired ? (
          <button 
            type="button"
            onClick={handlePrintBill} 
            className="flex-1 h-12 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 hover:text-white border border-indigo-500/20 font-bold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 text-xs"
          >
            <Printer size={16} /> Print Bill
          </button>
        ) : (
          <button 
            type="button"
            onClick={onFire} 
            className="flex-1 h-12 bg-orange-600/20 hover:bg-orange-600/30 text-orange-300 hover:text-white border border-orange-500/20 font-bold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 text-xs"
          >
            <Flame size={16} /> Send Kitchen
          </button>
        )}

        <div className="flex items-center gap-2 flex-[1.4]">
          <button 
            type="button"
            onClick={() => onOpenPayment('SELECT')} 
            className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20 transition-all active:scale-95 text-xs font-black tracking-wide"
          >
            <CreditCard size={16} /> Pay ${total.toFixed(2)}
          </button>

          <div className="relative shrink-0">
            <button 
              type="button"
              onClick={() => setShowOrderOptions(!showOrderOptions)}
              className="w-12 h-12 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl border border-slate-700 transition-all flex items-center justify-center shadow-sm active:scale-95"
              title="Table Options Menu"
            >
              <MoreHorizontal size={20} />
            </button>

            {showOrderOptions && (
              <OrderOptionsDropdown 
                align="bottom"
                onClose={() => setShowOrderOptions(false)}
                onPayEntireBill={() => onOpenPayment('SELECT')}
                onSplitBill={() => onOpenPayment('SPLIT_EVEN')}
                onApplyDiscount={() => onOpenPayment('SELECT')}
                onAddPreAuth={() => setActiveModal('PRE_AUTH')}
                onPrintQrCode={() => setActiveModal('QR_CODE')}
                onPrintEntireBill={() => setActiveModal('PRINT_BILL')}
                onPrintIndividualBill={() => setActiveModal('PRINT_INDIVIDUAL')}
                onDeleteOrder={() => setActiveModal('DELETE_ORDER')}
                onRefireKitchen={() => {
                  onFire();
                  onUpdateOrderItems(orderItems.map(i => ({ ...i, fired: true })));
                  showNotice('Refired order to kitchen');
                }}
                onMoveOrder={() => setActiveModal('MOVE_ORDER')}
                onCombineOrders={() => setActiveModal('COMBINE_ORDERS')}
                onTransferServers={() => setActiveModal('TRANSFER_SERVER')}
                onToggleAutoGratuity={onToggleAutoGratuity}
                autoGratuityApplied={autoGratuityApplied}
                autoGratuityRate={autoGratuityRate}
                onToggleServiceFee={onToggleServiceFee}
                serviceFeeApplied={serviceFeeApplied}
                serviceFeeName={serviceFeeName}
                serviceFeeValue={serviceFeeValue}
                serviceFeeType={serviceFeeType}
                onOpenSettings={onOpenSettings}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
