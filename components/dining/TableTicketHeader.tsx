import React from 'react';
import { ArrowLeft, Plus, ShieldCheck, Database } from 'lucide-react';
import { DiningTable } from '../../types';
import { PreAuthData } from './PreAuthModal';

interface TableTicketHeaderProps {
  table: DiningTable;
  onBackToFloor: () => void;
  onAddGuest?: () => void;
  preAuthInfo: PreAuthData | null;
  onOpenSettings?: () => void;
}

export const TableTicketHeader: React.FC<TableTicketHeaderProps> = ({
  table,
  onBackToFloor,
  onAddGuest,
  preAuthInfo,
  onOpenSettings
}) => {
  return (
    <div className="p-3 lg:p-4 border-b border-slate-800 bg-slate-950 flex flex-col gap-3 shrink-0 relative">
      <div className="flex justify-between items-center gap-2">
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={onBackToFloor} className="p-2 -ml-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors" title="Back to Floor Plan">
            <ArrowLeft size={20} />
          </button>
        </div>

        <div className="flex items-center gap-2.5 min-w-0">
          <div className="text-right truncate">
            <h2 className="font-black text-base lg:text-lg text-white truncate">Table {table.name}</h2>
            <div className="flex items-center gap-1.5 justify-end flex-wrap">
              <p className="text-[10px] lg:text-xs font-bold text-slate-500 uppercase tracking-widest">{table.status}</p>
              {preAuthInfo && (
                <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold flex items-center gap-1">
                  <ShieldCheck size={12} /> Pre-Auth ${preAuthInfo.amount.toFixed(2)} (*{preAuthInfo.cardLast4})
                  {preAuthInfo.isCardStored && <Database size={10} className="text-blue-300 ml-0.5" />}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <button onClick={onAddGuest} className="w-full py-2 border border-dashed border-slate-700 hover:border-slate-500 rounded-xl flex items-center justify-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-bold">
        <Plus size={16} /> Add New Guest
      </button>
    </div>
  );
};
