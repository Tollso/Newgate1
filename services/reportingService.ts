/**
 * ReportingService
 * Centralized business intelligence, sales reporting, and tax reconciliation engine.
 */

import { Money } from '../src/domain/money';
import { CanonicalOrder } from '../src/domain/types';
import { OrderService } from './orderService';

export interface SalesReportSummary {
  grossSales: number;
  netSales: number;
  taxCollected: number;
  tipsCollected: number;
  discountsTotal: number;
  refundsTotal: number;
  totalTransactions: number;
  averageOrderValue: number;
  dineInCount: number;
  takeoutCount: number;
  kioskCount: number;
  categoryBreakdown: { category: string; amount: number; percentage: number }[];
}

export class ReportingService {
  /**
   * Generates a comprehensive financial sales report for a specified date range / filters
   */
  static async generateSalesReport(filter?: {
    merchantId?: string;
    locationId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<SalesReportSummary> {
    const orders = await OrderService.listOrders({
      merchantId: filter?.merchantId,
      locationId: filter?.locationId,
    });

    let gross = Money.zero();
    let net = Money.zero();
    let tax = Money.zero();
    let tips = Money.zero();
    let discounts = Money.zero();
    let refunds = Money.zero();

    let dineIn = 0;
    let takeout = 0;
    let kiosk = 0;

    const categoryMap = new Map<string, Money>();

    for (const order of orders) {
      if (order.status === 'COMPLETED' || order.status === 'PAID') {
        const orderSubtotal = Money.fromDollars(order.subtotal);
        const orderTax = Money.fromDollars(order.taxTotal);
        const orderTip = Money.fromDollars(order.tipTotal);
        const orderDisc = Money.fromDollars(order.discountTotal);

        net = net.add(orderSubtotal);
        gross = gross.add(orderSubtotal).add(orderTax).add(orderTip);
        tax = tax.add(orderTax);
        tips = tips.add(orderTip);
        discounts = discounts.add(orderDisc);

        if (order.orderType === 'DINE_IN') dineIn++;
        else if (order.orderType === 'KIOSK') kiosk++;
        else takeout++;

        for (const item of order.items) {
          const cat = (item as any).category || 'Food & Drink';
          const line = Money.fromDollars(item.totalPrice);
          categoryMap.set(cat, (categoryMap.get(cat) || Money.zero()).add(line));
        }
      } else if (order.status === 'REFUNDED') {
        refunds = refunds.add(Money.fromDollars(order.totalAmount));
      }
    }

    const totalTxns = dineIn + takeout + kiosk;
    const avgOrderVal = totalTxns > 0 ? net.toDollars() / totalTxns : 0;

    const categoryBreakdown: { category: string; amount: number; percentage: number }[] = [];
    categoryMap.forEach((amt, category) => {
      const pct = net.isPositive() ? Math.round((amt.toDollars() / net.toDollars()) * 100) : 0;
      categoryBreakdown.push({
        category,
        amount: amt.toDollars(),
        percentage: pct,
      });
    });

    return {
      grossSales: gross.toDollars(),
      netSales: net.toDollars(),
      taxCollected: tax.toDollars(),
      tipsCollected: tips.toDollars(),
      discountsTotal: discounts.toDollars(),
      refundsTotal: refunds.toDollars(),
      totalTransactions: totalTxns,
      averageOrderValue: Math.round(avgOrderVal * 100) / 100,
      dineInCount: dineIn,
      takeoutCount: takeout,
      kioskCount: kiosk,
      categoryBreakdown,
    };
  }
}
