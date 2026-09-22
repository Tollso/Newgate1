/**
 * NativeBridge & Hardware Abstraction Layer (HAL)
 * Permanent Android runtime interface for hardware, peripheral control, and lock-task kiosk.
 * Supports Android Capacitor Plugins and window.NewgateNativeBridge interface.
 */

import { Capacitor } from '@capacitor/core';

export type ScannerSource = 'KEYBOARD_WEDGE' | 'CAMERA_SCANNER' | 'BROADCAST_INTENT';

export interface INativeBridge {
  isAndroidRuntime(): boolean;
  pulseCashDrawer(printerIp?: string, printerPort?: number): Promise<boolean>;
  beep(toneFrequency?: number, durationMs?: number): void;
  setLockTaskMode(enabled: boolean): Promise<boolean>;
  getBatteryLevel(): Promise<number>;
  triggerBarcodeScan(): Promise<string | null>;
  sendCustomerDisplay(line1: string, line2: string): Promise<boolean>;
  printReceipt(rawText: string, printerIp?: string, printerPort?: number): Promise<boolean>;
  onBarcodeScanned(callback: (barcode: string, source: ScannerSource) => void): () => void;
  sqliteSet(key: string, value: any): Promise<boolean>;
  sqliteGet<T>(key: string): Promise<T | null>;
}

class NativeBridgeImpl implements INativeBridge {
  private barcodeListeners: Set<(barcode: string, source: ScannerSource) => void> = new Set();
  private keyBuffer: string = '';
  private lastKeyTime: number = 0;
  private wedgeAttached: boolean = false;

  constructor() {
    this.initHardwareScannerListeners();
  }

  isAndroidRuntime(): boolean {
    return (
      Capacitor.isNativePlatform() ||
      typeof (window as any).NewgateNativeBridge !== 'undefined'
    );
  }

  private getCapacitorPlugin(): any {
    return (Capacitor as any).Plugins?.NewgatePosPlugin;
  }

  /**
   * Initializes hardware scanner listeners across HID keyboard wedge, Camera,
   * and Zebra / Honeywell Android Broadcast Intents.
   */
  private initHardwareScannerListeners() {
    if (typeof window === 'undefined' || this.wedgeAttached) return;
    this.wedgeAttached = true;

    // 1. HID Keyboard Wedge Listener (Physical USB / Bluetooth Laser Barcode Scanners)
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      // Ignore if user is actively typing into an editable input or textarea
      const target = e.target as HTMLElement | null;
      const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);

      const now = performance.now();
      const diff = now - this.lastKeyTime;
      this.lastKeyTime = now;

      // Scanners send keystrokes with < 50ms interval
      if (diff > 80 && this.keyBuffer.length > 0 && e.key !== 'Enter') {
        this.keyBuffer = '';
      }

      if (e.key === 'Enter') {
        if (this.keyBuffer.length >= 3) {
          const barcode = this.keyBuffer.trim();
          this.keyBuffer = '';
          this.notifyBarcode(barcode, 'KEYBOARD_WEDGE');
          if (!isInput) {
            e.preventDefault();
            e.stopPropagation();
          }
        } else {
          this.keyBuffer = '';
        }
      } else if (e.key.length === 1) {
        this.keyBuffer += e.key;
      }
    }, true);

    // 2. Broadcast Intent Bridge (Honeywell Mobility Edge, Zebra DataWedge, Newgate Native App)
    window.addEventListener('newgate-barcode-broadcast', (event: any) => {
      const barcode = event?.detail?.barcode || event?.detail?.data;
      if (barcode) {
        this.notifyBarcode(String(barcode).trim(), 'BROADCAST_INTENT');
      }
    });

    // Android WebView JavaScriptInterface bridge
    (window as any).onNewgateBarcodeScanned = (barcode: string, sourceString: string = 'BROADCAST_INTENT') => {
      const source: ScannerSource = sourceString === 'KEYBOARD_WEDGE' ? 'KEYBOARD_WEDGE' : 'BROADCAST_INTENT';
      this.notifyBarcode(barcode, source);
    };
  }

  private notifyBarcode(barcode: string, source: ScannerSource) {
    this.beep(2800, 60);
    this.barcodeListeners.forEach(listener => {
      try {
        listener(barcode, source);
      } catch (err) {
        console.error('[NativeBridge] Scanner listener error:', err);
      }
    });
  }

  onBarcodeScanned(callback: (barcode: string, source: ScannerSource) => void): () => void {
    this.barcodeListeners.add(callback);
    return () => {
      this.barcodeListeners.delete(callback);
    };
  }

  async pulseCashDrawer(printerIp: string = '192.168.1.200', printerPort: number = 9100): Promise<boolean> {
    const plugin = this.getCapacitorPlugin();
    if (plugin?.pulseCashDrawer) {
      const res = await plugin.pulseCashDrawer({ printerIp, printerPort });
      return res?.success ?? true;
    }
    if (typeof (window as any).NewgateNativeBridge !== 'undefined') {
      return (window as any).NewgateNativeBridge.pulseCashDrawer();
    }
    console.log('[NativeBridge HAL] Virtual cash drawer solenoid pulsed.');
    this.beep(2400, 80);
    return true;
  }

  beep(toneFrequency: number = 2000, durationMs: number = 100): void {
    const plugin = this.getCapacitorPlugin();
    if (plugin?.beep) {
      plugin.beep({ toneFrequency, durationMs });
      return;
    }
    if (typeof (window as any).NewgateNativeBridge !== 'undefined') {
      (window as any).NewgateNativeBridge.beep(toneFrequency, durationMs);
      return;
    }
    try {
      if (typeof window !== 'undefined' && 'AudioContext' in window) {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        osc.frequency.value = toneFrequency;
        osc.connect(ctx.destination);
        osc.start();
        setTimeout(() => {
          osc.stop();
          ctx.close();
        }, durationMs);
      }
    } catch (e) {
      // audio context ignore
    }
  }

  async setLockTaskMode(enabled: boolean): Promise<boolean> {
    const plugin = this.getCapacitorPlugin();
    if (plugin?.setLockTaskMode) {
      const res = await plugin.setLockTaskMode({ enabled });
      return res?.success ?? true;
    }
    if (typeof (window as any).NewgateNativeBridge !== 'undefined') {
      return (window as any).NewgateNativeBridge.setLockTaskMode(enabled);
    }
    console.log(`[NativeBridge HAL] LockTask (Kiosk) mode set to: ${enabled}`);
    return true;
  }

  async getBatteryLevel(): Promise<number> {
    const plugin = this.getCapacitorPlugin();
    if (plugin?.getBatteryLevel) {
      const res = await plugin.getBatteryLevel();
      return res?.batteryLevel ?? 100;
    }
    if (typeof (window as any).NewgateNativeBridge !== 'undefined') {
      return (window as any).NewgateNativeBridge.getBatteryLevel();
    }
    return 100;
  }

  async triggerBarcodeScan(): Promise<string | null> {
    if (typeof (window as any).NewgateNativeBridge !== 'undefined') {
      return (window as any).NewgateNativeBridge.triggerBarcodeScan();
    }
    return null;
  }

  async sendCustomerDisplay(line1: string, line2: string): Promise<boolean> {
    const plugin = this.getCapacitorPlugin();
    if (plugin?.sendCustomerDisplay) {
      const res = await plugin.sendCustomerDisplay({ line1, line2 });
      return res?.success ?? true;
    }
    if (typeof (window as any).NewgateNativeBridge !== 'undefined') {
      return (window as any).NewgateNativeBridge.sendCustomerDisplay(line1, line2);
    }
    console.log(`[NativeBridge HAL CustomerDisplay] "${line1}" | "${line2}"`);
    return true;
  }

  async printReceipt(rawText: string, printerIp: string = '192.168.1.200', printerPort: number = 9100): Promise<boolean> {
    const plugin = this.getCapacitorPlugin();
    if (plugin?.printReceipt) {
      const res = await plugin.printReceipt({ rawText, printerIp, printerPort });
      return res?.success ?? true;
    }
    console.log(`[NativeBridge HAL] Printed receipt to ${printerIp}:${printerPort}:\n`, rawText);
    return true;
  }

  async sqliteSet(key: string, value: any): Promise<boolean> {
    const serialized = JSON.stringify(value);
    const plugin = this.getCapacitorPlugin();
    if (plugin?.sqliteSet) {
      try {
        const res = await plugin.sqliteSet({ key, value: serialized });
        return res?.success ?? true;
      } catch (e) {
        console.warn(`[NativeBridge] Plugin sqliteSet error for ${key}:`, e);
      }
    }
    if (typeof (window as any).NewgateNativeBridge?.sqliteSet !== 'undefined') {
      try {
        return (window as any).NewgateNativeBridge.sqliteSet(key, serialized);
      } catch (e) {
        console.warn(`[NativeBridge] JSBridge sqliteSet error for ${key}:`, e);
      }
    }
    return false;
  }

  async sqliteGet<T>(key: string): Promise<T | null> {
    const plugin = this.getCapacitorPlugin();
    if (plugin?.sqliteGet) {
      try {
        const res = await plugin.sqliteGet({ key });
        if (res?.value) {
          try {
            return JSON.parse(res.value);
          } catch {
            return res.value as unknown as T;
          }
        }
      } catch (e) {
        console.warn(`[NativeBridge] Plugin sqliteGet error for ${key}:`, e);
      }
    }
    if (typeof (window as any).NewgateNativeBridge?.sqliteGet !== 'undefined') {
      try {
        const raw = (window as any).NewgateNativeBridge.sqliteGet(key);
        if (raw) {
          try {
            return JSON.parse(raw);
          } catch {
            return raw as unknown as T;
          }
        }
      } catch (e) {
        console.warn(`[NativeBridge] JSBridge sqliteGet error for ${key}:`, e);
      }
    }
    return null;
  }
}

export const NativeBridge = new NativeBridgeImpl();

