import React, { useState } from 'react';
import { DiningTable } from '../../types';
import InteractiveTable from './InteractiveTable';
import { useCanvasPanZoom } from './floor_canvas/useCanvasPanZoom';
import { CanvasZoomControls } from './floor_canvas/CanvasZoomControls';

interface KitchenStatus {
  status: 'Pending' | 'Prep' | 'Ready' | 'Delivered';
  queuePosition?: number;
  ticketId?: string;
}

interface DiningFloorCanvasProps {
  tables: DiningTable[];
  activeSection?: string;
  isEditMode?: boolean;
  selectedTableId?: string | null;
  onTableSelected?: (id: string | null) => void;
  onTablesChange?: (tables: DiningTable[]) => void;
  onTableClick?: (table: DiningTable) => void;
  kitchenStatusMap?: Record<string, KitchenStatus>;
  onDropItem?: (type: any, x: number, y: number) => void;
}

export const DiningFloorCanvas: React.FC<DiningFloorCanvasProps> = ({
  tables,
  activeSection,
  isEditMode = false,
  selectedTableId = null,
  onTableSelected,
  onTablesChange,
  onTableClick,
  kitchenStatusMap = {},
  onDropItem
}) => {
  const [interactionMode, setInteractionMode] = useState<'DRAG' | 'RESIZE' | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialDims, setInitialDims] = useState({ x: 0, y: 0, w: 0, h: 0 });
  
  const activeTables = (!activeSection || activeSection === 'All') ? tables : tables.filter(t => t.section === activeSection);
  const { scale, pan, setPan, isPanning, setIsPanning, panStart, setPanStart, canvasRef, zoomIn, zoomOut, resetZoom, fitToScreen } = useCanvasPanZoom(activeTables);

  const GRID_SIZE = 10;
  const snap = (value: number) => Math.round(value / GRID_SIZE) * GRID_SIZE;

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.button !== 1) return;
    if (e.button === 1 || (!isEditMode) || (e.button === 0 && (e.target as Element).id === 'canvas-bg')) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      if (isEditMode && onTableSelected) onTableSelected(null);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isPanning) {
      setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
      return;
    }
    if (isEditMode && interactionMode && selectedTableId && onTablesChange) {
      const dx = (e.clientX - dragStart.x) / scale;
      const dy = (e.clientY - dragStart.y) / scale;
      onTablesChange(tables.map(t => {
        if (t.id === selectedTableId) {
          if (interactionMode === 'DRAG') return { ...t, x: snap(initialDims.x + dx), y: snap(initialDims.y + dy) };
          if (interactionMode === 'RESIZE') return { ...t, width: Math.max(70, snap(initialDims.w + dx)), height: Math.max(70, snap(initialDims.h + dy)) };
        }
        return t;
      }));
    }
  };

  const handlePointerUp = () => {
    setIsPanning(false);
    setInteractionMode(null);
  };

  const handleTableClickEvent = (e: React.MouseEvent | React.PointerEvent, table: DiningTable, isResizeHandle: boolean) => {
    e.stopPropagation();
    if (isEditMode) {
      if (onTableSelected) onTableSelected(table.id);
      if (e.type === 'pointerdown') {
        const pe = e as React.PointerEvent;
        setInteractionMode(isResizeHandle ? 'RESIZE' : 'DRAG');
        setDragStart({ x: pe.clientX, y: pe.clientY });
        setInitialDims({ x: table.x, y: table.y, w: table.width, h: table.height });
      }
    } else if (e.type === 'pointerdown' && onTableClick) {
      onTableClick(table);
    }
  };

  const handleDropEvent = (e: React.DragEvent) => {
    e.preventDefault();
    if (!onDropItem || !canvasRef.current) return;
    const type = e.dataTransfer.getData('type');
    if (!type) return;
    const rect = canvasRef.current.getBoundingClientRect();
    onDropItem(type, (e.clientX - rect.left - pan.x) / scale, (e.clientY - rect.top - pan.y) / scale);
  };

  return (
    <div 
      className={`flex-1 bg-slate-100 rounded-2xl relative overflow-hidden select-none ${isPanning ? 'cursor-grabbing' : (isEditMode ? 'cursor-default' : 'cursor-grab')} border border-slate-300 shadow-inner`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onDrop={handleDropEvent}
      onDragOver={(e) => e.preventDefault()}
      ref={canvasRef}
    >
      <div 
        id="canvas-bg"
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.1) 1.5px, transparent 1.5px)',
          backgroundSize: `${20 * scale}px ${20 * scale}px`,
          backgroundPosition: `${pan.x}px ${pan.y}px`
        }}
      />
      
      <div 
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
          transformOrigin: '0 0',
          transition: isPanning || interactionMode ? 'none' : 'transform 0.1s ease-out'
        }}
        className="absolute inset-0 origin-top-left"
      >
        {activeTables.map(table => (
          <InteractiveTable
            key={table.id}
            table={table}
            isEditing={isEditMode}
            isSelected={table.id === selectedTableId}
            onClick={handleTableClickEvent}
            kitchenStatus={kitchenStatusMap[table.name]}
            zoomScale={scale}
          />
        ))}
      </div>

      <CanvasZoomControls scale={scale} zoomIn={zoomIn} zoomOut={zoomOut} fitToScreen={fitToScreen} resetZoom={resetZoom} />
    </div>
  );
};
