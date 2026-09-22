import React, { useState } from 'react';
import { DiningTable, Employee } from '../../types';
import { UserPlus, Bookmark, Trash2, X, Plus, Minus, ArrowRight } from 'lucide-react';

interface SeatTablePanelProps {
  table: DiningTable;
  onClose: () => void;
  onSeat: (guestCount: number, serverName: string, serverId: string) => void;
  onReserve: () => void;
  onMarkDirty: () => void;
  currentUser: Employee;
}

export const SeatTablePanel: React.FC<SeatTablePanelProps> = ({ table, onClose, onSeat, onReserve, onMarkDirty, currentUser }) => {
  const [guestCount, setGuestCount] = useState(2);
  const [step, setStep] = useState<'ACTIONS' | 'SEAT_FORM'>('ACTIONS');
  const [notes, setNotes] = useState('');

  if (step === 'ACTIONS') {
    return (
      <div className="p-6 grid grid-cols-2 gap-3">
        <button onClick={() => setStep('SEAT_FORM')} className="col-span-2 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 transition-all active:scale-95"><UserPlus size={20} /> Seat Guests</button>
        <button onClick={onReserve} className="py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold flex items-center justify-center gap-2 transition-colors"><Bookmark size={18} /> Reserve</button>
        <button onClick={onMarkDirty} className="py-4 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-2xl font-bold flex items-center justify-center gap-2 transition-colors"><Trash2 size={18} /> Mark Dirty</button>
      </div>
    );
  }

  return (
    <div className="p-6 animate-slide-up">
       <div className="mb-6">
         <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 text-center">Party Size</label>
         <div className="flex items-center justify-center gap-6">
           <button onClick={() => setGuestCount(Math.max(1, guestCount - 1))} className="w-14 h-14 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-600 transition-colors">
             <Minus size={24} />
           </button>
           <span className="text-4xl font-black text-slate-900 w-12 text-center">{guestCount}</span>
           <button onClick={() => setGuestCount(guestCount + 1)} className="w-14 h-14 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-600 transition-colors">
             <Plus size={24} />
           </button>
         </div>
       </div>

       <div className="space-y-4 mb-6">
         <div>
           <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Assigned Server</label>
           <div className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl font-bold text-slate-700">
             {currentUser.name}
           </div>
         </div>
         <div>
           <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Visit Notes (Optional)</label>
           <input 
             type="text" 
             value={notes}
             onChange={e => setNotes(e.target.value)}
             className="w-full bg-white border border-slate-200 p-3 rounded-xl font-medium outline-none focus:border-indigo-500 transition-colors"
             placeholder="Allergies, high chair, etc."
           />
         </div>
       </div>

       <div className="flex gap-3">
         <button onClick={() => setStep('ACTIONS')} className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-colors">
           Back
         </button>
         <button onClick={() => onSeat(guestCount, currentUser.name, currentUser.id)} className="flex-[2] py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 transition-all active:scale-95">
           Seat & Order <ArrowRight size={20} />
         </button>
       </div>
    </div>
  );
};
