import React from 'react';
import { DiningOrderItem } from '../../types';
import { OrderItemRow } from './OrderItemRow';
import { Share2, MoreHorizontal, Trash2, Tag, MoveRight, Shuffle, DollarSign } from 'lucide-react';

interface TableGuestGroupProps {
  seatNum: number;
  name: string;
  items: DiningOrderItem[];
  activeSeat: number;
  setActiveSeat: (seat: number) => void;
  activeGuestActions: number | null;
  setActiveGuestActions: (seat: number | null) => void;
  onVoidGuest: (seatNum: number) => void;
  onDiscountGuest: (seatNum: number) => void;
  onMoveGuest?: (seatNum: number) => void;
  onVoidItem: (cartId: string) => void;
  onDiscountItem: (cartId: string) => void;
  onMoveItem: (cartId: string) => void;
  guests: { id: number; name?: string }[];
  orderItems: DiningOrderItem[];
  orderSubtotal: number;
  orderTotal: number;
  onMoveTable: () => void;
  onPayGuest: (seatNum: number) => void;
}

export const TableGuestGroup: React.FC<TableGuestGroupProps> = ({
  seatNum,
  name,
  items,
  activeSeat,
  setActiveSeat,
  activeGuestActions,
  setActiveGuestActions,
  onVoidGuest,
  onDiscountGuest,
  onMoveGuest,
  onVoidItem,
  onDiscountItem,
  onMoveItem,
  guests,
  orderItems,
  orderSubtotal,
  orderTotal,
  onMoveTable,
  onPayGuest
}) => {
  const subtotal = items.filter(i => !i.isVoided).reduce((sum, i) => sum + (i.price * i.quantity), 0);
  
  let displayTotal = 0;
  if (seatNum === 0) {
    const sharedSubtotal = items.filter(i => !i.isVoided).reduce((sum, i) => sum + (i.price * i.quantity), 0);
    const ratio = orderSubtotal > 0 ? (sharedSubtotal / orderSubtotal) : 0;
    displayTotal = ratio * orderTotal;
  } else {
    const guestItems = items.filter(i => !i.isVoided);
    const guestSubtotal = guestItems.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    const sharedSubtotal = orderItems.filter(i => i.seatNumber === 0 && !i.isVoided).reduce((acc, i) => acc + (i.price * i.quantity), 0);
    const activeGuestsCount = guests.length;
    const sharedPerGuest = activeGuestsCount > 0 ? (sharedSubtotal / activeGuestsCount) : 0;
    const totalGuestSubtotal = guestSubtotal + sharedPerGuest;
    const ratio = orderSubtotal > 0 ? (totalGuestSubtotal / orderSubtotal) : 0;
    displayTotal = ratio * orderTotal;
  }
  const displayTotalStr = displayTotal.toFixed(2);

  const isActive = activeSeat === seatNum;
  const showGuestActions = activeGuestActions === seatNum;

  return (
    <div className="mb-4">
      <div 
        onClick={() => setActiveSeat(seatNum)}
        className={`flex items-center justify-between p-3 rounded-t-xl cursor-pointer transition-colors ${isActive ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'}`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${isActive ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-400'}`}>
            {seatNum === 0 ? <Share2 size={16} /> : seatNum}
          </div>
          <div>
            <div className="font-bold text-sm">{name}</div>
            <div className={`text-[10px] font-medium ${isActive ? 'text-indigo-200' : 'text-slate-500'}`}>{items.length} items</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold" title="Total (incl. tax & fees)">${displayTotalStr}</span>
          <button 
            onClick={(e) => { e.stopPropagation(); setActiveGuestActions(showGuestActions ? null : seatNum); }}
            className={`p-1.5 rounded-md hover:bg-black/20 ${showGuestActions ? 'bg-black/20' : ''}`}
            title="Guest Actions"
          >
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>

      {showGuestActions && (
        <div className={`flex flex-col sm:flex-row gap-1.5 p-2 border-x animate-scale-in bg-slate-900 border-slate-700`}>
          <button 
            onClick={() => onMoveGuest && onMoveGuest(seatNum)} 
            className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-slate-700"
          >
            <MoveRight size={13} /> Move Items
          </button>
          <button 
            onClick={() => onMoveTable && onMoveTable()} 
            className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-slate-700"
          >
            <Shuffle size={13} /> Move Tables
          </button>
          <button 
            onClick={() => onPayGuest && onPayGuest(seatNum)} 
            className="flex-1 py-2 px-3 bg-emerald-700 hover:bg-emerald-600 border border-emerald-600 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5"
          >
            <DollarSign size={13} /> Pay Guest
          </button>
        </div>
      )}

      <div className={`p-2 bg-slate-950/50 border-x border-b rounded-b-xl space-y-1 ${isActive ? 'border-indigo-500/30' : 'border-slate-700'}`}>
        {items.length === 0 ? (
          <div className="text-center py-4 text-xs font-medium text-slate-600">No items</div>
        ) : (
          items.map(item => (
            <OrderItemRow 
              key={item.cartId} 
              item={item}
              onVoid={() => onVoidItem(item.cartId)}
              onDiscount={() => onDiscountItem(item.cartId)}
              onMove={() => onMoveItem(item.cartId)}
            />
          ))
        )}
      </div>
    </div>
  );
};
