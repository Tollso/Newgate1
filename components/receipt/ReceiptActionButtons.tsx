import React from 'react';
import { Printer, Mail, Smartphone, Ban } from 'lucide-react';
import { ReceiptDeliveryOption } from './receiptTypes';

interface ReceiptActionButtonsProps {
  onSelectOption: (option: ReceiptDeliveryOption) => void;
  activeOption: ReceiptDeliveryOption | null;
  isProcessing: boolean;
}

export const ReceiptActionButtons: React.FC<ReceiptActionButtonsProps> = ({
  onSelectOption,
  activeOption,
  isProcessing
}) => {
  const options = [
    {
      type: 'PRINT' as ReceiptDeliveryOption,
      title: 'Print Receipt',
      description: 'Paper thermal receipt',
      icon: Printer,
      color: 'hover:border-indigo-500 hover:bg-indigo-50/50',
      activeColor: 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-500',
      iconBg: 'bg-indigo-100 text-indigo-600'
    },
    {
      type: 'EMAIL' as ReceiptDeliveryOption,
      title: 'Email Receipt',
      description: 'Digital copy sent to inbox',
      icon: Mail,
      color: 'hover:border-blue-500 hover:bg-blue-50/50',
      activeColor: 'border-blue-600 bg-blue-50 ring-2 ring-blue-500',
      iconBg: 'bg-blue-100 text-blue-600'
    },
    {
      type: 'SMS' as ReceiptDeliveryOption,
      title: 'Text Message (SMS)',
      description: 'Instant link sent to mobile',
      icon: Smartphone,
      color: 'hover:border-emerald-500 hover:bg-emerald-50/50',
      activeColor: 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-500',
      iconBg: 'bg-emerald-100 text-emerald-600'
    },
    {
      type: 'NONE' as ReceiptDeliveryOption,
      title: 'No Receipt',
      description: 'Decline receipt & finish',
      icon: Ban,
      color: 'hover:border-slate-400 hover:bg-slate-100',
      activeColor: 'border-slate-600 bg-slate-100 ring-2 ring-slate-400',
      iconBg: 'bg-slate-200 text-slate-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
      {options.map(opt => {
        const Icon = opt.icon;
        const isSelected = activeOption === opt.type;
        return (
          <button
            key={opt.type}
            type="button"
            disabled={isProcessing}
            onClick={() => onSelectOption(opt.type)}
            className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-4 text-left shadow-sm ${
              isSelected ? opt.activeColor : `bg-white border-slate-200 ${opt.color}`
            } ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${opt.iconBg}`}>
              <Icon size={24} />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-black text-slate-900 text-base leading-tight">{opt.title}</h4>
              <p className="text-xs text-slate-500 mt-0.5">{opt.description}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
};
