import React, { useState, useEffect } from 'react';
import { Save, Layout, Monitor, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { DiningTable, FloorItemType } from '../../types';
import { FloorPlanSidebar } from './FloorPlanSidebar';
import { FloorPlanProperties } from './FloorPlanProperties';
import { getAutoLayout } from './FloorPlanAutoLayouts';
import { createFloorItem, BUSINESS_TYPES } from './floorPlanItemCreation';
import { DiningFloorCanvas } from './DiningFloorCanvas';
import { saveFloorPlan } from './floorPlanStorage';

interface FloorPlanDesignerProps {
  tables: DiningTable[];
  onSave: (tables: DiningTable[]) => void;
  onExit: () => void;
  businessId?: string;
}

export default function FloorPlanDesigner({ tables: initialTables, onSave, onExit, businessId = 'B001' }: FloorPlanDesignerProps) {
  const [tables, setTables] = useState<DiningTable[]>(initialTables);
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [businessType, setBusinessType] = useState('Restaurant');
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const tablesRef = React.useRef(tables);
  useEffect(() => {
    tablesRef.current = tables;
  }, [tables]);

  // Keep synced if parent changes initialTables
  useEffect(() => {
    if (initialTables && initialTables.length > 0) {
      setTables(initialTables);
    }
  }, [initialTables]);

  // Ensure unmounting or screen changing preserves layout permanently
  useEffect(() => {
    return () => {
      if (tablesRef.current && tablesRef.current.length > 0) {
        const persisted = saveFloorPlan(tablesRef.current, businessId);
        onSave(persisted);
      }
    };
  }, [businessId, onSave]);
  
  const handleDragStart = (e: React.DragEvent, type: FloorItemType) => {
    e.dataTransfer.setData('type', type);
  };

  const handleDropItem = (type: FloorItemType, x: number, y: number) => {
    const dummyRect = { left: 0, top: 0 } as DOMRect;
    const newTable = createFloorItem(type, x, y, dummyRect, businessId);
    const updated = [...tables, newTable];
    setTables(updated);
    setSelectedTableId(newTable.id);
  };

  const updateSelected = (updates: Partial<DiningTable>) => {
    if (!selectedTableId) return;
    setTables(prev => prev.map(t => t.id === selectedTableId ? { ...t, ...updates } : t));
  };

  const deleteSelected = () => {
    if (!selectedTableId) return;
    setTables(tables.filter(t => t.id !== selectedTableId));
    setSelectedTableId(null);
  };

  const handleAutoLayout = () => {
    const layout = getAutoLayout(businessType, businessId);
    setTables(layout);
  };

  const handleSaveLayout = () => {
    const persisted = saveFloorPlan(tables, businessId);
    onSave(persisted);
    setSaveMessage('Saved Permanently!');
    setTimeout(() => setSaveMessage(null), 3500);
  };

  const handleExitToHub = () => {
    const persisted = saveFloorPlan(tables, businessId);
    onSave(persisted);
    onExit();
  };

  const handleBack = () => {
    const persisted = saveFloorPlan(tables, businessId);
    onSave(persisted);
    onExit();
  };

  return (
    <div className="h-screen w-full bg-slate-100 flex flex-col font-sans">
      <div className="h-16 bg-white/80 backdrop-blur-xl border-b border-white/50 px-6 flex items-center justify-between shadow-sm z-30 shrink-0 sticky top-0">
        <div className="flex items-center gap-4">
          <button onClick={handleBack} className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all" title="Back">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-slate-900 leading-none tracking-tight">Space Architect</h1>
            <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-widest mt-0.5">Enterprise Layout Editor</p>
          </div>
          {saveMessage && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-lg animate-fade-in shadow-sm">
              <CheckCircle2 size={14} className="text-emerald-600" />
              <span>{saveMessage}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <select 
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              className="appearance-none bg-slate-100/50 hover:bg-slate-100 border border-slate-200/50 text-sm font-semibold text-slate-700 py-2 pl-4 pr-10 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all cursor-pointer"
            >
              {BUSINESS_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <button 
            onClick={handleAutoLayout}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl font-bold text-sm hover:shadow-md transition-all active:scale-95"
          >
            <Layout size={16} /> Auto-Generate
          </button>
          <button 
            onClick={handleSaveLayout}
            className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-lg hover:bg-slate-800 transition-all active:scale-95"
          >
            <Save size={16} /> Save Layout
          </button>
          <button 
            onClick={handleExitToHub}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 shadow-md transition-all active:scale-95 ml-2"
          >
            <Monitor size={16} /> Open Dining Hub
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        <FloorPlanSidebar businessType={businessType} onDragStart={handleDragStart} />
        
        <div className="flex-1 flex relative bg-slate-50/50 overflow-hidden">
          <DiningFloorCanvas
            tables={tables}
            isEditMode={true}
            selectedTableId={selectedTableId}
            onTableSelected={setSelectedTableId}
            onTablesChange={setTables}
            onDropItem={handleDropItem}
          />
        </div>

        <FloorPlanProperties 
          selectedTableId={selectedTableId}
          tables={tables}
          onUpdateSelected={updateSelected}
          onDeleteSelected={deleteSelected}
        />
      </div>
    </div>
  );
}
