/**
 * InventoryService
 * Manages inventory stock levels, barcode lookups, adjustments, and immutable stock movement ledgers.
 */

import { CanonicalStockMovement, StockMovementType } from '../src/domain/types';
import { DataRepository } from '../src/repositories/persistence/DataRepository';
import { AuditService } from './auditService';
import { InventoryItem } from '../types/inventory';

export interface RecordMovementParams {
  productId: string;
  productName: string;
  sku: string;
  type: StockMovementType;
  quantityChange: number;
  reason?: string;
  orderId?: string;
  employeeId: string;
  employeeName?: string;
  merchantId?: string;
  locationId?: string;
}

export class InventoryService {
  private static movementRepo = new DataRepository<CanonicalStockMovement & { id: string }>('stock_movements');
  private static itemRepo = new DataRepository<InventoryItem & { id: string }>('inventory_items');
  private static memoryStockLevels = new Map<string, number>();

  /**
   * Record an immutable stock movement and update current inventory level
   */
  static async recordMovement(params: RecordMovementParams): Promise<CanonicalStockMovement> {
    const currentStock = await this.getCurrentStock(params.productId);
    const newStock = Math.max(0, currentStock + params.quantityChange);

    const movement: CanonicalStockMovement = {
      id: `mov-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      productId: params.productId,
      productName: params.productName,
      sku: params.sku,
      type: params.type,
      quantityChange: params.quantityChange,
      previousStock: currentStock,
      newStock: newStock,
      reason: params.reason,
      orderId: params.orderId,
      employeeId: params.employeeId,
      employeeName: params.employeeName || 'Staff',
      merchantId: params.merchantId || 'M001',
      locationId: params.locationId || 'LOC-1',
      timestamp: new Date().toISOString(),
    };

    this.memoryStockLevels.set(params.productId, newStock);
    await this.movementRepo.upsert(movement);

    // Update item stock in inventory repository if exists
    const item = await this.itemRepo.findById(params.productId);
    if (item) {
      item.stock = newStock;
      await this.itemRepo.upsert(item);
    }

    await AuditService.log({
      actorId: params.employeeId,
      actorName: params.employeeName || 'Staff',
      action: `STOCK_MOVEMENT_${params.type}`,
      targetType: 'INVENTORY_ITEM',
      targetId: params.productId,
      details: {
        productName: params.productName,
        change: params.quantityChange,
        previousStock: currentStock,
        newStock: newStock,
        reason: params.reason,
      },
      merchantId: params.merchantId,
      locationId: params.locationId,
    });

    return movement;
  }

  /**
   * Adjust stock via barcode scan or physical inventory count
   */
  static async adjustStockByBarcode(
    barcodeOrSku: string,
    delta: number,
    employeeId: string,
    reason: string = 'Barcode Adjustment'
  ): Promise<CanonicalStockMovement | null> {
    const items = await this.itemRepo.find({
      predicate: i => (i.sku && i.sku.toLowerCase() === barcodeOrSku.toLowerCase()) || (i as any).barcode === barcodeOrSku,
    });

    const item = items[0];
    if (!item) {
      return null;
    }

    return this.recordMovement({
      productId: item.id,
      productName: item.name,
      sku: item.sku || item.id,
      type: 'ADJUSTMENT',
      quantityChange: delta,
      reason,
      employeeId,
    });
  }

  /**
   * Get current stock for product ID
   */
  static async getCurrentStock(productId: string): Promise<number> {
    if (this.memoryStockLevels.has(productId)) {
      return this.memoryStockLevels.get(productId)!;
    }
    const item = await this.itemRepo.findById(productId);
    if (item && typeof item.stock === 'number') {
      this.memoryStockLevels.set(productId, item.stock);
      return item.stock;
    }
    return 100; // default fallback demo stock
  }

  /**
   * Deduct stock when an order is completed/paid
   */
  static async deductOrderStock(
    items: { productId: string; name: string; quantity: number }[],
    orderId: string,
    employeeId: string
  ): Promise<void> {
    for (const item of items) {
      await this.recordMovement({
        productId: item.productId,
        productName: item.name,
        sku: item.productId,
        type: 'SALE',
        quantityChange: -Math.abs(item.quantity),
        reason: `Order #${orderId} deduction`,
        orderId,
        employeeId,
      });
    }
  }

  /**
   * Restock on refund/void
   */
  static async restockReturnedItems(
    items: { productId: string; name: string; quantity: number }[],
    orderId: string,
    employeeId: string,
    reason: string = 'Order Refund/Return'
  ): Promise<void> {
    for (const item of items) {
      await this.recordMovement({
        productId: item.productId,
        productName: item.name,
        sku: item.productId,
        type: 'SALE_RETURN',
        quantityChange: Math.abs(item.quantity),
        reason: `${reason} for Order #${orderId}`,
        orderId,
        employeeId,
      });
    }
  }

  /**
   * Get stock movement history for a product or overall location
   */
  static async getMovements(filter?: {
    productId?: string;
    limit?: number;
    locationId?: string;
  }): Promise<CanonicalStockMovement[]> {
    return this.movementRepo.find({
      locationId: filter?.locationId,
      where: filter?.productId ? ({ productId: filter.productId } as any) : undefined,
      limit: filter?.limit || 50,
      sortBy: 'timestamp' as any,
      sortDirection: 'desc',
    });
  }
}
