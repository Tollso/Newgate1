/**
 * RetailService
 * Implements first-class retail domain functionality (Section 8):
 * Variants matrix, barcodes, POs, vendors, returns/store credit, serial tracking, and promotions.
 */

import {
  RetailProduct,
  ProductVariant,
  PurchaseOrder,
  RetailVendor,
  RetailReturnRecord,
  RetailPromotion,
  InventoryCountSheet,
  SerialNumberRecord,
} from '../types/retail';
import { DataRepository } from '../src/repositories/persistence/DataRepository';
import { InventoryService } from './inventoryService';
import { AuditService } from './auditService';
import { Money } from '../src/domain/money';

export class RetailService {
  private static productRepo = new DataRepository<RetailProduct & { id: string }>('retail_products');
  private static poRepo = new DataRepository<PurchaseOrder & { id: string }>('retail_purchase_orders');
  private static vendorRepo = new DataRepository<RetailVendor & { id: string }>('retail_vendors');
  private static returnRepo = new DataRepository<RetailReturnRecord & { id: string }>('retail_returns');
  private static promoRepo = new DataRepository<RetailPromotion & { id: string }>('retail_promotions');
  private static countRepo = new DataRepository<InventoryCountSheet & { id: string }>('retail_count_sheets');
  private static serialRepo = new DataRepository<SerialNumberRecord & { id: string }>('retail_serials');

  private static defaultProducts: RetailProduct[] = [
    {
      id: 'ret-prod-1',
      merchantId: 'M001',
      name: 'Organic Cotton Oxford Shirt',
      brand: 'Newgate Apparel',
      category: 'Apparel',
      primarySku: 'SHIRT-OXF-01',
      primaryBarcode: '012345678901',
      additionalBarcodes: ['012345678902'],
      hasVariants: true,
      variants: [
        {
          id: 'var-1a',
          productId: 'ret-prod-1',
          sku: 'SHIRT-OXF-BLU-M',
          barcode: '012345678910',
          size: 'M',
          color: 'Sky Blue',
          price: 58.00,
          costPrice: 22.00,
          stockQuantity: 24,
          reorderPoint: 5,
          idealStockLevel: 30,
        },
        {
          id: 'var-1b',
          productId: 'ret-prod-1',
          sku: 'SHIRT-OXF-BLU-L',
          barcode: '012345678911',
          size: 'L',
          color: 'Sky Blue',
          price: 58.00,
          costPrice: 22.00,
          stockQuantity: 18,
          reorderPoint: 5,
          idealStockLevel: 30,
        },
        {
          id: 'var-1c',
          productId: 'ret-prod-1',
          sku: 'SHIRT-OXF-WHT-M',
          barcode: '012345678912',
          size: 'M',
          color: 'Crisp White',
          price: 58.00,
          costPrice: 22.00,
          stockQuantity: 15,
          reorderPoint: 5,
          idealStockLevel: 25,
        },
      ],
      basePrice: 58.00,
      costPrice: 22.00,
      trackInventory: true,
      totalStockQuantity: 57,
      reorderPoint: 15,
      createdAt: '2026-09-01T10:00:00Z',
      updatedAt: '2026-09-18T10:00:00Z',
    },
    {
      id: 'ret-prod-2',
      merchantId: 'M001',
      name: 'Wireless Noise-Cancelling Headphones',
      brand: 'Acoustic Labs',
      category: 'Electronics',
      primarySku: 'AUDIO-HP-PRO',
      primaryBarcode: '088776655443',
      additionalBarcodes: ['088776655444'],
      hasVariants: false,
      variants: [],
      basePrice: 149.99,
      costPrice: 75.00,
      trackInventory: true,
      totalStockQuantity: 12,
      reorderPoint: 3,
      trackSerialNumbers: true,
      createdAt: '2026-09-05T10:00:00Z',
      updatedAt: '2026-09-15T10:00:00Z',
    },
    {
      id: 'ret-prod-3',
      merchantId: 'M001',
      name: 'Single Malt Scotch Whisky 750ml',
      brand: 'Highland Reserve',
      category: 'Spirits',
      primarySku: 'LIQ-SCOTCH-750',
      primaryBarcode: '077889900112',
      additionalBarcodes: [],
      hasVariants: false,
      variants: [],
      basePrice: 64.50,
      costPrice: 38.00,
      trackInventory: true,
      totalStockQuantity: 8,
      reorderPoint: 4,
      requiresAgeVerification: true,
      minimumAge: 21,
      createdAt: '2026-09-10T10:00:00Z',
      updatedAt: '2026-09-18T10:00:00Z',
    },
  ];

  /**
   * Find product or variant by any barcode or SKU
   */
  static async lookupByBarcodeOrSku(query: string): Promise<{
    product: RetailProduct;
    matchedVariant?: ProductVariant;
  } | null> {
    const q = query.trim().toUpperCase();
    const products = await this.listProducts();

    for (const prod of products) {
      // Check variants first
      for (const v of prod.variants) {
        if (v.barcode.toUpperCase() === q || v.sku.toUpperCase() === q) {
          return { product: prod, matchedVariant: v };
        }
      }
      // Check primary barcode, additional barcodes, and SKU
      if (
        prod.primaryBarcode.toUpperCase() === q ||
        prod.primarySku.toUpperCase() === q ||
        prod.additionalBarcodes.some(b => b.toUpperCase() === q) ||
        (prod.vendorSku && prod.vendorSku.toUpperCase() === q)
      ) {
        return { product: prod };
      }
    }

    return null;
  }

  static async listProducts(): Promise<RetailProduct[]> {
    const list = await this.productRepo.find();
    if (list.length === 0) {
      for (const p of this.defaultProducts) {
        await this.productRepo.upsert(p);
      }
      return this.defaultProducts;
    }
    return list;
  }

  static async createProduct(product: RetailProduct, employeeId: string): Promise<RetailProduct> {
    await this.productRepo.upsert(product);
    await AuditService.log({
      actorId: employeeId,
      actorName: 'Employee',
      action: 'RETAIL_PRODUCT_CREATED',
      targetType: 'PRODUCT',
      targetId: product.id,
      details: { name: product.name, sku: product.primarySku },
    });
    return product;
  }

  /**
   * Process a retail return (with receipt or receiptless)
   */
  static async processReturn(returnRecord: RetailReturnRecord): Promise<RetailReturnRecord> {
    // Reconcile inventory for restocked items
    for (const item of returnRecord.items) {
      if (item.restockItem) {
        await InventoryService.recordMovement({
          productId: item.productId,
          productName: item.name,
          sku: item.sku,
          type: 'RETURN',
          quantityChange: item.quantity,
          employeeId: returnRecord.cashierId,
          reason: `Customer return: ${item.reason}`,
        });
      }
    }

    // Generate store credit if requested
    if (returnRecord.refundMethod === 'STORE_CREDIT') {
      const code = `CREDIT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      returnRecord.storeCreditIssued = {
        code,
        amount: returnRecord.totalRefundAmount,
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      };
    }

    await this.returnRepo.upsert(returnRecord);

    await AuditService.log({
      actorId: returnRecord.cashierId,
      actorName: returnRecord.cashierName,
      action: 'RETAIL_RETURN_PROCESSED',
      targetType: 'RETURN',
      targetId: returnRecord.id,
      details: {
        amount: returnRecord.totalRefundAmount,
        refundMethod: returnRecord.refundMethod,
        isReceiptless: returnRecord.isReceiptless,
      },
    });

    return returnRecord;
  }

  /**
   * Purchase Order Receiving workflow
   */
  static async receivePurchaseOrder(
    poId: string,
    receivedItems: { sku: string; quantityReceived: number }[],
    employeeId: string
  ): Promise<PurchaseOrder> {
    const po = await this.poRepo.findById(poId);
    if (!po) throw new Error('Purchase Order not found');

    let allComplete = true;

    for (const r of receivedItems) {
      const item = po.items.find(i => i.sku === r.sku);
      if (item) {
        item.quantityReceived += r.quantityReceived;
        if (item.quantityReceived < item.quantityOrdered) {
          allComplete = false;
        }

        // Add to inventory movement ledger
        await InventoryService.recordMovement({
          productId: item.productId,
          productName: item.name,
          sku: item.sku,
          type: 'PURCHASE_RECEIVE',
          quantityChange: r.quantityReceived,
          employeeId,
          reason: `PO #${po.poNumber} Receiving`,
        });
      }
    }

    po.status = allComplete ? 'RECEIVED' : 'PARTIALLY_RECEIVED';
    po.receivedDate = new Date().toISOString();
    await this.poRepo.upsert(po);

    return po;
  }

  /**
   * Active promotions evaluation
   */
  static async evaluatePromotions(cartItems: { productId: string; quantity: number; price: number }[]): Promise<{
    discountTotal: Money;
    appliedPromos: string[];
  }> {
    const promos = await this.promoRepo.find({ predicate: p => p.isActive });
    let discount = Money.zero();
    const appliedPromos: string[] = [];

    for (const p of promos) {
      if (p.type === 'PERCENTAGE_DISCOUNT') {
        const totalEligible = cartItems.reduce((acc, c) => acc + c.price * c.quantity, 0);
        if (!p.minimumSpend || totalEligible >= p.minimumSpend) {
          const promoDiscount = Money.fromDollars(totalEligible).multiply(p.value / 100);
          discount = discount.add(promoDiscount);
          appliedPromos.push(`${p.name} (${p.value}%)`);
        }
      }
    }

    return { discountTotal: discount, appliedPromos };
  }
}
