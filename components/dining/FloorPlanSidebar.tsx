import React from 'react';
import { Box } from 'lucide-react';
import { FloorItemType } from '../../types';
import { FLOOR_PLAN_CATEGORIES } from './floor_plan/floorPlanItems';
import { ArchitectureSection } from './floor_plan/ArchitectureSection';

interface FloorPlanSidebarProps {
  businessType: string;
  onDragStart: (e: React.DragEvent, type: FloorItemType) => void;
}

export const FloorPlanSidebar: React.FC<FloorPlanSidebarProps> = ({ businessType, onDragStart }) => {
  const visibleCategories = FLOOR_PLAN_CATEGORIES.filter(c => c.showIf(businessType));

  return (
    <div className="w-[300px] bg-white/80 backdrop-blur-xl border-r border-white/50 flex flex-col z-20 shadow-[4px_0_24px_-8px_rgba(0,0,0,0.05)]">
      <div className="p-5 border-b border-slate-100/50">
        <h3 className="font-bold text-slate-800 text-xs uppercase tracking-widest flex items-center gap-2">
          <Box size={16} className="text-indigo-500" />
          Objects Library
        </h3>
      </div>
      
      <div className="p-4 overflow-y-auto space-y-6 flex-1 scrollbar-hide">
        {visibleCategories.map(cat => (
          <div key={cat.title}>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">{cat.title}</h4>
            <div className="grid grid-cols-2 gap-3">
              {cat.items.map(item => (
                <div 
                  key={item.type}
                  draggable
                  onDragStart={(e) => onDragStart(e, item.type as FloorItemType)}
                  className="bg-slate-50 border border-slate-200 rounded-lg p-3 cursor-grab hover:border-indigo-400 hover:shadow-sm flex flex-col items-center gap-2 transition-all"
                >
                  <div className={`w-10 h-10 border-2 ${item.colorBorder || 'border-slate-300'} ${item.colorBg || ''} ${item.shape === 'round' ? 'rounded-full' : 'rounded-md'}`} />
                  <span className="text-[10px] font-bold text-slate-600 text-center">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        ))}

        <ArchitectureSection businessType={businessType} onDragStart={onDragStart} />
      </div>
    </div>
  );
};
