/**
 * ScannerService
 * Manages USB HID keyboard wedge, Bluetooth, built-in hardware laser, and camera barcode providers.
 * Section 11 of the Newgate Platform Architecture.
 */

import { NativeBridge } from './nativeBridge';

export type BarcodeListener = (barcode: string) => void;

export class ScannerService {
  private static listeners: Set<BarcodeListener> = new Set();
  private static buffer: string = '';
  private static lastKeyTime: number = 0;
  private static isInitialized = false;

  static init() {
    if (this.isInitialized || typeof window === 'undefined') return;
    this.isInitialized = true;

    // Listen for rapid USB HID / Bluetooth barcode reader input
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      const now = Date.now();
      const timeDiff = now - this.lastKeyTime;
      this.lastKeyTime = now;

      // Most hardware barcode scanners type characters with < 50ms interval and terminate with Enter
      if (e.key === 'Enter') {
        if (this.buffer.length >= 3 && timeDiff < 100) {
          const scanned = this.buffer.trim();
          this.buffer = '';
          this.emitBarcode(scanned);
          e.preventDefault();
        } else {
          this.buffer = '';
        }
        return;
      }

      if (e.key.length === 1) {
        if (timeDiff > 200) {
          this.buffer = ''; // New sequence
        }
        this.buffer += e.key;
      }
    });
  }

  static subscribe(listener: BarcodeListener): () => void {
    this.init();
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  static emitBarcode(barcode: string) {
    NativeBridge.beep(2400, 80); // Success scanner beep
    console.log(`[ScannerService] Barcode Scanned: ${barcode}`);
    this.listeners.forEach(fn => {
      try {
        fn(barcode);
      } catch (err) {
        console.error('[ScannerService] Listener error:', err);
      }
    });
  }

  /**
   * Manually trigger scan (e.g. software scan button on handheld or camera modal)
   */
  static async triggerHardwareScan(): Promise<string | null> {
    const code = await NativeBridge.triggerBarcodeScan();
    if (code) {
      this.emitBarcode(code);
    }
    return code;
  }
}
