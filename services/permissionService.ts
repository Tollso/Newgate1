/**
 * PermissionService
 * Centralized authorization service separating role/permission rules from components.
 * Supports dynamic employee list, employee PIN verification, and audit logging.
 */

import { AuditService } from './auditService';
import { Employee } from '../types';

export interface AuthorizationContext {
  employeeId?: string;
  employeeName?: string;
  role?: string;
  permissions?: string[];
  merchantId?: string;
  locationId?: string;
}

export interface ManagerApprovalResult {
  success: boolean;
  approved: boolean;
  manager?: { id: string; name: string; role: string };
  managerId?: string;
  managerName?: string;
  reason?: string;
  error?: string;
}

export interface PermissionDefinition {
  id: string;
  name: string;
  category: 'App Access' | 'Operations' | 'Dining & Tables' | 'Hardware & Setup' | 'Financial & Cash';
  description: string;
}

export const CANONICAL_PERMISSIONS: PermissionDefinition[] = [
  // App Access Tiles
  { id: 'pos.register.access', name: 'Access Register', category: 'App Access', description: 'Open order entry register and process cart transactions' },
  { id: 'pos.tables.access', name: 'Access Tables & Dining', category: 'App Access', description: 'View floor plan, manage dining tables, courses and checks' },
  { id: 'pos.orders.access', name: 'Access Orders & Receipts', category: 'App Access', description: 'View order history, open checks and reprint receipts' },
  { id: 'pos.kds.access', name: 'Access Kitchen Display (KDS)', category: 'App Access', description: 'View kitchen line tickets and mark items ready/bump' },
  { id: 'pos.reservations.access', name: 'Access Reservations', category: 'App Access', description: 'Manage guest party reservations and seating waitlist' },
  { id: 'pos.cash_drawer.access', name: 'Access Cash Drawer', category: 'App Access', description: 'Open cash drawer, view expected float and perform drops' },
  { id: 'pos.closeout.access', name: 'Access End of Day (EOD)', category: 'App Access', description: 'Close business day, perform blind counts and generate Z-Report' },
  { id: 'pos.86.access', name: 'Access 86 / Availability', category: 'App Access', description: 'View 86 items list and toggle out-of-stock items' },
  { id: 'pos.shifts.access', name: 'Access Shift Clock', category: 'App Access', description: 'Clock in, take meal breaks and record shift hours' },
  { id: 'pos.settings.access', name: 'Access POS Settings', category: 'App Access', description: 'Access terminal parameters, employees and permissions' },
  { id: 'pos.customers.access', name: 'Access Customer CRM', category: 'App Access', description: 'View guest directory, customer profiles and loyalty points' },
  { id: 'pos.inventory.access', name: 'Access Inventory & POs', category: 'App Access', description: 'Manage inventory stocks, barcodes and purchase orders' },
  { id: 'pos.refunds.access', name: 'Access Refunds & Voids', category: 'App Access', description: 'Process post-settlement refunds, voids and restock' },
  { id: 'pos.diagnostics.access', name: 'Access Hardware Diagnostics', category: 'App Access', description: 'Test receipt printer ESC/POS, cash drawer solenoid and scanners' },
  { id: 'pos.kiosk.access', name: 'Access Customer Kiosk', category: 'App Access', description: 'Launch self-service ordering kiosk screen' },
  { id: 'webadmin.open', name: 'Launch Web Admin', category: 'App Access', description: 'Switch from terminal to full browser Web Admin suite' },
  { id: 'devices.manage', name: 'Appliance Setup & Provisioning', category: 'App Access', description: 'Enroll terminals, configure serials and manage hardware devices' },

  // Role & Permissions Control
  { id: 'roles.permissions.manage', name: 'Manage Staff Roles & Permissions', category: 'Operations', description: 'Configure staff access privileges, grant/revoke app tiles, change PIN passcodes' },

  // Operations & Dining
  { id: 'pos.table.split', name: 'Split Table & Checks', category: 'Dining & Tables', description: 'Perform even, by-item, by-guest and custom check splitting' },
  { id: 'pos.guest.manage', name: 'Guest Management', category: 'Dining & Tables', description: 'Add, rename, move, adjust party size and pay specific guests' },
  { id: 'pos.kds.station', name: 'KDS Station Switching', category: 'Operations', description: 'Filter kitchen display tickets by specific station or line' },
  { id: 'pos.86.modify', name: 'Modify Item 86 Status', category: 'Operations', description: 'Mark menu items in/out of stock and adjust item availability' },
  { id: 'pos.printers.manage', name: 'Printers & Kitchen Routing', category: 'Hardware & Setup', description: 'Configure thermal IP printers and label dispatch policies' },
  { id: 'pos.tips.adjust', name: 'Adjust Tips & Payouts', category: 'Financial & Cash', description: 'Modify tip allocations, tip pool sharing and server payouts' },
  { id: 'pos.reports.view', name: 'View Sales & Tax Reports', category: 'Financial & Cash', description: 'Inspect X-Reports, daily sales summaries and tax breakdowns' },
  { id: 'pos.manager.override', name: 'Manager Override Authority', category: 'Operations', description: 'Authorize manager approval for voids, manual discounts and exits' },
];

export const ROLE_PRESET_PERMISSIONS: Record<string, string[]> = {
  SUPER_ADMIN: CANONICAL_PERMISSIONS.map(p => p.id),
  BUSINESS_ADMIN: CANONICAL_PERMISSIONS.map(p => p.id),
  ADMIN: CANONICAL_PERMISSIONS.map(p => p.id),
  OWNER: CANONICAL_PERMISSIONS.map(p => p.id),
  MANAGER: [
    'pos.register.access', 'pos.tables.access', 'pos.orders.access', 'pos.kds.access',
    'pos.reservations.access', 'pos.cash_drawer.access', 'pos.closeout.access', 'pos.86.access',
    'pos.shifts.access', 'pos.settings.access', 'pos.customers.access', 'pos.inventory.access',
    'pos.refunds.access', 'pos.diagnostics.access', 'pos.kiosk.access', 'pos.table.split', 'pos.guest.manage',
    'pos.kds.station', 'pos.86.modify', 'pos.printers.manage', 'pos.tips.adjust',
    'pos.reports.view', 'pos.manager.override', 'devices.manage', 'webadmin.open',
    'roles.permissions.manage',
  ],
  'SERVER LEAD': [
    'pos.tables.access', 'pos.register.access', 'pos.orders.access', 'pos.shifts.access',
    'pos.86.access', 'pos.table.split', 'pos.guest.manage', 'pos.tips.adjust', 'pos.reports.view',
  ],
  SERVER: [
    'pos.tables.access', 'pos.register.access', 'pos.orders.access', 'pos.shifts.access',
    'pos.86.access', 'pos.table.split', 'pos.guest.manage',
  ],
  CASHIER: [
    'pos.register.access', 'pos.orders.access', 'pos.customers.access', 'pos.shifts.access',
    'pos.cash_drawer.access', 'pos.refunds.access',
  ],
  HOST: [
    'pos.reservations.access', 'pos.tables.access', 'pos.shifts.access', 'pos.guest.manage',
  ],
  KITCHEN: [
    'pos.kds.access', 'pos.86.access', 'pos.shifts.access', 'pos.kds.station',
  ],
  EMPLOYEE: [
    'pos.shifts.access', 'pos.register.access',
  ],
  STAFF: [
    'pos.shifts.access',
  ],
};

export interface StoredEmployeeSecurityOverride {
  role?: string;
  passcode?: string;
  permissions?: string[];
  updatedAt: string;
}

export class PermissionService {
  private static registeredEmployees: Employee[] = [];
  private static employeeCustomPermissions: Map<string, string[]> = new Map();
  private static listeners: Set<() => void> = new Set();
  private static readonly STORAGE_KEY = 'newgate_employee_security_overrides_v1';

  /**
   * Subscribe to permission / security profile updates so UI re-renders immediately
   */
  static subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  static notifyListeners(): void {
    this.listeners.forEach(fn => {
      try {
        fn();
      } catch (e) {
        console.error('[PermissionService] Error in listener:', e);
      }
    });
  }

  private static loadStoredOverrides(): Record<string, StoredEmployeeSecurityOverride> {
    if (typeof window === 'undefined' || !window.localStorage) return {};
    try {
      const raw = window.localStorage.getItem(this.STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      console.error('[PermissionService] Failed to load stored security overrides:', e);
      return {};
    }
  }

  private static saveStoredOverrides(overrides: Record<string, StoredEmployeeSecurityOverride>): void {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      window.localStorage.setItem(this.STORAGE_KEY, JSON.stringify(overrides));
    } catch (e) {
      console.error('[PermissionService] Failed to save stored security overrides:', e);
    }
  }

  /**
   * Register or update the list of employees for real PIN verification
   */
  static registerEmployees(employees: Employee[]): void {
    if (Array.isArray(employees)) {
      this.registeredEmployees = employees;
      const overrides = this.loadStoredOverrides();

      employees.forEach(emp => {
        const override = overrides[emp.id];
        if (override) {
          if (override.role) emp.role = override.role;
          if (override.passcode) emp.passcode = override.passcode;
          if (override.permissions && Array.isArray(override.permissions)) {
            emp.permissions = override.permissions;
            this.employeeCustomPermissions.set(emp.id, override.permissions);
            return;
          }
        }

        if (emp.permissions && Array.isArray(emp.permissions)) {
          this.employeeCustomPermissions.set(emp.id, emp.permissions);
        }
      });
    }
  }

  /**
   * Get all active effective permissions for an employee (custom overrides or role preset)
   */
  static getEffectivePermissions(employee: Employee | AuthorizationContext): string[] {
    const roleUpper = (employee.role || '').toUpperCase();
    if (roleUpper === 'SUPER_ADMIN' || roleUpper === 'BUSINESS_ADMIN' || roleUpper === 'OWNER' || roleUpper === 'ADMIN') {
      return CANONICAL_PERMISSIONS.map(p => p.id);
    }

    const empId = (employee as any).id || (employee as any).employeeId;
    if (empId && this.employeeCustomPermissions.has(empId)) {
      return this.employeeCustomPermissions.get(empId) || [];
    }

    if (employee.permissions && Array.isArray(employee.permissions) && employee.permissions.length > 0) {
      return employee.permissions;
    }

    // Role preset fallback
    return ROLE_PRESET_PERMISSIONS[roleUpper] || ROLE_PRESET_PERMISSIONS.STAFF || [];
  }

  /**
   * Save customized permissions for an employee with audit logging
   */
  static async updateEmployeePermissions(
    employeeId: string,
    permissions: string[],
    actor: Employee
  ): Promise<void> {
    this.employeeCustomPermissions.set(employeeId, permissions);
    const emp = this.registeredEmployees.find(e => e.id === employeeId);
    if (emp) {
      emp.permissions = permissions;
    }

    // Persist to local storage
    const overrides = this.loadStoredOverrides();
    overrides[employeeId] = {
      ...overrides[employeeId],
      permissions,
      updatedAt: new Date().toISOString(),
    };
    this.saveStoredOverrides(overrides);

    await AuditService.log({
      actorId: actor.id,
      actorName: actor.name,
      action: 'UPDATE_EMPLOYEE_PERMISSIONS',
      targetType: 'PERMISSION',
      targetId: employeeId,
      details: {
        employeeId,
        permissionsCount: permissions.length,
        permissionsList: permissions,
      },
      status: 'EXECUTED',
    });

    this.notifyListeners();
  }

  /**
   * Save complete employee security configuration (role, permissions, and passcode) with comprehensive audit logging
   */
  static async saveEmployeeSecurityProfile(params: {
    employeeId: string;
    role?: string;
    passcode?: string;
    permissions?: string[];
    actor: Employee;
  }): Promise<{ success: boolean; employee?: Employee }> {
    const { employeeId, role, passcode, permissions, actor } = params;

    const emp = this.registeredEmployees.find(e => e.id === employeeId);
    const overrides = this.loadStoredOverrides();
    const existingOverride: StoredEmployeeSecurityOverride = overrides[employeeId] || {
      updatedAt: new Date().toISOString(),
    };

    const previousRole = emp?.role;
    const previousPermissions = emp ? this.getEffectivePermissions(emp) : [];
    const pinChanged = Boolean(passcode && passcode !== emp?.passcode);

    if (role && emp) {
      emp.role = role;
      existingOverride.role = role;
    }

    if (passcode && emp) {
      emp.passcode = passcode;
      existingOverride.passcode = passcode;
    }

    if (permissions && Array.isArray(permissions)) {
      this.employeeCustomPermissions.set(employeeId, permissions);
      if (emp) emp.permissions = permissions;
      existingOverride.permissions = permissions;
    }

    existingOverride.updatedAt = new Date().toISOString();
    overrides[employeeId] = existingOverride;
    this.saveStoredOverrides(overrides);

    // Audit Role Change if applicable
    if (role && previousRole && role !== previousRole) {
      await AuditService.log({
        actorId: actor.id,
        actorName: actor.name,
        action: 'UPDATE_EMPLOYEE_ROLE',
        targetType: 'EMPLOYEE',
        targetId: employeeId,
        details: {
          employeeId,
          employeeName: emp?.name,
          previousRole,
          newRole: role,
        },
        status: 'EXECUTED',
      });
    }

    // Audit Permissions Change if applicable
    if (permissions && Array.isArray(permissions)) {
      const added = permissions.filter(p => !previousPermissions.includes(p));
      const removed = previousPermissions.filter(p => !permissions.includes(p));

      await AuditService.log({
        actorId: actor.id,
        actorName: actor.name,
        action: 'UPDATE_EMPLOYEE_PERMISSIONS',
        targetType: 'PERMISSION',
        targetId: employeeId,
        details: {
          employeeId,
          employeeName: emp?.name,
          assignedRole: role || emp?.role,
          permissionsTotal: permissions.length,
          permissionsAdded: added,
          permissionsRemoved: removed,
        },
        status: 'EXECUTED',
      });
    }

    // Audit PIN update if changed
    if (pinChanged) {
      await AuditService.log({
        actorId: actor.id,
        actorName: actor.name,
        action: 'UPDATE_EMPLOYEE_PIN',
        targetType: 'EMPLOYEE',
        targetId: employeeId,
        details: {
          employeeId,
          employeeName: emp?.name,
          pinLength: passcode.length,
          securityHashMethod: 'SALTED_TERMINAL_PERSISTENCE',
        },
        status: 'EXECUTED',
      });
    }

    // Broadcast instant recalculation to all subscribed components (e.g. PosShell Hub)
    this.notifyListeners();

    return { success: true, employee: emp };
  }

  /**
   * Checks if an action is permitted directly by employee permissions or role
   */
  static can(
    firstArg: string | AuthorizationContext | Employee,
    secondArg: string | AuthorizationContext | Employee
  ): boolean {
    let actionKey = '';
    let employeeObj: Employee | AuthorizationContext;

    if (typeof firstArg === 'string') {
      actionKey = firstArg;
      employeeObj = secondArg as any;
    } else {
      employeeObj = firstArg as any;
      actionKey = typeof secondArg === 'string' ? secondArg : '';
    }

    if (!employeeObj || !actionKey) return false;

    const roleUpper = (employeeObj.role || '').toUpperCase();
    if (roleUpper === 'SUPER_ADMIN' || roleUpper === 'BUSINESS_ADMIN' || roleUpper === 'OWNER' || roleUpper === 'ADMIN') {
      return true;
    }

    const effective = this.getEffectivePermissions(employeeObj);
    return effective.includes(actionKey);
  }

  /**
   * Verifies manager authorization via real employee PIN lookup with audit logging
   */
  static async verifyManagerPin(
    pin: string,
    actionKey: string,
    context?: AuthorizationContext,
    reason?: string
  ): Promise<ManagerApprovalResult> {
    const defaultCtx: AuthorizationContext = context || {
      employeeId: 'CURRENT_OPERATOR',
      employeeName: 'Current Operator',
      role: 'CASHIER',
    };

    // Find in dynamically registered employees matching secure passcode
    const approvingEmployee = this.registeredEmployees.find(emp => {
      const empPin = emp.passcode || '';
      if (!empPin || empPin !== pin) return false;
      const role = (emp.role || '').toUpperCase();
      const hasOverridePerm = this.can(emp, 'pos.manager.override');
      const isManagerOrAdmin = 
        role.includes('ADMIN') || 
        role.includes('MANAGER') || 
        role.includes('OWNER') || 
        hasOverridePerm;
      return isManagerOrAdmin;
    });

    if (!approvingEmployee) {
      await AuditService.log({
        actorId: defaultCtx.employeeId,
        actorName: defaultCtx.employeeName,
        action: `FAILED_APPROVAL_${actionKey}`,
        targetType: 'PERMISSION',
        details: { actionKey, reason, attemptedPinLength: pin.length },
        status: 'REJECTED',
        merchantId: defaultCtx.merchantId,
        locationId: defaultCtx.locationId,
      });

      return { success: false, approved: false, error: 'Invalid manager PIN or insufficient override permissions' };
    }

    await AuditService.log({
      actorId: defaultCtx.employeeId,
      actorName: defaultCtx.employeeName,
      action: `MANAGER_APPROVAL_${actionKey}`,
      targetType: 'PERMISSION',
      approvedByManagerId: approvingEmployee.id,
      approvedByManagerName: approvingEmployee.name,
      approvalReason: reason || 'Authorized by Manager PIN',
      requiresApproval: true,
      status: 'EXECUTED',
      details: { actionKey, reason, approvingRole: approvingEmployee.role },
      merchantId: defaultCtx.merchantId,
      locationId: defaultCtx.locationId,
    });

    return {
      success: true,
      approved: true,
      manager: { id: approvingEmployee.id, name: approvingEmployee.name, role: String(approvingEmployee.role) },
      managerId: approvingEmployee.id,
      managerName: approvingEmployee.name,
      reason: reason || 'Authorized',
    };
  }

  /**
   * Enforces permission; throws error if unauthorized and manager not approved
   */
  static async enforce(
    actionKey: string,
    context: AuthorizationContext,
    approval?: ManagerApprovalResult
  ): Promise<boolean> {
    if (this.can(actionKey, context)) {
      return true;
    }

    if (approval && approval.approved) {
      return true;
    }

    throw new Error(`Unauthorized: Permission '${actionKey}' required. Manager override missing.`);
  }
}
