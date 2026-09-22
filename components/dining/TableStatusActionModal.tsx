import React from 'react';
import { DiningTable, Employee } from '../../types';
import { SeatTablePanel } from './SeatTablePanel';
import { X, Utensils, CreditCard, RotateCcw, Sparkles, UserPlus, XCircle, MoveRight } from 'lucide-react';

interface TableStatusActionModalProps {
  actionTable: DiningTable;
  currentUser: Employee;
  onClose: () => void;
  onSeatGuests: (guestCount: number, serverName: string, serverId: string) => void;
  onTableAction: (action: string) => void;
}

export const TableStatusActionModal: React.FC<TableStatusActionModalProps> = ({
  actionTable,
  currentUser,
  onClose,
  onSeatGuests,
  onTableAction
}) => {
  return (
    <div 
      className="absolute inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-fade-in" 
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl shadow-2xl overflow-hidden w-[90%] md:w-[400px] max-w-md animate-scale-in" 
        onClick={e => e.stopPropagation()}
      >
        <div className="bg-slate-50 p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Table {actionTable.name}</h3>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mt-1">{actionTable.status}</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-200 rounded-full text-slate-400 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-0">
          {actionTable.status === 'Available' ? (
            <SeatTablePanel
              table={actionTable}
              currentUser={currentUser}
              onClose={onClose}
              onSeat={onSeatGuests}
              onReserve={() => onTableAction('MARK_RESERVED')}
              onMarkDirty={() => onTableAction('MARK_DIRTY')}
            />
          ) : (
            <div className="p-6 grid grid-cols-2 gap-3">
              {actionTable.status === 'Occupied' && (
                <>
                  <button onClick={() => onTableAction('OPEN_ORDER')} className="col-span-2 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 transition-all active:scale-95">
                    <Utensils size={20} /> View / Edit Order
                  </button>
                  <button onClick={() => onTableAction('MARK_PAYMENT')} className="py-4 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-2xl font-bold flex items-center justify-center gap-2 transition-colors">
                    <CreditCard size={18} /> Payment
                  </button>
                  <button onClick={() => onTableAction('MOVE_MERGE')} className="py-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-2xl font-bold flex items-center justify-center gap-2 transition-colors">
                    <MoveRight size={18} /> Move/Merge
                  </button>
                  <button onClick={() => onTableAction('CLEAR_TABLE')} className="col-span-2 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold flex items-center justify-center gap-2 transition-colors">
                    <RotateCcw size={18} /> Clear Table
                  </button>
                </>
              )}
              {actionTable.status === 'Dirty' && (
                <button onClick={() => onTableAction('MARK_CLEAN')} className="col-span-2 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 transition-all active:scale-95">
                  <Sparkles size={20} /> Mark Clean
                </button>
              )}
              {actionTable.status === 'Reserved' && (
                <>
                  <button onClick={() => onTableAction('SEAT')} className="col-span-2 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 transition-all active:scale-95">
                    <UserPlus size={20} /> Seat Guests
                  </button>
                  <button onClick={() => onTableAction('CANCEL_RESERVATION')} className="col-span-2 py-4 bg-red-50 hover:bg-red-100 text-red-700 rounded-2xl font-bold flex items-center justify-center gap-2 transition-colors">
                    <XCircle size={18} /> Cancel Reserve
                  </button>
                </>
              )}
              {actionTable.status === 'Payment' && (
                <>
                  <button onClick={() => onTableAction('MARK_PAYMENT')} className="col-span-2 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 transition-all active:scale-95">
                    <CreditCard size={20} /> Complete Payment
                  </button>
                  <button onClick={() => onTableAction('OPEN_ORDER')} className="py-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-2xl font-bold flex items-center justify-center gap-2 transition-colors">
                    <Utensils size={18} /> View Order
                  </button>
                  <button onClick={() => onTableAction('CLEAR_TABLE')} className="py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold flex items-center justify-center gap-2 transition-colors">
                    <RotateCcw size={18} /> Clear Table
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
