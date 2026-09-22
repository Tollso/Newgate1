import React, { useState } from 'react';
import { DiningTable, DiningOrderItem } from '../../types';
import { Printer, X, FileText, User } from 'lucide-react';

interface PrintIndividualBillModalProps {
  table: DiningTable;
  guests: { id: number; name?: string }[];
  orderItems: DiningOrderItem[];
  onClose: () => void;
  onPrinted?: () => void;
}

export const PrintIndividualBillModal: React.FC<PrintIndividualBillModalProps> = ({
  table,
  guests,
  orderItems,
  onClose,
  onPrinted
}) => {
  const [selectedSeat, setSelectedSeat] = useState<number>(guests[0]?.id || 1);

  const activeGuest = guests.find(g => g.id === selectedSeat) || guests[0];
  const guestSeatNum = activeGuest?.id || 1;
  const guestName = activeGuest?.name || `Guest ${guestSeatNum}`;

  const guestItems = orderItems.filter(i => i.seatNumber === guestSeatNum && !i.isVoided);
  const sharedItems = orderItems.filter(i => i.seatNumber === 0 && !i.isVoided);
  const sharedSubtotalPerGuest = guests.length > 0 ? (sharedItems.reduce((acc, i) => acc + (i.price * i.quantity), 0) / guests.length) : 0;

  const guestSubtotal = guestItems.reduce((acc, i) => acc + (i.price * i.quantity), 0) + sharedSubtotalPerGuest;
  const guestTax = guestSubtotal * 0.0825;
  const guestTotal = guestSubtotal + guestTax;

  const handlePrint = () => {
    window.print();
    if (onPrinted) onPrinted();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/70 backdrop-blur-sm animate-fade-in text-slate-800 p-4">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl animate-scale-in relative max-h-[90vh] flex flex-col">
        
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-cyan-100 text-cyan-600 flex items-center justify-center">
              <FileText size={22} />
            </div>
            <div>
              <h3 className="font-black text-xl text-slate-900">Individual Guest Bill</h3>
              <p className="text-xs font-bold text-slate-400">Table {table.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Guest Selector Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-2">
          {guests.map(g => (
            <button
              key={g.id}
              onClick={() => setSelectedSeat(g.id)}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                selectedSeat === g.id
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <User size={13} /> {g.name || `Guest ${g.id}`}
            </button>
          ))}
        </div>

        {/* Individual Thermal Receipt Preview */}
        <div className="flex-1 overflow-y-auto bg-amber-50/50 border border-amber-200/60 rounded-2xl p-5 font-mono text-xs text-slate-800 space-y-3 shadow-inner my-2">
          <div className="text-center space-y-1 pb-3 border-b border-dashed border-amber-300">
            <h4 className="font-black text-sm uppercase tracking-wide">Gourmet Bistro & Grill</h4>
            <p className="text-[11px] text-slate-500">INDIVIDUAL GUEST RECEIPT</p>
            <div className="pt-2 text-[11px] font-bold text-slate-700 flex justify-between">
              <span>Table: {table.name}</span>
              <span>{guestName}</span>
            </div>
            <div className="text-[10px] text-slate-400 flex justify-between">
              <span>Server: {table.assignedToName || 'Staff'}</span>
              <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>

          <div className="space-y-2 py-2">
            <div className="grid grid-cols-12 font-bold border-b border-amber-200 pb-1 text-[11px]">
              <span className="col-span-2">Qty</span>
              <span className="col-span-7">Item</span>
              <span className="col-span-3 text-right">Price</span>
            </div>

            {guestItems.length === 0 && sharedSubtotalPerGuest === 0 ? (
              <p className="text-center py-4 text-slate-400 italic">No items for this guest</p>
            ) : (
              <>
                {guestItems.map((item) => (
                  <div key={item.cartId} className="grid grid-cols-12 text-[11px] items-center">
                    <span className="col-span-2 font-bold">{item.quantity}x</span>
                    <span className="col-span-7 truncate">{item.name}</span>
                    <span className="col-span-3 text-right font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                {sharedSubtotalPerGuest > 0 && (
                  <div className="grid grid-cols-12 text-[11px] items-center text-slate-600 italic border-t border-amber-200 pt-1">
                    <span className="col-span-2 font-bold">1x</span>
                    <span className="col-span-7 truncate">Shared Items Share</span>
                    <span className="col-span-3 text-right font-bold">${sharedSubtotalPerGuest.toFixed(2)}</span>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="pt-3 border-t border-dashed border-amber-300 space-y-1.5 text-[11px]">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-bold">${guestSubtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (8.25%):</span>
              <span className="font-bold">${guestTax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-black pt-1 border-t border-amber-300">
              <span>GUEST TOTAL:</span>
              <span>${guestTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="pt-4 text-center border-t border-dashed border-amber-300">
            <p className="text-[10px] text-slate-400 italic">Thank you for dining with us!</p>
          </div>
        </div>

        <div className="flex gap-3 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-2xl transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 py-3.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-cyan-900/20 text-sm flex items-center justify-center gap-2"
          >
            <Printer size={18} /> Print Guest Bill
          </button>
        </div>
      </div>
    </div>
  );
};
