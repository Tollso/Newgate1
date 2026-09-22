/**
 * SettingsService
 * Resolves effective configuration settings across hierarchical scopes (MERCHANT > LOCATION > DEVICE).
 */

import { GlobalTaxConfig, TipConfig, KioskConfig } from '../types';
import { DataRepository } from '../src/repositories/persistence/DataRepository';
import { AuditService } from './auditService';

export interface ScopeIdentifier {
  merchantId: string;
  locationId?: string;
  deviceId?: string;
}

export interface EffectiveSettings {
  scope: ScopeIdentifier;
  taxConfig: GlobalTaxConfig;
  tipConfig: TipConfig;
  kioskConfig: KioskConfig;
  receiptHeader: string;
  receiptFooter: string;
  currency: string;
  requireManagerApprovalForDiscountsOverPercent: number;
  requireManagerApprovalForRefunds: boolean;
  autoCloseDrawerAtEOD: boolean;
  offlineModeEnabled: boolean;
  // Terminal Hardware & Device Security Configuration
  printerIp?: string;
  printerPort?: number;
  defaultOpeningFloat?: number;
  blindCloseEnabled?: boolean;
  autoLockTimeout?: string;
  requireManagerForVoids?: boolean;
  kioskLockTaskEnabled?: boolean;
  networkMode?: 'DHCP' | 'STATIC';
  staticIpAddress?: string;
  gatewayAddress?: string;
}

export class SettingsService {
  private static repo = new DataRepository<any>('settings_store');

  private static defaultSettings: EffectiveSettings = {
    scope: { merchantId: 'M001', locationId: 'LOC-1' },
    taxConfig: {
      rate: 7.25,
      name: 'State Sales Tax',
      enabled: true,
      includeInPrice: false,
      additionalTaxes: [
        { id: 'tax-city', name: 'City Hospitality Tax', rate: 1.25, enabled: true },
      ],
    },
    tipConfig: {
      enabled: true,
      defaultPercentage: 18,
      suggestedPercentages: [15, 18, 20, 25],
      allowCustom: true,
    },
    kioskConfig: {
      enabled: true,
      operatingMode: 'Hybrid (Both)',
      welcomeMessage: 'Welcome to The Newgate POS',
      themeColor: 'indigo',
      layout: 'bottom-cart',
      requireCustomerName: false,
      showItemImages: true,
      timeoutSeconds: 90,
      idleTimeoutSeconds: 90,
      bannerImageUrl: '',
      brandColor: '#4f46e5',
      allowCashPayment: false,
    },
    receiptHeader: 'THE NEWGATE POS\n100 Market St, Suite 400',
    receiptFooter: 'Thank you for your patronage!\nFollow us @newgatepos',
    currency: 'USD',
    requireManagerApprovalForDiscountsOverPercent: 20,
    requireManagerApprovalForRefunds: true,
    autoCloseDrawerAtEOD: true,
    offlineModeEnabled: true,
    printerIp: '192.168.1.200',
    printerPort: 9100,
    defaultOpeningFloat: 200,
    blindCloseEnabled: true,
    autoLockTimeout: '2',
    requireManagerForVoids: true,
    kioskLockTaskEnabled: false,
    networkMode: 'DHCP',
    staticIpAddress: '192.168.1.150',
    gatewayAddress: '192.168.1.1',
  };

  /**
   * Resolves effective settings cascading down from Merchant to Location to Device
   */
  static async resolveEffectiveSettings(scope: ScopeIdentifier): Promise<EffectiveSettings> {
    try {
      const persisted = await this.repo.findById(`scope_${scope.merchantId}_${scope.locationId || 'default'}`);
      if (persisted) {
        return {
          ...this.defaultSettings,
          ...persisted,
          scope,
        };
      }
    } catch (e) {
      console.warn('[SettingsService] Failed to load persisted settings, using defaults', e);
    }

    return {
      ...this.defaultSettings,
      scope,
    };
  }

  /**
   * Update configuration for a specific scope with audit trail
   */
  static async updateSettings(
    scope: ScopeIdentifier,
    updates: Partial<EffectiveSettings>,
    employeeId: string,
    employeeName?: string
  ): Promise<EffectiveSettings> {
    const current = await this.resolveEffectiveSettings(scope);
    const updated: EffectiveSettings = {
      ...current,
      ...updates,
      scope,
    };

    await this.repo.upsert({
      id: `scope_${scope.merchantId}_${scope.locationId || 'default'}`,
      ...updated,
    });

    await AuditService.log({
      actorId: employeeId,
      actorName: employeeName || 'Admin',
      action: 'SETTINGS_UPDATED',
      targetType: 'SETTINGS',
      targetId: `${scope.merchantId}:${scope.locationId}`,
      details: { changedKeys: Object.keys(updates || {}) },
    });

    return updated;
  }
}
