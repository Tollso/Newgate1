/**
 * RealtimeTransport
 * Inter-terminal / cross-tab broadcast communication using BroadcastChannel and local event routing.
 */

export interface RealtimeMessage<T = any> {
  type: string;
  payload: T;
  sourceTerminalId: string;
  timestamp: string;
}

export type MessageHandler<T = any> = (message: RealtimeMessage<T>) => void;

export class RealtimeTransport {
  private static channel: BroadcastChannel | null = null;
  private static listeners: Map<string, Set<MessageHandler>> = new Map();
  private static terminalId = `term-${Math.random().toString(36).substr(2, 6)}`;

  static init() {
    if (this.channel) return;
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        this.channel = new BroadcastChannel('newgate_pos_realtime');
        this.channel.onmessage = (event) => {
          const msg = event.data as RealtimeMessage;
          this.dispatchLocal(msg);
        };
      }
    } catch (e) {
      console.warn('[RealtimeTransport] BroadcastChannel not supported in current environment', e);
    }
  }

  static publish<T = any>(type: string, payload: T) {
    this.init();
    const msg: RealtimeMessage<T> = {
      type,
      payload,
      sourceTerminalId: this.terminalId,
      timestamp: new Date().toISOString(),
    };

    // Broadcast across windows / tabs / terminals
    if (this.channel) {
      try {
        this.channel.postMessage(msg);
      } catch (e) {
        console.warn('[RealtimeTransport] publish error:', e);
      }
    }

    // Also dispatch to local listeners in current window
    this.dispatchLocal(msg);
  }

  static subscribe<T = any>(type: string, handler: MessageHandler<T>): () => void {
    this.init();
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(handler as MessageHandler);

    return () => {
      this.listeners.get(type)?.delete(handler as MessageHandler);
    };
  }

  private static dispatchLocal(msg: RealtimeMessage) {
    const handlers = this.listeners.get(msg.type);
    if (handlers) {
      handlers.forEach(h => {
        try {
          h(msg);
        } catch (e) {
          console.error(`[RealtimeTransport] Handler error for ${msg.type}:`, e);
        }
      });
    }
  }
}
