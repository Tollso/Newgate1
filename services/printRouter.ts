/**
 * PrintRouter
 * Routes print jobs (receipts, kitchen chits, bar orders) to appropriate printers based on routing rules.
 */

import { PrintJob, PrintJobType } from '../src/domain/hardwareTypes';

export interface RoutingRule {
  targetPrinterId: string;
  stationName: string;
  applicableJobTypes: PrintJobType[];
  categories?: string[];
}

export class PrintRouter {
  private rules: RoutingRule[] = [
    {
      targetPrinterId: 'printer-front-receipt',
      stationName: 'Front Cashier',
      applicableJobTypes: ['RECEIPT', 'CUSTOMER_BILL', 'CASH_REPORT', 'TEST'],
    },
    {
      targetPrinterId: 'printer-kitchen-main',
      stationName: 'Main Kitchen / Grill',
      applicableJobTypes: ['KITCHEN_TICKET'],
      categories: ['Mains', 'Burgers', 'Entrees', 'Sides', 'Grill'],
    },
    {
      targetPrinterId: 'printer-bar',
      stationName: 'Bar / Beverage',
      applicableJobTypes: ['KITCHEN_TICKET'],
      categories: ['Drinks', 'Beverages', 'Bar', 'Cocktails', 'Beer'],
    },
  ];

  routeJob(job: PrintJob): string {
    if (job.targetPrinterId) {
      return job.targetPrinterId;
    }

    const matchedRule = this.rules.find(r => r.applicableJobTypes.includes(job.type));
    if (matchedRule) {
      return matchedRule.targetPrinterId;
    }

    return 'printer-front-receipt';
  }

  setRules(rules: RoutingRule[]) {
    this.rules = rules;
  }

  getRules(): RoutingRule[] {
    return this.rules;
  }
}
