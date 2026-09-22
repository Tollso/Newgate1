/**
 * PrinterService
 * Central printer orchestrator coordinating routing, spooling, and formatting.
 */

import { PrintJob, PrintJobType } from '../src/domain/hardwareTypes';
import { PrintRouter } from './printRouter';
import { PrintSpooler } from './printSpooler';
import { CanonicalOrder } from '../src/domain/types';
import { Money } from '../src/domain/money';

export class PrinterService {
  private static router = new PrintRouter();
  private static spooler = new PrintSpooler();

  static getSpooler(): PrintSpooler {
    return this.spooler;
  }

  static getRouter(): PrintRouter {
    return this.router;
  }

  /**
   * Print customer receipt for an order
   */
  static async printReceipt(order: CanonicalOrder, customHeader?: string): Promise<PrintJob> {
    const lines: string[] = [];
    lines.push('================================');
    lines.push('       THE NEWGATE POS          ');
    lines.push(customHeader || '      100 Market Street         ');
    lines.push('================================');
    lines.push(`Order: #${order.orderNumber}   Type: ${order.orderType}`);
    lines.push(`Date:  ${new Date().toLocaleString()}`);
    if (order.tableName) lines.push(`Table: ${order.tableName}   Server: ${order.employeeName || 'Staff'}`);
    lines.push('--------------------------------');

    for (const item of order.items) {
      if (item.status !== 'VOIDED') {
        const itemLine = `${item.quantity}x ${item.name}`.padEnd(24) + `$${item.totalPrice.toFixed(2)}`.padStart(8);
        lines.push(itemLine);
        for (const mod of item.modifiers || []) {
          lines.push(`   + ${mod.name}`);
        }
      }
    }

    lines.push('--------------------------------');
    lines.push(`Subtotal:`.padEnd(24) + `$${order.subtotal.toFixed(2)}`.padStart(8));
    if (order.discountTotal > 0) {
      lines.push(`Discount:`.padEnd(24) + `-$${order.discountTotal.toFixed(2)}`.padStart(8));
    }
    lines.push(`Tax:`.padEnd(24) + `$${order.taxTotal.toFixed(2)}`.padStart(8));
    if (order.tipTotal > 0) {
      lines.push(`Tip:`.padEnd(24) + `$${order.tipTotal.toFixed(2)}`.padStart(8));
    }
    lines.push('================================');
    lines.push(`TOTAL:`.padEnd(24) + `$${order.totalAmount.toFixed(2)}`.padStart(8));
    lines.push(`Paid:`.padEnd(24) + `$${order.totalPaid.toFixed(2)}`.padStart(8));
    if (order.balanceDue > 0) {
      lines.push(`Balance Due:`.padEnd(24) + `$${order.balanceDue.toFixed(2)}`.padStart(8));
    }
    lines.push('================================');
    lines.push('      Thank you for dining!     ');
    lines.push('================================');

    const job: PrintJob = {
      id: `print-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      type: 'RECEIPT',
      title: `Receipt #${order.orderNumber}`,
      content: lines.join('\n'),
      orderId: order.id,
      orderNumber: order.orderNumber,
      tableName: order.tableName,
      serverName: order.employeeName,
      subtotal: order.subtotal,
      tax: order.taxTotal,
      total: order.totalAmount,
      timestamp: new Date().toISOString(),
      status: 'PENDING',
    };

    job.targetPrinterId = this.router.routeJob(job);
    return this.spooler.enqueue(job);
  }

  /**
   * Print kitchen ticket for order items
   */
  static async printKitchenTicket(order: CanonicalOrder, stationName?: string): Promise<PrintJob> {
    const lines: string[] = [];
    lines.push('*** KITCHEN ORDER TICKET ***');
    lines.push(`Ticket: #${order.orderNumber}   Table: ${order.tableName || 'Takeout'}`);
    lines.push(`Server: ${order.employeeName || 'Staff'}   Time: ${new Date().toLocaleTimeString()}`);
    lines.push('----------------------------');

    for (const item of order.items) {
      if (item.status === 'PENDING' || item.status === 'SENT') {
        lines.push(`[ ] ${item.quantity}x ${item.name.toUpperCase()}`);
        if (item.seatNumber) lines.push(`    Seat: ${item.seatNumber}`);
        for (const mod of item.modifiers || []) {
          lines.push(`    * ${mod.name}`);
        }
        if (item.notes) lines.push(`    Note: ${item.notes}`);
      }
    }

    lines.push('----------------------------');

    const job: PrintJob = {
      id: `print-kitch-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      type: 'KITCHEN_TICKET',
      title: `Kitchen Ticket #${order.orderNumber}`,
      content: lines.join('\n'),
      orderId: order.id,
      orderNumber: order.orderNumber,
      tableName: order.tableName,
      serverName: order.employeeName,
      station: stationName || 'Main Kitchen',
      timestamp: new Date().toISOString(),
      status: 'PENDING',
    };

    job.targetPrinterId = this.router.routeJob(job);
    return this.spooler.enqueue(job);
  }

  /**
   * Print hardware diagnostic test page
   */
  static async printTest(printerId?: string): Promise<PrintJob> {
    const job: PrintJob = {
      id: `print-test-${Date.now()}`,
      type: 'TEST',
      title: 'Printer Diagnostic Test',
      content: [
        '*** HARDWARE TEST PAGE ***',
        'Printer status: ONLINE',
        `Device ID: ${printerId || 'Default'}`,
        `Timestamp: ${new Date().toISOString()}`,
        'Character test: !@#$%^&*()_+-=~{}[]',
        'Alignment: LEFT, CENTER, RIGHT OK',
        '*** END OF TEST ***',
      ].join('\n'),
      targetPrinterId: printerId,
      timestamp: new Date().toISOString(),
      status: 'PENDING',
    };

    job.targetPrinterId = printerId || this.router.routeJob(job);
    return this.spooler.enqueue(job);
  }

  /**
   * Print custom raw text or barcode label
   */
  static async printRaw(printerId: string, content: string): Promise<PrintJob> {
    const job: PrintJob = {
      id: `print-raw-${Date.now()}`,
      type: 'LABEL',
      title: 'Raw / Label Print Job',
      content,
      targetPrinterId: printerId,
      timestamp: new Date().toISOString(),
      status: 'PENDING',
    };
    return this.spooler.enqueue(job);
  }
}
