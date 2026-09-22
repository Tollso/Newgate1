import React from 'react';
import { CheckCircle, Database } from 'lucide-react';

interface PreAuthSuccessViewProps {
  finalAmount: number;
  cardBrand: string;
  cardLast4: string;
  storeCardData: boolean;
}

export const PreAuthSuccessView: React.FC<PreAuthSuccessViewProps> = ({
  finalAmount,
  cardBrand,
  cardLast4,
  storeCardData,
}) => {
  return (
    <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
      <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center animate-bounce">
        <CheckCircle size={36} />
      </div>
      <h4 className="text-xl font-black text-slate-900">Pre-Auth Approved</h4>
      <p className="text-sm font-medium text-slate-500">
        ${finalAmount.toFixed(2)} hold authorized on {cardBrand} **** {cardLast4}
      </p>
      {storeCardData && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-200">
          <Database size={13} /> Card Data Stored for 1-Click Payment
        </span>
      )}
    </div>
  );
};
