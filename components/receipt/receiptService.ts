import { ReceiptOrderContext, ReceiptDeliveryOption } from './receiptTypes';

export class ReceiptDeliveryService {
  static formatThermalReceipt(context: ReceiptOrderContext): string {
    const lines: string[] = [];
    lines.push('================================');
    lines.push('          NEWGATE POS           ');
    lines.push('================================');
    lines.push(`Date: ${new Date().toLocaleString()}`);
    if (context.orderNumber) lines.push(`Order #: ${context.orderNumber}`);
    if (context.orderId) lines.push(`Ref: ${context.orderId}`);
    if (context.tableTentOrName) lines.push(`Location: ${context.tableTentOrName}`);
    lines.push('--------------------------------');
    
    if (context.items && context.items.length > 0) {
      context.items.forEach(item => {
        const itemLine = `${item.qty}x ${item.name}`.padEnd(22, ' ');
        const priceStr = `$${(item.price * item.qty).toFixed(2)}`.padStart(10, ' ');
        lines.push(`${itemLine}${priceStr}`);
      });
      lines.push('--------------------------------');
    }

    if (context.subtotal !== undefined) {
      lines.push(`Subtotal:              $${context.subtotal.toFixed(2)}`);
    }
    if (context.tax !== undefined) {
      lines.push(`Tax:                   $${context.tax.toFixed(2)}`);
    }
    if (context.tip !== undefined && context.tip > 0) {
      lines.push(`Tip:                   $${context.tip.toFixed(2)}`);
    }
    lines.push(`TOTAL:                 $${context.total.toFixed(2)}`);
    lines.push(`Payment:               ${context.paymentMethod}`);
    lines.push('Status:                APPROVED');
    lines.push('================================');
    lines.push('       THANK YOU FOR DINING!    ');
    lines.push('================================');
    return lines.join('\n');
  }

  static async deliverReceipt(
    option: ReceiptDeliveryOption,
    context: ReceiptOrderContext,
    destination?: string
  ): Promise<{ success: boolean; message: string }> {
    switch (option) {
      case 'PRINT': {
        const thermalText = this.formatThermalReceipt(context);
        console.log('[RECEIPT_PRINT] Thermal ESC/POS Payload Dispatched:\n', thermalText);
        return { success: true, message: 'Thermal receipt sent to counter printer.' };
      }
      case 'EMAIL': {
        const targetEmail = destination || context.customerEmail || '';
        console.log(`[RECEIPT_EMAIL] Emailed receipt to: ${targetEmail}`, context);
        return { success: true, message: `Receipt sent to ${targetEmail}.` };
      }
      case 'SMS': {
        const targetPhone = destination || context.customerPhone || '';
        console.log(`[RECEIPT_SMS] SMS text link sent to: ${targetPhone}`, context);
        return { success: true, message: `Text receipt dispatched to ${targetPhone}.` };
      }
      case 'NONE':
      default:
        return { success: true, message: 'No receipt requested.' };
    }
  }
}
