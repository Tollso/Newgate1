/**
 * Canonical Hardware Domain Types
 */

export type DeviceType = 
  | 'TERMINAL' 
  | 'RECEIPT_PRINTER' 
  | 'KITCHEN_PRINTER' 
  | 'CASH_DRAWER' 
  | 'BARCODE_SCANNER' 
  | 'SCALE' 
  | 'CUSTOMER_DISPLAY'
  | 'PAYMENT_PINPAD';

export type DeviceConnectionType = 'USB' | 'NETWORK' | 'BLUETOOTH' | 'SERIAL' | 'VIRTUAL';

export type DeviceStatus = 'ONLINE' | 'OFFLINE' | 'BUSY' | 'ERROR' | 'PAPER_OUT' | 'DRAWER_OPEN';

export interface HardwareDevice {
  id: string;
  name: string;
  type: DeviceType;
  connectionType: DeviceConnectionType;
  address?: string; // IP, COM port, or USB VID/PID
  status: DeviceStatus;
  isDefault?: boolean;
  stationId?: string;
  stationName?: string;
  metadata?: Record<string, any>;
  lastSeen?: string;
}

export type PrintJobType = 'RECEIPT' | 'KITCHEN_TICKET' | 'CUSTOMER_BILL' | 'CASH_REPORT' | 'LABEL' | 'TEST';

export interface PrintJobItem {
  name: string;
  quantity: number;
  price?: number;
  modifiers?: string[];
  notes?: string;
}

export interface PrintJob {
  id: string;
  type: PrintJobType;
  targetPrinterId?: string;
  station?: string;
  title: string;
  content: string; // Plain text, ESC/POS formatted, or markdown
  items?: PrintJobItem[];
  subtotal?: number;
  tax?: number;
  total?: number;
  headerText?: string;
  footerText?: string;
  orderId?: string;
  orderNumber?: string;
  tableName?: string;
  serverName?: string;
  timestamp: string;
  status: 'PENDING' | 'PRINTING' | 'COMPLETED' | 'FAILED';
  retryCount?: number;
  errorMessage?: string;
}

export interface CashDrawerEvent {
  id: string;
  drawerId: string;
  type: 'OPEN' | 'SALE' | 'REFUND' | 'PAID_IN' | 'PAID_OUT' | 'NO_SALE' | 'AUDIT';
  amount?: number;
  reason?: string;
  employeeId: string;
  employeeName?: string;
  timestamp: string;
  authorizedByManagerId?: string;
}
