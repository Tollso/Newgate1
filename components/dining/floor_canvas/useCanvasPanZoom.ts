import { useState, useRef, useEffect, useCallback } from 'react';
import { DiningTable } from '../../../types';

export const useCanvasPanZoom = (activeTables: DiningTable[]) => {
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    if (e.ctrlKey || e.metaKey) {
      const zoomSensitivity = 0.002;
      const delta = -e.deltaY * zoomSensitivity;
      setScale(s => Math.min(Math.max(0.3, s + delta), 3));
    } else {
      setPan(p => ({
        x: p.x - e.deltaX,
        y: p.y - e.deltaY
      }));
    }
  }, []);

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  const zoomIn = () => setScale(s => Math.min(3, s + 0.2));
  const zoomOut = () => setScale(s => Math.max(0.3, s - 0.2));
  const resetZoom = () => { setScale(1); setPan({ x: 0, y: 0 }); };

  const fitToScreen = () => {
    if (activeTables.length === 0 || !canvasRef.current) return;
    const padding = 50;
    const minX = Math.min(...activeTables.map(t => t.x));
    const minY = Math.min(...activeTables.map(t => t.y));
    const maxX = Math.max(...activeTables.map(t => t.x + t.width));
    const maxY = Math.max(...activeTables.map(t => t.y + t.height));
    
    const contentWidth = maxX - minX;
    const contentHeight = maxY - minY;
    
    const canvasWidth = canvasRef.current.clientWidth - (padding * 2);
    const canvasHeight = canvasRef.current.clientHeight - (padding * 2);
    
    const scaleX = canvasWidth / Math.max(1, contentWidth);
    const scaleY = canvasHeight / Math.max(1, contentHeight);
    const newScale = Math.min(2, Math.max(0.3, Math.min(scaleX, scaleY)));
    
    setScale(newScale);
    setPan({
      x: (canvasRef.current.clientWidth - (contentWidth * newScale)) / 2 - (minX * newScale),
      y: (canvasRef.current.clientHeight - (contentHeight * newScale)) / 2 - (minY * newScale)
    });
  };

  return {
    scale,
    setScale,
    pan,
    setPan,
    isPanning,
    setIsPanning,
    panStart,
    setPanStart,
    canvasRef,
    zoomIn,
    zoomOut,
    resetZoom,
    fitToScreen,
  };
};
