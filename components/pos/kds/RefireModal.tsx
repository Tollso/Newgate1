import React from 'react';
import { AlertCircle } from 'lucide-react';

interface RefireModalProps {
  ticketId: string | null;
  onClose: () => void;
  refireReason: string;
  setRefireReason: (val: string) => void;
  onConfirm: (ticketId: string) => void;
}

export const RefireModal: React.FC<RefireModalProps> = ({
  ticketId,
  onClose,
  refireReason,
  setRefireReason,
  onConfirm,
}) => {
  if (!ticketId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
          <AlertCircle size={20} className="text-rose-400" />
          Refire Kitchen Ticket
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Specify reason for refiring ticket #{ticketId.split('-')[1]}. The station will receive a high-priority restart notice.
        </p>

        <div className="space-y-3">
          <input
            type="text"
            value={refireReason}
            onChange={e => setRefireReason(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm outline-none"
            placeholder="Reason..."
          />
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-xs font-bold"
            >
              Cancel
            </button>
            <button
              onClick={() => onConfirm(ticketId)}
              className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold"
            >
              Confirm Refire
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
