/**
 * Storage Adapter Interface and Default Implementations
 * Decouples domain services from underlying persistence (LocalStorage, IndexedDB, Memory, Remote API).
 */

export interface IStorageAdapter {
  getItem<T>(key: string): Promise<T | null>;
  setItem<T>(key: string, value: T): Promise<void>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
  keys(): Promise<string[]>;
}

export class LocalStorageAdapter implements IStorageAdapter {
  async getItem<T>(key: string): Promise<T | null> {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return null;
      const data = window.localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.warn(`[LocalStorageAdapter] Error getting key ${key}:`, e);
      return null;
    }
  }

  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return;
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`[LocalStorageAdapter] Error setting key ${key}:`, e);
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return;
      window.localStorage.removeItem(key);
    } catch (e) {
      console.warn(`[LocalStorageAdapter] Error removing key ${key}:`, e);
    }
  }

  async clear(): Promise<void> {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return;
      window.localStorage.clear();
    } catch (e) {
      console.warn(`[LocalStorageAdapter] Error clearing:`, e);
    }
  }

  async keys(): Promise<string[]> {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return [];
      return Object.keys(window.localStorage);
    } catch {
      return [];
    }
  }
}

export class MemoryStorageAdapter implements IStorageAdapter {
  private store = new Map<string, any>();

  async getItem<T>(key: string): Promise<T | null> {
    return this.store.has(key) ? (this.store.get(key) as T) : null;
  }

  async setItem<T>(key: string, value: T): Promise<void> {
    this.store.set(key, JSON.parse(JSON.stringify(value)));
  }

  async removeItem(key: string): Promise<void> {
    this.store.delete(key);
  }

  async clear(): Promise<void> {
    this.store.clear();
  }

  async keys(): Promise<string[]> {
    return Array.from(this.store.keys());
  }
}

export class SqliteStorageAdapter implements IStorageAdapter {
  private fallback = new LocalStorageAdapter();

  async getItem<T>(key: string): Promise<T | null> {
    try {
      if (typeof window !== 'undefined') {
        const { SqliteDbService } = await import('../../../services/sqliteDbService');
        const val = await (SqliteDbService as any).getKv(key, null);
        if (val !== null && val !== undefined) return val;
      }
    } catch {
      // ignore
    }
    return this.fallback.getItem<T>(key);
  }

  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      if (typeof window !== 'undefined') {
        const { SqliteDbService } = await import('../../../services/sqliteDbService');
        await (SqliteDbService as any).setKv(key, value);
      }
    } catch {
      // ignore
    }
    await this.fallback.setItem(key, value);
  }

  async removeItem(key: string): Promise<void> {
    return this.fallback.removeItem(key);
  }

  async clear(): Promise<void> {
    return this.fallback.clear();
  }

  async keys(): Promise<string[]> {
    return this.fallback.keys();
  }
}

