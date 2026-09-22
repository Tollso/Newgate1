import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

interface RemovalReasonModalProps {
  itemName: string;
  reasons: string[];
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export const RemovalReasonModal: React.FC<RemovalReasonModalProps> = ({
  itemName,
  reasons,
  onClose,
  onConfirm
}) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');

  const handleConfirm = () => {
    const finalReason = selectedReason === 'Custom' ? customReason.trim() : selectedReason;
    if (!finalReason) return;
    onConfirm(finalReason);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 overflow-hidden flex flex-col animate-scale-in border border-slate-100">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-lg font-black text-slate-800 tracking-tight">Reason for Removal</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} className="text-slate-400" />
          </button>
        </div>
        
        <p className="text-sm text-slate-500 mb-4">
          Why are you removing <span className="font-bold text-slate-800">"{itemName}"</span>?
        </p>

        <div className="space-y-2 max-h-60 overflow-y-auto mb-4 pr-1">
          {reasons.map((reason, idx) => (
            <button
              key={idx}
              onClick={() => { setSelectedReason(reason); setCustomReason(''); }}
              className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-bold transition-all flex justify-between items-center ${
                selectedReason === reason 
                  ? 'bg-indigo-50 border-indigo-600 text-indigo-700' 
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              <span>{reason}</span>
              {selectedReason === reason && <Check size={16} className="text-indigo-600" />}
            </button>
          ))}
          
          <button
            onClick={() => setSelectedReason('Custom')}
            className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-bold transition-all flex justify-between items-center ${
              selectedReason === 'Custom' 
                ? 'bg-indigo-50 border-indigo-600 text-indigo-700' 
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
            }`}
          >
            <span>Write Custom Reason...</span>
            {selectedReason === 'Custom' && <Check size={16} className="text-indigo-600" />}
          </button>
        </div>

        {selectedReason === 'Custom' && (
          <div className="mb-4 animate-fade-in">
            <textarea
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              placeholder="Type reason here..."
              rows={2}
              maxLength={100}
              className="w-full border-2 border-slate-200 rounded-xl p-3 text-sm font-medium focus:border-indigo-500 outline-none focus:ring-0 transition-colors bg-white text-slate-800"
            />
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-slate-200 hover:bg-slate-50 rounded-xl font-bold text-sm text-slate-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedReason || (selectedReason === 'Custom' && !customReason.trim())}
            className="flex-1 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white rounded-xl font-bold text-sm transition-colors shadow-lg shadow-red-100"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};
