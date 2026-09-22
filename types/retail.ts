/**
 * Retail Domain Types
 * First-class retail domain independent of restaurant modifiers (Section 8).
 */

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  barcode: string;
  size?: string;
  color?: string;
  style?: string;
  price: number;
  costPrice: number;
  stockQuantity: number;
  reorderPoint: number;
  idealStockLevel: number;
  weight?: number;
}

export interface RetailProduct {
  id: string;
  merchantId: string;
  name: string;
  brand?: string;
  category: string;
  primarySku: string;
  primaryBarcode: string;
  additionalBarcodes: string[];
  vendorSku?: string;
  vendorId?: string;
  hasVariants: boolean;
  variants: ProductVariant[];
  basePrice: number;
  costPrice: number;
  trackInventory: boolean;
  totalStockQuantity: number;
  reorderPoint: number;
  requiresAgeVerification?: boolean;
  minimumAge?: number;
  isTaxExemptEligible?: boolean;
  trackSerialNumbers?: boolean;
  trackLotExpiration?: boolean;
  imageUrl?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RetailVendor {
  id: string;
  merchantId: string;
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  paymentTerms?: string;
  leadTimeDays?: number;
}

export type ReturnReason = 'DEFECTIVE' | 'WRONG_SIZE' | 'CHANGED_MIND' | 'GIFT_RETURN' | 'OTHER';
export type RefundMethod = 'ORIGINAL_PAYMENT' | 'STORE_CREDIT' | 'CASH' | 'EXCHANGE';

export interface PurchaseOrderItem {
  productId: string;
  variantId?: string;
  sku: string;
  name: string;
  quantityOrdered: number;
  quantityReceived: number;
  unitCost: number;
  totalCost: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  merchantId: string;
  vendorId: string;
  vendorName: string;
  status: 'DRAFT' | 'ORDERED' | 'PARTIALLY_RECEIVED' | 'RECEIVED' | 'CANCELLED';
  items: PurchaseOrderItem[];
  totalAmount: number;
  expectedDate?: string;
  receivedDate?: string;
  notes?: string;
  createdAt: string;
}

export interface InventoryCountSheet {
  id: string;
  merchantId: string;
  type: 'CYCLE_COUNT' | 'FULL_PHYSICAL';
  status: 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED' | 'RECONCILED';
  items: {
    productId: string;
    variantId?: string;
    sku: string;
    name: string;
    expectedQuantity: number;
    countedQuantity: number;
    variance: number;
  }[];
  countedBy: string;
  reconciledBy?: string;
  createdAt: string;
  completedAt?: string;
}

export interface RetailReturnItem {
  orderItemId: string;
  productId: string;
  variantId?: string;
  sku: string;
  name: string;
  quantity: number;
  unitPrice: number;
  refundAmount: number;
  restockItem: boolean;
  reason: 'DEFECTIVE' | 'WRONG_SIZE' | 'CHANGED_MIND' | 'GIFT_RETURN' | 'OTHER';
}

export interface RetailReturnRecord {
  id: string;
  merchantId: string;
  originalOrderId?: string;
  originalReceiptNumber?: string;
  isReceiptless: boolean;
  items: RetailReturnItem[];
  totalRefundAmount: number;
  refundMethod: 'ORIGINAL_PAYMENT' | 'STORE_CREDIT' | 'CASH' | 'EXCHANGE';
  storeCreditIssued?: {
    code: string;
    amount: number;
    expiresAt?: string;
  };
  cashierId: string;
  cashierName: string;
  approvedByManagerId?: string;
  approvedByManagerName?: string;
  timestamp: string;
}

export interface RetailPromotion {
  id: string;
  merchantId: string;
  name: string;
  type: 'PERCENTAGE_DISCOUNT' | 'FIXED_AMOUNT' | 'BOGO' | 'MIX_AND_MATCH' | 'TIERED_SPEND';
  value: number;
  code?: string;
  minimumSpend?: number;
  applicableCategoryIds?: string[];
  applicableProductIds?: string[];
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface SerialNumberRecord {
  id: string;
  productId: string;
  variantId?: string;
  serialNumber: string;
  status: 'IN_STOCK' | 'SOLD' | 'RETURNED' | 'DEFECTIVE';
  orderId?: string;
  lotNumber?: string;
  expirationDate?: string;
}
