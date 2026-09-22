import { useState, useEffect, useRef, useCallback } from 'react';

interface UseKioskInactivityProps {
  timeoutSeconds: number;
  isActiveSession: boolean;
  onTimeoutReset: () => void;
}

export function useKioskInactivity({
  timeoutSeconds = 60,
  isActiveSession,
  onTimeoutReset
}: UseKioskInactivityProps) {
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);
  const [countdownSeconds, setCountdownSeconds] = useState(30);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const resetInactivityTimer = useCallback(() => {
    if (showTimeoutWarning) return;
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);

    if (isActiveSession) {
      const timeoutMs = (timeoutSeconds || 60) * 1000;
      inactivityTimerRef.current = setTimeout(() => {
        setShowTimeoutWarning(true);
        setCountdownSeconds(30);
      }, timeoutMs);
    }
  }, [isActiveSession, timeoutSeconds, showTimeoutWarning]);

  useEffect(() => {
    if (showTimeoutWarning) {
      countdownIntervalRef.current = setInterval(() => {
        setCountdownSeconds(prev => {
          if (prev <= 1) {
            onTimeoutReset();
            return 30;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    }
    return () => {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [showTimeoutWarning, onTimeoutReset]);

  useEffect(() => {
    const activityEvents = ['touchstart', 'mousedown', 'keydown', 'pointerdown'];
    const handleUserInteraction = () => resetInactivityTimer();
    activityEvents.forEach(evt => window.addEventListener(evt, handleUserInteraction, { passive: true }));
    resetInactivityTimer();

    return () => {
      activityEvents.forEach(evt => window.removeEventListener(evt, handleUserInteraction));
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    };
  }, [resetInactivityTimer]);

  const handleExtendSession = () => {
    setShowTimeoutWarning(false);
    resetInactivityTimer();
  };

  return {
    showTimeoutWarning,
    countdownSeconds,
    handleExtendSession,
    setShowTimeoutWarning
  };
}
