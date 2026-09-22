import React from 'react';
import { Printer, FileText, Users, DollarSign, RefreshCw, Trash2 } from 'lucide-react';

interface OrderDropdownBillProps {
  onPrintEntireBill: () => void;
  onPrintIndividualBill: () => void;
  onToggleAutoGratuity?: () => void;
  autoGratuityApplied?: boolean;
  autoGratuityRate?: number;
  onToggleServiceFee?: () => void;
  serviceFeeApplied?: boolean;
  serviceFeeName?: string;
  serviceFeeValue?: number;
  serviceFeeType?: 'Percentage' | 'Fixed';
  onRefireKitchen: () => void;
  onDeleteOrder: () => void;
  handleAction: (action: () => void) => void;
}

export const OrderDropdownBill: React.FC<OrderDropdownBillProps> = ({
  onPrintEntireBill,
  onPrintIndividualBill,
  onToggleAutoGratuity,
  autoGratuityApplied = false,
  autoGratuityRate = 18,
  onToggleServiceFee,
  serviceFeeApplied = false,
  serviceFeeName = 'Service Fee',
  serviceFeeValue = 3.5,
  serviceFeeType = 'Percentage',
  onRefireKitchen,
  onDeleteOrder,
  handleAction,
}) => {
  return (
    <div>
      <div className="px-3 py-1 text-[11px] font-black uppercase tracking-wider text-indigo-400">
        Bill
      </div>
      <div className="space-y-0.5 mt-0.5">
        <button
          onClick={() => handleAction(onPrintEntireBill)}
          className="w-full text-left px-3 py-2 text-xs font-bold hover:bg-slate-800 rounded-xl flex items-center gap-2.5 text-slate-200 hover:text-white transition-colors"
        >
          <Printer size={15} className="text-sky-400" /> Print Entire Bill
        </button>
        <button
          onClick={() => handleAction(onPrintIndividualBill)}
          className="w-full text-left px-3 py-2 text-xs font-bold hover:bg-slate-800 rounded-xl flex items-center gap-2.5 text-slate-200 hover:text-white transition-colors"
        >
          <FileText size={15} className="text-cyan-400" /> Print Individual Bill
        </button>
        {onToggleAutoGratuity && (
          <button
            onClick={() => handleAction(onToggleAutoGratuity)}
            className={`w-full text-left px-3 py-2 text-xs font-bold hover:bg-slate-800 rounded-xl flex items-center justify-between gap-2.5 transition-colors ${autoGratuityApplied ? 'bg-amber-900/40 text-amber-300' : 'text-slate-200 hover:text-white'}`}
          >
            <div className="flex items-center gap-2.5">
              <Users size={15} className="text-amber-400" />
              <span>Auto Grat ({autoGratuityRate}%)</span>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${autoGratuityApplied ? 'bg-amber-500/30 text-amber-300' : 'bg-slate-800 text-slate-400'}`}>
              {autoGratuityApplied ? 'Applied' : 'Add'}
            </span>
          </button>
        )}
        {onToggleServiceFee && (
          <button
            onClick={() => handleAction(onToggleServiceFee)}
            className={`w-full text-left px-3 py-2 text-xs font-bold hover:bg-slate-800 rounded-xl flex items-center justify-between gap-2.5 transition-colors ${serviceFeeApplied ? 'bg-indigo-900/40 text-indigo-300' : 'text-slate-200 hover:text-white'}`}
          >
            <div className="flex items-center gap-2.5">
              <DollarSign size={15} className="text-indigo-400" />
              <span className="truncate max-w-[120px]">{serviceFeeName} ({serviceFeeType === 'Fixed' ? `$${serviceFeeValue}` : `${serviceFeeValue}%`})</span>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase shrink-0 ${serviceFeeApplied ? 'bg-indigo-500/30 text-indigo-300' : 'bg-slate-800 text-slate-400'}`}>
              {serviceFeeApplied ? 'Applied' : 'Add'}
            </span>
          </button>
        )}
        <button
          onClick={() => handleAction(onRefireKitchen)}
          className="w-full text-left px-3 py-2 text-xs font-bold hover:bg-slate-800 rounded-xl flex items-center gap-2.5 text-slate-200 hover:text-white transition-colors"
        >
          <RefreshCw size={15} className="text-orange-400" /> Refire Kitchen
        </button>
        <button
          onClick={() => handleAction(onDeleteOrder)}
          className="w-full text-left px-3 py-2 text-xs font-bold hover:bg-red-900/40 rounded-xl flex items-center gap-2.5 text-red-400 hover:text-red-300 transition-colors"
        >
          <Trash2 size={15} className="text-red-400" /> Delete Order
        </button>
      </div>
    </div>
  );
};
