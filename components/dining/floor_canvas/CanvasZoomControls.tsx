import React from 'react';
import { ZoomIn, ZoomOut, Maximize, RotateCcw } from 'lucide-react';

interface CanvasZoomControlsProps {
  scale: number;
  zoomIn: () => void;
  zoomOut: () => void;
  fitToScreen: () => void;
  resetZoom: () => void;
}

export const CanvasZoomControls: React.FC<CanvasZoomControlsProps> = ({
  scale,
  zoomIn,
  zoomOut,
  fitToScreen,
  resetZoom,
}) => {
  return (
    <>
      <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg border border-slate-200 flex flex-col overflow-hidden z-50">
        <button onClick={zoomIn} className="p-2 hover:bg-slate-50 text-slate-700 border-b border-slate-100" title="Zoom In">
          <ZoomIn size={18} />
        </button>
        <button onClick={zoomOut} className="p-2 hover:bg-slate-50 text-slate-700 border-b border-slate-100" title="Zoom Out">
          <ZoomOut size={18} />
        </button>
        <button onClick={fitToScreen} className="p-2 hover:bg-slate-50 text-slate-700 border-b border-slate-100" title="Fit to Screen">
          <Maximize size={18} />
        </button>
        <button onClick={resetZoom} className="p-2 hover:bg-slate-50 text-slate-700" title="Reset Zoom">
          <RotateCcw size={18} />
        </button>
      </div>
      <div className="absolute bottom-4 left-4 bg-white/80 px-2 py-1 rounded-md text-xs font-bold text-slate-500 shadow-sm border border-slate-200 pointer-events-none">
        {Math.round(scale * 100)}%
      </div>
    </>
  );
};
