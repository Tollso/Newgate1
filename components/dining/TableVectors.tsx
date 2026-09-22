import React from 'react';
import { DiningTable } from '../../types';

interface TableVectorsProps {
  table: DiningTable;
  tableFill: string;
  tableStroke: string;
  tableShadow: string;
  chairStroke: string;
}

export const renderChairs = (table: DiningTable, chairStroke: string) => {
  if (!table.isSeatable || table.seats === 0) return null;
  
  const chairs = [];
  if (table.type === 'TABLE_ROUND') {
    const r = 49; 
    const offset = -4; 
    
    for (let i = 0; i < table.seats; i++) {
      const angle = (i / table.seats) * 2 * Math.PI;
      const degrees = (angle * 180) / Math.PI;
      const cx = 50 + (r + offset) * Math.cos(angle); 
      const cy = 50 + (r + offset) * Math.sin(angle);
      
      chairs.push(
        <g key={i} transform={`translate(${cx}, ${cy}) rotate(${degrees - 90})`}>
          <rect x="-8" y="-9" width="16" height="13" rx="3" fill="none" className={`${chairStroke}`} strokeWidth="2.5" />
          <line x1="-6" y1="3" x2="-6" y2="7" className={`${chairStroke}`} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="6" y1="3" x2="6" y2="7" className={`${chairStroke}`} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="-9" y1="7" x2="9" y2="7" className={`${chairStroke}`} strokeWidth="3.5" strokeLinecap="round" />
        </g>
      );
    }
  } else {
    const perSide = Math.ceil(table.seats / 2);
    for(let i=0; i<table.seats; i++) {
      const side = i % 2; 
      const idxInSide = Math.floor(i / 2);
      const availableSpace = 100;
      const step = availableSpace / perSide;
      const x = (step * idxInSide) + (step / 2);
      const y = side === 0 ? 3 : 97; 
      const rot = side === 0 ? 180 : 0;

      chairs.push(
        <g key={i} transform={`translate(${x}, ${y}) rotate(${rot})`}>
          <rect x="-8" y="-9" width="16" height="13" rx="3" fill="none" className={`${chairStroke}`} strokeWidth="2.5" />
          <line x1="-6" y1="3" x2="-6" y2="7" className={`${chairStroke}`} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="6" y1="3" x2="6" y2="7" className={`${chairStroke}`} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="-9" y1="7" x2="9" y2="7" className={`${chairStroke}`} strokeWidth="3.5" strokeLinecap="round" />
        </g>
      );
    }
  }
  return chairs;
};

export const TableVectors: React.FC<TableVectorsProps> = ({ table, tableFill, tableStroke, tableShadow, chairStroke }) => {
  switch(table.type) {
    case 'TABLE_ROUND':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible pointer-events-none">
          {renderChairs(table, chairStroke)}
          <circle cx="50" cy="50" r="49" className={`${tableFill} ${tableStroke} ${tableShadow}`} strokeWidth="2" />
        </svg>
      );
    case 'TABLE_SQUARE':
    case 'TABLE_RECT':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible pointer-events-none">
          {renderChairs(table, chairStroke)}
          <rect x="1" y="1" width="98" height="98" rx="8" className={`${tableFill} ${tableStroke} ${tableShadow}`} strokeWidth="2" />
        </svg>
      );
    case 'BOOTH_SINGLE':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full pointer-events-none drop-shadow-md">
          <path d="M1 12 Q1 1 12 1 L88 1 Q99 1 99 12 L99 26 L1 26 Z" fill="#64748b" stroke="#334155" strokeWidth="2" />
          <rect x="1" y="28" width="98" height="71" rx="6" className={`${tableFill} ${tableStroke}`} strokeWidth="2" />
        </svg>
      );
    case 'BOOTH_DOUBLE':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full pointer-events-none drop-shadow-md">
          <rect x="1" y="18" width="98" height="64" rx="6" className={`${tableFill} ${tableStroke}`} strokeWidth="2" />
          <rect x="1" y="1" width="98" height="15" rx="4" fill="#64748b" stroke="#334155" strokeWidth="2" />
          <rect x="1" y="84" width="98" height="15" rx="4" fill="#64748b" stroke="#334155" strokeWidth="2" />
        </svg>
      );
    case 'PLANT_MONSTERA':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg pointer-events-none">
          <circle cx="50" cy="50" r="15" fill="#3f2e18" /> 
          <circle cx="50" cy="50" r="18" stroke="#78350f" strokeWidth="4" fill="none" /> 
        </svg>
      );
    case 'DECOR_PIANO':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl pointer-events-none">
          <path d="M10 10 L60 10 Q95 10 95 40 L95 90 L10 90 Z" fill="#020617" stroke="#334155" strokeWidth="2" />
        </svg>
      );
    default:
      return (
        <div 
          className="w-full h-full border border-white/40 flex items-center justify-center p-2 rounded-[inherit] overflow-hidden"
          style={{ backgroundColor: table.color || '#e2e8f0' }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none rounded-[inherit]" />
        </div>
      );
  }
};
