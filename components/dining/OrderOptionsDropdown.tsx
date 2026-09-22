import React from 'react';
import { MoveRight, Merge, UserCheck } from 'lucide-react';
import { OrderDropdownPayments } from './dropdown/OrderDropdownPayments';
import { OrderDropdownBill } from './dropdown/OrderDropdownBill';

interface OrderOptionsDropdownProps {
  align?: 'top' | 'bottom';
  onClose: () => void;
  onPayEntireBill: () => void;
  onSplitBill: () => void;
  onApplyDiscount?: () => void;
  onAddPreAuth: () => void;
  onPrintQrCode: () => void;
  onPrintEntireBill: () => void;
  onPrintIndividualBill: () => void;
  onDeleteOrder: () => void;
  onRefireKitchen: () => void;
  onMoveOrder: () => void;
  onCombineOrders: () => void;
  onTransferServers: () => void;
  onOpenSettings?: () => void;
  onToggleAutoGratuity?: () => void;
  autoGratuityApplied?: boolean;
  autoGratuityRate?: number;
  onToggleServiceFee?: () => void;
  serviceFeeApplied?: boolean;
  serviceFeeName?: string;
  serviceFeeValue?: number;
  serviceFeeType?: 'Percentage' | 'Fixed';
}

export const OrderOptionsDropdown: React.FC<OrderOptionsDropdownProps> = ({
  align = 'bottom',
  onClose,
  onPayEntireBill,
  onSplitBill,
  onApplyDiscount,
  onAddPreAuth,
  onPrintQrCode,
  onPrintEntireBill,
  onPrintIndividualBill,
  onDeleteOrder,
  onRefireKitchen,
  onMoveOrder,
  onCombineOrders,
  onTransferServers,
  onToggleAutoGratuity,
  autoGratuityApplied = false,
  autoGratuityRate = 18,
  onToggleServiceFee,
  serviceFeeApplied = false,
  serviceFeeName = 'Service Fee',
  serviceFeeValue = 3.5,
  serviceFeeType = 'Percentage'
}) => {
  const handleAction = (action: () => void) => {
    action();
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-[100]" onClick={onClose} />
      <div className={`absolute ${align === 'top' ? 'top-full mt-2 origin-top-right' : 'bottom-full mb-2 origin-bottom-right'} right-0 w-72 bg-slate-900 text-slate-100 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden z-[110] animate-scale-in p-2.5 max-h-[82vh] overflow-y-auto space-y-2 select-none`}>
        <OrderDropdownPayments
          onPayEntireBill={onPayEntireBill}
          onSplitBill={onSplitBill}
          onApplyDiscount={onApplyDiscount}
          onAddPreAuth={onAddPreAuth}
          onPrintQrCode={onPrintQrCode}
          handleAction={handleAction}
        />

        <div className="border-t border-slate-800" />

        <OrderDropdownBill
          onPrintEntireBill={onPrintEntireBill}
          onPrintIndividualBill={onPrintIndividualBill}
          onToggleAutoGratuity={onToggleAutoGratuity}
          autoGratuityApplied={autoGratuityApplied}
          autoGratuityRate={autoGratuityRate}
          onToggleServiceFee={onToggleServiceFee}
          serviceFeeApplied={serviceFeeApplied}
          serviceFeeName={serviceFeeName}
          serviceFeeValue={serviceFeeValue}
          serviceFeeType={serviceFeeType}
          onRefireKitchen={onRefireKitchen}
          onDeleteOrder={onDeleteOrder}
          handleAction={handleAction}
        />

        <div className="border-t border-slate-800" />

        <div>
          <div className="px-3 py-1 text-[11px] font-black uppercase tracking-wider text-indigo-400">
            Orders
          </div>
          <div className="space-y-0.5 mt-0.5">
            <button
              onClick={() => handleAction(onMoveOrder)}
              className="w-full text-left px-3 py-2 text-xs font-bold hover:bg-slate-800 rounded-xl flex items-center gap-2.5 text-slate-200 hover:text-white transition-colors"
            >
              <MoveRight size={15} className="text-violet-400" /> Move Order
            </button>
            <button
              onClick={() => handleAction(onCombineOrders)}
              className="w-full text-left px-3 py-2 text-xs font-bold hover:bg-slate-800 rounded-xl flex items-center gap-2.5 text-slate-200 hover:text-white transition-colors"
            >
              <Merge size={15} className="text-pink-400" /> Combine Orders
            </button>
          </div>
        </div>

        <div className="border-t border-slate-800" />

        <div>
          <button
            onClick={() => handleAction(onTransferServers)}
            className="w-full text-left px-3 py-2.5 text-xs font-bold hover:bg-slate-800 rounded-xl flex items-center gap-2.5 text-indigo-300 hover:text-white transition-colors"
          >
            <UserCheck size={15} className="text-indigo-400" /> Transfer Servers
          </button>
        </div>
      </div>
    </>
  );
};
