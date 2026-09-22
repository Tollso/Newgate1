import React, { useState, useEffect, useRef } from 'react';
import { DiningTable } from '../../types';
import { User, Clock, MoveDiagonal } from 'lucide-react';
import { TableVectors } from './TableVectors';
import { getTableStyles, getTableShapeBounds } from './interactive_table/tableColorHelpers';
import { TableHoverTooltip } from './interactive_table/TableHoverTooltip';

interface KitchenStatus {
  status: 'Pending' | 'Prep' | 'Ready' | 'Delivered';
  queuePosition?: number;
  ticketId?: string;
}

interface InteractiveTableProps {
  table: DiningTable;
  onClick: (e: React.MouseEvent | React.PointerEvent, table: DiningTable, isResizeHandle: boolean) => void;
  isEditing?: boolean;
  isSelected?: boolean;
  kitchenStatus?: KitchenStatus | null;
  zoomScale?: number;
}

const InteractiveTable: React.FC<InteractiveTableProps> = ({ table, onClick, isEditing, isSelected, kitchenStatus, zoomScale = 1 }) => {
  const [elapsedMinutes, setElapsedMinutes] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const textContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (table.status !== 'Available' && table.timeSeated) {
      const seated = new Date(table.timeSeated).getTime();
      const interval = setInterval(() => {
        setElapsedMinutes(Math.floor((Date.now() - seated) / 60000));
      }, 60000);
      setElapsedMinutes(Math.floor((Date.now() - seated) / 60000));
      return () => clearInterval(interval);
    } else {
      setElapsedMinutes(0);
    }
  }, [table.status, table.timeSeated]);

  const expected = table.expectedDuration || 60;
  const { tableFill, tableStroke, tableShadow, chairStroke, labelColor, statusBadge } = getTableStyles(table, elapsedMinutes, expected);

  const w = table.width;
  const h = table.height;
  const x = table.x;
  const y = table.y;
  const serverName = table.assignedToName || '';
  const minDim = Math.min(w, h);
  const baseFontSize = Math.max(12, Math.min(17, Math.round(minDim / 7.5)));

  return (
    <div
      onPointerDown={(e) => {
        e.stopPropagation();
        onClick(e, table, false);
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        cursor: isEditing ? 'grab' : (table.isSeatable ? 'pointer' : 'default'),
        zIndex: isSelected ? 100 : (isHovered || table.highlight ? 50 : 10),
        transform: `rotate(${table.rotation || 0}deg)`,
        borderRadius: table.type.includes('ROUND') || table.type.includes('PLANT') || table.type === 'WAITING_CHAIR' ? '50%' : '8px',
      }}
      className={`flex flex-col items-center justify-center select-none relative group ${isSelected && isEditing ? 'ring-2 ring-indigo-500 shadow-xl' : ''}`}
    >
      <TableVectors table={table} tableFill={tableFill} tableStroke={tableStroke} tableShadow={tableShadow} chairStroke={chairStroke} />
      
      {statusBadge && !isEditing && (
        <div style={{ transform: `rotate(-${table.rotation || 0}deg) scale(${1 / zoomScale})`, transformOrigin: 'center' }}>
          {statusBadge === 'RSVP' ? (
            <div className="absolute -top-2 -right-2 bg-indigo-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow-sm border border-indigo-600 z-20">RSVP</div>
          ) : (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow-sm border border-red-600 z-20 animate-pulse">LATE</div>
          )}
        </div>
      )}
      
      <div 
        ref={textContainerRef}
        style={getTableShapeBounds(table.type)}
        className="absolute flex flex-col items-center justify-center z-10 pointer-events-none p-1 overflow-hidden"
      >
        <div style={{ transform: `rotate(-${table.rotation || 0}deg)` }} className="flex flex-col items-center w-full h-full justify-center px-0.5">
          {(!table.type.includes('PLANT') && !table.type.includes('RUG') && !table.type.includes('PIANO')) && (
            <div 
              className={`font-black tracking-tight text-center leading-tight truncate max-w-full ${labelColor}`}
              style={{ fontSize: `${baseFontSize}px`, marginBottom: '2px' }}
              title={table.name}
            >
              {table.name}
            </div>
          )}
          
          {table.isSeatable && !isEditing && (
            <div className="flex flex-col items-center justify-center gap-1 w-full">
              {table.status === 'Available' ? (
                <div className="flex items-center gap-1 text-[10.5px] font-bold text-slate-600 bg-white/95 px-2 py-0.5 rounded-md border border-slate-200/80 shadow-xs leading-none">
                  <User size={10} className="text-slate-500" />
                  <span>{table.seats} seats</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1 w-full">
                  {serverName && (
                    <span className="text-[9.5px] font-extrabold text-slate-800 bg-white/95 px-1.5 py-0.5 rounded-md border border-slate-200/80 leading-none truncate max-w-full text-center shadow-xs">
                      {serverName}
                    </span>
                  )}
                  <div className="flex items-center gap-1 justify-center flex-wrap max-w-full">
                    {table.status !== 'Reserved' && table.status !== 'Dirty' && (
                      <span className="text-[9px] text-slate-900 font-extrabold bg-white/95 px-1.5 py-0.5 rounded-md flex items-center gap-0.5 border border-slate-200/80 leading-none shadow-xs">
                        <Clock size={8} className="text-slate-500" />
                        <span>{elapsedMinutes}m</span>
                      </span>
                    )}
                    {kitchenStatus && (
                      <span className={`text-[8.5px] font-black px-1.5 py-0.5 rounded-md flex items-center gap-0.5 border uppercase leading-none shadow-xs ${
                        kitchenStatus.status === 'Pending' ? 'bg-amber-100 text-amber-900 border-amber-300' :
                        kitchenStatus.status === 'Prep' ? 'bg-indigo-100 text-indigo-900 border-indigo-300' : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                      }`}>
                        {kitchenStatus.status === 'Pending' && `Q#${kitchenStatus.queuePosition || 1}`}
                        {kitchenStatus.status === 'Prep' && `PREP`}
                        {kitchenStatus.status === 'Ready' && `RDY`}
                      </span>
                    )}
                    <span className="text-[8.5px] font-bold text-slate-600 bg-white/90 px-1 py-0.5 rounded border border-slate-200/70 leading-none">
                      {table.seats}p
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {isEditing && isSelected && (
        <div 
          onPointerDown={(e) => { e.stopPropagation(); onClick(e, table, true); }}
          className="absolute -bottom-3 -right-3 w-6 h-6 bg-white border-2 border-indigo-600 rounded-full cursor-nwse-resize z-50 flex items-center justify-center shadow-lg"
          style={{ transform: `scale(${1 / zoomScale})` }}
        >
          <MoveDiagonal size={12} className="text-indigo-600" />
        </div>
      )}

      {isHovered && (!isEditing || table.name.length > 5) && (
        <TableHoverTooltip table={table} elapsedMinutes={elapsedMinutes} expected={expected} zoomScale={zoomScale} />
      )}
    </div>
  );
};

export default InteractiveTable;
