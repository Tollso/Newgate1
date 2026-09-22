import React from 'react';
import { Clock, CheckCircle } from 'lucide-react';
import { KitchenTicket, KDSSettings } from '../../../types';

interface TicketCardProps {
  ticket: KitchenTicket;
  onAction: () => void;
  actionLabel: string;
  variant?: 'normal' | 'ready';
  settings?: KDSSettings;
  activeStation: string;
  activeLabels?: any[];
  isExpo?: boolean;
  onRefire?: () => void;
}

export const TicketCard: React.FC<TicketCardProps> = ({
  ticket,
  onAction,
  actionLabel,
  variant = 'normal',
  settings,
  onRefire,
}) => {
  const elapsed = '08:45';

  const itemsByGuest: Record<number, any[]> = ticket.items.reduce((acc, item) => {
    const seat = item.seatNumber === undefined ? -1 : item.seatNumber;
    if (!acc[seat]) acc[seat] = [];
    acc[seat].push(item);
    return acc;
  }, {} as Record<number, typeof ticket.items>);

  return (
    <div className={`rounded-xl border-l-4 overflow-hidden shadow-md flex flex-col transition-all hover:translate-y-[-2px] border ${
      variant === 'ready'
        ? 'bg-emerald-950/30 border-l-emerald-500 border-emerald-800/40'
        : 'bg-slate-800/90 border-l-orange-500 border-slate-700'
    }`}>
      {/* Card Header */}
      <div className="p-3 flex justify-between items-start border-b border-white/5">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-mono font-black text-lg text-white">#{ticket.orderId.split('-')[1]}</span>
            {(settings?.showTable ?? true) && ticket.table && (
              <span className="bg-slate-700 text-white text-xs px-2 py-0.5 rounded font-bold uppercase">
                {ticket.table}
              </span>
            )}
            {ticket.type && (
              <span className="bg-indigo-600 text-white text-[10px] px-1.5 py-0.5 rounded font-bold uppercase">
                {ticket.type}
              </span>
            )}
          </div>
          <div className="text-xs text-slate-400 font-medium">
            {(settings?.showServer ?? true) && (ticket.server ? `Server: ${ticket.server}` : 'Order Entry')}
          </div>
        </div>
        <div className="font-mono text-sm font-bold text-slate-300">
          {elapsed}
        </div>
      </div>

      {/* Items List */}
      <div className="p-3 space-y-3 flex-1">
        {Object.entries(itemsByGuest || {}).map(([seatNumStr, items]) => {
          const seatNum = parseInt(seatNumStr);
          const seatLabel = seatNum === -1 ? '' : seatNum === 0 ? 'Shared' : `Guest ${seatNum}`;

          return (
            <div key={seatNumStr} className="space-y-1.5">
              {seatLabel && (
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-700/50 pb-0.5">
                  {seatLabel}
                </div>
              )}
              {items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start py-0.5">
                  <span className="font-black text-sm text-amber-400 w-6">{item.qty}x</span>
                  <div className="flex-1 ml-2">
                    <span className="font-bold text-sm text-slate-100">{item.name}</span>
                    {item.modifiers && item.modifiers.length > 0 && (
                      <div className="text-xs text-slate-400 space-y-0.5 mt-0.5">
                        {item.modifiers.map((mod: string, i: number) => (
                          <div key={i} className="text-orange-300">• {mod}</div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Footer Controls */}
      <div className="p-3 pt-0 flex gap-2">
        {onRefire && (
          <button
            onClick={onRefire}
            className="px-2.5 py-2 bg-rose-950/60 hover:bg-rose-900 text-rose-300 rounded-lg text-xs font-bold border border-rose-800/50 transition-colors"
            title="Refire item"
          >
            Refire
          </button>
        )}
        <button
          onClick={onAction}
          className={`flex-1 py-2.5 rounded-lg font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-sm ${
            variant === 'ready'
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white'
          }`}
        >
          {variant === 'ready' ? <CheckCircle size={14} /> : <Clock size={14} />}
          {actionLabel}
        </button>
      </div>
    </div>
  );
};
