export interface SalesSummary {
  date: string;
  grossSales: number;
  discounts: number;
  netSales: number;
  orderCount: number;
}

export interface OrderTypeSummary {
  type: 'Dine-in' | 'Takeout' | 'Delivery' | 'Merchandise' | 'Other';
  grossSales: number;
  orderCount: number;
}

export interface OrderTypeExtendedStats {
  type: string;
  ordersCount: number;
  grossSales: number;
  netSales: number;
  avgTicketSize: number;
}

export interface DiscountReportSummary {
  totalDiscountAmount: number;
  totalUses: number;
  percentageOfGrossSales: number;
  itemsDiscounted: number;
}

export interface DiscountReportDetail {
  discountId: string;
  discountName: string;
  uses: number;
  itemsDiscounted: number;
  totalAmount: number;
}

export interface DiscountReportData {
  summary: DiscountReportSummary;
  details: DiscountReportDetail[];
}

export interface OrderTypeTrend {
  date: string;
  [key: string]: number | string;
}

export interface TenderTypeSummary {
  type: 'Cash' | 'Visa' | 'MasterCard' | 'AmEx' | 'Gift Card';
  amount: number;
  count: number;
}

export interface HourlySales {
  hour: string;
  today: number;
  lastPeriod: number;
}

export interface TopItem {
  name: string;
  amount: number;
  quantity: number;
  percentage: number;
}

export interface AppRecommendation {
  name: string;
  provider: string;
  description: string;
  link: string;
  linkText?: string;
}

export interface TrendMetric {
  value: number;
  previousValue: number;
  percentageChange: number;
}

export interface LaborCostMetric {
  total: number;
  percentage: number;
}

export interface SalesOverviewReport {
  summary: {
    orders: TrendMetric;
    grossSales: TrendMetric;
    netSales: TrendMetric;
    avgTicketSize: TrendMetric;
    amountCollected: TrendMetric;
    laborCost: LaborCostMetric;
    guests: TrendMetric;
  };
  chartData: { date: string; current: number; previous: number }[];
  topTenderTypes: { name: string; value: number }[];
  topRevenueClasses: { name: string; value: number }[];
  topCardTypes: { name: string; value: number }[];
  topCategories: { name: string; value: number }[];
  topItems: { name: string; value: number }[];
}

export interface HourlyBreakdown {
  hour: string;
  grossSales: number;
  refunds: number;
  netSales: number;
  taxes: number;
  tips: number;
  amountCollected: number;
}

export interface RevenueItem {
  id: string;
  name: string;
  category: string;
  grossSales: number;
  netSales: number;
  quantitySold: number;
  quantityRefunded: number;
  discounts: number;
  refunds: number;
  cogs: number;
  grossProfit: number;
  avgItemSize: number;
}

export interface RemovedItem {
  id: string;
  itemName: string;
  price: number;
  removedAt: string;
  employeeName: string;
  reason: string;
  orderId: string;
  orderType: string;
  printStatus: string;
  removedBy?: string;
  serverSection?: string;
  time?: string;
}

export interface GiftCardReportSummary {
  totalLoaded: number;
  paidLoaded: number;
  complimentaryLoaded: number;
  countIssued: number;
  totalRedeemed: number;
}

export interface GiftCardTransaction {
  id: string;
  loadMethod: string;
  amount: number;
  date: string;
  employeeName: string;
  type: string;
  orderId?: string;
}

export interface EmployeeSalesReportSummary {
  netSales: number;
  avgTicketSize: number;
  tips: number;
  laborCost: number;
  laborCostPercentage: number;
}

export interface EmployeeSalesRow {
  employeeId: string;
  employeeName: string;
  role: string;
  grossSales: number;
  discounts: number;
  refunds: number;
  netSales: number;
  nonRevenue: number;
  gcActivations: number;
  taxesExpected?: number;
  taxesCollected?: number;
  tips?: number;
  chargesExpected?: number;
  chargesCollected?: number;
  amountCollected?: number;
  paymentCount?: number;
  voids?: number;
  avgTicketSize?: number;
}

export interface PeerMetric {
  metric: string;
  you: number;
  peerAverage: number;
  percentageDiff: number;
  format: 'currency' | 'number';
}

export interface PeerComparisonData {
  grossSales: PeerMetric;
  avgMonthlySales: PeerMetric;
  avgTransactions: PeerMetric;
  avgTransactionSize: PeerMetric;
  chartData: { month: string; you: number; peers: number }[];
  transactionSizeChartData: { month: string; you: number; peers: number }[];
}

export interface ReportRequest {
  id: string;
  type: string;
  dateRange: string;
  status: 'Pending' | 'Ready' | 'Failed';
  requestDate: string;
  requestedBy?: string;
}
