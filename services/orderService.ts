/**
 * OrderService
 * Central domain service managing order lifecycle across Register, Table Service, and Kiosk.
 */

import { CanonicalOrder, CanonicalOrderItem, CanonicalDiscount, CanonicalOrderStatus, CanonicalOrderSplit, CanonicalOrderType } from '../src/domain/types';
import { Money } from '../src/domain/money';
import { DataRepository } from '../src/repositories/persistence/DataRepository';
import { PaymentService, ProcessPaymentParams } from './paymentService';
import { AuditService } from './auditService';
import { TaxEngine } from './taxEngine';
import { ChargesEngine } from './chargesEngine';

export interface CreateOrderParams {
  merchantId?: string;
  locationId?: string;
  deviceId?: string;
  employeeId: string;
  employeeName?: string;
  orderType: CanonicalOrderType;
  tableId?: string;
  tableName?: string;
  guestCount?: number;
  customerId?: string;
  customerName?: string;
  notes?: string;
  items?: CanonicalOrderItem[];
}

export class OrderService {
  private static orderRepo = new DataRepository<CanonicalOrder & { id: string }>('orders');
  private static memoryOrders: Map<string, CanonicalOrder> = new Map();

  /**
   * Create a new order in DRAFT or OPEN status
   */
  static async createOrder(params: CreateOrderParams): Promise<CanonicalOrder> {
    const orderNumber = Math.floor(1000 + Math.random() * 9000).toString();
    const now = new Date().toISOString();

    const order: CanonicalOrder = {
      id: `ord-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      orderNumber,
      merchantId: params.merchantId || 'M001',
      locationId: params.locationId || 'LOC-1',
      deviceId: params.deviceId,
      employeeId: params.employeeId,
      employeeName: params.employeeName,
      status: 'OPEN',
      orderType: params.orderType,
      tableId: params.tableId,
      tableName: params.tableName,
      guestCount: params.guestCount || 1,
      customerId: params.customerId,
      customerName: params.customerName,
      items: params.items || [],
      subtotal: 0,
      discountTotal: 0,
      taxTotal: 0,
      tipTotal: 0,
      totalAmount: 0,
      totalPaid: 0,
      balanceDue: 0,
      payments: [],
      discounts: [],
      notes: params.notes,
      createdAt: now,
      updatedAt: now,
    };

    this.recalculateTotals(order);
    this.memoryOrders.set(order.id, order);
    await this.orderRepo.upsert(order);

    return order;
  }

  /**
   * Add or update an item in an order
   */
  static async addItem(orderId: string, item: Omit<CanonicalOrderItem, 'id'>): Promise<CanonicalOrder> {
    const order = await this.getOrder(orderId);
    if (!order) throw new Error(`Order ${orderId} not found`);
    if (order.status === 'COMPLETED' || order.status === 'VOIDED') {
      throw new Error(`Cannot modify ${order.status} order`);
    }

    const newItem: CanonicalOrderItem = {
      ...item,
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      status: 'PENDING',
    };

    order.items.push(newItem);
    this.recalculateTotals(order);
    await this.saveOrder(order);

    return order;
  }

  /**
   * Remove an item or void it
   */
  static async removeItem(orderId: string, itemId: string, employeeId: string, reason?: string): Promise<CanonicalOrder> {
    const order = await this.getOrder(orderId);
    if (!order) throw new Error(`Order ${orderId} not found`);

    const itemIndex = order.items.findIndex(i => i.id === itemId);
    if (itemIndex === -1) throw new Error(`Item ${itemId} not found in order`);

    const item = order.items[itemIndex];

    // If item was already sent to kitchen, mark as VOIDED instead of removing completely
    if (item.status === 'SENT' || item.status === 'PREPARING') {
      item.status = 'VOIDED';
      await AuditService.log({
        actorId: employeeId,
        actorName: order.employeeName || 'Staff',
        action: 'VOID_KITCHEN_ITEM',
        targetType: 'ORDER_ITEM',
        targetId: item.id,
        details: { orderId, itemName: item.name, reason },
        merchantId: order.merchantId,
        locationId: order.locationId,
      });
    } else {
      order.items.splice(itemIndex, 1);
    }

    this.recalculateTotals(order);
    await this.saveOrder(order);

    return order;
  }

  /**
   * Send pending items to kitchen
   */
  static async sendToKitchen(orderId: string): Promise<CanonicalOrder> {
    const order = await this.getOrder(orderId);
    if (!order) throw new Error(`Order ${orderId} not found`);

    const pendingItems = order.items.filter(i => i.status === 'PENDING');
    if (pendingItems.length === 0) return order;

    const now = new Date().toISOString();
    for (const item of pendingItems) {
      item.status = 'SENT';
      item.sentAt = now;
    }

    order.status = 'SENT_TO_KITCHEN';
    this.recalculateTotals(order);
    await this.saveOrder(order);

    return order;
  }

  /**
   * Apply discount to an order
   */
  static async applyDiscount(orderId: string, discount: CanonicalDiscount): Promise<CanonicalOrder> {
    const order = await this.getOrder(orderId);
    if (!order) throw new Error(`Order ${orderId} not found`);

    order.discounts.push(discount);
    this.recalculateTotals(order);
    await this.saveOrder(order);

    return order;
  }

  /**
   * Process a payment tender towards the order
   */
  static async addPayment(params: ProcessPaymentParams): Promise<{ order: CanonicalOrder; payment: any }> {
    const order = await this.getOrder(params.orderId);
    if (!order) throw new Error(`Order ${params.orderId} not found`);

    const payment = await PaymentService.processPayment({
      ...params,
      merchantId: order.merchantId,
      locationId: order.locationId,
    });

    order.payments.push(payment);
    const reconciliation = PaymentService.reconcileOrderPayments(order.totalAmount, order.payments);

    order.totalPaid = reconciliation.totalPaid;
    order.tipTotal = reconciliation.totalTips;
    order.balanceDue = reconciliation.balanceDue;

    if (reconciliation.isFullyPaid) {
      order.status = 'PAID';
    }

    await this.saveOrder(order);
    return { order, payment };
  }

  /**
   * Split order by seat
   */
  static async splitBySeat(orderId: string): Promise<CanonicalOrderSplit[]> {
    const order = await this.getOrder(orderId);
    if (!order) throw new Error(`Order ${orderId} not found`);

    const seats = Array.from(new Set(order.items.map(i => i.seatNumber || 1)));
    const splits: CanonicalOrderSplit[] = [];

    for (const seat of seats) {
      const seatItems = order.items.filter(i => (i.seatNumber || 1) === seat && i.status !== 'VOIDED');
      const subtotal = seatItems.reduce((sum, item) => sum + item.totalPrice, 0);
      const tax = TaxEngine.calculateSplitTax(subtotal).toDollars();
      const total = Money.fromDollars(subtotal).add(Money.fromDollars(tax)).toDollars();

      splits.push({
        splitId: `split-seat-${seat}`,
        name: `Seat ${seat}`,
        itemIds: seatItems.map(i => i.id),
        subtotal,
        tax,
        discounts: 0,
        total,
        isPaid: false,
        payments: [],
      });
    }

    order.splits = splits;
    await this.saveOrder(order);
    return splits;
  }

  /**
   * Close or complete order
   */
  static async closeOrder(orderId: string, employeeId: string): Promise<CanonicalOrder> {
    const order = await this.getOrder(orderId);
    if (!order) throw new Error(`Order ${orderId} not found`);

    if (order.balanceDue > 0) {
      throw new Error(`Cannot close order with remaining balance due of $${order.balanceDue.toFixed(2)}`);
    }

    order.status = 'COMPLETED';
    order.closedAt = new Date().toISOString();
    await this.saveOrder(order);

    await AuditService.log({
      actorId: employeeId,
      actorName: order.employeeName || 'Staff',
      action: 'ORDER_CLOSED',
      targetType: 'ORDER',
      targetId: order.id,
      details: { total: order.totalAmount, paid: order.totalPaid },
      merchantId: order.merchantId,
      locationId: order.locationId,
    });

    return order;
  }

  /**
   * Mathematical recalculation of order totals avoiding floating point noise
   */
  private static recalculateTotals(order: CanonicalOrder) {
    let subtotal = Money.zero();

    for (const item of order.items) {
      if (item.status !== 'VOIDED') {
        let line = Money.fromDollars(item.unitPrice).multiply(item.quantity);
        for (const mod of item.modifiers || []) {
          line = line.add(Money.fromDollars(mod.priceDelta || 0).multiply(item.quantity));
        }
        item.totalPrice = line.toDollars();
        subtotal = subtotal.add(line);
      }
    }

    // Discounts
    let discount = Money.zero();
    for (const disc of order.discounts || []) {
      if (disc.type === 'PERCENTAGE') {
        const amt = subtotal.percentage(disc.value);
        disc.amountApplied = amt.toDollars();
        discount = discount.add(amt);
      } else {
        const amt = Money.fromDollars(disc.value);
        disc.amountApplied = amt.toDollars();
        discount = discount.add(amt);
      }
    }

    const taxableAmount = subtotal.subtract(discount);
    
    // Configurable multi-jurisdiction tax calculation via TaxEngine (removes hard-coded 8.5%)
    const taxResult = TaxEngine.calculateTax(taxableAmount.toDollars());
    const tax = taxResult.totalTax;

    // Service charges and auto gratuity evaluation (Section 7)
    let gratuity = Money.zero();
    let serviceCharge = Money.zero();
    const appliedRules: string[] = [];

    // Party size >= 6 auto-gratuity rule (18%) for dine-in
    const partySize = order.guestCount || 1;
    if (order.orderType === 'DINE_IN' && partySize >= 6) {
      const autoGratAmount = taxableAmount.multiply(0.18);
      gratuity = gratuity.add(autoGratAmount);
      appliedRules.push(`Large Party Auto-Gratuity (18%): $${autoGratAmount.toDollars().toFixed(2)}`);
    }

    const total = taxableAmount.add(tax).add(gratuity).add(serviceCharge);

    order.subtotal = subtotal.toDollars();
    order.discountTotal = discount.toDollars();
    order.taxTotal = tax.toDollars();
    order.gratuityTotal = gratuity.toDollars();
    order.serviceChargeTotal = serviceCharge.toDollars();
    order.appliedChargeRules = appliedRules;
    order.totalAmount = total.toDollars();

    const reconciliation = PaymentService.reconcileOrderPayments(order.totalAmount, order.payments);
    order.totalPaid = reconciliation.totalPaid;
    order.tipTotal = reconciliation.totalTips;
    order.balanceDue = reconciliation.balanceDue;
  }

  static async getOrder(orderId: string): Promise<CanonicalOrder | null> {
    if (this.memoryOrders.has(orderId)) {
      return this.memoryOrders.get(orderId)!;
    }
    const persisted = await this.orderRepo.findById(orderId);
    if (persisted) {
      this.memoryOrders.set(orderId, persisted);
      return persisted;
    }
    return null;
  }

  static async listOrders(filter?: {
    merchantId?: string;
    locationId?: string;
    status?: CanonicalOrderStatus;
  }): Promise<CanonicalOrder[]> {
    const list = await this.orderRepo.find({
      merchantId: filter?.merchantId,
      locationId: filter?.locationId,
      where: filter?.status ? ({ status: filter.status } as any) : undefined,
      sortBy: 'createdAt' as any,
      sortDirection: 'desc',
    });

    return list;
  }

  private static async saveOrder(order: CanonicalOrder): Promise<void> {
    order.updatedAt = new Date().toISOString();
    this.memoryOrders.set(order.id, order);
    await this.orderRepo.upsert(order);
  }
}
