import {
  Business, Role, Employee, Customer, PermissionItem, RolePermission, PermissionGroup,
  RoleAssignmentRequest, PasscodeSettings, UserRole
} from '../../types';

export const MOCK_BUSINESSES: Business[] = [
  { id: 'B001', name: 'LUMI RESTAURANT AND BAR', ownerName: 'Seckin Gungordu', plan: 'Enterprise', status: 'Active', nextBillingDate: '2024-06-01', revenueYTD: 145000, merchantMode: 'RESTAURANT', varConfig: { provider: 'Clover', merchantId: '496138300884', terminalId: 'LK9921', status: 'Active' } },
  { id: 'B002', name: 'DOWNTOWN BISTRO', ownerName: 'Jane Smith', plan: 'Growth', status: 'Active', nextBillingDate: '2024-06-15', revenueYTD: 85200, merchantMode: 'RESTAURANT', varConfig: { provider: 'Square', merchantId: '5566778899', status: 'Active' } },
  { id: 'B003', name: 'OCEAN VIEW CAFE', ownerName: 'Robert Ocean', plan: 'Starter', status: 'Active', nextBillingDate: '2024-07-01', revenueYTD: 12400, merchantMode: 'RESTAURANT', varConfig: { provider: 'Stripe', merchantId: 'acct_123456789', status: 'Active' } },
  { id: 'B004', name: 'NEWGATE RETAIL STORE', ownerName: 'Marcus Bell', plan: 'Growth', status: 'Active', nextBillingDate: '2024-08-01', revenueYTD: 52000, merchantMode: 'RETAIL', varConfig: { provider: 'Stripe', merchantId: 'acct_retail_999', status: 'Active' } },
  { id: 'B005', name: 'HOPE COMMUNITY FOUNDATION', ownerName: 'Sarah Jenkins', plan: 'Enterprise', status: 'Active', nextBillingDate: '2024-09-01', revenueYTD: 110000, merchantMode: 'NONPROFIT', varConfig: { provider: 'Stripe', merchantId: 'acct_np_777', status: 'Active' } }
];

export const MOCK_ROLES: Role[] = [
  { id: 'R-ADMIN', name: 'Admin', type: 'Default', isSystem: true, description: 'Full platform control', employeeCount: 2 },
  { id: 'R-EMPLOYEE', name: 'Employee', type: 'Default', isSystem: true, description: 'Basic access', employeeCount: 22 },
  { id: 'R-MANAGER', name: 'Manager', type: 'Default', isSystem: true, description: 'Store operations', employeeCount: 4 },
  { id: 'R-LEAD', name: 'Server Lead', type: 'Custom', isSystem: false, description: 'Shift leader', employeeCount: 0 }
];

export const MOCK_PERMISSIONS: PermissionItem[] = [
  { id: 'P1', name: 'Access App Market', key: 'ACCESS_APP_MARKET', category: 'App Access' },
  { id: 'P2', name: 'Access Cash Log', key: 'ACCESS_CASH_LOG', category: 'App Access' },
  { id: 'P3', name: 'Access Closeout', key: 'ACCESS_CLOSEOUT', category: 'App Access' },
  { id: 'P4', name: 'Access Clover Dining', key: 'ACCESS_DINING', category: 'App Access' },
  { id: 'P5', name: 'Access Clover Focus Browser', key: 'ACCESS_FOCUS_BROWSER', category: 'App Access' },
  { id: 'P6', name: 'Access Customers', key: 'ACCESS_CUSTOMERS', category: 'App Access' },
  { id: 'P7', name: 'Access Help', key: 'ACCESS_HELP', category: 'App Access' },
  { id: 'P8', name: 'Access Discounts', key: 'ACCESS_DISCOUNTS', category: 'App Access' },
  { id: 'P9', name: 'Access Gift Cards', key: 'ACCESS_GIFT_CARDS', category: 'App Access' },
  { id: 'P10', name: 'Access Happy Hour', key: 'ACCESS_HAPPY_HOUR', category: 'App Access' },
  { id: 'P11', name: 'Access Inventory app', key: 'ACCESS_INVENTORY', category: 'App Access' },
  { id: 'P12', name: 'Access Invoice Manager', key: 'ACCESS_INVOICES', category: 'App Access' },
  { id: 'P13', name: 'Access Manual Transaction', key: 'ACCESS_MANUAL_TRANS', category: 'App Access' },
  { id: 'P14', name: 'Access Multiple Menus', key: 'ACCESS_MENUS', category: 'App Access' },
  { id: 'P15', name: 'Access Printers', key: 'ACCESS_PRINTERS', category: 'App Access' },
  { id: 'P16', name: 'Access Plan Manager', key: 'ACCESS_PLANS', category: 'App Access' },
  { id: 'P17', name: 'Access Refund', key: 'ACCESS_REFUND', category: 'App Access' },
  { id: 'P18', name: 'Access Register', key: 'ACCESS_REGISTER', category: 'App Access' },
  { id: 'P19', name: 'Access Reporting', key: 'ACCESS_REPORTING', category: 'App Access' },
  { id: 'P20', name: 'Access Setup App', key: 'ACCESS_SETUP', category: 'App Access' },
  { id: 'P21', name: 'Access Shifts', key: 'ACCESS_SHIFTS', category: 'App Access' },
  { id: 'P22', name: 'Access Tips', key: 'ACCESS_TIPS', category: 'App Access' },
  { id: 'P23', name: 'Access Transactions', key: 'ACCESS_TRANSACTIONS', category: 'App Access' },
  { id: 'P24', name: 'Access Virtual Terminal', key: 'ACCESS_VIRTUAL_TERMINAL', category: 'App Access' },
  { id: 'P25', name: 'Access Wireless Manager', key: 'ACCESS_WIRELESS', category: 'App Access' }
];

export const MOCK_ROLE_PERMISSIONS: RolePermission[] = [
  { roleId: 'R-MANAGER', permissionKey: 'ACCESS_REGISTER', access: true },
  { roleId: 'R-EMPLOYEE', permissionKey: 'ACCESS_REGISTER', access: true }
];

export const MOCK_PERMISSION_GROUPS: PermissionGroup[] = [
  { id: 'G1', name: 'Front of House', description: 'Cashier and server permissions', permissions: ['ACCESS_REGISTER', 'ACCESS_DINING'] }
];

export const MOCK_ROLE_ASSIGNMENT_REQUESTS: RoleAssignmentRequest[] = [
  { id: 'REQ1', employeeId: 'E100', employeeName: 'Alice Smith', currentRole: 'Employee', requestedRole: 'Manager', status: 'Pending', requesterName: 'Bob Manager', date: '2024-05-15' }
];

export const MOCK_PASSCODE_SETTINGS: PasscodeSettings = {
  requirePasscode: true,
  minLength: 4,
  requireAlpha: false,
  expirationDays: 90
};

export const MOCK_EMPLOYEES: Employee[] = [
  { id: 'E101', name: 'Seckin Gungordu', role: 'Admin', email: 'sgungordu@gmail.com', hourlyRate: 50, hoursWorked: 40, status: 'Active', businessId: 'B001', deviceAccess: true, passcode: '1234' },
  { id: 'E102', name: 'Sarah Manager', role: 'Manager', email: 'sarah.m@lumi.com', hourlyRate: 35, hoursWorked: 45, status: 'Active', businessId: 'B001', deviceAccess: true, passcode: '5678' },
  { id: 'E103', name: 'John Lead', role: 'Server Lead', email: 'john.l@lumi.com', hourlyRate: 25, hoursWorked: 38, status: 'Active', businessId: 'B001', deviceAccess: true, passcode: '0000' },
  { id: 'E104', name: 'Michael Server', role: 'Server', email: 'michael.s@lumi.com', hourlyRate: 18, hoursWorked: 30, status: 'Active', businessId: 'B001', deviceAccess: true, passcode: '1111' },
  { id: 'E105', name: 'Jane Host', role: 'Host', email: 'jane.h@lumi.com', hourlyRate: 18, hoursWorked: 25, status: 'Active', businessId: 'B001', deviceAccess: true, passcode: '2222' },
  { id: 'E112', name: 'Carlos Kitchen', role: 'Kitchen', email: 'carlos.k@lumi.com', hourlyRate: 20, hoursWorked: 40, status: 'Active', businessId: 'B001', deviceAccess: true, passcode: '2468' },
  { id: 'E113', name: 'Lisa Cashier', role: 'Cashier', email: 'lisa.c@lumi.com', hourlyRate: 17, hoursWorked: 35, status: 'Active', businessId: 'B001', deviceAccess: true, passcode: '1357' },
  { id: 'E107', name: 'Alice Walker', role: 'Server', email: 'alice.w@lumi.com', hourlyRate: 18, hoursWorked: 32, status: 'Active', businessId: 'B001', deviceAccess: true, passcode: '4444' },
  { id: 'E108', name: 'David Chen', role: 'Server', email: 'david.c@lumi.com', hourlyRate: 18, hoursWorked: 28, status: 'Active', businessId: 'B001', deviceAccess: true, passcode: '5555' },
  { id: 'E109', name: 'Emma Davis', role: 'Server', email: 'emma.d@lumi.com', hourlyRate: 18, hoursWorked: 35, status: 'Active', businessId: 'B001', deviceAccess: true, passcode: '6666' },
  { id: 'E110', name: 'Chris Evans', role: 'Server', email: 'chris.e@lumi.com', hourlyRate: 18, hoursWorked: 20, status: 'Active', businessId: 'B001', deviceAccess: true, passcode: '7777' },
  { id: 'E111', name: 'Katie Holmes', role: 'Server', email: 'katie.h@lumi.com', hourlyRate: 18, hoursWorked: 40, status: 'Active', businessId: 'B001', deviceAccess: true, passcode: '8888' },
  { id: 'E106', name: 'Bob Employee', role: 'Employee', email: 'bob.e@lumi.com', hourlyRate: 15, hoursWorked: 20, status: 'Active', businessId: 'B001', deviceAccess: true, passcode: '3333' },
  { id: 'E_SUPER', name: 'System Super', role: UserRole.SUPER_ADMIN, email: 'super@omnicommand.com', hourlyRate: 100, hoursWorked: 0, status: 'Active', businessId: 'B001', deviceAccess: true, passcode: '9999' }
];

export const MOCK_CUSTOMERS: Customer[] = [
  { id: 'C001', name: 'Alice Wonderland', email: 'alice@example.com', phone: '555-0101', totalSpent: 1250.50, segment: 'VIP', lastVisit: '2024-05-14', ordersCount: 45 },
  { id: 'C002', name: 'Bob Builder', email: 'bob@example.com', phone: '555-0102', totalSpent: 450.00, segment: 'Regular', lastVisit: '2024-05-10', ordersCount: 12 },
  { id: 'C003', name: 'Charlie Chocolate', email: 'charlie@example.com', phone: '555-0103', totalSpent: 50.00, segment: 'New', lastVisit: '2024-05-15', ordersCount: 1 },
  { id: 'C004', name: 'Diana Prince', email: 'diana@themyscira.com', phone: '555-0104', totalSpent: 3200.00, segment: 'VIP', lastVisit: '2024-05-16', ordersCount: 88 },
  { id: 'C005', name: 'Edward Nigma', email: 'ed@riddler.com', phone: '555-0105', totalSpent: 120.00, segment: 'Regular', lastVisit: '2024-05-12', ordersCount: 3 },
  { id: 'C006', name: 'Fiona Gallagher', email: 'fiona@southside.com', phone: '555-0106', totalSpent: 890.00, segment: 'Regular', lastVisit: '2024-05-08', ordersCount: 22 },
  { id: 'C007', name: 'George Costanza', email: 'george@vandelay.com', phone: '555-0107', totalSpent: 15.00, segment: 'At Risk', lastVisit: '2024-04-01', ordersCount: 1 },
  { id: 'C008', name: 'Hannah Montana', email: 'hannah@miley.com', phone: '555-0108', totalSpent: 4500.00, segment: 'VIP', lastVisit: '2024-05-16', ordersCount: 112 },
  { id: 'C009', name: 'Ian Wright', email: 'ian@arsenal.com', phone: '555-0109', totalSpent: 210.00, segment: 'Regular', lastVisit: '2024-05-14', ordersCount: 6 },
  { id: 'C010', name: 'Jack Sparrow', email: 'jack@blackpearl.com', phone: '555-0110', totalSpent: 1500.00, segment: 'VIP', lastVisit: '2024-05-15', ordersCount: 30 }
];
