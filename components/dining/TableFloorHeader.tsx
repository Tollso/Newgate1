import React from 'react';
import { ArrowLeft, Settings, LayoutGrid } from 'lucide-react';

interface TableFloorHeaderProps {
  onExit: () => void;
  floorSections: string[];
  activeSection: string;
  setActiveSection: (sec: string) => void;
  onOpenSettings?: () => void;
  onOpenDesigner?: () => void;
}

export const TableFloorHeader: React.FC<TableFloorHeaderProps> = ({
  onExit,
  floorSections,
  activeSection,
  setActiveSection,
  onOpenSettings,
  onOpenDesigner
}) => {
  return (
    <div className="bg-white p-4 border-b border-slate-200 flex flex-wrap gap-3 justify-between items-center shadow-sm">
      <div className="flex items-center gap-3">
        <button onClick={onExit} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors" title="Back to Home">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-bold text-slate-800">Table Service</h2>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setActiveSection('All')}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors ${
            activeSection === 'All' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          All
        </button>
        {floorSections.map(sec => (
          <button
            key={sec}
            onClick={() => setActiveSection(sec)}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors ${
              activeSection === sec ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {sec}
          </button>
        ))}

        {onOpenDesigner && (
          <button
            onClick={onOpenDesigner}
            className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors border border-indigo-200 ml-1"
            title="Open Floor Plan Designer"
          >
            <LayoutGrid size={15} /> Floor Designer
          </button>
        )}

        {onOpenSettings && (
          <button
            onClick={onOpenSettings}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors border border-slate-200"
            title="Open Dining & Table Settings"
          >
            <Settings size={15} /> Table Settings
          </button>
        )}
      </div>
    </div>
  );
};
