/**
 * Domain Converters
 * Translates between Newgate legacy/UI models and canonical domain entities.
 */

import { CanonicalOrder, CanonicalOrderItem, CanonicalPayment, CanonicalOrderStatus } from './types';
import { Order, OrderItem } from '../../types/orders';
import { Money } from './money';

export class DomainConverters {
  /**
   * Convert UI Order to CanonicalOrder
   */
  static toCanonicalOrder(order: Order, employeeId: string = 'E001', locationId: string = 'LOC-1'): CanonicalOrder {
    const subtotal = order.subtotal ?? (order.total - (order.tax || 0));
    const taxTotal = order.tax ?? 0;
    const discountTotal = order.discountAmount ?? 0;
    const tipTotal = order.tipAmount ?? 0;
    const totalAmount = order.total;
    const totalPaid = order.paymentStatus === 'PAID' ? totalAmount : 0;
    const balanceDue = Money.fromDollars(totalAmount).subtract(totalPaid).toDollars();

    const canonicalItems: CanonicalOrderItem[] = (order.items || []).map(item => this.toCanonicalOrderItem(item));

    let status: CanonicalOrderStatus = 'OPEN';
    if (order.status === 'COMPLETED' || order.paymentStatus === 'PAID') {
      status = 'PAID';
    } else if (order.status === 'CANCELLED') {
      status = 'VOIDED';
    } else if (order.status === 'IN_PROGRESS') {
      status = 'PREPARING';
    }

    return {
      id: order.id,
      orderNumber: order.orderNumber || order.id.slice(-4),
      merchantId: 'M001',
      locationId: locationId,
      employeeId: employeeId,
      status: status,
      orderType: order.diningOption === 'dine-in' ? 'DINE_IN' : 'TAKEOUT',
      tableId: order.tableId,
      tableName: order.tableName,
      guestCount: order.guestCount || 1,
      customerId: order.customerId,
      customerName: order.customerName,
      items: canonicalItems,
      subtotal: subtotal,
      discountTotal: discountTotal,
      taxTotal: taxTotal,
      tipTotal: tipTotal,
      totalAmount: totalAmount,
      totalPaid: totalPaid,
      balanceDue: balanceDue,
      payments: [],
      discounts: [],
      createdAt: order.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  static toCanonicalOrderItem(item: OrderItem): CanonicalOrderItem {
    const unitPrice = item.price;
    const quantity = item.quantity || 1;
    const totalPrice = item.totalPrice ?? (unitPrice * quantity);

    return {
      id: item.id || `item-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      productId: item.productId || item.id,
      name: item.name,
      quantity: quantity,
      unitPrice: unitPrice,
      modifiers: (item.modifiers || []).map(m => ({
        id: typeof m === 'string' ? m : (m as any).id || m,
        name: typeof m === 'string' ? m : (m as any).name || m,
        priceDelta: typeof m === 'string' ? 0 : (m as any).priceDelta || 0,
      })),
      discountsTotal: 0,
      taxAmount: 0,
      totalPrice: totalPrice,
      seatNumber: item.seatNumber,
      notes: item.notes,
      status: item.status === 'READY' ? 'READY' : item.status === 'SERVED' ? 'SERVED' : 'PENDING',
      kitchenStation: item.kitchenStation,
      sentAt: item.sentAt,
    };
  }

  /**
   * Convert CanonicalOrder to UI Order
   */
  static toUIOrder(canonical: CanonicalOrder): Order {
    return {
      id: canonical.id,
      orderNumber: canonical.orderNumber,
      tableId: canonical.tableId,
      tableName: canonical.tableName,
      guestCount: canonical.guestCount,
      customerId: canonical.customerId,
      customerName: canonical.customerName,
      items: canonical.items.map(item => ({
        id: item.id,
        productId: item.productId,
        name: item.name,
        price: item.unitPrice,
        quantity: item.quantity,
        totalPrice: item.totalPrice,
        modifiers: item.modifiers.map(m => m.name),
        notes: item.notes,
        status: item.status,
        seatNumber: typeof item.seatNumber === 'number' ? item.seatNumber : undefined,
        kitchenStation: item.kitchenStation,
        sentAt: item.sentAt,
      })),
      subtotal: canonical.subtotal,
      tax: canonical.taxTotal,
      discountAmount: canonical.discountTotal,
      tipAmount: canonical.tipTotal,
      total: canonical.totalAmount,
      diningOption: canonical.orderType === 'DINE_IN' ? 'dine-in' : 'takeout',
      status: canonical.status === 'PAID' || canonical.status === 'COMPLETED' ? 'COMPLETED' 
        : canonical.status === 'VOIDED' ? 'CANCELLED' : 'IN_PROGRESS',
      paymentStatus: canonical.balanceDue <= 0 ? 'PAID' : canonical.totalPaid > 0 ? 'PARTIALLY_PAID' : 'PENDING',
      paymentMethod: canonical.payments[0]?.method,
      createdAt: canonical.createdAt,
    };
  }
}
