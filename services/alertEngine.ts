/**
 * AlertEngine
 * Operational monitoring for printer/KDS offline, low stock, cash variance, and sync failures.
 * Section 12 of the Newgate Platform Architecture.
 */

import { RealtimeTransport } from './realtimeTransport';

export type AlertSeverity = 'INFO' | 'WARNING' | 'CRITICAL';

export interface SystemAlert {
  id: string;
  type: 'PRINTER_OFFLINE' | 'KDS_OFFLINE' | 'LOW_STOCK' | 'CASH_VARIANCE' | 'SYNC_FAILURE' | 'DEVICE_ERROR';
  severity: AlertSeverity;
  title: string;
  message: string;
  sourceId?: string;
  timestamp: string;
  isDismissed: boolean;
}

export class AlertEngine {
  private static alerts: SystemAlert[] = [];
  private static listeners: Set<(alerts: SystemAlert[]) => void> = new Set();

  static notify(alert: Omit<SystemAlert, 'id' | 'timestamp' | 'isDismissed'>): SystemAlert {
    const newAlert: SystemAlert = {
      id: `alt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      ...alert,
      timestamp: new Date().toISOString(),
      isDismissed: false,
    };

    this.alerts.unshift(newAlert);
    if (this.alerts.length > 50) this.alerts.pop();

    RealtimeTransport.publish('alert:triggered', newAlert);
    this.emitChange();
    return newAlert;
  }

  static dismiss(alertId: string) {
    const a = this.alerts.find(x => x.id === alertId);
    if (a) {
      a.isDismissed = true;
      this.emitChange();
    }
  }

  static getActiveAlerts(): SystemAlert[] {
    return this.alerts.filter(a => !a.isDismissed);
  }

  static subscribe(listener: (alerts: SystemAlert[]) => void): () => void {
    this.listeners.add(listener);
    listener(this.getActiveAlerts());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private static emitChange() {
    const active = this.getActiveAlerts();
    this.listeners.forEach(fn => fn(active));
  }
}
