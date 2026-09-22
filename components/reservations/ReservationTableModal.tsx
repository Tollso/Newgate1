import React from 'react';
import { X, Sparkles, MapPin, Users } from 'lucide-react';
import { Reservation, DiningTable } from '../../types';

interface ReservationTableModalProps {
  showTableSelector: boolean;
  setShowTableSelector: (show: boolean) => void;
  selectedRes: Reservation | null;
  aiSuggesting: string | null;
  suggestedTableId: string | null;
  floorPlanTables: DiningTable[];
  handleAiSuggest: () => void;
  confirmSeating: (tableId: string) => void;
}

export const ReservationTableModal: React.FC<ReservationTableModalProps> = ({
  showTableSelector,
  setShowTableSelector,
  selectedRes,
  aiSuggesting,
  suggestedTableId,
  floorPlanTables,
  handleAiSuggest,
  confirmSeating
}) => {
  if (!showTableSelector || !selectedRes) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden animate-scale-in">
        <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <div>
            <h3 className="font-black text-slate-800 text-lg uppercase tracking-tight">Assign Table for {selectedRes.customerName}</h3>
            <p className="text-xs text-slate-500 font-medium">{selectedRes.partySize} Guests • {selectedRes.time}</p>
          </div>
          <button onClick={() => setShowTableSelector(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-indigo-900">Need Table Recommendation?</p>
              <p className="text-[10px] text-indigo-600 font-medium">Smart table assignment</p>
            </div>
            <button
              onClick={handleAiSuggest}
              disabled={!!aiSuggesting}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md hover:bg-indigo-700 transition-all disabled:opacity-50"
            >
              <Sparkles size={14} /> {aiSuggesting ? 'Analyzing...' : 'Auto Match'}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 max-h-60 overflow-y-auto p-1">
            {floorPlanTables.map(t => {
              const isSuggested = suggestedTableId === t.id;
              const isAvailable = t.status === 'Available';
              return (
                <button
                  key={t.id}
                  onClick={() => confirmSeating(t.id)}
                  disabled={!isAvailable}
                  className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition-all relative ${
                    isSuggested ? 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-4 ring-emerald-100' :
                    isAvailable ? 'border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/50 text-slate-700' :
                    'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed'
                  }`}
                >
                  <span className="font-black text-base">{t.name}</span>
                  <span className="text-[10px] font-bold flex items-center gap-1 opacity-70"><Users size={12}/> {t.seats} seats</span>
                  {isSuggested && (
                    <span className="absolute -top-2 bg-emerald-500 text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-full shadow-sm">
                      Best Match
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button onClick={() => setShowTableSelector(false)} className="px-5 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-700">Cancel</button>
        </div>
      </div>
    </div>
  );
};
