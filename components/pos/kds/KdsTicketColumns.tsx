import React from 'react';
import { KitchenTicket, KDSSettings, PrinterLabel } from '../../../types';
import { TicketCard } from './TicketCard';

interface KdsTicketColumnsProps {
  pendingTickets: KitchenTicket[];
  prepTickets: KitchenTicket[];
  readyTickets: KitchenTicket[];
  handleStatusChange: (id: string, status: KitchenTicket['status']) => void;
  effectiveSettings?: KDSSettings;
  activeLabels: PrinterLabel[];
  selectedStation: string;
  isExpo: boolean;
  onRefire: (id: string) => void;
}

export const KdsTicketColumns: React.FC<KdsTicketColumnsProps> = ({
  pendingTickets,
  prepTickets,
  readyTickets,
  handleStatusChange,
  effectiveSettings,
  activeLabels,
  selectedStation,
  isExpo,
  onRefire,
}) => {
  return (
    <main className="flex-1 overflow-x-auto p-4 flex gap-4">
      {/* Column 1: PENDING */}
      <div className="w-80 shrink-0 flex flex-col">
        <div className="bg-slate-800/80 p-2.5 rounded-t-xl border-b border-slate-700 flex justify-between items-center">
          <span className="font-black text-xs text-slate-300 tracking-wider uppercase">NEW ORDERS</span>
          <span className="bg-rose-600 text-white text-xs px-2.5 py-0.5 rounded-full font-black shadow-sm">{pendingTickets.length}</span>
        </div>
        <div className="flex-1 bg-slate-900/60 rounded-b-xl border border-slate-800 p-2.5 space-y-3 overflow-y-auto">
          {pendingTickets.length === 0 ? (
            <div className="h-32 flex items-center justify-center text-xs text-slate-500 font-mono">No new orders</div>
          ) : (
            pendingTickets.map(ticket => (
              <TicketCard key={ticket.id} ticket={ticket} onAction={() => handleStatusChange(ticket.id, 'Prep')} actionLabel="START PREP" settings={effectiveSettings} activeLabels={activeLabels} activeStation={selectedStation} isExpo={isExpo} onRefire={() => onRefire(ticket.id)} />
            ))
          )}
        </div>
      </div>

      {/* Column 2: IN PREP */}
      <div className="flex-1 min-w-[320px] flex flex-col">
        <div className="bg-slate-800/80 p-2.5 rounded-t-xl border-b border-slate-700 flex justify-between items-center">
          <span className="font-black text-xs text-slate-300 tracking-wider uppercase">IN PREPARATION</span>
          <span className="bg-orange-500 text-white text-xs px-2.5 py-0.5 rounded-full font-black shadow-sm">{prepTickets.length}</span>
        </div>
        <div className="flex-1 bg-slate-900/60 rounded-b-xl border border-slate-800 p-3 overflow-y-auto">
          {prepTickets.length === 0 ? (
            <div className="h-32 flex items-center justify-center text-xs text-slate-500 font-mono">No items currently prepping</div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3">
              {prepTickets.map(ticket => (
                <TicketCard key={ticket.id} ticket={ticket} onAction={() => handleStatusChange(ticket.id, 'Ready')} actionLabel={isExpo ? "EXPO READY" : "MARK READY"} settings={effectiveSettings} activeLabels={activeLabels} activeStation={selectedStation} isExpo={isExpo} onRefire={() => onRefire(ticket.id)} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Column 3: READY */}
      <div className="w-80 shrink-0 flex flex-col">
        <div className="bg-slate-800/80 p-2.5 rounded-t-xl border-b border-slate-700 flex justify-between items-center">
          <span className="font-black text-xs text-slate-300 tracking-wider uppercase">{isExpo ? "READY FOR EXPO BUMP" : "READY FOR SERVING"}</span>
          <span className="bg-emerald-600 text-white text-xs px-2.5 py-0.5 rounded-full font-black shadow-sm">{readyTickets.length}</span>
        </div>
        <div className="flex-1 bg-slate-900/60 rounded-b-xl border border-slate-800 p-2.5 space-y-3 overflow-y-auto">
          {readyTickets.length === 0 ? (
            <div className="h-32 flex items-center justify-center text-xs text-slate-500 font-mono">No tickets waiting</div>
          ) : (
            readyTickets.map(ticket => (
              <TicketCard key={ticket.id} ticket={ticket} onAction={() => handleStatusChange(ticket.id, 'Delivered')} actionLabel={isExpo ? "EXPEDITE & DISPATCH" : "CLEAR TICKET"} variant="ready" settings={effectiveSettings} activeLabels={activeLabels} activeStation={selectedStation} isExpo={isExpo} onRefire={() => onRefire(ticket.id)} />
            ))
          )}
        </div>
      </div>
    </main>
  );
};
