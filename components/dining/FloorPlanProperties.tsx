import React from 'react';
import { Monitor, Trash2 } from 'lucide-react';
import { DiningTable } from '../../types';

interface FloorPlanPropertiesProps {
  selectedTableId: string | null;
  tables: DiningTable[];
  onUpdateSelected: (updates: Partial<DiningTable>) => void;
  onDeleteSelected: () => void;
}

export const FloorPlanProperties: React.FC<FloorPlanPropertiesProps> = ({
  selectedTableId,
  tables,
  onUpdateSelected,
  onDeleteSelected,
}) => {
  const table = selectedTableId ? tables.find(t => t.id === selectedTableId) : null;

  return (
    <div className="w-[300px] bg-white/80 backdrop-blur-xl border-l border-white/50 z-20 flex flex-col shadow-[-4px_0_24px_-8px_rgba(0,0,0,0.05)]">
      <div className="p-5 border-b border-slate-100/50">
        <h3 className="font-bold text-slate-800 text-xs uppercase tracking-widest flex items-center gap-2">
          <Monitor size={16} className="text-indigo-500" />
          Properties
        </h3>
      </div>
      
      {table ? (
        <div className="p-5 space-y-6 flex-1 overflow-y-auto scrollbar-hide">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Name / Label</label>
            <input 
              type="text" 
              value={table.name} 
              onChange={(e) => onUpdateSelected({ name: e.target.value })}
              className="w-full bg-slate-50/50 border border-slate-200/50 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Floor Section</label>
            <select 
              value={table.section || 'Main Floor'} 
              onChange={(e) => onUpdateSelected({ section: e.target.value })}
              className="w-full bg-slate-50/50 border border-slate-200/50 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-sm appearance-none cursor-pointer"
            >
              <option value="Main Floor">Main Floor</option>
              <option value="Bar Area">Bar Area</option>
              <option value="Patio">Patio</option>
              <option value="VIP Lounge">VIP Lounge</option>
              <option value="Poolside">Poolside</option>
              <option value="Entrance">Entrance</option>
              <option value="Terrace">Terrace</option>
              <option value="Meeting Room">Meeting Room</option>
              <option value="Wait Area">Wait Area</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Width</label>
              <input 
                type="number" 
                value={table.width} 
                onChange={(e) => onUpdateSelected({ width: parseInt(e.target.value) || 0 })}
                className="w-full bg-slate-50/50 border border-slate-200/50 rounded-xl px-4 py-2.5 text-sm font-mono font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Height</label>
              <input 
                type="number" 
                value={table.height} 
                onChange={(e) => onUpdateSelected({ height: parseInt(e.target.value) || 0 })}
                className="w-full bg-slate-50/50 border border-slate-200/50 rounded-xl px-4 py-2.5 text-sm font-mono font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Rotation (deg)</label>
              <input 
                type="number" 
                value={table.rotation || 0} 
                onChange={(e) => onUpdateSelected({ rotation: parseInt(e.target.value) || 0 })}
                className="w-full bg-slate-50/50 border border-slate-200/50 rounded-xl px-4 py-2.5 text-sm font-mono font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Seats</label>
              <input 
                type="number" 
                value={table.seats} 
                onChange={(e) => onUpdateSelected({ seats: parseInt(e.target.value) || 0 })}
                className="w-full bg-slate-50/50 border border-slate-200/50 rounded-xl px-4 py-2.5 text-sm font-mono font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-sm"
              />
            </div>
          </div>
          
          <div className="space-y-1.5 flex items-center justify-between bg-slate-50/50 p-3 rounded-xl border border-slate-200/50 shadow-sm">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Seatable / Orderable</label>
              <p className="text-[10px] text-slate-500">Allow orders on this item</p>
            </div>
            <button 
              onClick={() => onUpdateSelected({ isSeatable: !table.isSeatable })}
              className={`w-12 h-6 rounded-full relative transition-all ${table.isSeatable ? 'bg-indigo-600' : 'bg-slate-300'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${table.isSeatable ? 'left-7' : 'left-1'}`} />
            </button>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Fill Color</label>
            <div className="flex gap-3">
              <div className="relative w-12 h-12 rounded-xl border border-slate-200 shadow-sm overflow-hidden shrink-0">
                <input 
                  type="color" 
                  value={table.color || '#ffffff'} 
                  onChange={(e) => onUpdateSelected({ color: e.target.value })}
                  className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer border-none p-0 bg-transparent"
                />
              </div>
              <input 
                type="text" 
                value={table.color || '#ffffff'} 
                onChange={(e) => onUpdateSelected({ color: e.target.value })}
                className="flex-1 bg-slate-50/50 border border-slate-200/50 rounded-xl px-4 text-sm font-mono font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-100/50">
            <button 
              onClick={onDeleteSelected}
              className="w-full py-3 bg-rose-50 text-rose-600 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-rose-100 hover:text-rose-700 transition-all active:scale-95 flex items-center justify-center gap-2 border border-rose-100/50 shadow-sm"
            >
              <Trash2 size={16} /> Delete Object
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center opacity-70">
          <Monitor size={48} className="text-slate-200 mb-4 stroke-[1.5]" />
          <p className="text-sm font-medium">Select an item on the canvas to configure properties.</p>
        </div>
      )}
    </div>
  );
};
