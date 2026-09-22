import { DiningTable } from '../../../types';

export interface TableStyleConfig {
  tableFill: string;
  tableStroke: string;
  tableShadow: string;
  chairStroke: string;
  ringColor: string;
  labelColor: string;
  statusBadge: 'RSVP' | 'LATE' | null;
}

export const getTableStyles = (table: DiningTable, elapsedMinutes: number, expected: number): TableStyleConfig => {
  let tableFill = 'fill-slate-100';
  let tableStroke = 'stroke-slate-300';
  let tableShadow = 'drop-shadow-sm';
  let chairStroke = 'stroke-slate-400';
  let ringColor = '#cbd5e1'; 
  let labelColor = 'text-slate-600';
  let statusBadge: 'RSVP' | 'LATE' | null = null;

  if (table.isSeatable) {
    if (table.highlight) {
      tableFill = 'fill-yellow-50';
      tableStroke = 'stroke-yellow-400';
      chairStroke = 'stroke-yellow-600';
      labelColor = 'text-yellow-800';
    } else if (table.status === 'Available') {
      tableFill = 'fill-white';
      tableStroke = 'stroke-slate-300';
      chairStroke = 'stroke-slate-400';
      labelColor = 'text-slate-600';
    } else if (table.status === 'Reserved') {
      tableFill = 'fill-indigo-50';
      tableStroke = 'stroke-indigo-300';
      chairStroke = 'stroke-indigo-400';
      labelColor = 'text-indigo-800';
      ringColor = '#818cf8';
      statusBadge = 'RSVP';
    } else if (table.status === 'Occupied') {
      tableFill = 'fill-blue-50';
      tableStroke = 'stroke-blue-400';
      chairStroke = 'stroke-blue-600';
      labelColor = 'text-blue-900';
      ringColor = '#3b82f6';
    } else if (table.status === 'Overdue' || (elapsedMinutes > expected)) {
      tableFill = 'fill-red-50';
      tableStroke = 'stroke-red-500';
      chairStroke = 'stroke-red-600';
      labelColor = 'text-red-900';
      ringColor = '#ef4444';
      statusBadge = 'LATE';
    } else if (table.status === 'Dirty') {
      tableFill = 'fill-amber-50';
      tableStroke = 'stroke-amber-400';
      chairStroke = 'stroke-amber-500';
      labelColor = 'text-amber-900';
    } else if (table.status === 'Payment') {
      tableFill = 'fill-emerald-50';
      tableStroke = 'stroke-emerald-400';
      chairStroke = 'stroke-emerald-500';
      labelColor = 'text-emerald-900';
    }
  } else {
    tableFill = 'fill-slate-200';
    tableStroke = 'stroke-slate-400';
  }

  return { tableFill, tableStroke, tableShadow, chairStroke, ringColor, labelColor, statusBadge };
};

export const getTableShapeBounds = (type: string) => {
  switch (type) {
    case 'TABLE_ROUND':
      return { left: '0%', top: '0%', width: '100%', height: '100%', borderRadius: '50%' };
    case 'TABLE_SQUARE':
    case 'TABLE_RECT':
      return { left: '0%', top: '0%', width: '100%', height: '100%', borderRadius: '8px' };
    case 'BOOTH_SINGLE':
    case 'BOOTH_DOUBLE':
      return { left: '0%', top: '0%', width: '100%', height: '100%', borderRadius: '6px' };
    default:
      return { left: '0%', top: '0%', width: '100%', height: '100%', borderRadius: 'inherit' };
  }
};
