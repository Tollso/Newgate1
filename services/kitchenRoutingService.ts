/**
 * KitchenRoutingService
 * Canonical KDS order routing, station delivery policies, bump lifecycle, and recovery (Section 8 - P0).
 * Eliminates heuristic name-matching and establishes a single source of truth for kitchen tickets.
 */

import { CanonicalOrder, CanonicalOrderItem } from '../src/domain/types';
import { KDSTicket, KDSTicketItem, KDSRoutingMode } from '../types/kds';
import { PrinterService } from './printerService';
import { DataRepository } from '../src/repositories/persistence/DataRepository';
import { AuditService } from './auditService';

export type { KDSRoutingMode };

export interface StationConfig {
  id: string;
  name: string;
  deliveryMode: KDSRoutingMode;
  printerId?: string;
  color: string;
}

export const UNASSIGNED_STATION: StationConfig = {
  id: 'unassigned',
  name: 'Unassigned (Needs Setup)',
  deliveryMode: 'KDS_ONLY',
  color: 'rose',
};

export class KitchenRoutingService {
  private static ticketRepo = new DataRepository<KDSTicket & { id: string }>('kds_tickets');
  private static stationRepo = new DataRepository<StationConfig & { id: string }>('kitchen_stations');
  private static activeTickets: Map<string, KDSTicket> = new Map();
  private static completedTicketsHistory: KDSTicket[] = [];
  private static listeners: Set<(tickets: KDSTicket[]) => void> = new Set();
  private static isInitialized = false;

  // Standard architectural kitchen stations (Section 8)
  public static readonly STATIONS: StationConfig[] = [
    { id: 'expo', name: 'Expo', deliveryMode: 'KDS_ONLY', color: 'indigo' },
    { id: 'grill', name: 'Grill', deliveryMode: 'BOTH', color: 'orange' },
    { id: 'oven', name: 'Oven', deliveryMode: 'BOTH', color: 'amber' },
    { id: 'fryer', name: 'Fryer', deliveryMode: 'KDS_ONLY', color: 'yellow' },
    { id: 'cold_prep', name: 'Cold Prep', deliveryMode: 'KDS_ONLY', color: 'emerald' },
    { id: 'bar', name: 'Bar', deliveryMode: 'BOTH', color: 'cyan' },
    { id: 'dessert', name: 'Dessert', deliveryMode: 'KDS_ONLY', color: 'purple' },
  ];

  private static customStationsList: StationConfig[] = [];

  /**
   * Get all merchant stations (default + dynamically configured custom stations)
   */
  static async getStations(): Promise<StationConfig[]> {
    try {
      const persisted = await this.stationRepo.find();
      if (persisted.length > 0) {
        const combined = [...this.STATIONS];
        for (const p of persisted) {
          if (!combined.some(s => s.id === p.id)) {
            combined.push(p);
          }
        }
        return combined;
      }
    } catch (e) {
      console.warn('[KitchenRoutingService] Failed to load stations from repo:', e);
    }
    return [...this.STATIONS, ...this.customStationsList];
  }

  /**
   * Dynamically add custom station without code changes
   */
  static async addCustomStation(station: StationConfig): Promise<StationConfig[]> {
    await this.stationRepo.upsert(station);
    if (!this.customStationsList.some(s => s.id === station.id)) {
      this.customStationsList.push(station);
    }
    return this.getStations();
  }

  static async registerCustomStation(station: StationConfig): Promise<StationConfig[]> {
    return this.addCustomStation(station);
  }

  /**
   * Aggregate production station readiness for an order in Expo
   */
  static getOrderStationReadiness(orderId: string): { station: string; status: 'NEW' | 'PREPARING' | 'READY'; totalItems: number; readyItems: number; isReady: boolean }[] {
    const stationTickets = Array.from(this.activeTickets.values()).filter(
      t => t.orderId === orderId && t.station.toLowerCase() !== 'expo'
    );

    return stationTickets.map(t => {
      const total = t.items.length;
      const ready = t.items.filter(i => i.status === 'READY' || i.status === 'SERVED').length;
      return {
        station: t.station,
        status: t.status === 'COMPLETED' ? 'READY' : t.status,
        totalItems: total,
        readyItems: ready,
        isReady: total > 0 && ready === total,
      };
    });
  }

  // Category-level deterministic station mapping
  private static categoryStationMap: Record<string, string> = {
    'Burgers': 'grill',
    'Steaks': 'grill',
    'Pizzas': 'oven',
    'Baked Goods': 'oven',
    'Sides': 'fryer',
    'Appetizers': 'fryer',
    'Salads': 'cold_prep',
    'Cold Starters': 'cold_prep',
    'Drinks': 'bar',
    'Beverages': 'bar',
    'Cocktails': 'bar',
    'Wine': 'bar',
    'Beer': 'bar',
    'Desserts': 'dessert',
    'Sweets': 'dessert',
  };

  /**
   * Subscribe to real-time KDS state updates
   */
  static subscribe(listener: (tickets: KDSTicket[]) => void): () => void {
    this.listeners.add(listener);
    // Push immediate current state
    listener(Array.from(this.activeTickets.values()));
    return () => this.listeners.delete(listener);
  }

  private static notifyListeners() {
    const ticketList = Array.from(this.activeTickets.values());
    for (const listener of this.listeners) {
      try {
        listener(ticketList);
      } catch (e) {
        console.warn('[KitchenRoutingService] Error in ticket listener:', e);
      }
    }
  }

  /**
   * Persistent recovery on application boot
   */
  static async initialize(): Promise<void> {
    if (this.isInitialized) return;
    try {
      const persisted = await this.ticketRepo.find();
      for (const t of persisted) {
        if (t.status !== 'COMPLETED') {
          this.activeTickets.set(t.id, t);
        } else {
          this.completedTicketsHistory.push(t);
        }
      }
      this.isInitialized = true;
      this.notifyListeners();
    } catch (e) {
      console.warn('[KitchenRoutingService] Failed to load persisted tickets:', e);
    }
  }

  /**
   * Deterministic station resolution without substring heuristics.
   * Priority: 1. Item stationIds[] -> 2. kitchenStation override -> 3. Category mapping -> 4. 'unassigned' (Setup Warning)
   */
  static resolveItemStations(item: CanonicalOrderItem, availableStations?: StationConfig[]): string[] {
    // 1. Direct canonical station IDs configured on product
    if (item.stationIds && item.stationIds.length > 0) {
      return item.stationIds;
    }

    const stationsToSearch = availableStations && availableStations.length > 0
      ? availableStations
      : [...this.STATIONS, ...this.customStationsList];

    // 2. Explicit kitchenStation override matched dynamically against real stations
    if (item.kitchenStation) {
      const matched = stationsToSearch.find(
        s => s.id.toLowerCase() === item.kitchenStation?.toLowerCase() ||
             s.name.toLowerCase() === item.kitchenStation?.toLowerCase()
      );
      if (matched) return [matched.id];
    }

    // 3. Category mapping
    if (item.category && this.categoryStationMap[item.category]) {
      return [this.categoryStationMap[item.category]];
    }

    // Explicit UNASSIGNED line requiring admin/manager routing configuration
    return ['unassigned'];
  }

  static resolveItemStation(item: CanonicalOrderItem, availableStations?: StationConfig[]): string {
    const stations = this.resolveItemStations(item, availableStations);
    return stations[0] || 'unassigned';
  }

  /**
   * Dispatches order items to respective stations and Expo screen
   */
  static async dispatchOrder(order: CanonicalOrder): Promise<KDSTicket[]> {
    await this.initialize();

    const createdTickets: KDSTicket[] = [];
    const stationItemsMap = new Map<string, CanonicalOrderItem[]>();
    const allStations = await this.getStations();

    // Group items by each station they are routed to
    for (const item of order.items) {
      if (item.status === 'VOIDED') continue;
      const stationIds = this.resolveItemStations(item, allStations);
      for (const stId of stationIds) {
        const list = stationItemsMap.get(stId) || [];
        list.push(item);
        stationItemsMap.set(stId, list);
      }
    }

    // Create tickets for each active station
    for (const [stId, items] of stationItemsMap.entries()) {
      const stConfig = allStations.find(
        s => s.id.toLowerCase() === stId.toLowerCase() || s.name.toLowerCase() === stId.toLowerCase()
      ) || (stId === 'unassigned' ? UNASSIGNED_STATION : { id: stId, name: stId, deliveryMode: 'KDS_ONLY' as KDSRoutingMode, color: 'rose' });

      if (stId === 'unassigned') {
        await AuditService.log({
          actorId: order.employeeId || 'SYSTEM',
          actorName: order.employeeName || 'System Kitchen Router',
          action: 'KDS_UNASSIGNED_STATION_WARNING',
          targetType: 'KDS',
          targetId: order.id,
          details: {
            orderId: order.id,
            unroutedItems: items.map(i => i.name),
            message: 'Items dispatched to kitchen without station routing configuration.',
          },
          status: 'EXECUTED',
        });
      }

      const ticket: KDSTicket = {
        id: `kds-${order.id}-${stId}-${Date.now()}`,
        orderId: order.id,
        orderNumber: order.orderNumber,
        tableNumber: order.tableName || (order.tableId ? `Table ${order.tableId}` : undefined),
        serverName: order.employeeName || 'Server',
        orderType: order.orderType === 'DINE_IN' ? 'DINE_IN' : 'TAKEOUT',
        station: stConfig.name,
        status: 'NEW',
        items: items.map(i => ({
          id: i.id,
          name: i.name,
          quantity: i.quantity,
          modifiers: i.modifiers ? i.modifiers.map(m => m.name) : [],
          notes: i.notes,
          status: 'PENDING',
        })),
        createdAt: new Date().toISOString(),
        timeElapsedMinutes: 0,
      };

      // Check delivery policy: If KDS_ONLY or BOTH, store in active KDS
      if (stConfig.deliveryMode === 'KDS_ONLY' || stConfig.deliveryMode === 'BOTH') {
        this.activeTickets.set(ticket.id, ticket);
        await this.ticketRepo.upsert(ticket);
        createdTickets.push(ticket);
      }

      // If PRINTER_ONLY or BOTH, dispatch to station printer
      if (stConfig.deliveryMode === 'PRINTER_ONLY' || stConfig.deliveryMode === 'BOTH') {
        try {
          await PrinterService.printKitchenTicket({
            ...order,
            items,
          });
        } catch (e) {
          console.warn(`[KitchenRoutingService] Station printer error for ${stConfig.name}:`, e);
        }
      }
    }

    // Always create an Expo master ticket for fulfillment coordination
    const expoConfig = this.STATIONS[0];
    const expoTicket: KDSTicket = {
      id: `kds-${order.id}-expo-${Date.now()}`,
      orderId: order.id,
      orderNumber: order.orderNumber,
      tableNumber: order.tableName || (order.tableId ? `Table ${order.tableId}` : undefined),
      serverName: order.employeeName || 'Server',
      orderType: order.orderType === 'DINE_IN' ? 'DINE_IN' : 'TAKEOUT',
      station: 'Expo',
      status: 'NEW',
      items: order.items.filter(i => i.status !== 'VOIDED').map(i => ({
        id: i.id,
        name: i.name,
        quantity: i.quantity,
        modifiers: i.modifiers ? i.modifiers.map(m => m.name) : [],
        notes: i.notes,
        status: 'PENDING',
      })),
      createdAt: new Date().toISOString(),
      timeElapsedMinutes: 0,
    };

    this.activeTickets.set(expoTicket.id, expoTicket);
    await this.ticketRepo.upsert(expoTicket);
    createdTickets.push(expoTicket);

    this.notifyListeners();
    return createdTickets;
  }

  /**
   * Bump individual item status on ticket
   */
  static async bumpItem(ticketId: string, itemId: string): Promise<KDSTicket | null> {
    const ticket = this.activeTickets.get(ticketId);
    if (!ticket) return null;

    const item = ticket.items.find(i => i.id === itemId);
    if (!item) return null;

    if (item.status === 'PENDING') item.status = 'PREPARING';
    else if (item.status === 'PREPARING') item.status = 'READY';
    else if (item.status === 'READY') item.status = 'SERVED';

    // Check if all items in ticket are ready
    if (ticket.items.every(i => i.status === 'READY' || i.status === 'SERVED')) {
      ticket.status = 'READY';
    }

    await this.ticketRepo.upsert(ticket);
    this.notifyListeners();
    return ticket;
  }

  /**
   * Bump entire ticket (NEW -> PREPARING -> READY -> COMPLETED)
   */
  static async bumpTicket(ticketId: string): Promise<KDSTicket | null> {
    const ticket = this.activeTickets.get(ticketId);
    if (!ticket) return null;

    if (ticket.status === 'NEW') {
      ticket.status = 'PREPARING';
      ticket.items.forEach(i => i.status = 'PREPARING');
    } else if (ticket.status === 'PREPARING') {
      ticket.status = 'READY';
      ticket.items.forEach(i => i.status = 'READY');
    } else if (ticket.status === 'READY') {
      ticket.status = 'COMPLETED';
      ticket.items.forEach(i => i.status = 'SERVED');
      this.activeTickets.delete(ticketId);
      this.completedTicketsHistory.push(ticket);
    }

    await this.ticketRepo.upsert(ticket);

    await AuditService.log({
      actorId: 'KDS',
      actorName: 'Kitchen Display',
      action: 'KDS_TICKET_BUMPED',
      targetType: 'KDS_TICKET',
      targetId: ticketId,
      details: { orderId: ticket.orderId, newStatus: ticket.status, station: ticket.station },
    });

    this.notifyListeners();
    return ticket;
  }

  /**
   * Recall the most recently bumped ticket
   */
  static async recallTicket(): Promise<KDSTicket | null> {
    if (this.completedTicketsHistory.length === 0) return null;
    const recalled = this.completedTicketsHistory.pop()!;
    recalled.status = 'READY';
    this.activeTickets.set(recalled.id, recalled);
    await this.ticketRepo.upsert(recalled);

    await AuditService.log({
      actorId: 'KDS',
      actorName: 'Kitchen Display',
      action: 'KDS_TICKET_RECALLED',
      targetType: 'KDS_TICKET',
      targetId: recalled.id,
      details: { station: recalled.station },
    });

    this.notifyListeners();
    return recalled;
  }

  /**
   * Refire item with audit reason
   */
  static async refireItem(ticketId: string, itemId: string, reason: string = 'Refire requested'): Promise<KDSTicket | null> {
    const ticket = this.activeTickets.get(ticketId);
    if (!ticket) return null;

    const item = ticket.items.find(i => i.id === itemId);
    if (!item) return null;

    item.status = 'PENDING';
    item.notes = `${item.notes ? item.notes + ' | ' : ''}REFIRE: ${reason}`;
    ticket.status = 'PREPARING';

    await this.ticketRepo.upsert(ticket);

    await AuditService.log({
      actorId: 'KDS',
      actorName: 'Kitchen Display',
      action: 'ITEM_REFIRED',
      targetType: 'KDS_ITEM',
      targetId: itemId,
      details: { ticketId, reason },
    });

    this.notifyListeners();
    return ticket;
  }

  /**
   * Query active tickets for a specific station or Expo view
   */
  static async getActiveTickets(stationName?: string): Promise<KDSTicket[]> {
    await this.initialize();
    const all = Array.from(this.activeTickets.values());
    if (!stationName || stationName.toUpperCase() === 'ALL' || stationName.toUpperCase() === 'EXPO') {
      return all;
    }
    return all.filter(t => t.station.toLowerCase() === stationName.toLowerCase());
  }

  /**
   * Calculate Expo readiness for a dining order across all prep stations
   */
  static getExpoReadiness(orderId: string): {
    orderId: string;
    totalStations: number;
    readyStations: number;
    isAllReady: boolean;
  } {
    const orderTickets = Array.from(this.activeTickets.values()).filter(
      t => t.orderId === orderId && t.station !== 'Expo'
    );

    if (orderTickets.length === 0) {
      return { orderId, totalStations: 0, readyStations: 0, isAllReady: true };
    }

    const readyCount = orderTickets.filter(t => t.status === 'READY' || t.status === 'COMPLETED').length;
    return {
      orderId,
      totalStations: orderTickets.length,
      readyStations: readyCount,
      isAllReady: readyCount === orderTickets.length,
    };
  }
}
