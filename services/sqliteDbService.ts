/**
 * SqliteDbService
 * High-performance persistence layer for Android POS.
 * Persists:
 * 1. Open orders
 * 2. Tables & seating state
 * 3. Employee permission snapshot
 * 4. KDS tickets
 * 5. Print queue
 * 6. Sync queue (Idempotent outbox)
 * 7. Business day & cash drawer state
 * 8. Device config
 *
 * Implements Capacitor SQLite / Android Room Bridge with IndexedDB web fallback.
 */

import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { NativeBridge } from './nativeBridge';
import { DetailedOrder, DiningTable, KitchenTicket, Employee } from '../types';
import { DeviceRecord } from '../types/device';
import { LocalPrintJob, LocalBusinessDayState, LocalOutboxMutation } from './localDbService';

const DB_NAME = 'newgate_pos_appliance';
const DB_VERSION = 1;

class SqliteDbServiceImpl {
  private sqliteConnection: SQLiteConnection | null = null;
  private db: SQLiteDBConnection | null = null;
  private isInitialized = false;
  private initPromise: Promise<void> | null = null;
  private idbDatabase: IDBDatabase | null = null;

  async init(): Promise<void> {
    if (this.isInitialized) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = (async () => {
      try {
        const isNative = Capacitor.isNativePlatform();

        if (isNative) {
          try {
            this.sqliteConnection = new SQLiteConnection(CapacitorSQLite);
            const isConn = (await this.sqliteConnection.isConnection(DB_NAME, false)).result;
            if (isConn) {
              this.db = await this.sqliteConnection.retrieveConnection(DB_NAME, false);
            } else {
              this.db = await this.sqliteConnection.createConnection(
                DB_NAME,
                false,
                'no-encryption',
                DB_VERSION,
                false
              );
            }
            await this.db.open();
            await this.createTables();
            console.log('[SqliteDbService] Native Capacitor SQLite database connected and initialized.');
            this.isInitialized = true;
            return;
          } catch (nativeErr) {
            console.warn('[SqliteDbService] Capacitor SQLite plugin init error, falling back to NativeBridge/IndexedDB:', nativeErr);
          }
        }

        // IndexedDB fallback for Web & browser previews
        await this.initIndexedDb();
        console.log('[SqliteDbService] Web SQLite/IndexedDB persistence initialized.');
        this.isInitialized = true;
      } catch (e) {
        console.error('[SqliteDbService] Initialization failure:', e);
        this.isInitialized = true; // allow non-blocking fallbacks
      }
    })();

    return this.initPromise;
  }

  private async createTables(): Promise<void> {
    if (!this.db) return;

    const schema = `
      CREATE TABLE IF NOT EXISTS open_orders (
        id TEXT PRIMARY KEY,
        order_number TEXT,
        table_id TEXT,
        status TEXT,
        total_amount REAL,
        data_json TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS dining_tables (
        id TEXT PRIMARY KEY,
        table_number TEXT,
        section TEXT,
        status TEXT,
        data_json TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS employee_permission_snapshots (
        id TEXT PRIMARY KEY,
        name TEXT,
        role TEXT,
        data_json TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS kds_tickets (
        id TEXT PRIMARY KEY,
        order_id TEXT,
        station TEXT,
        status TEXT,
        data_json TEXT NOT NULL,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS print_queue (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        content TEXT NOT NULL,
        status TEXT NOT NULL,
        retry_count INTEGER DEFAULT 0,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS sync_queue (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        payload_json TEXT NOT NULL,
        idempotency_key TEXT UNIQUE NOT NULL,
        status TEXT NOT NULL,
        timestamp TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS business_day (
        business_date TEXT PRIMARY KEY,
        is_open INTEGER NOT NULL,
        drawer_float REAL NOT NULL,
        active_shift_id TEXT,
        data_json TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS device_config (
        config_key TEXT PRIMARY KEY,
        config_value TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `;

    await this.db.execute(schema);
  }

  private initIndexedDb(): Promise<void> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        resolve();
        return;
      }

      const request = indexedDB.open('newgate_pos_sqlite_store', 1);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('sqlite_records')) {
          db.createObjectStore('sqlite_records', { keyPath: 'key' });
        }
      };

      request.onsuccess = (event) => {
        this.idbDatabase = (event.target as IDBOpenDBRequest).result;
        resolve();
      };

      request.onerror = () => {
        resolve();
      };
    });
  }

  // Generic key-value SQLite persistence layer
  private async setKv(key: string, value: any): Promise<void> {
    await this.init();
    const str = JSON.stringify(value);

    // 1. Native Android Bridge (Direct SQLite / Room Helper)
    if (NativeBridge.isAndroidRuntime()) {
      await NativeBridge.sqliteSet(key, value);
    }

    // 2. Capacitor SQLite Plugin Table (if active)
    if (this.db) {
      try {
        await this.db.run(
          `INSERT OR REPLACE INTO device_config (config_key, config_value, updated_at) VALUES (?, ?, ?);`,
          [key, str, new Date().toISOString()]
        );
      } catch (err) {
        console.warn(`[SqliteDbService] Capacitor SQLite write error for ${key}:`, err);
      }
    }

    // 3. Web IndexedDB Store
    if (this.idbDatabase) {
      try {
        const tx = this.idbDatabase.transaction('sqlite_records', 'readwrite');
        const store = tx.objectStore('sqlite_records');
        store.put({ key, value, updatedAt: new Date().toISOString() });
      } catch (err) {
        console.warn(`[SqliteDbService] IndexedDB write error for ${key}:`, err);
      }
    }
  }

  private async getKv<T>(key: string, defaultValue: T): Promise<T> {
    await this.init();

    // 1. Native Android Bridge
    if (NativeBridge.isAndroidRuntime()) {
      const nativeVal = await NativeBridge.sqliteGet<T>(key);
      if (nativeVal !== null && nativeVal !== undefined) {
        return nativeVal;
      }
    }

    // 2. Capacitor SQLite Table
    if (this.db) {
      try {
        const res = await this.db.query(
          `SELECT config_value FROM device_config WHERE config_key = ? LIMIT 1;`,
          [key]
        );
        if (res.values && res.values.length > 0) {
          const raw = res.values[0].config_value;
          return JSON.parse(raw);
        }
      } catch (err) {
        console.warn(`[SqliteDbService] Capacitor SQLite read error for ${key}:`, err);
      }
    }

    // 3. IndexedDB
    if (this.idbDatabase) {
      try {
        const val = await new Promise<T | null>((resolve) => {
          const tx = this.idbDatabase!.transaction('sqlite_records', 'readonly');
          const store = tx.objectStore('sqlite_records');
          const req = store.get(key);
          req.onsuccess = () => resolve(req.result ? req.result.value : null);
          req.onerror = () => resolve(null);
        });
        if (val !== null && val !== undefined) {
          return val;
        }
      } catch (err) {
        console.warn(`[SqliteDbService] IndexedDB read error for ${key}:`, err);
      }
    }

    return defaultValue;
  }

  // ==========================================
  // 1. Open Orders
  // ==========================================
  async saveOpenOrders(orders: (DetailedOrder | any)[]): Promise<void> {
    await this.setKv('open_orders', orders);

    if (this.db) {
      try {
        await this.db.execute('DELETE FROM open_orders;');
        for (const order of orders) {
          const ord = order as any;
          await this.db.run(
            `INSERT OR REPLACE INTO open_orders (id, order_number, table_id, status, total_amount, data_json, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?);`,
            [
              ord.id,
              ord.orderNumber || ord.id,
              ord.tableId || ord.tableName || '',
              ord.status || 'OPEN',
              ord.total ?? ord.totalAmount ?? 0,
              JSON.stringify(order),
              new Date().toISOString(),
            ]
          );
        }
      } catch (e) {
        console.warn('[SqliteDbService] Error saving open_orders table:', e);
      }
    }
  }

  async getOpenOrders(): Promise<DetailedOrder[]> {
    return this.getKv<DetailedOrder[]>('open_orders', []);
  }

  // ==========================================
  // 2. Tables & Guest/Seat State
  // ==========================================
  async saveTables(tables: DiningTable[], activeTableOrders: Record<string, any> = {}): Promise<void> {
    await this.setKv('tables_state', { tables, activeTableOrders, updatedAt: new Date().toISOString() });

    if (this.db) {
      try {
        await this.db.execute('DELETE FROM dining_tables;');
        for (const t of tables) {
          const tbl = t as any;
          await this.db.run(
            `INSERT OR REPLACE INTO dining_tables (id, table_number, section, status, data_json, updated_at)
             VALUES (?, ?, ?, ?, ?, ?);`,
            [
              tbl.id,
              tbl.number || tbl.name || tbl.id,
              tbl.section || 'MAIN',
              tbl.status || 'AVAILABLE',
              JSON.stringify(t),
              new Date().toISOString(),
            ]
          );
        }
      } catch (e) {
        console.warn('[SqliteDbService] Error saving dining_tables table:', e);
      }
    }
  }

  async getTables(): Promise<{ tables: DiningTable[]; activeTableOrders: Record<string, any> } | null> {
    return this.getKv<{ tables: DiningTable[]; activeTableOrders: Record<string, any> } | null>('tables_state', null);
  }

  // ==========================================
  // 3. Employee Permission Snapshot
  // ==========================================
  async saveEmployeeSnapshot(employees: Employee[]): Promise<void> {
    await this.setKv('employee_permission_snapshot', employees);

    if (this.db) {
      try {
        await this.db.execute('DELETE FROM employee_permission_snapshots;');
        for (const emp of employees) {
          await this.db.run(
            `INSERT OR REPLACE INTO employee_permission_snapshots (id, name, role, data_json, updated_at)
             VALUES (?, ?, ?, ?, ?);`,
            [emp.id, emp.name, emp.role, JSON.stringify(emp), new Date().toISOString()]
          );
        }
      } catch (e) {
        console.warn('[SqliteDbService] Error saving employee_permission_snapshots table:', e);
      }
    }
  }

  async getEmployeeSnapshot(): Promise<Employee[]> {
    return this.getKv<Employee[]>('employee_permission_snapshot', []);
  }

  // ==========================================
  // 4. KDS Tickets
  // ==========================================
  async saveKdsTickets(tickets: KitchenTicket[]): Promise<void> {
    await this.setKv('kds_tickets', tickets);

    if (this.db) {
      try {
        await this.db.execute('DELETE FROM kds_tickets;');
        for (const t of tickets) {
          const tkt = t as any;
          await this.db.run(
            `INSERT OR REPLACE INTO kds_tickets (id, order_id, station, status, data_json, created_at)
             VALUES (?, ?, ?, ?, ?, ?);`,
            [
              tkt.id,
              tkt.orderId,
              tkt.station || 'KITCHEN',
              tkt.status,
              JSON.stringify(t),
              tkt.createdAt || tkt.timeIn || new Date().toISOString()
            ]
          );
        }
      } catch (e) {
        console.warn('[SqliteDbService] Error saving kds_tickets table:', e);
      }
    }
  }

  async getKdsTickets(): Promise<KitchenTicket[]> {
    return this.getKv<KitchenTicket[]>('kds_tickets', []);
  }

  // ==========================================
  // 5. Print Queue
  // ==========================================
  async savePrintQueue(jobs: LocalPrintJob[]): Promise<void> {
    await this.setKv('print_queue', jobs);

    if (this.db) {
      try {
        await this.db.execute('DELETE FROM print_queue;');
        for (const j of jobs) {
          await this.db.run(
            `INSERT OR REPLACE INTO print_queue (id, type, content, status, retry_count, created_at)
             VALUES (?, ?, ?, ?, ?, ?);`,
            [j.id, j.type, j.content, j.status, j.retryCount || 0, j.createdAt]
          );
        }
      } catch (e) {
        console.warn('[SqliteDbService] Error saving print_queue table:', e);
      }
    }
  }

  async getPrintQueue(): Promise<LocalPrintJob[]> {
    return this.getKv<LocalPrintJob[]>('print_queue', []);
  }

  // ==========================================
  // 6. Sync Queue (Outbox)
  // ==========================================
  async saveSyncQueue(queue: LocalOutboxMutation[]): Promise<void> {
    await this.setKv('sync_queue', queue);

    if (this.db) {
      try {
        await this.db.execute('DELETE FROM sync_queue;');
        for (const m of queue) {
          await this.db.run(
            `INSERT OR REPLACE INTO sync_queue (id, type, payload_json, idempotency_key, status, timestamp)
             VALUES (?, ?, ?, ?, ?, ?);`,
            [m.id, m.type, JSON.stringify(m.payload), m.idempotencyKey, m.status, m.timestamp]
          );
        }
      } catch (e) {
        console.warn('[SqliteDbService] Error saving sync_queue table:', e);
      }
    }
  }

  async getSyncQueue(): Promise<LocalOutboxMutation[]> {
    return this.getKv<LocalOutboxMutation[]>('sync_queue', []);
  }

  // ==========================================
  // 7. Business Day
  // ==========================================
  async saveBusinessDay(state: LocalBusinessDayState): Promise<void> {
    await this.setKv('business_day', state);

    if (this.db) {
      try {
        await this.db.run(
          `INSERT OR REPLACE INTO business_day (business_date, is_open, drawer_float, active_shift_id, data_json, updated_at)
           VALUES (?, ?, ?, ?, ?, ?);`,
          [
            state.businessDate,
            state.isOpen ? 1 : 0,
            state.drawerFloat || 0,
            state.activeShiftId || '',
            JSON.stringify(state),
            new Date().toISOString(),
          ]
        );
      } catch (e) {
        console.warn('[SqliteDbService] Error saving business_day table:', e);
      }
    }
  }

  async getBusinessDay(): Promise<LocalBusinessDayState | null> {
    return this.getKv<LocalBusinessDayState | null>('business_day', null);
  }

  // ==========================================
  // 8. Device Config
  // ==========================================
  async saveDeviceConfig(config: DeviceRecord | any): Promise<void> {
    await this.setKv('device_config_record', config);
  }

  async getDeviceConfig(): Promise<DeviceRecord | null> {
    return this.getKv<DeviceRecord | null>('device_config_record', null);
  }

  // ==========================================
  // Full System Restoration from SQLite
  // ==========================================
  async restoreAll(): Promise<{
    openOrders: DetailedOrder[];
    tablesState: { tables: DiningTable[]; activeTableOrders: Record<string, any> } | null;
    employees: Employee[];
    kdsTickets: KitchenTicket[];
    printJobs: LocalPrintJob[];
    syncQueue: LocalOutboxMutation[];
    businessDay: LocalBusinessDayState | null;
    deviceConfig: DeviceRecord | null;
  }> {
    await this.init();
    const [
      openOrders,
      tablesState,
      employees,
      kdsTickets,
      printJobs,
      syncQueue,
      businessDay,
      deviceConfig,
    ] = await Promise.all([
      this.getOpenOrders(),
      this.getTables(),
      this.getEmployeeSnapshot(),
      this.getKdsTickets(),
      this.getPrintQueue(),
      this.getSyncQueue(),
      this.getBusinessDay(),
      this.getDeviceConfig(),
    ]);

    return {
      openOrders,
      tablesState,
      employees,
      kdsTickets,
      printJobs,
      syncQueue,
      businessDay,
      deviceConfig,
    };
  }
}

export const SqliteDbService = new SqliteDbServiceImpl();
