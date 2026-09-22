import React, { useState, useEffect } from 'react';
import { DiningTable, FloorItemType } from '../../types';
import { MOCK_FLOOR_TABLES } from '../../constants';
import { Save, X, Plus } from 'lucide-react';
import { DiningFloorCanvas } from './DiningFloorCanvas';

interface DiningDashboardProps {
  initialTables?: DiningTable[];
  onSaveFloorPlan?: (tables: DiningTable[]) => void;
  onOpenDesigner?: () => void;
}

const DiningDashboard: React.FC<DiningDashboardProps> = ({ initialTables, onSaveFloorPlan, onOpenDesigner }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [tables, setTables] = useState<DiningTable[]>(initialTables || MOCK_FLOOR_TABLES);
  
  useEffect(() => {
    if (initialTables && initialTables.length > 0) {
      setTables(initialTables);
    }
  }, [initialTables]);

  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  
  // Dynamically compute sections from actual saved tables
  const sectionsFromTables = Array.from(new Set(tables.map(t => t.section).filter(Boolean))) as string[];
  const sections = sectionsFromTables.length > 0 ? sectionsFromTables : ['Main Floor', 'Dining Room', 'Patio', 'Bar'];
  const [activeSection, setActiveSection] = useState<string>('All');

  const handleAddItem = (type: FloorItemType) => {
    const isSeatable = type.includes('TABLE') || type.includes('BOOTH') || type.includes('COUCH');
    let w = 110;
    let h = 110;
    if (type.includes('RECT') || type.includes('BOOTH') || type.includes('BILLIARDS') || type.includes('PIANO')) {
      w = 140; h = 90;
    } else if (type.includes('BAR')) {
      w = 200; h = 80;
    }

    const targetSection = activeSection === 'All' ? (sections[0] || 'Main Floor') : activeSection;

    const newItem: DiningTable = {
      id: `ITEM-${Date.now()}`,
      name: isSeatable ? `${tables.filter(t => t.isSeatable).length + 1}` : '',
      type,
      section: targetSection,
      x: 100,
      y: 100,
      width: w,
      height: h,
      seats: isSeatable ? 4 : 0,
      status: 'Available',
      isSeatable,
      rotation: 0,
      businessId: 'B001'
    };

    setTables([...tables, newItem]);
    setSelectedTableId(newItem.id);
  };

  const handleSave = () => {
    if (onSaveFloorPlan) {
      onSaveFloorPlan(tables);
      setIsEditMode(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex flex-col gap-1 shrink-0">
        <h1 className="text-2xl font-bold text-slate-800">Dining Floor Plan</h1>
        <p className="text-slate-500 font-medium">Floor Plan Management & Live Status</p>
      </div>

      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm shrink-0 flex-wrap gap-3">
        <div className="flex gap-2 flex-wrap items-center">
          <button
            onClick={() => setActiveSection('All')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSection === 'All' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Tables ({tables.length})
          </button>
          {sections.map(sec => (
            <button
              key={sec}
              onClick={() => setActiveSection(sec)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeSection === sec ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {sec} ({tables.filter(t => t.section === sec).length})
            </button>
          ))}
        </div>
        <div className="flex gap-2 items-center">
          {onOpenDesigner && (
            <button
              onClick={onOpenDesigner}
              className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-lg transition-colors border border-indigo-200"
            >
              Floor Plan Designer
            </button>
          )}
          {isEditMode ? (
            <>
              <button onClick={handleSave} className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-lg flex items-center gap-1">
                <Save size={14} /> Save
              </button>
              <button onClick={() => setIsEditMode(false)} className="px-4 py-2 bg-slate-200 text-slate-700 font-bold text-xs rounded-lg flex items-center gap-1">
                <X size={14} /> Cancel
              </button>
            </>
          ) : (
            <button onClick={() => setIsEditMode(true)} className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-lg">
              Edit Layout
            </button>
          )}
        </div>
      </div>

      {isEditMode && (
        <div className="flex gap-2 shrink-0 bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
           <button onClick={() => handleAddItem('TABLE_ROUND')} className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded hover:bg-slate-200 flex items-center gap-1"><Plus size={12}/> Round Table</button>
           <button onClick={() => handleAddItem('TABLE_RECT')} className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded hover:bg-slate-200 flex items-center gap-1"><Plus size={12}/> Rect Table</button>
           <button onClick={() => handleAddItem('FURNITURE_BAR')} className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded hover:bg-slate-200 flex items-center gap-1"><Plus size={12}/> Bar</button>
        </div>
      )}

      <DiningFloorCanvas
        tables={tables}
        activeSection={activeSection}
        isEditMode={isEditMode}
        selectedTableId={selectedTableId}
        onTableSelected={setSelectedTableId}
        onTablesChange={setTables}
      />
    </div>
  );
};

export default DiningDashboard;
