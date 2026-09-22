import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { RetailProduct } from '../../../types/retail';

interface RetailAgeVerificationModalProps {
  item: RetailProduct | null;
  onCancel: () => void;
  onConfirm: (item: RetailProduct) => void;
}

export const RetailAgeVerificationModal: React.FC<RetailAgeVerificationModalProps> = ({
  item,
  onCancel,
  onConfirm,
}) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-amber-600 rounded-2xl w-full max-w-md p-6 space-y-4 text-center">
        <div className="w-14 h-14 mx-auto rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
          <AlertTriangle size={28} />
        </div>
        <h3 className="text-lg font-black text-white">Age Verification Required</h3>
        <p className="text-xs text-slate-300">
          Customer must be at least <span className="font-bold text-amber-400">{item.minimumAge || 21} years old</span> to purchase {item.name}.
        </p>
        <p className="text-xs text-slate-400">
          Please inspect physical photo ID and verify birth date.
        </p>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs"
          >
            Under Age / Cancel
          </button>
          <button
            onClick={() => onConfirm(item)}
            className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs"
          >
            ID Verified (Age 21+)
          </button>
        </div>
      </div>
    </div>
  );
};
