/**
 * CustomerDisplayService
 * Projects order items, running totals, tip suggestions, and thank you screens to secondary customer-facing displays.
 * Section 12 of the Newgate Platform Architecture.
 */

import { RealtimeTransport } from './realtimeTransport';
import { NativeBridge } from './nativeBridge';

export interface CustomerDisplayState {
  screenMode: 'IDLE' | 'ACTIVE_ORDER' | 'TIP_PROMPT' | 'PAYMENT_PROCESSING' | 'THANK_YOU';
  merchantName: string;
  orderNumber?: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  subtotal: number;
  tax: number;
  tip: number;
  total: number;
  suggestedTips?: number[];
  customMessage?: string;
}

export class CustomerDisplayService {
  private static currentState: CustomerDisplayState = {
    screenMode: 'IDLE',
    merchantName: 'The Newgate POS',
    items: [],
    subtotal: 0,
    tax: 0,
    tip: 0,
    total: 0,
    customMessage: 'Welcome to The Newgate POS',
  };

  private static listeners: Set<(state: CustomerDisplayState) => void> = new Set();

  static updateDisplay(updates: Partial<CustomerDisplayState>) {
    this.currentState = {
      ...this.currentState,
      ...updates,
    };

    // Broadcast across windows/tabs/hardware
    RealtimeTransport.publish('customer_display:update', this.currentState);

    // Also notify Native HAL VFD / 2-line display if attached
    if (this.currentState.screenMode === 'ACTIVE_ORDER') {
      const line1 = this.currentState.items.length > 0
        ? `${this.currentState.items[this.currentState.items.length - 1].name.slice(0, 14)} $${this.currentState.items[this.currentState.items.length - 1].price.toFixed(2)}`
        : 'Welcome';
      const line2 = `TOTAL: $${this.currentState.total.toFixed(2)}`;
      NativeBridge.sendCustomerDisplay(line1, line2);
    } else if (this.currentState.screenMode === 'THANK_YOU') {
      NativeBridge.sendCustomerDisplay('THANK YOU!', 'Please come again');
    }

    this.listeners.forEach(fn => fn(this.currentState));
  }

  static resetToIdle() {
    this.updateDisplay({
      screenMode: 'IDLE',
      items: [],
      subtotal: 0,
      tax: 0,
      tip: 0,
      total: 0,
      customMessage: 'Welcome to The Newgate POS',
    });
  }

  static subscribe(listener: (state: CustomerDisplayState) => void): () => void {
    this.listeners.add(listener);
    listener(this.currentState);
    return () => {
      this.listeners.delete(listener);
    };
  }
}
