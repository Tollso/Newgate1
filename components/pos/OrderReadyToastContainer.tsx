import React, { useEffect, useState, useRef } from 'react';
import { CheckCircle, X } from 'lucide-react';
import { Notification } from '../../types';

interface OrderReadyToastItemProps {
  notification: Notification;
  onDismiss: (id: string) => void;
}

export const OrderReadyToastItem: React.FC<OrderReadyToastItemProps> = ({ notification, onDismiss }) => {
  const [translateX, setTranslateX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const startXRef = useRef<number | null>(null);
  const currentXRef = useRef<number>(0);

  // Auto disappear after 2 seconds (2000ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(notification.id);
    }, 2000);

    return () => clearTimeout(timer);
  }, [notification.id, onDismiss]);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startXRef.current === null) return;
    const diff = e.touches[0].clientX - startXRef.current;
    currentXRef.current = diff;
    setTranslateX(diff);
  };

  const handleTouchEnd = () => {
    if (!isSwiping) return;
    setIsSwiping(false);
    if (Math.abs(currentXRef.current) > 50) {
      onDismiss(notification.id);
    } else {
      setTranslateX(0);
    }
    startXRef.current = null;
    currentXRef.current = 0;
  };

  // Mouse handlers for desktop swipe/drag
  const handleMouseDown = (e: React.MouseEvent) => {
    startXRef.current = e.clientX;
    setIsSwiping(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isSwiping || startXRef.current === null) return;
    const diff = e.clientX - startXRef.current;
    currentXRef.current = diff;
    setTranslateX(diff);
  };

  const handleMouseUp = () => {
    if (!isSwiping) return;
    setIsSwiping(false);
    if (Math.abs(currentXRef.current) > 50) {
      onDismiss(notification.id);
    } else {
      setTranslateX(0);
    }
    startXRef.current = null;
    currentXRef.current = 0;
  };

  const opacity = Math.max(0.1, 1 - Math.abs(translateX) / 180);

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{
        transform: `translateX(${translateX}px)`,
        opacity: opacity,
        transition: isSwiping ? 'none' : 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease-out',
      }}
      className="bg-slate-900 border-l-4 border-emerald-500 rounded-xl shadow-2xl p-4 flex items-start gap-3.5 w-80 cursor-grab active:cursor-grabbing select-none border border-slate-800 text-white relative overflow-hidden backdrop-blur-md"
    >
      {/* 2-second countdown visual indicator bar */}
      <div 
        className="absolute bottom-0 left-0 h-1 bg-emerald-500/80"
        style={{
          animation: 'notification-shrink 2000ms linear forwards'
        }}
      />
      <style>{`
        @keyframes notification-shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>

      <div className="bg-emerald-500/20 text-emerald-400 p-2 rounded-xl shrink-0 mt-0.5 border border-emerald-500/30">
        <CheckCircle size={20} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-emerald-400 text-sm flex items-center gap-1.5">
            Order Ready!
          </h4>
          <span className="text-[10px] font-semibold text-slate-400">
            {new Date(notification.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <p className="text-xs text-slate-200 mt-1 font-semibold leading-snug">{notification.message}</p>
        <p className="text-[10px] text-slate-400 mt-1.5 flex items-center gap-1">
          <span>Swipe left/right to dismiss</span>
        </p>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onDismiss(notification.id);
        }}
        className="text-slate-400 hover:text-white p-1 hover:bg-slate-800 rounded-lg transition-colors shrink-0"
        title="Dismiss"
      >
        <X size={16} />
      </button>
    </div>
  );
};

interface OrderReadyToastContainerProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

export const OrderReadyToastContainer: React.FC<OrderReadyToastContainerProps> = ({
  notifications,
  onDismiss,
}) => {
  if (!notifications || notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-6 z-[9999] flex flex-col gap-2.5 pointer-events-auto">
      {notifications.map((notif) => (
        <OrderReadyToastItem
          key={notif.id}
          notification={notif}
          onDismiss={onDismiss}
        />
      ))}
    </div>
  );
};
