const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'components');

// Move mapping: oldPath relative to components -> newPath relative to components
const moves = {
  // POS
  'CashierPOS.tsx': 'pos/CashierPOS.tsx',
  'KioskApp.tsx': 'pos/KioskApp.tsx',
  // POS folder rename (will handle manually or rename)

  // Dining
  'DiningDashboard.tsx': 'dining/DiningDashboard.tsx',
  'FloorPlanDesignerApp.tsx': 'dining/FloorPlanDesignerApp.tsx',
  'InteractiveTable.tsx': 'dining/InteractiveTable.tsx',
  'TableServiceApp.tsx': 'dining/TableServiceApp.tsx',
  
  // Reports
  'SalesReports.tsx': 'reports/SalesReports.tsx',
  'ItemSales.tsx': 'reports/ItemSales.tsx',
  'EmployeeSalesReport.tsx': 'reports/EmployeeSalesReport.tsx',
  'DiscountsReport.tsx': 'reports/DiscountsReport.tsx',
  'GiftCardReport.tsx': 'reports/GiftCardReport.tsx',
  'ReportFilters.tsx': 'reports/ReportFilters.tsx',
  
  // Finances
  'FinancesOverview.tsx': 'finances/FinancesOverview.tsx',
  'CashLog.tsx': 'finances/CashLog.tsx',
  'Closeout.tsx': 'finances/Closeout.tsx',
  'Deposits.tsx': 'finances/Deposits.tsx',
  'Disputes.tsx': 'finances/Disputes.tsx',
  'PayBills.tsx': 'finances/PayBills.tsx',
  'Invoices.tsx': 'finances/Invoices.tsx',
  'RecurringPayments.tsx': 'finances/RecurringPayments.tsx',
  'Transactions.tsx': 'finances/Transactions.tsx',
  
  // Inventory
  'Items.tsx': 'inventory/Items.tsx',
  'Categories.tsx': 'inventory/Categories.tsx',
  'ModifierGroups.tsx': 'inventory/ModifierGroups.tsx',
  'RemovedItems.tsx': 'inventory/RemovedItems.tsx',
  'Discounts.tsx': 'inventory/Discounts.tsx',
  
  // Staff
  'Employees.tsx': 'staff/Employees.tsx',
  'SchedulingApp.tsx': 'staff/SchedulingApp.tsx',
  'PeerInsights.tsx': 'staff/PeerInsights.tsx',
  
  // CRM
  'Customers.tsx': 'crm/Customers.tsx',
  'FeedbackApp.tsx': 'crm/FeedbackApp.tsx',
  
  // Hardware/Misc
  'PrinterLabels.tsx': 'hardware/PrinterLabels.tsx',
  'ReceiptFeedback.tsx': 'hardware/ReceiptFeedback.tsx',
  'PasscodeLock.tsx': 'auth/PasscodeLock.tsx',
  'Login.tsx': 'auth/Login.tsx',
  
  // Admin / General
  'Settings.tsx': 'admin/Settings.tsx',
  'MLPipeline.tsx': 'admin/MLPipeline.tsx',
  'Documents.tsx': 'admin/Documents.tsx',
  'KitchenDisplay.tsx': 'pos/KitchenDisplay.tsx', // Kitchen belongs to POS/ops
  'Orders.tsx': 'orders/Orders.tsx',
  'ReservationsApp.tsx': 'reservations/ReservationsApp.tsx',
  'Dashboard.tsx': 'dashboard/Dashboard.tsx',
};

// ... Wait, fixing imports automatically via regex can be extremely destructive.
