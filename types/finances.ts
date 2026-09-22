export interface DepositLog {
  id: string;
  date: string;
  totalCollected: number;
  fees: number;
  netDeposit: number;
  status: 'Pending' | 'Completed' | 'In Transit';
}

export interface TaxReport {
  period: string;
  taxableSales: number;
  taxRate: number;
  estimatedTax: number;
  status: 'Due' | 'Paid';
}

export interface TaxDetail {
  id: string;
  taxRate: number;
  name: string;
  applicableSales: number;
  taxesCollected: number;
  taxesRefunded: number;
  netTaxes: number;
}

export interface CashLogEntry {
  id: string;
  date: string;
  openingAmount: number;
  cashSales: number;
  cashDrops: number;
  closingAmount: number;
  variance: number;
  employeeId: string;
}

export interface Statement {
  id: string;
  period: string;
  year: number;
  type: 'Merchant Processing' | 'Plan & Apps';
  amount?: number;
  status: 'Finalized' | 'Estimate';
  downloadUrl: string;
}

export interface Batch {
  id: string;
  date?: string;
  time?: string;
  status?: string;
  type?: string;
  transactionCount?: number;
  amount?: number;
  totalSales?: number;
  netSales?: number;
  tenderCount?: number;
}

export interface DepositDetail {
  id: string;
  date: string;
  submitted: number;
  transferred: number;
  fees: number;
  chargebacks: number;
  paidByOthers: number;
  status: string;
  amount?: number;
  source?: string;
}

export interface Dispute {
  id: string;
  date?: string;
  transactionId?: string;
  reason?: string;
  status?: string;
  amount?: number;
  dueDate?: string;
  originalAmount?: number;
  disputedAmount?: number;
  receivedDate?: string;
  deadlineDate?: string;
}

export interface Vendor {
  id: string;
  name: string;
  email?: string;
  paymentMethod?: string;
  outstandingBalance?: number;
  lastPaidDate?: string;
  category?: string;
  contactName?: string;
  phone?: string;
  status?: string;
}

export interface Bill {
  id: string;
  vendorId: string;
  amount: number;
  dueDate: string;
  status: string;
  invoiceNumber: string;
  vendorName?: string;
  dateIssued?: string;
}

export interface Invoice {
  id: string;
  customerName: string;
  dateIssued: string;
  dueDate: string;
  status: string;
  amount: number;
}

export interface RecurringPlan {
  id: string;
  name: string;
  customerName: string;
  frequency: string;
  nextRun: string;
  status: string;
  amount: number;
}

export interface TenderGroupStats {
  group: string;
  totalAmount: number;
  totalCount: number;
  networks?: { network: string; count: number; amount: number }[];
}

export interface MLJob {
  id: string;
  name: string;
  modelType: string;
  status: 'Running' | 'Completed' | 'Failed' | 'Queued';
  accuracy: number;
  resourceClass: string;
  startTime: string;
}

export interface ResourceClass {
  id: string;
  name: string;
  type: 'GPU' | 'TPU' | 'CPU';
  spec: string;
  availability: number;
}

export interface GiftCard {
  id: string;
  code: string;
  type: 'Physical' | 'Digital';
  balance: number;
  initialBalance: number;
  issuedDate: string;
  status: 'Active' | 'Redeemed' | 'Void';
  businessId: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  expirationDate?: string;
  securityCode?: string;
}
