import {
  Transaction, InventoryItem, Category, MLJob, ResourceClass, SalesSummary,
  DepositLog, TaxReport, DiscountCode, CashLogEntry, Statement, ReportRequest,
  HourlySales, DetailedOrder, OrderTypeSummary, TenderTypeSummary, SalesOverviewReport,
  HourlyBreakdown, TenderGroupStats, OrderTypeExtendedStats, OrderTypeTrend, TaxDetail
} from '../../types';

export const MOCK_TRANSACTIONS: Transaction[] = [];

export const MOCK_INVENTORY_ITEMS: InventoryItem[] = [
  { id: 'I-1', name: 'Margarita Pizza', price: 18.00, cost: 4.50, category: 'Main Course', modifierGroups: [], inStock: true, showOnPos: true, showOnline: true, printerLabels: ['PL-PIZZA'], stationIds: ['oven'], deliveryPolicy: 'BOTH', businessId: 'B001' },
  { id: 'I-2', name: 'Craft Beer', price: 8.00, cost: 2.50, category: 'Beverages', modifierGroups: [], inStock: true, showOnPos: true, showOnline: true, printerLabels: ['PL-BAR'], stationIds: ['bar'], deliveryPolicy: 'BOTH', businessId: 'B001' },
  { id: 'I-3', name: 'Caesar Salad', price: 12.00, cost: 3.00, category: 'Appetizers', modifierGroups: [], inStock: true, showOnPos: true, showOnline: true, printerLabels: ['PL-COLD'], stationIds: ['cold_prep'], deliveryPolicy: 'KDS_ONLY', businessId: 'B001' },
  { id: 'I-4', name: 'Grilled Salmon', price: 24.00, cost: 8.00, category: 'Main Course', modifierGroups: [], inStock: true, showOnPos: true, showOnline: true, printerLabels: ['PL-HOT'], stationIds: ['grill'], deliveryPolicy: 'BOTH', businessId: 'B001' },
  { id: 'I-5', name: 'Cheesecake', price: 9.00, cost: 2.00, category: 'Dessert', modifierGroups: [], inStock: true, showOnPos: true, showOnline: true, printerLabels: ['PL-COLD'], stationIds: ['dessert'], deliveryPolicy: 'KDS_ONLY', businessId: 'B001' },
  { id: 'I-6', name: 'Crispy Wings', price: 15.00, cost: 3.50, category: 'Appetizers', modifierGroups: [], inStock: true, showOnPos: true, showOnline: true, printerLabels: ['PL-HOT'], stationIds: ['fryer'], deliveryPolicy: 'KDS_ONLY', businessId: 'B001' },
  { id: 'I-B2-1', name: 'Downtown Burger', price: 15.00, cost: 4.00, category: 'Burgers', modifierGroups: [], inStock: true, showOnPos: true, showOnline: true, printerLabels: ['PL-HOT'], stationIds: ['grill'], deliveryPolicy: 'BOTH', businessId: 'B002' },
  { id: 'I-B2-2', name: 'Truffle Fries', price: 7.00, cost: 1.50, category: 'Sides', modifierGroups: [], inStock: true, showOnPos: true, showOnline: true, printerLabels: ['PL-HOT'], stationIds: ['fryer'], deliveryPolicy: 'KDS_ONLY', businessId: 'B002' },
  { id: 'I-B3-1', name: 'Lobster Roll', price: 28.00, cost: 12.00, category: 'Seafood', modifierGroups: [], inStock: true, showOnPos: true, showOnline: true, printerLabels: ['PL-HOT'], stationIds: ['cold_prep', 'grill'], deliveryPolicy: 'BOTH', businessId: 'B003' }
];

export const MOCK_ML_JOBS: MLJob[] = [
  { id: 'JOB-001', name: 'Demand Forecast v2', modelType: 'TimeSeries', status: 'Running', accuracy: 0.85, resourceClass: 'GPU-A100', startTime: '2024-05-15 08:00' }
];

export const MOCK_RESOURCES: ResourceClass[] = [
  { id: 'RES-001', name: 'NVIDIA A100 Cluster', type: 'GPU', spec: '80GB VRAM', availability: 4 }
];

export const MOCK_SALES_SUMMARY: SalesSummary[] = [];

export const MOCK_DEPOSITS: DepositLog[] = [];

export const MOCK_TAX_REPORTS: TaxReport[] = [];

export const MOCK_DISCOUNTS: DiscountCode[] = [
  { id: 'D001', code: 'SUMMER10', value: 10, type: 'Percentage', status: 'Active', usageCount: 0, name: 'Summer Sale', showOnPos: true, showOnline: true, applicability: 'Order', taxCalculation: 'BeforeTax' },
  { id: 'D002', code: 'HAPPYHOUR20', value: 20, type: 'Percentage', status: 'Active', usageCount: 0, name: 'Happy Hour 20%', showOnPos: true, showOnline: true, applicability: 'Order', taxCalculation: 'BeforeTax' },
  { id: 'D003', code: 'LUNCH5OFF', value: 5, type: 'Fixed', status: 'Active', usageCount: 0, name: '$5 Off Lunch Special', showOnPos: true, showOnline: false, applicability: 'Order', taxCalculation: 'BeforeTax' }
];

export const MOCK_DEFAULT_DISCOUNTS: DiscountCode[] = [
  { id: 'DEF-1', code: '5OFF', name: '$5 Off', type: 'Fixed', value: 5, status: 'Default', applicability: 'Order', taxCalculation: 'BeforeTax', showOnPos: true, showOnline: true, usageCount: 0 },
  { id: 'DEF-2', code: '10OFF', name: '10% Off', type: 'Percentage', value: 10, status: 'Default', applicability: 'Order', taxCalculation: 'BeforeTax', showOnPos: true, showOnline: true, usageCount: 0 },
  { id: 'DEF-3', code: '15OFF', name: '15% Off', type: 'Percentage', value: 15, status: 'Default', applicability: 'Order', taxCalculation: 'BeforeTax', showOnPos: true, showOnline: true, usageCount: 0 },
  { id: 'DEF-4', code: '20OFF', name: '20% Off', type: 'Percentage', value: 20, status: 'Default', applicability: 'Order', taxCalculation: 'BeforeTax', showOnPos: true, showOnline: true, usageCount: 0 },
  { id: 'DEF-5', code: 'COMP50', name: 'Employee 50% Comp', type: 'Percentage', value: 50, status: 'Default', applicability: 'Order', taxCalculation: 'BeforeTax', showOnPos: true, showOnline: false, usageCount: 0 },
  { id: 'DEF-6', code: 'VIP100', name: '100% VIP Comp', type: 'Percentage', value: 100, status: 'Default', applicability: 'Order', taxCalculation: 'BeforeTax', showOnPos: true, showOnline: false, usageCount: 0 }
];

export const MOCK_DISCOUNT_REPORT = {
  summary: { totalDiscountAmount: 0, totalUses: 0, percentageOfGrossSales: 0, itemsDiscounted: 0 },
  details: []
};

export const MOCK_CASH_LOGS: CashLogEntry[] = [];

export const MOCK_STATEMENTS: Statement[] = [];

export const MOCK_REPORT_REQUESTS: ReportRequest[] = [];

export const MOCK_HOURLY_SALES: HourlySales[] = [];

export const MOCK_DETAILED_ORDERS: DetailedOrder[] = [];

export const MOCK_CATEGORIES: Category[] = [
  { id: 'CAT1', name: 'Appetizers', itemsCount: 1, modifierGroups: [], showOnPos: true, showOnline: true, businessId: 'B001' },
  { id: 'CAT2', name: 'Main Course', itemsCount: 3, modifierGroups: [], showOnPos: true, showOnline: true, businessId: 'B001' },
  { id: 'CAT3', name: 'Beverages', itemsCount: 1, modifierGroups: [], showOnPos: true, showOnline: true, businessId: 'B001' },
  { id: 'CAT4', name: 'Dessert', itemsCount: 1, modifierGroups: [], showOnPos: true, showOnline: true, businessId: 'B001' },
  { id: 'CAT-B2-1', name: 'Burgers', itemsCount: 1, modifierGroups: [], showOnPos: true, showOnline: true, businessId: 'B002' },
  { id: 'CAT-B2-2', name: 'Sides', itemsCount: 1, modifierGroups: [], showOnPos: true, showOnline: true, businessId: 'B002' },
  { id: 'CAT-B3-1', name: 'Seafood', itemsCount: 1, modifierGroups: [], showOnPos: true, showOnline: true, businessId: 'B003' }
];

export const MOCK_ORDER_TYPES: OrderTypeSummary[] = [];

export const MOCK_TENDER_TYPES: TenderTypeSummary[] = [];

export const MOCK_SALES_OVERVIEW: SalesOverviewReport = {
  summary: {
    orders: { value: 0, previousValue: 0, percentageChange: 0 },
    grossSales: { value: 0, previousValue: 0, percentageChange: 0 },
    netSales: { value: 0, previousValue: 0, percentageChange: 0 },
    avgTicketSize: { value: 0, previousValue: 0, percentageChange: 0 },
    amountCollected: { value: 0, previousValue: 0, percentageChange: 0 },
    laborCost: { total: 0, percentage: 0 },
    guests: { value: 0, previousValue: 0, percentageChange: 0 }
  },
  chartData: [
    { date: 'Mon', current: 0, previous: 0 },
    { date: 'Tue', current: 0, previous: 0 },
    { date: 'Wed', current: 0, previous: 0 },
    { date: 'Thu', current: 0, previous: 0 },
    { date: 'Fri', current: 0, previous: 0 },
    { date: 'Sat', current: 0, previous: 0 },
    { date: 'Sun', current: 0, previous: 0 }
  ],
  topTenderTypes: [],
  topRevenueClasses: [],
  topCardTypes: [],
  topCategories: [],
  topItems: []
};

export const MOCK_HOURLY_BREAKDOWN: HourlyBreakdown[] = [
  { hour: '7:00 AM', grossSales: 0, refunds: 0, netSales: 0, taxes: 0, tips: 0, amountCollected: 0 },
  { hour: '8:00 AM', grossSales: 0, refunds: 0, netSales: 0, taxes: 0, tips: 0, amountCollected: 0 },
  { hour: '9:00 AM', grossSales: 0, refunds: 0, netSales: 0, taxes: 0, tips: 0, amountCollected: 0 },
  { hour: '10:00 AM', grossSales: 0, refunds: 0, netSales: 0, taxes: 0, tips: 0, amountCollected: 0 },
  { hour: '11:00 AM', grossSales: 0, refunds: 0, netSales: 0, taxes: 0, tips: 0, amountCollected: 0 },
  { hour: '12:00 PM', grossSales: 0, refunds: 0, netSales: 0, taxes: 0, tips: 0, amountCollected: 0 },
  { hour: '1:00 PM', grossSales: 0, refunds: 0, netSales: 0, taxes: 0, tips: 0, amountCollected: 0 }
];

export const MOCK_TENDER_REPORT_DETAILED: TenderGroupStats[] = [];

export const MOCK_ORDER_TYPES_EXTENDED: OrderTypeExtendedStats[] = [];

export const MOCK_ORDER_TYPE_TRENDS: OrderTypeTrend[] = [];

export const MOCK_TAX_DETAILS: TaxDetail[] = [];
