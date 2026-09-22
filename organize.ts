import { Project } from "ts-morph";
import * as path from "path";

const projectFiles = new Project({
    tsConfigFilePath: "./tsconfig.json", 
});

const moves: Record<string, string> = {
  // POS
  'components/CashierPOS.tsx': 'components/pos/CashierPOS.tsx',
  'components/KioskApp.tsx': 'components/pos/KioskApp.tsx',
  'components/KitchenDisplay.tsx': 'components/pos/KitchenDisplay.tsx',

  // Dining
  'components/DiningDashboard.tsx': 'components/dining/DiningDashboard.tsx',
  'components/FloorPlanDesignerApp.tsx': 'components/dining/FloorPlanDesignerApp.tsx',
  'components/InteractiveTable.tsx': 'components/dining/InteractiveTable.tsx',
  'components/TableServiceApp.tsx': 'components/dining/TableServiceApp.tsx',
  
  // Reports
  'components/SalesReports.tsx': 'components/reports/SalesReports.tsx',
  'components/ItemSales.tsx': 'components/reports/ItemSales.tsx',
  'components/EmployeeSalesReport.tsx': 'components/reports/EmployeeSalesReport.tsx',
  'components/DiscountsReport.tsx': 'components/reports/DiscountsReport.tsx',
  'components/GiftCardReport.tsx': 'components/reports/GiftCardReport.tsx',
  'components/ReportFilters.tsx': 'components/reports/ReportFilters.tsx',
  
  // Finances
  'components/FinancesOverview.tsx': 'components/finances/FinancesOverview.tsx',
  'components/CashLog.tsx': 'components/finances/CashLog.tsx',
  'components/Closeout.tsx': 'components/finances/Closeout.tsx',
  'components/Deposits.tsx': 'components/finances/Deposits.tsx',
  'components/Disputes.tsx': 'components/finances/Disputes.tsx',
  'components/PayBills.tsx': 'components/finances/PayBills.tsx',
  'components/Invoices.tsx': 'components/finances/Invoices.tsx',
  'components/RecurringPayments.tsx': 'components/finances/RecurringPayments.tsx',
  'components/Transactions.tsx': 'components/finances/Transactions.tsx',
  
  // Inventory
  'components/Items.tsx': 'components/inventory/Items.tsx',
  'components/Categories.tsx': 'components/inventory/Categories.tsx',
  'components/ModifierGroups.tsx': 'components/inventory/ModifierGroups.tsx',
  'components/RemovedItems.tsx': 'components/inventory/RemovedItems.tsx',
  'components/Discounts.tsx': 'components/inventory/Discounts.tsx',
  
  // Staff
  'components/Employees.tsx': 'components/staff/Employees.tsx',
  'components/SchedulingApp.tsx': 'components/staff/SchedulingApp.tsx',
  'components/PeerInsights.tsx': 'components/staff/PeerInsights.tsx',
  
  // CRM
  'components/Customers.tsx': 'components/crm/Customers.tsx',
  'components/FeedbackApp.tsx': 'components/crm/FeedbackApp.tsx',
  
  // Hardware/Misc
  'components/PrinterLabels.tsx': 'components/hardware/PrinterLabels.tsx',
  'components/ReceiptFeedback.tsx': 'components/hardware/ReceiptFeedback.tsx',
  'components/PasscodeLock.tsx': 'components/auth/PasscodeLock.tsx',
  'components/Login.tsx': 'components/auth/Login.tsx',
  
  // Admin / General
  'components/Settings.tsx': 'components/admin/Settings.tsx',
  'components/MLPipeline.tsx': 'components/admin/MLPipeline.tsx',
  'components/Documents.tsx': 'components/admin/Documents.tsx',
  'components/Orders.tsx': 'components/orders/Orders.tsx',
  'components/ReservationsApp.tsx': 'components/reservations/ReservationsApp.tsx',
  'components/Dashboard.tsx': 'components/dashboard/Dashboard.tsx',
};

for (const [oldPath, newPath] of Object.entries(moves)) {
    const sourceFile = projectFiles.getSourceFile(oldPath);
    if (sourceFile) {
        console.log(`Moving ${oldPath} to ${newPath}`);
        sourceFile.move(newPath);
    } else {
        console.warn(`Could not find ${oldPath}`);
    }
}

// Rename 'components/POS' directory to 'components/pos'
const posDir = projectFiles.getDirectory("components/POS");
if (posDir) {
    const files = posDir.getDescendantSourceFiles();
    for (const file of files) {
        const filePath = file.getFilePath();
        const newFilePath = filePath.replace('/components/POS/', '/components/pos/');
        file.move(newFilePath);
    }
}

projectFiles.saveSync();
console.log("Done!");
