/**
 * BusinessDayService
 * Manages Business Day boundaries independent of midnight, End of Day (EOD) closeouts, and Z-Reports.
 * Section 12 of the Newgate Platform Architecture.
 */

import { DataRepository } from '../src/repositories/persistence/DataRepository';
import { AuditService } from './auditService';
import { OrderService } from './orderService';
import { CashDrawerService } from './cashDrawerService';
import { Money } from '../src/domain/money';

export interface BusinessDayRecord {
  id: string; // e.g. 'bday_2026-09-19'
  merchantId: string;
  businessDate: string; // YYYY-MM-DD
  openedAt: string;
  closedAt?: string;
  openedByEmployeeId: string;
  closedByEmployeeId?: string;
  status: 'OPEN' | 'CLOSED';
  openingFloatDollars: number;
  closingCashActualDollars?: number;
  closingCashExpectedDollars?: number;
  cashVarianceDollars?: number;
  zReportNumber?: string;
}

export interface ZReportSummary {
  reportNumber: string;
  businessDate: string;
  openedAt: string;
  closedAt: string;
  grossSales: number;
  netSales: number;
  taxCollected: number;
  tipsTotal: number;
  cardTotal: number;
  cashTotal: number;
  giftCardTotal: number;
  refundsTotal: number;
  voidsCount: number;
  discountsTotal: number;
  cashExpected: number;
  cashActual: number;
  cashVariance: number;
}

export class BusinessDayService {
  private static repo = new DataRepository<BusinessDayRecord & { id: string }>('business_days');
  private static currentDay: BusinessDayRecord | null = null;

  /**
   * Get the active business day. If none open, returns an open record initialized for today.
   */
  static async getCurrentBusinessDay(merchantId: string = 'M001'): Promise<BusinessDayRecord> {
    if (this.currentDay && this.currentDay.status === 'OPEN') {
      return this.currentDay;
    }

    const openDays = await this.repo.find({
      predicate: d => d.merchantId === merchantId && d.status === 'OPEN',
      limit: 1,
    });

    if (openDays.length > 0) {
      this.currentDay = openDays[0];
      return openDays[0];
    }

    // Initialize business day
    const todayStr = new Date().toISOString().split('T')[0];
    const newDay: BusinessDayRecord = {
      id: `bday_${todayStr}`,
      merchantId,
      businessDate: todayStr,
      openedAt: new Date().toISOString(),
      openedByEmployeeId: 'SYSTEM',
      status: 'OPEN',
      openingFloatDollars: 200.00,
    };

    await this.repo.upsert(newDay);
    this.currentDay = newDay;
    return newDay;
  }

  /**
   * Perform End of Day (EOD) closeout and generate Z-Report
   */
  static async closeBusinessDay(params: {
    merchantId: string;
    closedByEmployeeId: string;
    closedByEmployeeName: string;
    actualCashCountDollars: number;
  }): Promise<{ businessDay: BusinessDayRecord; zReport: ZReportSummary }> {
    const currentDay = await this.getCurrentBusinessDay(params.merchantId);
    const orders = await OrderService.listOrders({ merchantId: params.merchantId });

    let netSales = Money.zero();
    let taxTotal = Money.zero();
    let tipsTotal = Money.zero();
    let cardTotal = Money.zero();
    let cashTotal = Money.zero();
    let refundsTotal = Money.zero();
    let voidsCount = 0;
    let discountsTotal = Money.zero();

    for (const o of orders) {
      if (o.status === 'COMPLETED' || o.status === 'PAID') {
        netSales = netSales.add(o.subtotal);
        taxTotal = taxTotal.add(o.taxTotal);
        tipsTotal = tipsTotal.add(o.tipTotal);
        discountsTotal = discountsTotal.add(o.discountTotal);

        for (const p of o.payments) {
          if (p.method === 'CASH') cashTotal = cashTotal.add(p.amount);
          else cardTotal = cardTotal.add(p.amount);
        }
      } else if (o.status === 'REFUNDED') {
        refundsTotal = refundsTotal.add(o.totalAmount);
      } else if (o.status === 'VOIDED') {
        voidsCount++;
      }
    }

    const openingFloat = Money.fromDollars(currentDay.openingFloatDollars);
    const expectedCashInDrawer = openingFloat.add(cashTotal);
    const actualCash = Money.fromDollars(params.actualCashCountDollars);
    const cashVariance = actualCash.subtract(expectedCashInDrawer);

    const zReportNumber = `Z-${currentDay.businessDate.replace(/-/g, '')}-01`;
    const closedAt = new Date().toISOString();

    currentDay.status = 'CLOSED';
    currentDay.closedAt = closedAt;
    currentDay.closedByEmployeeId = params.closedByEmployeeId;
    currentDay.closingCashExpectedDollars = expectedCashInDrawer.toDollars();
    currentDay.closingCashActualDollars = actualCash.toDollars();
    currentDay.cashVarianceDollars = cashVariance.toDollars();
    currentDay.zReportNumber = zReportNumber;

    await this.repo.upsert(currentDay);
    this.currentDay = null;

    const zReport: ZReportSummary = {
      reportNumber: zReportNumber,
      businessDate: currentDay.businessDate,
      openedAt: currentDay.openedAt,
      closedAt,
      grossSales: netSales.add(taxTotal).add(tipsTotal).toDollars(),
      netSales: netSales.toDollars(),
      taxCollected: taxTotal.toDollars(),
      tipsTotal: tipsTotal.toDollars(),
      cardTotal: cardTotal.toDollars(),
      cashTotal: cashTotal.toDollars(),
      giftCardTotal: 0,
      refundsTotal: refundsTotal.toDollars(),
      voidsCount,
      discountsTotal: discountsTotal.toDollars(),
      cashExpected: expectedCashInDrawer.toDollars(),
      cashActual: actualCash.toDollars(),
      cashVariance: cashVariance.toDollars(),
    };

    await AuditService.log({
      actorId: params.closedByEmployeeId,
      actorName: params.closedByEmployeeName,
      action: 'EOD_CLOSEOUT_PERFORMED',
      targetType: 'BUSINESS_DAY',
      targetId: currentDay.id,
      details: {
        zReportNumber,
        variance: cashVariance.toDollars(),
        expectedCash: expectedCashInDrawer.toDollars(),
        actualCash: actualCash.toDollars(),
      },
    });

    return { businessDay: currentDay, zReport };
  }
}
