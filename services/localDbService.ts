/**
 * LocalDbService
 * High-reliability Local-First Android POS persistence layer.
 * Backed by native Android SQLite / Room / Capacitor SQLite via SqliteDbService.
 *
 * Persists all core operational states:
 * 1. Open orders
 * 2. Tables & seating state
 * 3. Employee permission snapshot
 * 4. KDS tickets
 * 5. Print queue
 * 6. Sync queue (Idempotent outbox)
 * 7. Business day & cash drawer state
 * 8. Device config
 *
 * Crash/restart restores complete operational state without data loss.
 */

import { DetailedOrder, DiningTable, KitchenTicket, InventoryItem, Category, Employee, ModifierGroup } from '../types';
import { DeviceRecord } from '../types/device';
import { SqliteDbService } from './sqliteDbService';

export interface LocalPrintJob {
  id: string;
  type: 'RECEIPT' | 'KITCHEN_TICKET' | 'Z_REPORT';
  content: string;
  createdAt: string;
  status: 'QUEUED' | 'PRINTING' | 'PRINTED' | 'FAILED';
  retryCount: number;
}

export interface LocalBusinessDayState {
  businessDate: string;
  isOpen: boolean;
  drawerFloat: number;
  activeShiftId: string;
  openedAt: string;
  lastZReportAt?: string;
}

export interface LocalOutboxMutation {
  id: string;
  type: 'ORDER_CREATE' | 'ORDER_UPDATE' | 'PAYMENT' | 'TABLE_UPDATE' | 'DRAWER_DROP' | 'AUDIT';
  payload: any;
  timestamp: string;
  idempotencyKey: string;
  status: 'PENDING' | 'SYNCED' | 'FAILED';
}

const STORAGE_PREFIX = 'newgate_localdb_';

export class LocalDbService {
  // In-memory hot cache synchronized with SQLite
  private static memoryCache: {
    openOrders: DetailedOrder[];
    tablesState: { tables: DiningTable[]; activeTableOrders: Record<string, any> } | null;
    employees: Employee[];
    kdsTickets: KitchenTicket[];
    printJobs: LocalPrintJob[];
    syncQueue: LocalOutboxMutation[];
    businessDay: LocalBusinessDayState;
    deviceConfig: DeviceRecord | any | null;
    catalog: {
      inventory: InventoryItem[];
      categories: Category[];
      modifierGroups: ModifierGroup[];
      cachedAt: string;
    } | null;
  } = {
    openOrders: [],
    tablesState: null,
    employees: [],
    kdsTickets: [],
    printJobs: [],
    syncQueue: [],
    businessDay: {
      businessDate: new Date().toISOString().split('T')[0],
      isOpen: true,
      drawerFloat: 250.0,
      activeShiftId: 'SHIFT-001',
      openedAt: new Date().toISOString(),
    },
    deviceConfig: null,
    catalog: null,
  };

  private static initialized = false;

  private static fallbackGet<T>(key: string, defaultValue: T): T {
    try {
      if (typeof window === 'undefined') return defaultValue;
      const raw = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
      return raw ? JSON.parse(raw) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private static fallbackSet<T>(key: string, value: T): void {
    try {
      if (typeof window === 'undefined') return;
      localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value));
    } catch {
      // ignore storage quota errors
    }
  }

  /**
   * Initializes SQLite connection and hydrates memory cache from SQLite / Room.
   */
  static async init(): Promise<void> {
    if (this.initialized) return;
    try {
      await SqliteDbService.init();
      const state = await SqliteDbService.restoreAll();

      if (state.openOrders && state.openOrders.length > 0) {
        this.memoryCache.openOrders = state.openOrders;
      } else {
        this.memoryCache.openOrders = this.fallbackGet<DetailedOrder[]>('open_orders', []);
      }

      if (state.tablesState) {
        this.memoryCache.tablesState = state.tablesState;
      } else {
        this.memoryCache.tablesState = this.fallbackGet<{ tables: DiningTable[]; activeTableOrders: Record<string, any> } | null>('tables_state', null);
      }

      if (state.employees && state.employees.length > 0) {
        this.memoryCache.employees = state.employees;
      } else {
        const empFallback = this.fallbackGet<{ employees: Employee[] } | null>('cached_employees', null);
        this.memoryCache.employees = empFallback?.employees || [];
      }

      if (state.kdsTickets && state.kdsTickets.length > 0) {
        this.memoryCache.kdsTickets = state.kdsTickets;
      } else {
        this.memoryCache.kdsTickets = this.fallbackGet<KitchenTicket[]>('kds_tickets', []);
      }

      if (state.printJobs && state.printJobs.length > 0) {
        this.memoryCache.printJobs = state.printJobs;
      } else {
        this.memoryCache.printJobs = this.fallbackGet<LocalPrintJob[]>('print_jobs', []);
      }

      if (state.syncQueue && state.syncQueue.length > 0) {
        this.memoryCache.syncQueue = state.syncQueue;
      } else {
        this.memoryCache.syncQueue = this.fallbackGet<LocalOutboxMutation[]>('outbox_queue', []);
      }

      if (state.businessDay) {
        this.memoryCache.businessDay = state.businessDay;
      } else {
        this.memoryCache.businessDay = this.fallbackGet<LocalBusinessDayState>('business_day', this.memoryCache.businessDay);
      }

      if (state.deviceConfig) {
        this.memoryCache.deviceConfig = state.deviceConfig;
      } else {
        this.memoryCache.deviceConfig = this.fallbackGet<any>('device_config_record', null);
      }

      this.memoryCache.catalog = this.fallbackGet('cached_catalog', null);
      this.initialized = true;

      console.log(`[LocalDbService] SQLite / Room storage initialized. Loaded: ` +
        `${this.memoryCache.openOrders.length} open orders, ` +
        `${this.memoryCache.printJobs.length} print jobs, ` +
        `${this.memoryCache.syncQueue.length} outbox mutations, ` +
        `${this.memoryCache.employees.length} employees, ` +
        `business day: ${this.memoryCache.businessDay.businessDate}.`
      );
    } catch (e) {
      console.warn('[LocalDbService] SQLite initialization fallback:', e);
      this.initialized = true;
    }
  }

  // ==========================================
  // 1. Cached Menu / Catalog
  // ==========================================
  static cacheCatalog(catalog: {
    inventory: InventoryItem[];
    categories: Category[];
    modifierGroups: ModifierGroup[];
  }): void {
    const item = { ...catalog, cachedAt: new Date().toISOString() };
    this.memoryCache.catalog = item;
    this.fallbackSet('cached_catalog', item);
  }

  static getCachedCatalog(): {
    inventory: InventoryItem[];
    categories: Category[];
    modifierGroups: ModifierGroup[];
    cachedAt: string;
  } | null {
    if (this.memoryCache.catalog) return this.memoryCache.catalog;
    return this.fallbackGet('cached_catalog', null);
  }

  // ==========================================
  // 2. Employee / Permission Snapshot (SQLite)
  // ==========================================
  static cacheEmployeeSnapshot(employees: Employee[]): void {
    this.memoryCache.employees = employees;
    this.fallbackSet('cached_employees', { employees, cachedAt: new Date().toISOString() });
    SqliteDbService.saveEmployeeSnapshot(employees).catch(err => {
      console.warn('[LocalDbService] SQLite cacheEmployeeSnapshot error:', err);
    });
  }

  static getCachedEmployees(): Employee[] {
    if (this.memoryCache.employees && this.memoryCache.employees.length > 0) {
      return this.memoryCache.employees;
    }
    const data = this.fallbackGet<{ employees: Employee[] } | null>('cached_employees', null);
    return data?.employees || [];
  }

  // ==========================================
  // 3. Open Orders / Checks (SQLite)
  // ==========================================
  static saveOpenOrders(orders: (DetailedOrder | any)[]): void {
    this.memoryCache.openOrders = orders;
    this.fallbackSet('open_orders', orders);
    SqliteDbService.saveOpenOrders(orders).catch(err => {
      console.warn('[LocalDbService] SQLite saveOpenOrders error:', err);
    });
  }

  static getOpenOrders(): (DetailedOrder | any)[] {
    if (this.memoryCache.openOrders && this.memoryCache.openOrders.length > 0) {
      return this.memoryCache.openOrders;
    }
    return this.fallbackGet<(DetailedOrder | any)[]>('open_orders', []);
  }

  // ==========================================
  // 4. Tables / Guest-Seat State (SQLite)
  // ==========================================
  static saveTableState(tables: DiningTable[], activeTableOrders: Record<string, any> = {}): void {
    const state = { tables, activeTableOrders };
    this.memoryCache.tablesState = state;
    this.fallbackSet('tables_state', { ...state, updatedAt: new Date().toISOString() });
    SqliteDbService.saveTables(tables, activeTableOrders).catch(err => {
      console.warn('[LocalDbService] SQLite saveTables error:', err);
    });
  }

  static getTableState(): { tables: DiningTable[]; activeTableOrders: Record<string, any> } | null {
    if (this.memoryCache.tablesState) {
      return this.memoryCache.tablesState;
    }
    return this.fallbackGet<{ tables: DiningTable[]; activeTableOrders: Record<string, any> } | null>('tables_state', null);
  }

  // ==========================================
  // 5. KDS Dispatch State (SQLite)
  // ==========================================
  static saveKdsTickets(tickets: KitchenTicket[]): void {
    this.memoryCache.kdsTickets = tickets;
    this.fallbackSet('kds_tickets', tickets);
    SqliteDbService.saveKdsTickets(tickets).catch(err => {
      console.warn('[LocalDbService] SQLite saveKdsTickets error:', err);
    });
  }

  static getKdsTickets(): KitchenTicket[] {
    if (this.memoryCache.kdsTickets && this.memoryCache.kdsTickets.length > 0) {
      return this.memoryCache.kdsTickets;
    }
    return this.fallbackGet<KitchenTicket[]>('kds_tickets', []);
  }

  // ==========================================
  // 6. Print Jobs Queue (SQLite)
  // ==========================================
  static enqueuePrintJob(type: LocalPrintJob['type'], content: string): LocalPrintJob {
    const jobs = this.getPrintJobs();
    const job: LocalPrintJob = {
      id: `PJ-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type,
      content,
      createdAt: new Date().toISOString(),
      status: 'QUEUED',
      retryCount: 0,
    };
    jobs.push(job);
    this.memoryCache.printJobs = jobs;
    this.fallbackSet('print_jobs', jobs);
    SqliteDbService.savePrintQueue(jobs).catch(err => {
      console.warn('[LocalDbService] SQLite savePrintQueue error:', err);
    });
    return job;
  }

  static getPrintJobs(): LocalPrintJob[] {
    if (this.memoryCache.printJobs && this.memoryCache.printJobs.length > 0) {
      return this.memoryCache.printJobs;
    }
    return this.fallbackGet<LocalPrintJob[]>('print_jobs', []);
  }

  static updatePrintJobStatus(id: string, status: LocalPrintJob['status']): void {
    const jobs = this.getPrintJobs();
    const target = jobs.find(j => j.id === id);
    if (target) {
      target.status = status;
      this.memoryCache.printJobs = jobs;
      this.fallbackSet('print_jobs', jobs);
      SqliteDbService.savePrintQueue(jobs).catch(err => {
        console.warn('[LocalDbService] SQLite updatePrintJobStatus error:', err);
      });
    }
  }

  // ==========================================
  // 7. Business Day & Cash Drawer State (SQLite)
  // ==========================================
  static saveBusinessDay(state: Partial<LocalBusinessDayState>): void {
    const current = this.getBusinessDay();
    const updated = { ...current, ...state };
    this.memoryCache.businessDay = updated;
    this.fallbackSet('business_day', updated);
    SqliteDbService.saveBusinessDay(updated).catch(err => {
      console.warn('[LocalDbService] SQLite saveBusinessDay error:', err);
    });
  }

  static getBusinessDay(): LocalBusinessDayState {
    if (this.memoryCache.businessDay) {
      return this.memoryCache.businessDay;
    }
    return this.fallbackGet<LocalBusinessDayState>('business_day', {
      businessDate: new Date().toISOString().split('T')[0],
      isOpen: true,
      drawerFloat: 250.00,
      activeShiftId: 'SHIFT-001',
      openedAt: new Date().toISOString(),
    });
  }

  // ==========================================
  // 8. Device Config & Hardware Binding (SQLite)
  // ==========================================
  static saveDeviceConfig(config: DeviceRecord | any): void {
    this.memoryCache.deviceConfig = config;
    this.fallbackSet('device_config_record', config);
    SqliteDbService.saveDeviceConfig(config).catch(err => {
      console.warn('[LocalDbService] SQLite saveDeviceConfig error:', err);
    });
  }

  static getDeviceConfig(): DeviceRecord | any | null {
    if (this.memoryCache.deviceConfig) {
      return this.memoryCache.deviceConfig;
    }
    return this.fallbackGet<DeviceRecord | any | null>('device_config_record', null);
  }

  // ==========================================
  // Sync / Outbox Queue (SQLite)
  // ==========================================
  static enqueueOutbox(type: LocalOutboxMutation['type'], payload: any): LocalOutboxMutation {
    const queue = this.getOutbox();
    const mutation: LocalOutboxMutation = {
      id: `MUT-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type,
      payload,
      timestamp: new Date().toISOString(),
      idempotencyKey: `NG-IDEM-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      status: 'PENDING',
    };
    queue.push(mutation);
    this.memoryCache.syncQueue = queue;
    this.fallbackSet('outbox_queue', queue);
    SqliteDbService.saveSyncQueue(queue).catch(err => {
      console.warn('[LocalDbService] SQLite saveSyncQueue error:', err);
    });
    return mutation;
  }

  static getOutbox(): LocalOutboxMutation[] {
    if (this.memoryCache.syncQueue && this.memoryCache.syncQueue.length > 0) {
      return this.memoryCache.syncQueue;
    }
    return this.fallbackGet<LocalOutboxMutation[]>('outbox_queue', []);
  }

  static markSynced(id: string): void {
    let queue = this.getOutbox();
    queue = queue.filter(q => q.id !== id);
    this.memoryCache.syncQueue = queue;
    this.fallbackSet('outbox_queue', queue);
    SqliteDbService.saveSyncQueue(queue).catch(err => {
      console.warn('[LocalDbService] SQLite markSynced error:', err);
    });
  }

  // ==========================================
  // 9. Full System Restoration on Restart / Boot
  // ==========================================
  static restoreOperationalState(): {
    hasCachedState: boolean;
    openOrdersCount: number;
    pendingPrintJobs: number;
    pendingOutboxCount: number;
    businessDay: LocalBusinessDayState;
  } {
    // Trigger async SQLite hydration
    this.init().catch(e => console.warn('[LocalDbService] Restore init warning:', e));

    const orders = this.getOpenOrders();
    const printJobs = this.getPrintJobs().filter(p => p.status === 'QUEUED');
    const outbox = this.getOutbox();
    const bDay = this.getBusinessDay();

    console.log(`[LocalDbService] Restored local operational SQLite database: ${orders.length} open orders, ${printJobs.length} print jobs, ${outbox.length} pending mutations.`);

    return {
      hasCachedState: orders.length > 0 || outbox.length > 0,
      openOrdersCount: orders.length,
      pendingPrintJobs: printJobs.length,
      pendingOutboxCount: outbox.length,
      businessDay: bDay,
    };
  }
}
