/**
 * CashDrawerService
 * Manages cash drawer kicks, paid-in/paid-out transactions, no-sale opens, and daily drawer reconciliation.
 */

import { CashDrawerEvent } from '../src/domain/hardwareTypes';
import { Money } from '../src/domain/money';
import { DataRepository } from '../src/repositories/persistence/DataRepository';
import { AuditService } from './auditService';

export interface DrawerTransactionParams {
  type: 'SALE' | 'REFUND' | 'PAID_IN' | 'PAID_OUT' | 'NO_SALE' | 'AUDIT';
  amount?: number;
  reason?: string;
  employeeId: string;
  employeeName?: string;
  authorizedByManagerId?: string;
  drawerId?: string;
}

export class CashDrawerService {
  private static eventRepo = new DataRepository<CashDrawerEvent & { id: string }>('cash_drawer_events');
  private static startingCash = 200.00; // $200 standard opening float

  /**
   * Triggers hardware drawer kick (or simulated pulse) and records event
   */
  static async openDrawer(params: DrawerTransactionParams): Promise<CashDrawerEvent> {
    const event: CashDrawerEvent = {
      id: `drawer-ev-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      drawerId: params.drawerId || 'DRAWER-1',
      type: params.type,
      amount: params.amount,
      reason: params.reason || (params.type === 'NO_SALE' ? 'Manual No-Sale Open' : params.type),
      employeeId: params.employeeId,
      employeeName: params.employeeName,
      timestamp: new Date().toISOString(),
      authorizedByManagerId: params.authorizedByManagerId,
    };

    await this.eventRepo.upsert(event);

    await AuditService.log({
      actorId: params.employeeId,
      actorName: params.employeeName || 'Staff',
      action: `CASH_DRAWER_${params.type}`,
      targetType: 'CASH_DRAWER',
      targetId: event.drawerId,
      details: { amount: params.amount, reason: params.reason },
      approvedByManagerId: params.authorizedByManagerId,
      requiresApproval: !!params.authorizedByManagerId,
    });

    console.log(`[Hardware] Drawer pulse sent to ${event.drawerId} (${params.type})`);
    return event;
  }

  /**
   * Cash paid-in (e.g. adding extra float change)
   */
  static async paidIn(amount: number, reason: string, employeeId: string, employeeName?: string): Promise<CashDrawerEvent> {
    return this.openDrawer({
      type: 'PAID_IN',
      amount,
      reason,
      employeeId,
      employeeName,
    });
  }

  /**
   * Cash paid-out (e.g. buying emergency supplies / paying vendor cash)
   */
  static async paidOut(
    amount: number,
    reason: string,
    employeeId: string,
    employeeName?: string,
    managerId?: string
  ): Promise<CashDrawerEvent> {
    return this.openDrawer({
      type: 'PAID_OUT',
      amount,
      reason,
      employeeId,
      employeeName,
      authorizedByManagerId: managerId,
    });
  }

  /**
   * Calculates current expected cash in drawer based on starting float + sales + paid_ins - refunds - paid_outs
   */
  static async calculateExpectedDrawerCash(drawerId: string = 'DRAWER-1'): Promise<{
    startingCash: number;
    cashSales: number;
    cashRefunds: number;
    paidInTotal: number;
    paidOutTotal: number;
    expectedCash: number;
  }> {
    const events = await this.eventRepo.find({
      where: { drawerId } as any,
    });

    let sales = Money.zero();
    let refunds = Money.zero();
    let paidIn = Money.zero();
    let paidOut = Money.zero();

    for (const ev of events) {
      const amt = Money.fromDollars(ev.amount || 0);
      if (ev.type === 'SALE') sales = sales.add(amt);
      if (ev.type === 'REFUND') refunds = refunds.add(amt);
      if (ev.type === 'PAID_IN') paidIn = paidIn.add(amt);
      if (ev.type === 'PAID_OUT') paidOut = paidOut.add(amt);
    }

    const start = Money.fromDollars(this.startingCash);
    const expected = start.add(sales).subtract(refunds).add(paidIn).subtract(paidOut);

    return {
      startingCash: start.toDollars(),
      cashSales: sales.toDollars(),
      cashRefunds: refunds.toDollars(),
      paidInTotal: paidIn.toDollars(),
      paidOutTotal: paidOut.toDollars(),
      expectedCash: expected.toDollars(),
    };
  }

  static async getCurrentShift(drawerId: string = 'DRAWER-1') {
    const summary = await this.calculateExpectedDrawerCash(drawerId);
    return {
      currentExpectedCash: summary.expectedCash,
      ...summary,
    };
  }

  static async getEvents(limit: number = 50): Promise<CashDrawerEvent[]> {
    return this.eventRepo.find({
      limit,
      sortBy: 'timestamp' as any,
      sortDirection: 'desc',
    });
  }
}
