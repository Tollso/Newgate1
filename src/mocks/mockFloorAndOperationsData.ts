import {
  Table, DiningTable, Reservation, Schedule, BusinessLocation, Director,
  FraudRule, BankAccount, BusinessHours, StockTrackingSettings, KDSSettings,
  PeerComparisonData, SystemModule, SubscriptionPlan, AuditLog, GlobalAutomationRule,
  BusinessGovernanceProfile, RevenueItem, RemovedItem, GiftCardReportSummary,
  GiftCardTransaction, EmployeeSalesReportSummary, EmployeeSalesRow, Batch,
  DepositDetail, Dispute, Vendor, Bill, ModifierGroup, PrinterLabel, PrinterDevice,
  FloorPlan, DiningMetric, DiningAutomationRule, OptimizationRecommendation, TopItem,
  AppRecommendation, TipConfig, KitchenTicket, KitchenMetric, UserRole
} from '../../types';

export const MOCK_TABLES: Table[] = [
  { id: 'T1', name: 'Table 1', seats: 4, status: 'Available' }
];

export const MOCK_FLOOR_TABLES: DiningTable[] = [
  { id: 'B1', name: 'Bar 1', type: 'TABLE_SQUARE', section: 'Main Floor', x: 60, y: 140, width: 110, height: 110, seats: 2, status: 'Occupied', assignedToName: 'Emma Davis', employeeId: 'E109', timeSeated: new Date(Date.now() - 1000 * 60 * 15).toISOString(), isSeatable: true, rotation: 0, businessId: 'B001' },
  { id: 'B2', name: 'Bar 2', type: 'TABLE_SQUARE', section: 'Main Floor', x: 200, y: 140, width: 110, height: 110, seats: 2, status: 'Available', isSeatable: true, rotation: 0, businessId: 'B001' },
  { id: 'B3', name: 'Bar 3', type: 'TABLE_SQUARE', section: 'Main Floor', x: 60, y: 280, width: 110, height: 110, seats: 2, status: 'Occupied', assignedToName: 'Emma Davis', employeeId: 'E109', timeSeated: new Date(Date.now() - 1000 * 60 * 30).toISOString(), isSeatable: true, rotation: 0, businessId: 'B001' },
  { id: 'B4', name: 'Bar 4', type: 'TABLE_SQUARE', section: 'Main Floor', x: 200, y: 280, width: 110, height: 110, seats: 2, status: 'Payment', assignedToName: 'Emma Davis', employeeId: 'E109', isSeatable: true, rotation: 0, businessId: 'B001' },
  { id: 'DB1', name: 'Booth 10', type: 'BOOTH_DOUBLE', section: 'Main Floor', x: 740, y: 40, width: 150, height: 110, seats: 4, status: 'Occupied', assignedToName: 'Alice Walker', employeeId: 'E107', timeSeated: new Date(Date.now() - 1000 * 60 * 55).toISOString(), isSeatable: true, rotation: 0, businessId: 'B001' },
  { id: 'DB2', name: 'Booth 11', type: 'BOOTH_DOUBLE', section: 'Main Floor', x: 740, y: 180, width: 150, height: 110, seats: 4, status: 'Available', isSeatable: true, rotation: 0, businessId: 'B001' },
  { id: 'DB3', name: 'Booth 12', type: 'BOOTH_DOUBLE', section: 'Main Floor', x: 740, y: 320, width: 150, height: 110, seats: 4, status: 'Occupied', assignedToName: 'Alice Walker', employeeId: 'E107', timeSeated: new Date(Date.now() - 1000 * 60 * 10).toISOString(), isSeatable: true, rotation: 0, businessId: 'B001' },
  { id: 'DB4', name: 'Booth 13', type: 'BOOTH_DOUBLE', section: 'Main Floor', x: 740, y: 460, width: 150, height: 110, seats: 4, status: 'Dirty', assignedToName: 'Alice Walker', employeeId: 'E107', isSeatable: true, rotation: 0, businessId: 'B001' },
  { id: 'R1', name: 'T20', type: 'TABLE_ROUND', section: 'Main Floor', x: 370, y: 180, width: 130, height: 130, seats: 4, status: 'Available', isSeatable: true, rotation: 0, businessId: 'B001' },
  { id: 'R2', name: 'T21', type: 'TABLE_ROUND', section: 'Main Floor', x: 540, y: 180, width: 130, height: 130, seats: 4, status: 'Occupied', assignedToName: 'Michael Server', employeeId: 'E104', timeSeated: new Date(Date.now() - 1000 * 60 * 45).toISOString(), isSeatable: true, rotation: 0, businessId: 'B001' },
  { id: 'R3', name: 'T22', type: 'TABLE_ROUND', section: 'Main Floor', x: 370, y: 340, width: 130, height: 130, seats: 4, status: 'Occupied', assignedToName: 'Michael Server', employeeId: 'E104', timeSeated: new Date(Date.now() - 1000 * 60 * 5).toISOString(), isSeatable: true, rotation: 0, businessId: 'B001' },
  { id: 'R4', name: 'T23', type: 'TABLE_ROUND', section: 'Main Floor', x: 540, y: 340, width: 130, height: 130, seats: 4, status: 'Available', isSeatable: true, rotation: 0, businessId: 'B001' },
  { id: 'R5', name: 'T24', type: 'TABLE_ROUND', section: 'Main Floor', x: 370, y: 500, width: 130, height: 130, seats: 4, status: 'Dirty', assignedToName: 'David Chen', employeeId: 'E108', isSeatable: true, rotation: 0, businessId: 'B001' },
  { id: 'R6', name: 'T25', type: 'TABLE_ROUND', section: 'Main Floor', x: 540, y: 500, width: 130, height: 130, seats: 4, status: 'Available', isSeatable: true, rotation: 0, businessId: 'B001' },
  { id: 'L1', name: 'T30', type: 'TABLE_RECT', section: 'Main Floor', x: 60, y: 430, width: 120, height: 150, seats: 6, status: 'Occupied', assignedToName: 'David Chen', employeeId: 'E108', timeSeated: new Date(Date.now() - 1000 * 60 * 60).toISOString(), isSeatable: true, rotation: 0, businessId: 'B001' },
  { id: 'L2', name: 'T31', type: 'TABLE_RECT', section: 'Main Floor', x: 210, y: 430, width: 120, height: 150, seats: 6, status: 'Payment', assignedToName: 'David Chen', employeeId: 'E108', isSeatable: true, rotation: 0, businessId: 'B001' },
  { id: 'L3', name: 'T32', type: 'TABLE_RECT', section: 'Main Floor', x: 60, y: 610, width: 120, height: 150, seats: 6, status: 'Available', isSeatable: true, rotation: 0, businessId: 'B001' },
  { id: 'L4', name: 'T33', type: 'TABLE_RECT', section: 'Main Floor', x: 210, y: 610, width: 120, height: 150, seats: 6, status: 'Available', isSeatable: true, rotation: 0, businessId: 'B001' },
  { id: 'V1', name: 'VIP 1', type: 'TABLE_ROUND', section: 'Main Floor', x: 540, y: 20, width: 140, height: 140, seats: 8, status: 'Available', isSeatable: true, rotation: 0, businessId: 'B001' },
  { id: 'V2', name: 'Lounge', type: 'COUCH_STRAIGHT', section: 'Main Floor', x: 360, y: 30, width: 150, height: 95, seats: 4, status: 'Occupied', assignedToName: 'Chris Evans', employeeId: 'E110', timeSeated: new Date(Date.now() - 1000 * 60 * 20).toISOString(), isSeatable: true, rotation: 0, businessId: 'B001' },
  { id: 'B2-T1', name: 'Table 1', type: 'TABLE_SQUARE', section: 'Dining Room', x: 80, y: 80, width: 120, height: 120, seats: 4, status: 'Available', isSeatable: true, businessId: 'B002' },
  { id: 'B2-T2', name: 'Table 2', type: 'TABLE_SQUARE', section: 'Dining Room', x: 240, y: 80, width: 120, height: 120, seats: 4, status: 'Available', isSeatable: true, businessId: 'B002' },
  { id: 'B2-T3', name: 'Window 1', type: 'TABLE_RECT', section: 'Dining Room', x: 80, y: 240, width: 150, height: 110, seats: 6, status: 'Available', isSeatable: true, businessId: 'B002' }
];

export const MOCK_RESERVATIONS: Reservation[] = [
  { id: 'RES-001', customerName: 'Guest', partySize: 2, time: '7:00 PM', status: 'Booked', notes: 'Window seat preferred' },
  { id: 'RES-002', customerName: 'Guest', partySize: 4, time: '7:30 PM', status: 'Booked', notes: 'Celebrating anniversary' },
  { id: 'RES-003', customerName: 'Guest', partySize: 1, time: '8:00 PM', status: 'Booked' },
  { id: 'RES-004', customerName: 'Guest', partySize: 8, time: '8:30 PM', status: 'Booked', notes: 'VIP Table' },
  { id: 'RES-005', customerName: 'Guest', partySize: 2, time: '6:30 PM', status: 'Seated', tableId: 'T1' },
  { id: 'RES-006', customerName: 'Guest', partySize: 3, time: '7:15 PM', status: 'Booked' },
  { id: 'RES-007', customerName: 'Guest', partySize: 2, time: '8:15 PM', status: 'Booked' },
  { id: 'RES-008', customerName: 'Guest', partySize: 1, time: '9:00 PM', status: 'Booked' }
];

export const MOCK_SCHEDULES: Schedule[] = [
  { id: 'SCH-01', employeeId: 'E107', employeeName: 'Alice Walker', shiftStart: new Date(new Date().setHours(9, 0, 0, 0)).toISOString(), shiftEnd: new Date(new Date().setHours(17, 0, 0, 0)).toISOString(), role: 'Server', source: 'External', externalId: 'ext-101' },
  { id: 'SCH-02', employeeId: 'E108', employeeName: 'David Chen', shiftStart: new Date(new Date().setHours(10, 0, 0, 0)).toISOString(), shiftEnd: new Date(new Date().setHours(18, 0, 0, 0)).toISOString(), role: 'Server', source: 'External', externalId: 'ext-102' },
  { id: 'SCH-03', employeeId: 'E102', employeeName: 'Sarah Manager', shiftStart: new Date(new Date().setHours(8, 0, 0, 0)).toISOString(), shiftEnd: new Date(new Date().setHours(16, 0, 0, 0)).toISOString(), role: 'Manager', source: 'POS' },
  { id: 'SCH-04', employeeId: 'E104', employeeName: 'Michael Server', shiftStart: new Date(new Date(Date.now() - 86400000).setHours(9, 0, 0, 0)).toISOString(), shiftEnd: new Date(new Date(Date.now() - 86400000).setHours(17, 0, 0, 0)).toISOString(), role: 'Server', source: 'POS' },
  { id: 'SCH-05', employeeId: 'E109', employeeName: 'Emma Davis', shiftStart: new Date(new Date().setHours(16, 0, 0, 0)).toISOString(), shiftEnd: new Date(new Date().setHours(23, 0, 0, 0)).toISOString(), role: 'Server', source: 'POS' },
  { id: 'SCH-06', employeeId: 'E110', employeeName: 'Chris Evans', shiftStart: new Date(new Date().setHours(17, 0, 0, 0)).toISOString(), shiftEnd: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(), role: 'Server', source: 'POS' }
];

export const MOCK_LABOR_ANALYSIS = {
  daily: [
    { date: 'Mon', cost: 0, sales: 0, percentage: 0, guests: 0 },
    { date: 'Tue', cost: 0, sales: 0, percentage: 0, guests: 0 },
    { date: 'Wed', cost: 0, sales: 0, percentage: 0, guests: 0 },
    { date: 'Thu', cost: 0, sales: 0, percentage: 0, guests: 0 },
    { date: 'Fri', cost: 0, sales: 0, percentage: 0, guests: 0 },
    { date: 'Sat', cost: 0, sales: 0, percentage: 0, guests: 0 },
    { date: 'Sun', cost: 0, sales: 0, percentage: 0, guests: 0 }
  ],
  weekly: [],
  monthly: []
};

export const MOCK_LOCATIONS: BusinessLocation[] = [];
export const MOCK_DIRECTORS: Director[] = [];
export const MOCK_FRAUD_RULES: FraudRule[] = [];
export const MOCK_BANK_ACCOUNTS: BankAccount[] = [];
export const MOCK_BUSINESS_HOURS: BusinessHours[] = [];
export const MOCK_STOCK_SETTINGS: StockTrackingSettings = { trackStock: true, autoUpdateCounts: true, allowNegativeCounts: false };

export const MOCK_KDS_SETTINGS: KDSSettings = {
  isEnabled: true, routingMode: 'KDS_ONLY', autoReleaseTable: true, stations: [], itemRouting: [],
  warningThresholdMinutes: 10, criticalThresholdMinutes: 20, layoutMode: 'GRID', ticketGrouping: 'TABLE',
  colorCoding: 'TIME_BASED', showCompletedHistory: true, ticketSize: 'COMPACT', showTimers: true, fontSize: 'MEDIUM',
  contrastMode: 'NORMAL', enableItemStatusTracking: true, allowBumpRecall: true, groupItemsByGuest: true,
  enablePriorityHighlighting: true, soundAlerts: true, visualAlerts: true, printerBackup: false, errorLogging: true,
  allowedEditRoles: [UserRole.SUPER_ADMIN, UserRole.BUSINESS_ADMIN], auditLogChanges: true, realtimeSync: true, maintenanceMode: false
};

export const MOCK_PEER_METRICS: PeerComparisonData = {
  grossSales: { metric: 'Gross Sales', you: 0, peerAverage: 0, percentageDiff: 0, format: 'currency' },
  avgMonthlySales: { metric: 'Avg Monthly Sales', you: 0, peerAverage: 0, percentageDiff: 0, format: 'currency' },
  avgTransactions: { metric: 'Avg Transactions', you: 0, peerAverage: 0, percentageDiff: 0, format: 'number' },
  avgTransactionSize: { metric: 'Avg Ticket', you: 0, peerAverage: 0, percentageDiff: 0, format: 'currency' },
  chartData: [],
  transactionSizeChartData: []
};

export const MOCK_SYSTEM_MODULES: SystemModule[] = [
  { id: 'MOD-DIN', name: 'Clover Dining', category: 'Core', isEnabled: true, description: 'Table service and floor plan management' },
  { id: 'MOD-KDS', name: 'Kitchen Display', category: 'Add-on', isEnabled: true, description: 'Digital tickets for kitchen efficiency' },
  { id: 'MOD-RES', name: 'Reservations', category: 'Integration', isEnabled: true, description: 'Guest booking and seat management' },
  { id: 'MOD-GFT', name: 'Gift Cards', category: 'Core', isEnabled: true, description: 'Issue and redeem digital gift cards' }
];

export const MOCK_SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  { id: 'PLAN-STR', name: 'Starter', price: 49, billingCycle: 'Monthly', features: ['Basic Reporting', '1 Register', 'inventory Management'] },
  { id: 'PLAN-GRW', name: 'Growth', price: 99, billingCycle: 'Monthly', features: ['Advanced Reporting', '3 Registers', 'Full Inventory', 'Gift Cards'] },
  { id: 'PLAN-ENT', name: 'Enterprise', price: 199, billingCycle: 'Monthly', features: ['Multi-store', 'Unlimited Registers', 'API Access', '24/7 Support'] }
];

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  { id: 'LOG1', action: 'Employee Sign In', user: 'Michael Server', timestamp: new Date(Date.now() - 3600000).toISOString(), details: 'Signed in at Register 1' },
  { id: 'LOG2', action: 'Refund Issued', user: 'Sarah Manager', timestamp: new Date(Date.now() - 7200000).toISOString(), details: 'Refunded $45.50 for Order ORD-099' },
  { id: 'LOG3', action: 'Settings Updated', user: 'Seckin Gungordu', timestamp: new Date(Date.now() - 86400000).toISOString(), details: 'Updated Tax Configuration' }
];

export const MOCK_GLOBAL_RULES: GlobalAutomationRule[] = [];
export const MOCK_GOVERNANCE_PROFILES: BusinessGovernanceProfile[] = [];
export const MOCK_INVOICES: any[] = [
  { id: 'INV-1001', amount: 250.00, status: 'Sent', dueDate: '2024-06-15', dateIssued: '2024-05-15' },
  { id: 'INV-1002', amount: 1500.00, status: 'Paid', dueDate: '2024-05-10', dateIssued: '2024-04-10' }
];
export const MOCK_RECURRING_PLANS: any[] = [];
export const MOCK_REVENUE_ITEMS: RevenueItem[] = [];
export const MOCK_REMOVED_ITEMS: RemovedItem[] = [];
export const MOCK_GIFT_CARD_DATA: { summary: GiftCardReportSummary, transactions: GiftCardTransaction[] } = {
  summary: { totalLoaded: 0, paidLoaded: 0, complimentaryLoaded: 0, countIssued: 0, totalRedeemed: 0 },
  transactions: []
};
export const MOCK_EMPLOYEES_SALES_DATA: { summary: EmployeeSalesReportSummary, rows: EmployeeSalesRow[] } = {
  summary: { netSales: 0, avgTicketSize: 0, tips: 0, laborCost: 0, laborCostPercentage: 0 },
  rows: []
};
export const MOCK_BATCHES: Batch[] = [];
export const MOCK_DETAILED_DEPOSITS: DepositDetail[] = [
  { id: 'DEP-001', date: 'May 14, 2024', submitted: 8540.00, fees: 142.50, chargebacks: 0, paidByOthers: 0, transferred: 8397.50, status: 'Completed' },
  { id: 'DEP-002', date: 'May 15, 2024', submitted: 6944.42, fees: 115.00, chargebacks: 0, paidByOthers: 0, transferred: 6829.42, status: 'Completed' }
];
export const MOCK_DISPUTES: Dispute[] = [
  { id: 'DISP-101', date: 'May 10, 2024', amount: 45.00, reason: 'Unrecognized Charge', status: 'Under Review', dueDate: 'Jun 01, 2024' }
];
export const MOCK_VENDORS: Vendor[] = [];
export const MOCK_BILLS: Bill[] = [];
export const MOCK_MODIFIER_GROUPS: ModifierGroup[] = [];
export const MOCK_PRINTER_LABELS: PrinterLabel[] = [
  { id: 'PL-HOT', name: 'Hot Line', itemsCount: 15, assignedPrinter: 'Kitchen 1', isActive: true },
  { id: 'PL-COLD', name: 'Cold Station', itemsCount: 8, assignedPrinter: 'Kitchen 2', isActive: true },
  { id: 'PL-BAR', name: 'Bar', itemsCount: 12, assignedPrinter: 'Bar Printer', isActive: true },
  { id: 'PL-PIZZA', name: 'Pizza Oven', itemsCount: 5, assignedPrinter: 'Oven Printer', isActive: true }
];
export const MOCK_PRINTER_DEVICES: PrinterDevice[] = [];
export const MOCK_FLOOR_PLAN: FloorPlan = { id: 'FP1', name: 'Main Layout', sections: ['Dining Room'] };
export const MOCK_DINING_ANALYTICS: DiningMetric[] = [];
export const MOCK_DINING_RULES: DiningAutomationRule[] = [];
export const MOCK_OPTIMIZATIONS: OptimizationRecommendation[] = [];
export const MOCK_TOP_ITEMS: TopItem[] = [];
export const MOCK_RECOMMENDED_APPS: AppRecommendation[] = [
  { name: 'DoorDash Drive', provider: 'DoorDash', description: 'White-label delivery fulfillment', link: '#', linkText: 'Connect' },
  { name: 'QuickBooks Online', provider: 'Intuit', description: 'Sync sales and taxes automatically', link: '#', linkText: 'Connect' }
];
export const MOCK_TIP_CONFIG: TipConfig = { 
  enabled: true, 
  defaultPercentage: 20, 
  suggestedPercentages: [15, 18, 20, 25], 
  allowCustom: true,
  autoGratuityEnabled: true,
  autoGratuityRate: 18,
  autoGratuityMinPartySize: 6,
  serviceFeeEnabled: true,
  serviceFeeName: 'Service Fee',
  serviceFeeType: 'Percentage',
  serviceFeeValue: 3.5
};
export const MOCK_KITCHEN_TICKETS: KitchenTicket[] = [
  { id: 'TKT-101', orderId: 'ORD-101', type: 'Dine-in', status: 'Pending', timeIn: new Date(Date.now() - 1000 * 60 * 5).toISOString(), table: 'Table 4', server: 'Alice W.', items: [{ name: 'Margarita Pizza', qty: 1, modifiers: ['Extra Cheese'], printerLabels: ['PL-PIZZA'] }, { name: 'Craft Beer', qty: 2, modifiers: [], printerLabels: ['PL-BAR'] }] }
];
export const MOCK_KITCHEN_METRICS: KitchenMetric[] = [
  { metric: 'Avg Prep Time', value: '12m 30s', trend: 'down' }
];
export const MOCK_RECEIPT_SETTINGS = { showTax: true };
