/**
 * GlobalSearchService
 * Unified search engine across Orders, Receipts, Customers, Donors, SKUs/Barcodes, and Employees.
 * Section 12 of the Newgate Platform Architecture.
 */

import { OrderService } from './orderService';
import { CustomerService } from './customerService';
import { RetailService } from './retailService';
import { NonprofitService } from './nonprofitService';

export interface GlobalSearchResultItem {
  id: string;
  category: 'ORDER' | 'CUSTOMER' | 'DONOR' | 'RETAIL_PRODUCT' | 'BARCODE';
  title: string;
  subtitle: string;
  metadata?: string;
  actionPayload?: any;
}

export class GlobalSearchService {
  static async searchAll(query: string): Promise<GlobalSearchResultItem[]> {
    const q = query.trim().toLowerCase();
    if (!q || q.length < 2) return [];

    const results: GlobalSearchResultItem[] = [];

    // 1. Search Orders
    try {
      const orders = await OrderService.listOrders();
      for (const o of orders) {
        if (
          o.orderNumber.toLowerCase().includes(q) ||
          o.id.toLowerCase().includes(q) ||
          (o.customerName && o.customerName.toLowerCase().includes(q)) ||
          (o.tableName && o.tableName.toLowerCase().includes(q))
        ) {
          results.push({
            id: o.id,
            category: 'ORDER',
            title: `Order #${o.orderNumber} - $${o.totalAmount.toFixed(2)}`,
            subtitle: `${o.orderType} | ${o.status} | ${o.tableName || o.customerName || 'Walk-in'}`,
            actionPayload: o,
          });
        }
      }
    } catch (e) {
      // ignore
    }

    // 2. Search Customers
    try {
      const customers = await CustomerService.search(q);
      for (const c of customers) {
        results.push({
          id: c.id,
          category: 'CUSTOMER',
          title: c.name,
          subtitle: `${c.phone || c.email} | Total Spent: $${c.totalSpent.toFixed(2)} (${c.segment})`,
          actionPayload: c,
        });
      }
    } catch (e) {
      // ignore
    }

    // 3. Search Retail Products & Barcodes
    try {
      const products = await RetailService.listProducts();
      for (const p of products) {
        const matchesSku = p.primarySku.toLowerCase().includes(q) || (p.vendorSku && p.vendorSku.toLowerCase().includes(q));
        const matchesBarcode = p.primaryBarcode.toLowerCase().includes(q) || p.additionalBarcodes.some(b => b.toLowerCase().includes(q));
        const matchesName = p.name.toLowerCase().includes(q);

        if (matchesSku || matchesBarcode || matchesName) {
          results.push({
            id: p.id,
            category: 'RETAIL_PRODUCT',
            title: p.name,
            subtitle: `SKU: ${p.primarySku} | Barcode: ${p.primaryBarcode} | $${p.basePrice.toFixed(2)} (Stock: ${p.totalStockQuantity})`,
            actionPayload: p,
          });
        }
      }
    } catch (e) {
      // ignore
    }

    // 4. Search Donors
    try {
      const donors = await NonprofitService.listDonors();
      for (const d of donors) {
        const donorName = d.type === 'ORGANIZATION' ? d.organizationName : `${d.firstName} ${d.lastName}`;
        if (donorName?.toLowerCase().includes(q) || d.email.toLowerCase().includes(q)) {
          results.push({
            id: d.id,
            category: 'DONOR',
            title: donorName || 'Donor',
            subtitle: `${d.email} | Lifetime Giving: $${d.lifetimeGivingTotal.toFixed(2)}`,
            actionPayload: d,
          });
        }
      }
    } catch (e) {
      // ignore
    }

    return results.slice(0, 15);
  }
}
