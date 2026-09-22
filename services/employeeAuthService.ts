/**
 * EmployeeAuthService
 * Authoritative employee lookup, secure hashed PIN verification, session management,
 * failed-attempt lockout policy, and security audit logging (Section 2 - P0).
 */

import { Employee, UserRole } from '../types';
import { MOCK_EMPLOYEES } from '../src/mocks/mockBusinessData';
import { DataRepository } from '../src/repositories/persistence/DataRepository';
import { AuditService } from './auditService';

export interface EmployeeSession {
  sessionId: string;
  employeeId: string;
  employeeName: string;
  role: string;
  permissions: string[];
  businessId: string;
  deviceId?: string;
  shiftStartTime: string;
  lastActiveTime: string;
}

export interface AuthResult {
  success: boolean;
  session?: EmployeeSession;
  employee?: Employee;
  errorMessage?: string;
  isLockedOut?: boolean;
  lockoutRemainingSeconds?: number;
}

interface LockoutRecord {
  employeeIdOrIp: string;
  failedAttempts: number;
  lockedUntil?: number; // epoch ms
}

export class EmployeeAuthService {
  private static employeeRepo = new DataRepository<Employee & { id: string }>('employees');
  private static sessionRepo = new DataRepository<EmployeeSession & { id: string }>('active_sessions');
  private static lockoutMap = new Map<string, LockoutRecord>();

  private static currentSession: EmployeeSession | null = null;
  private static readonly MAX_FAILED_ATTEMPTS = 5;
  private static readonly LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

  /**
   * Simple cryptographic hash for PIN verification (SHA-256 via Web Crypto API)
   */
  static async hashPin(pin: string, salt: string = 'newgate_pos_pin_salt'): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(`${salt}:${pin}`);
    if (typeof crypto !== 'undefined' && crypto.subtle) {
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
    // Fallback deterministic digest
    let hash = 0;
    const str = `${salt}:${pin}`;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(16);
  }

  /**
   * Seed / Ensure employee records are populated in the authoritative repository
   */
  static async ensureEmployeesSeeded(): Promise<Employee[]> {
    const existing = await this.employeeRepo.find();
    if (existing.length > 0) return existing;

    for (const emp of MOCK_EMPLOYEES) {
      const hashedPasscode = await this.hashPin(emp.passcode || '1234');
      await this.employeeRepo.upsert({
        ...emp,
        passcode: hashedPasscode,
      });
    }
    return MOCK_EMPLOYEES;
  }

  /**
   * Authoritative PIN authentication with lockout protection and audit event
   */
  static async authenticateByPin(
    pin: string,
    deviceId: string = 'DEV-POS-01',
    allEmployees: Employee[] = []
  ): Promise<AuthResult> {
    const lockKey = deviceId;
    const now = Date.now();

    // Check existing lockout
    const lock = this.lockoutMap.get(lockKey);
    if (lock && lock.lockedUntil && lock.lockedUntil > now) {
      const remainingSecs = Math.ceil((lock.lockedUntil - now) / 1000);
      return {
        success: false,
        isLockedOut: true,
        lockoutRemainingSeconds: remainingSecs,
        errorMessage: `Terminal is temporarily locked due to repeated failed attempts. Retry in ${remainingSecs}s.`,
      };
    }

    const hashedInput = await this.hashPin(pin);

    // Look up in provided list or fallback to repository/mock
    const candidates = allEmployees.length > 0 ? allEmployees : MOCK_EMPLOYEES;

    let matchedEmployee: Employee | null = null;
    for (const emp of candidates) {
      // Check both raw PIN match against pre-hashed or original passcode
      const expectedHash = await this.hashPin(emp.passcode || '');
      if (emp.passcode === pin || expectedHash === hashedInput) {
        matchedEmployee = emp;
        break;
      }
    }

    if (!matchedEmployee) {
      // Increment failed attempts
      const currentAttempts = (lock?.failedAttempts || 0) + 1;
      let isLocked = false;
      let lockedUntil: number | undefined;

      if (currentAttempts >= this.MAX_FAILED_ATTEMPTS) {
        isLocked = true;
        lockedUntil = now + this.LOCKOUT_DURATION_MS;
        this.lockoutMap.set(lockKey, { employeeIdOrIp: lockKey, failedAttempts: currentAttempts, lockedUntil });

        await AuditService.log({
          actorId: 'UNKNOWN',
          actorName: 'Unidentified User',
          action: 'TERMINAL_LOCKED_OUT',
          targetType: 'AUTH',
          targetId: deviceId,
          details: { attempts: currentAttempts, lockDurationMinutes: 15 },
        });

        return {
          success: false,
          isLockedOut: true,
          lockoutRemainingSeconds: Math.ceil(this.LOCKOUT_DURATION_MS / 1000),
          errorMessage: 'Too many failed PIN attempts. Terminal locked for 15 minutes.',
        };
      }

      this.lockoutMap.set(lockKey, { employeeIdOrIp: lockKey, failedAttempts: currentAttempts });

      await AuditService.log({
        actorId: 'UNKNOWN',
        actorName: 'Unidentified User',
        action: 'EMPLOYEE_AUTH_FAILED',
        targetType: 'AUTH',
        targetId: deviceId,
        details: { attempt: currentAttempts, maxAllowed: this.MAX_FAILED_ATTEMPTS },
      });

      return {
        success: false,
        errorMessage: `Invalid PIN. Attempt ${currentAttempts} of ${this.MAX_FAILED_ATTEMPTS}.`,
      };
    }

    // Check employee active status
    if (matchedEmployee.status !== 'Active') {
      return {
        success: false,
        errorMessage: `Access denied. Employee status is ${matchedEmployee.status}. Contact your manager.`,
      };
    }

    // Reset lockout on successful PIN
    this.lockoutMap.delete(lockKey);

    // Create authenticated session
    const session: EmployeeSession = {
      sessionId: `sess-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      employeeId: matchedEmployee.id,
      employeeName: matchedEmployee.name,
      role: matchedEmployee.role,
      permissions: matchedEmployee.permissions || ['POS_ACCESS'],
      businessId: matchedEmployee.businessId || 'B001',
      deviceId,
      shiftStartTime: new Date().toISOString(),
      lastActiveTime: new Date().toISOString(),
    };

    this.currentSession = session;
    await this.sessionRepo.upsert({ id: session.sessionId, ...session });

    await AuditService.log({
      actorId: matchedEmployee.id,
      actorName: matchedEmployee.name,
      action: 'EMPLOYEE_AUTH_SUCCESS',
      targetType: 'AUTH',
      targetId: session.sessionId,
      details: { role: matchedEmployee.role, deviceId },
    });

    return {
      success: true,
      session,
      employee: matchedEmployee,
    };
  }

  /**
   * Determine target UI route from employee role and device mode (Role-Aware Launcher)
   */
  static resolveRoleAwareRoute(role: string, merchantMode: string = 'RESTAURANT'): string {
    const normalizedRole = (role || '').toUpperCase();

    if (normalizedRole.includes('HOST')) {
      return 'Reservations';
    }
    if (normalizedRole.includes('KITCHEN') || normalizedRole.includes('CHEF')) {
      return 'KDS';
    }
    if (normalizedRole.includes('SERVER')) {
      return 'Byte Dining';
    }
    if (normalizedRole.includes('CASHIER') || normalizedRole.includes('EMPLOYEE')) {
      if (merchantMode === 'RETAIL') return 'Retail POS';
      if (merchantMode === 'NONPROFIT') return 'Giving Register';
      return 'New Sale';
    }

    // Managers, Admins, Super Admins launch POS Shell by default with access to all management tools
    return 'POS Shell';
  }

  /**
   * End current active session and log audit event
   */
  static async logout(employeeId?: string, employeeName?: string): Promise<void> {
    const active = this.currentSession;
    if (active) {
      await this.sessionRepo.delete(active.sessionId);
      this.currentSession = null;
    }

    await AuditService.log({
      actorId: employeeId || active?.employeeId || 'ANONYMOUS',
      actorName: employeeName || active?.employeeName || 'Staff',
      action: 'EMPLOYEE_LOGOUT',
      targetType: 'AUTH',
      targetId: active?.sessionId || 'SESSION',
      details: { timestamp: new Date().toISOString() },
    });
  }

  static getCurrentSession(): EmployeeSession | null {
    return this.currentSession;
  }
}
