export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  BUSINESS_ADMIN = 'BUSINESS_ADMIN',
  CASHIER = 'CASHIER',
  STAFF = 'STAFF',
  VENDOR = 'VENDOR',
  CUSTOMER = 'CUSTOMER'
}

export interface AdditionalTaxRate {
  id: string;
  name: string;
  rate: number;
  enabled: boolean;
}

export interface GlobalTaxConfig {
  rate: number;
  name: string;
  enabled: boolean;
  includeInPrice: boolean;
  additionalTaxes?: AdditionalTaxRate[];
}

export function getEffectiveTaxRate(taxConfig?: GlobalTaxConfig): number {
  if (!taxConfig || !taxConfig.enabled) return 0;
  let totalRate = taxConfig.rate || 0;
  if (taxConfig.additionalTaxes && Array.isArray(taxConfig.additionalTaxes)) {
    taxConfig.additionalTaxes.forEach(tax => {
      if (tax.enabled) {
        totalRate += tax.rate || 0;
      }
    });
  }
  return totalRate;
}

export function getTaxBreakdown(subtotal: number, taxConfig?: GlobalTaxConfig) {
  if (!taxConfig || !taxConfig.enabled) {
    return {
      totalTax: 0,
      effectiveRate: 0,
      breakdown: [] as { name: string; rate: number; amount: number }[]
    };
  }

  const breakdown: { name: string; rate: number; amount: number }[] = [];
  const primaryAmount = subtotal * ((taxConfig.rate || 0) / 100);
  breakdown.push({
    name: taxConfig.name || 'Sales Tax',
    rate: taxConfig.rate || 0,
    amount: primaryAmount
  });

  let additionalTotal = 0;
  if (taxConfig.additionalTaxes && Array.isArray(taxConfig.additionalTaxes)) {
    taxConfig.additionalTaxes.forEach(tax => {
      if (tax.enabled) {
        const amt = subtotal * ((tax.rate || 0) / 100);
        additionalTotal += amt;
        breakdown.push({
          name: tax.name,
          rate: tax.rate || 0,
          amount: amt
        });
      }
    });
  }

  const effectiveRate = getEffectiveTaxRate(taxConfig);
  const totalTax = primaryAmount + additionalTotal;

  return {
    totalTax,
    effectiveRate,
    breakdown
  };
}

export type VARProvider = 'Stripe' | 'Fiserv' | 'TSYS' | 'Clover' | 'Square' | 'PayPal' | 'None';

export interface VARConfiguration {
  provider: VARProvider;
  merchantId: string;
  terminalId?: string;
  vNumber?: string;
  authKey?: string;
  status: 'Active' | 'Pending' | 'Failed' | 'Not Configured';
}

export interface Business {
  id: string;
  name: string;
  ownerName: string;
  plan: 'Starter' | 'Growth' | 'Enterprise';
  status: 'Active' | 'Suspended' | 'Trial';
  nextBillingDate: string;
  revenueYTD: number;
  merchantMode?: 'RESTAURANT' | 'RETAIL' | 'NONPROFIT';
  varConfig?: VARConfiguration;
}

export interface PasscodePolicy {
  minLength: number;
  requireComplex: boolean;
  expirationDays?: number;
}

export interface Employee {
  id: string;
  name: string;
  nickname?: string;
  role: UserRole | string;
  email: string;
  phone?: string;
  payType?: 'Hourly' | 'Salary';
  hourlyRate: number;
  hoursWorked: number;
  status: 'Active' | 'On Leave' | 'Terminated';
  businessId?: string;
  deviceAccess?: boolean;
  passcode?: string;
  permissions?: string[];
}

export interface Role {
  id: string;
  name: string;
  type: 'Default' | 'Custom';
  description?: string;
  isSystem?: boolean;
  employeeCount?: number;
  hourlyRate?: number;
  pinRequired?: boolean;
  passcodePolicy?: PasscodePolicy;
}

export interface PermissionItem {
  id: string;
  name: string;
  key: string;
  category: 'App Access' | 'Transactions' | 'Inventory' | 'Setup' | 'Customers';
  description?: string;
}

export interface PermissionGroup {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isSystem?: boolean;
}

export interface RolePermission {
  roleId: string;
  permissionKey: string;
  access: boolean;
}

export interface PasscodeSettings {
  requirePasscode: boolean;
  minLength: number;
  requireAlpha: boolean;
  expirationDays: number;
}

export interface RoleAssignmentRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  currentRole: string;
  requestedRole: string;
  status: 'Pending' | 'Approved' | 'Denied';
  requesterName: string;
  date: string;
}

export type CustomerSegment = 'VIP' | 'Regular' | 'New' | 'At Risk' | 'Subscriber' | 'Abandoned';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalSpent: number;
  totalSpend?: number;
  segment: CustomerSegment;
  lastVisit: string;
  ordersCount: number;
  visitCount?: number;
  loyaltyPoints?: number;
  businessId?: string;
}

export interface BusinessLocation {
  id: string;
  name: string;
  address: string;
  status: string;
}

export interface Director {
  id: string;
  name: string;
  title: string;
}

export interface FraudRule {
  id: string;
  condition: string;
  action: string;
  active: boolean;
}

export interface BankAccount {
  id: string;
  bankName: string;
  last4: string;
  status: string;
  rapidDeposit: boolean;
}

export interface BusinessHours {
  day: string;
  open: string;
  close: string;
  closed: boolean;
}

export interface AppIntegrationConfig {
  reservation_pos: boolean;
  scheduling_pos: boolean;
  scheduling_reservation: boolean;
  kdsEnabled: boolean;
}

export interface Reservation {
  id: string;
  customerName: string;
  partySize: number;
  time: string;
  tableId?: string;
  status: 'Booked' | 'Seated' | 'Cancelled' | 'Completed';
  notes?: string;
}

export interface WaitlistEntry {
  id: string;
  customerName: string;
  customerPhone?: string;
  partySize: number;
  quotedTimeMins: number;
  timeAdded: string;
  status: 'Waiting' | 'Ready' | 'Seated' | 'No Show';
  notes?: string;
}

export interface Schedule {
  id: string;
  employeeId: string;
  employeeName: string;
  shiftStart: string;
  shiftEnd: string;
  role: string;
  assignedSection?: string;
  source?: 'POS' | 'External';
  externalId?: string;
}

export interface SystemModule {
  id: string;
  name: string;
  category: 'Core' | 'Add-on' | 'Integration';
  isEnabled: boolean;
  description: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  billingCycle: 'Monthly' | 'Yearly';
  features: string[];
}

export interface AuditLog {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details: string;
}

export interface GlobalAutomationRule {
  id: string;
  name: string;
  ruleType: 'Refund' | 'Discount' | 'Inventory' | 'Scheduling';
  threshold: number;
  action: 'Auto-Approve' | 'Flag' | 'Block';
  appliedGlobally: boolean;
  description: string;
}

export interface BusinessGovernanceProfile {
  businessId: string;
  businessName: string;
  planEnforcement: 'Strict' | 'Flexible';
  complianceLevel: 'Standard' | 'High';
  dataRetentionDays: number;
}

export interface Notification {
  id: string;
  type: 'OrderReady' | 'System';
  message: string;
  targetEmployeeId: string;
  timestamp: string;
  read: boolean;
}

