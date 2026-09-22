import React from 'react';
import { Share2 } from 'lucide-react';
import { DiningOrderItem } from '../../types';

interface MoveItemModalProps {
  itemToMove?: string | null;
  guestToMove?: number | null;
  guests: { id: number; name?: string }[];
  orderItems: DiningOrderItem[];
  onUpdateOrderItems: (items: DiningOrderItem[]) => void;
  onClose: () => void;
}

export const MoveItemModal: React.FC<MoveItemModalProps> = ({
  itemToMove,
  guestToMove,
  guests,
  orderItems,
  onUpdateOrderItems,
  onClose
}) => {
  const isGuestMove = guestToMove !== undefined && guestToMove !== null;
  const targetLabel = isGuestMove 
    ? (guestToMove === 0 ? 'Shared Items' : `Guest ${guestToMove}`)
    : 'Selected Item';

  const handleMoveToSeat = (targetSeat: number) => {
    if (isGuestMove) {
      onUpdateOrderItems(orderItems.map(i => i.seatNumber === guestToMove ? { ...i, seatNumber: targetSeat } : i));
    } else if (itemToMove) {
      onUpdateOrderItems(orderItems.map(i => i.cartId === itemToMove ? { ...i, seatNumber: targetSeat } : i));
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in text-slate-800 p-4">
      <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-scale-in">
        <h3 className="font-black text-xl mb-1">{isGuestMove ? 'Move Guest Items' : 'Move Item'}</h3>
        <p className="text-sm font-medium text-slate-500 mb-6">
          Move items from <span className="font-bold text-slate-800">{targetLabel}</span> to:
        </p>
        
        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
          {(!isGuestMove || guestToMove !== 0) && (
            <button 
              onClick={() => handleMoveToSeat(0)}
              className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <Share2 size={16} />
                </div>
                <span className="font-bold text-slate-700">Shared / Table</span>
              </div>
            </button>
          )}
          
          {guests.map((g) => {
            if (isGuestMove && g.id === guestToMove) return null;
            return (
              <button 
                key={g.id}
                onClick={() => handleMoveToSeat(g.id)}
                className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs">
                    {g.id}
                  </div>
                  <span className="font-bold text-slate-700">{g.name || `Guest ${g.id}`}</span>
                </div>
              </button>
            );
          })}
        </div>
        
        <button onClick={onClose} className="w-full mt-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-2xl transition-colors text-sm">
          Cancel
        </button>
      </div>
    </div>
  );
};
