import React from 'react';
import { DiningTable } from '../../../types';
import { User, Clock, Info } from 'lucide-react';

interface TableHoverTooltipProps {
  table: DiningTable;
  elapsedMinutes: number;
  expected: number;
  zoomScale: number;
}

export const TableHoverTooltip: React.FC<TableHoverTooltipProps> = ({
  table,
  elapsedMinutes,
  expected,
  zoomScale,
}) => {
  return (
    <div 
      className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs p-3 rounded-xl shadow-xl z-[120] pointer-events-none min-w-[160px] border border-slate-700"
      style={{ transform: `rotate(-${table.rotation || 0}deg) scale(${1 / zoomScale})`, transformOrigin: 'top center' }}
    >
      <div className="flex items-start justify-between mb-2 pb-2 border-b border-white/10 gap-2">
        <h4 className="font-bold text-sm leading-tight break-words">{table.name}</h4>
        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
          table.status === 'Available' ? 'bg-slate-700 text-slate-300' :
          table.status === 'Occupied' ? 'bg-blue-500/20 text-blue-300' :
          table.status === 'Dirty' ? 'bg-amber-500/20 text-amber-300' :
          table.status === 'Payment' ? 'bg-emerald-500/20 text-emerald-300' :
          table.status === 'Reserved' ? 'bg-indigo-500/20 text-indigo-300' :
          'bg-red-500/20 text-red-300'
        }`}>{table.status}</span>
      </div>
      
      {table.isSeatable && (
        <div className="space-y-1.5 text-[11px] text-slate-300">
          <p className="flex justify-between items-center">
            <span className="flex items-center gap-1 opacity-70"><User size={12}/> Capacity:</span> 
            <span className="font-mono font-medium text-white">{table.seats}</span>
          </p>
          
          {table.status !== 'Available' && (
            <>
              <p className="flex justify-between items-center">
                <span className="flex items-center gap-1 opacity-70"><Info size={12}/> Server:</span> 
                <span className="font-medium text-white truncate max-w-[80px]">{table.assignedToName || 'Unassigned'}</span>
              </p>
              <p className="flex justify-between items-center">
                <span className="flex items-center gap-1 opacity-70"><Clock size={12}/> Seated:</span> 
                <span className="font-mono font-medium text-white">
                  {table.timeSeated ? new Date(table.timeSeated).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--'}
                </span>
              </p>
              
              {elapsedMinutes > 0 && (
                <p className="flex justify-between items-center">
                  <span className="opacity-70">Duration:</span>
                  <span className={`font-mono font-bold ${elapsedMinutes > expected ? 'text-red-400' : 'text-white'}`}>
                    {elapsedMinutes}m / {expected}m
                  </span>
                </p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};
