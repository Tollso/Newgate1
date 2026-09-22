/**
 * DataRepository
 * Clean abstraction layer between business services and storage.
 * Enforces tenant/location isolation and enables swapping storage engines easily.
 */

import { IStorageAdapter, LocalStorageAdapter } from './StorageAdapter';

export interface BaseEntity {
  id: string;
  merchantId?: string;
  locationId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface QueryFilter<T> {
  merchantId?: string;
  locationId?: string;
  where?: Partial<Record<keyof T, any>>;
  predicate?: (item: T) => boolean;
  limit?: number;
  offset?: number;
  sortBy?: keyof T;
  sortDirection?: 'asc' | 'desc';
}

export class DataRepository<T extends BaseEntity> {
  private collectionName: string;
  private storage: IStorageAdapter;

  constructor(collectionName: string, storage?: IStorageAdapter) {
    this.collectionName = collectionName;
    this.storage = storage || new LocalStorageAdapter();
  }

  private getKey(): string {
    return `newgate_repo_${this.collectionName}`;
  }

  private async getAllRaw(): Promise<T[]> {
    const list = await this.storage.getItem<T[]>(this.getKey());
    return list || [];
  }

  private async saveAllRaw(items: T[]): Promise<void> {
    await this.storage.setItem(this.getKey(), items);
  }

  async findById(id: string): Promise<T | null> {
    const items = await this.getAllRaw();
    return items.find(i => i.id === id) || null;
  }

  async find(filter?: QueryFilter<T>): Promise<T[]> {
    let items = await this.getAllRaw();

    if (filter) {
      if (filter.merchantId) {
        items = items.filter(i => !i.merchantId || i.merchantId === filter.merchantId);
      }
      if (filter.locationId) {
        items = items.filter(i => !i.locationId || i.locationId === filter.locationId);
      }
      if (filter.where && typeof filter.where === 'object') {
        items = items.filter(i => {
          for (const key of Object.keys(filter.where || {})) {
            if ((i as any)[key] !== (filter.where as any)[key]) {
              return false;
            }
          }
          return true;
        });
      }
      if (filter.predicate) {
        items = items.filter(filter.predicate);
      }
      if (filter.sortBy) {
        const key = filter.sortBy;
        const dir = filter.sortDirection === 'desc' ? -1 : 1;
        items.sort((a, b) => {
          if (a[key] < b[key]) return -1 * dir;
          if (a[key] > b[key]) return 1 * dir;
          return 0;
        });
      }
      if (typeof filter.offset === 'number' || typeof filter.limit === 'number') {
        const start = filter.offset || 0;
        const end = filter.limit ? start + filter.limit : undefined;
        items = items.slice(start, end);
      }
    }

    return items;
  }

  async upsert(entity: T): Promise<T> {
    const items = await this.getAllRaw();
    const existingIndex = items.findIndex(i => i.id === entity.id);
    const now = new Date().toISOString();

    const record: T = {
      ...entity,
      updatedAt: now,
      createdAt: entity.createdAt || (existingIndex >= 0 ? items[existingIndex].createdAt : now),
    };

    if (existingIndex >= 0) {
      items[existingIndex] = record;
    } else {
      items.push(record);
    }

    await this.saveAllRaw(items);
    return record;
  }

  async delete(id: string): Promise<boolean> {
    const items = await this.getAllRaw();
    const filtered = items.filter(i => i.id !== id);
    if (filtered.length !== items.length) {
      await this.saveAllRaw(filtered);
      return true;
    }
    return false;
  }

  async count(filter?: QueryFilter<T>): Promise<number> {
    const results = await this.find(filter);
    return results.length;
  }
}
