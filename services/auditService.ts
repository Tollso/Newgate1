/**
 * AuditService
 * Centralized audit logging for critical operations and security/manager approvals.
 */

import { CanonicalAuditLog } from '../src/domain/types';
import { DataRepository } from '../src/repositories/persistence/DataRepository';

export interface RecordAuditParams {
  merchantId?: string;
  locationId?: string;
  actorId: string;
  actorName: string;
  action: string;
  targetType: string;
  targetId?: string;
  details?: Record<string, any>;
  requiresApproval?: boolean;
  approvedByManagerId?: string;
  approvedByManagerName?: string;
  approvalReason?: string;
  status?: 'EXECUTED' | 'REJECTED' | 'PENDING_APPROVAL';
}

export class AuditService {
  private static repository = new DataRepository<CanonicalAuditLog & { id: string }>('audit_logs');
  private static memoryLogs: CanonicalAuditLog[] = [];

  private static initialized = false;

  private static async ensureInitialized() {
    if (this.initialized) return;
    this.initialized = true;
    try {
      const existing = await this.repository.find({ limit: 1 });
      if (existing.length === 0 && this.memoryLogs.length === 0) {
        // Seed initial audit trail
        const initialSeeds: RecordAuditParams[] = [
          {
            actorId: 'EMP-001',
            actorName: 'Admin User',
            action: 'FEE_CONFIG_UPDATED',
            targetType: 'SYSTEM_SETTINGS',
            details: { message: 'Credit card surcharge updated to 2.85%' },
            status: 'EXECUTED',
          },
          {
            actorId: 'EMP-102',
            actorName: 'Sarah Jenkins',
            action: 'MANAGER_PIN_OVERRIDE',
            targetType: 'VOID_ORDER',
            targetId: 'ORD-98214',
            approvalReason: 'Accidental duplicate guest entry',
            approvedByManagerName: 'Michael Scott',
            requiresApproval: true,
            status: 'EXECUTED',
          },
          {
            actorId: 'EMP-001',
            actorName: 'Admin User',
            action: 'DEVICE_PROVISIONED',
            targetType: 'TERMINAL',
            targetId: 'TERM-POS-01',
            details: { lane: 'Register 1', model: 'Sunmi T2s' },
            status: 'EXECUTED',
          },
          {
            actorId: 'EMP-104',
            actorName: 'Alex Rivera',
            action: 'EOD_Z_REPORT_CLOSED',
            targetType: 'BUSINESS_DAY',
            details: { netSales: '$4,285.50', cashVariance: '$0.00' },
            status: 'EXECUTED',
          },
        ];

        for (const s of initialSeeds) {
          await this.log(s);
        }
      }
    } catch {
      // ignore
    }
  }

  static async getAuditLogsForUI(): Promise<Array<{ id: string; action: string; user: string; timestamp: string; details: string }>> {
    await this.ensureInitialized();
    const canonical = await this.getLogs({ limit: 100 });
    return canonical.map(c => ({
      id: c.id,
      action: c.action.replace(/_/g, ' '),
      user: c.actorName || 'System',
      timestamp: c.timestamp,
      details: c.approvalReason
        ? `${c.approvalReason} (Approved by ${c.approvedByManagerName || 'Manager'})`
        : c.details?.message || JSON.stringify(c.details) || c.targetType,
    }));
  }

  static async log(params: RecordAuditParams): Promise<CanonicalAuditLog> {
    const logEntry: CanonicalAuditLog = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      merchantId: params.merchantId || 'M001',
      locationId: params.locationId || 'LOC-1',
      actorId: params.actorId,
      actorName: params.actorName,
      action: params.action,
      targetType: params.targetType,
      targetId: params.targetId,
      details: params.details || {},
      requiresApproval: !!params.requiresApproval,
      approvedByManagerId: params.approvedByManagerId,
      approvedByManagerName: params.approvedByManagerName,
      approvalReason: params.approvalReason,
      timestamp: new Date().toISOString(),
      status: params.status || 'EXECUTED',
    };

    this.memoryLogs.unshift(logEntry);
    if (this.memoryLogs.length > 200) {
      this.memoryLogs = this.memoryLogs.slice(0, 200);
    }

    try {
      await this.repository.upsert(logEntry);
    } catch (e) {
      console.warn('[AuditService] Storage sync error:', e);
    }

    return logEntry;
  }

  static async getLogs(filter?: {
    merchantId?: string;
    locationId?: string;
    actorId?: string;
    action?: string;
    limit?: number;
  }): Promise<CanonicalAuditLog[]> {
    try {
      const persisted = await this.repository.find({
        merchantId: filter?.merchantId,
        locationId: filter?.locationId,
        limit: filter?.limit || 100,
        sortBy: 'timestamp' as any,
        sortDirection: 'desc',
      });
      if (persisted.length > 0) return persisted;
    } catch {
      // fallback to memory
    }

    let logs = [...this.memoryLogs];
    if (filter?.action) {
      logs = logs.filter(l => l.action.toLowerCase().includes(filter.action!.toLowerCase()));
    }
    if (filter?.actorId) {
      logs = logs.filter(l => l.actorId === filter.actorId);
    }
    return logs.slice(0, filter?.limit || 100);
  }
}
