import React, { useState, useEffect } from 'react';
import { ShieldAlert, Lock, KeyRound, ArrowLeft } from 'lucide-react';
import { NativeBridge } from '../../services/nativeBridge';
import { KitchenRoutingService, StationConfig } from '../../services/kitchenRoutingService';
import { SettingsService, EffectiveSettings } from '../../services/settingsService';
import { PermissionService } from '../../services/permissionService';
import { AuditService } from '../../services/auditService';
import { ManagerApprovalModal } from '../auth/ManagerApprovalModal';
import { PosSettingsHubProps, SettingsSection } from './settings/PosSettingsTypes';
import { PosSettingsHeader } from './settings/PosSettingsHeader';
import { PosSettingsOverviewGrid } from './settings/PosSettingsOverviewGrid';
import { PosSettingsEmployeesSection } from './settings/PosSettingsEmployeesSection';
import { PosSettingsMenuSection } from './settings/PosSettingsMenuSection';
import { PosSettingsDevicesSection } from './settings/PosSettingsDevicesSection';
import { PosSettingsCashSecurityHelp } from './settings/PosSettingsCashSecurityHelp';
import { PosSettingsTablesSection } from './settings/PosSettingsTablesSection';
import { PosSettingsKitchenSection } from './settings/PosSettingsKitchenSection';
import { PosSettingsTipsSection } from './settings/PosSettingsTipsSection';
import { PosSettingsReceiptsSection } from './settings/PosSettingsReceiptsSection';
import { PosSettingsNetworkSection } from './settings/PosSettingsNetworkSection';

export const PosSettingsHub: React.FC<PosSettingsHubProps> = ({
  currentUser,
  employees,
  inventory,
  tables,
  tipConfig,
  taxConfig,
  kdsSettings,
  onExit,
  onOpenWebAdmin,
  onSaveItem,
  onUpdateTable,
  onUpdateEmployee,
}) => {
  const [activeSection, setActiveSection] = useState<SettingsSection>('OVERVIEW');
  const [batteryLevel, setBatteryLevel] = useState<number>(100);
  const [stations, setStations] = useState<StationConfig[]>(KitchenRoutingService.STATIONS);
  const [employeeEditorUnlocked, setEmployeeEditorUnlocked] = useState(false);
  const [showOverrideModal, setShowOverrideModal] = useState(false);

  const canManageStaff = PermissionService.can(currentUser, 'roles.permissions.manage') || employeeEditorUnlocked;

  // Authoritative settings state backed by SettingsService
  const [printerIp, setPrinterIpState] = useState('192.168.1.200');
  const [printerPort, setPrinterPortState] = useState(9100);
  const [defaultOpeningFloat, setDefaultOpeningFloatState] = useState(200);
  const [blindCloseEnabled, setBlindCloseEnabledState] = useState(true);
  const [autoLockTimeout, setAutoLockTimeoutState] = useState('2');
  const [requireManagerForVoids, setRequireManagerForVoidsState] = useState(true);
  const [kioskLockTaskEnabled, setKioskLockTaskEnabledState] = useState(false);

  const isSuperAdminOrAdmin =
    currentUser.role === 'SUPER_ADMIN' ||
    currentUser.role === 'BUSINESS_ADMIN' ||
    currentUser.role === 'Admin' ||
    currentUser.role === 'Owner' ||
    currentUser.role === 'Manager';

  useEffect(() => {
    NativeBridge.getBatteryLevel().then(setBatteryLevel);
    KitchenRoutingService.getStations().then(setStations);

    SettingsService.resolveEffectiveSettings({ merchantId: 'M001', locationId: 'LOC-1' }).then(cfg => {
      if (cfg.printerIp) setPrinterIpState(cfg.printerIp);
      if (cfg.printerPort) setPrinterPortState(cfg.printerPort);
      if (cfg.defaultOpeningFloat !== undefined) setDefaultOpeningFloatState(cfg.defaultOpeningFloat);
      if (cfg.blindCloseEnabled !== undefined) setBlindCloseEnabledState(cfg.blindCloseEnabled);
      if (cfg.autoLockTimeout !== undefined) setAutoLockTimeoutState(cfg.autoLockTimeout);
      if (cfg.requireManagerForVoids !== undefined) setRequireManagerForVoidsState(cfg.requireManagerForVoids);
      if (cfg.kioskLockTaskEnabled !== undefined) setKioskLockTaskEnabledState(cfg.kioskLockTaskEnabled);
    });
  }, []);

  const persistSetting = (updates: Partial<EffectiveSettings>) => {
    SettingsService.updateSettings(
      { merchantId: 'M001', locationId: 'LOC-1' },
      updates,
      currentUser.id,
      currentUser.name
    ).catch(e => console.error('[PosSettingsHub] Failed to persist settings:', e));
  };

  const setPrinterIp = (val: string) => {
    setPrinterIpState(val);
    persistSetting({ printerIp: val });
  };

  const setPrinterPort = (val: number) => {
    setPrinterPortState(val);
    persistSetting({ printerPort: val });
  };

  const setDefaultOpeningFloat = (val: number) => {
    setDefaultOpeningFloatState(val);
    persistSetting({ defaultOpeningFloat: val });
  };

  const setBlindCloseEnabled = (val: boolean) => {
    setBlindCloseEnabledState(val);
    persistSetting({ blindCloseEnabled: val });
  };

  const setAutoLockTimeout = (val: string) => {
    setAutoLockTimeoutState(val);
    persistSetting({ autoLockTimeout: val });
  };

  const setRequireManagerForVoids = (val: boolean) => {
    setRequireManagerForVoidsState(val);
    persistSetting({ requireManagerForVoids: val });
  };

  const setKioskLockTaskEnabled = (val: boolean) => {
    setKioskLockTaskEnabledState(val);
    persistSetting({ kioskLockTaskEnabled: val });
  };

  const handleBack = () => {
    if (activeSection !== 'OVERVIEW') setActiveSection('OVERVIEW');
    else onExit();
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 text-slate-100 select-none overflow-hidden">
      <PosSettingsHeader
        activeSection={activeSection}
        onBack={handleBack}
        currentUser={currentUser}
        isSuperAdminOrAdmin={isSuperAdminOrAdmin}
        onOpenWebAdmin={onOpenWebAdmin}
      />

      <div className="flex-1 overflow-y-auto p-6 md:p-8 max-w-6xl mx-auto w-full">
        {activeSection === 'OVERVIEW' && (
          <PosSettingsOverviewGrid
            onSelectSection={setActiveSection}
            tables={tables}
            stations={stations}
            batteryLevel={batteryLevel}
            currentUser={currentUser}
          />
        )}

        {activeSection === 'EMPLOYEES' && (
          canManageStaff ? (
            <PosSettingsEmployeesSection
              employees={employees}
              currentUser={currentUser}
              onUpdateEmployee={onUpdateEmployee}
            />
          ) : (
            <div className="max-w-xl mx-auto mt-12 p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center shadow-2xl">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-6 text-amber-400">
                <ShieldAlert size={36} />
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono mb-4">
                <Lock size={12} />
                <span>Permission Guard Enforced</span>
              </span>
              <h3 className="text-2xl font-black text-white tracking-tight mb-2">
                Roles & Permissions Restricted
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                Only operators with the <code className="text-amber-300 font-mono bg-slate-800 px-1.5 py-0.5 rounded">roles.permissions.manage</code> privilege (or authorized Managers/Admins) can modify staff roles, grant permissions, and configure terminal PINs.
              </p>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-left mb-6 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Current Operator:</span>
                  <span className="text-white font-medium">{currentUser.name} ({currentUser.role})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Required Permission:</span>
                  <span className="text-amber-400 font-mono font-bold">roles.permissions.manage</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => setActiveSection('OVERVIEW')}
                  className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft size={16} />
                  <span>Return to Settings</span>
                </button>
                <button
                  onClick={() => setShowOverrideModal(true)}
                  className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <KeyRound size={16} />
                  <span>Authorize with Manager PIN</span>
                </button>
              </div>
            </div>
          )
        )}

        {activeSection === 'MENU' && (
          <PosSettingsMenuSection inventory={inventory} onSaveItem={onSaveItem} />
        )}

        {activeSection === 'TABLES' && (
          <PosSettingsTablesSection
            tables={tables}
            currentUser={currentUser}
            onUpdateTable={onUpdateTable}
          />
        )}

        {activeSection === 'KITCHEN' && (
          <PosSettingsKitchenSection currentUser={currentUser} />
        )}

        {activeSection === 'TIPS' && (
          <PosSettingsTipsSection
            tipConfig={tipConfig}
            currentUser={currentUser}
          />
        )}

        {activeSection === 'RECEIPTS' && (
          <PosSettingsReceiptsSection currentUser={currentUser} />
        )}

        {activeSection === 'NETWORK' && (
          <PosSettingsNetworkSection currentUser={currentUser} />
        )}

        {activeSection === 'DEVICES' && (
          <PosSettingsDevicesSection
            currentUser={currentUser}
            printerIp={printerIp}
            setPrinterIp={setPrinterIp}
            printerPort={printerPort}
            setPrinterPort={setPrinterPort}
          />
        )}

        {['CASH', 'SECURITY', 'HELP'].includes(activeSection) && (
          <PosSettingsCashSecurityHelp
            activeSection={activeSection as any}
            defaultOpeningFloat={defaultOpeningFloat}
            setDefaultOpeningFloat={setDefaultOpeningFloat}
            blindCloseEnabled={blindCloseEnabled}
            setBlindCloseEnabled={setBlindCloseEnabled}
            kioskLockTaskEnabled={kioskLockTaskEnabled}
            setKioskLockTaskEnabled={setKioskLockTaskEnabled}
            requireManagerForVoids={requireManagerForVoids}
            setRequireManagerForVoids={setRequireManagerForVoids}
            autoLockTimeout={autoLockTimeout}
            setAutoLockTimeout={setAutoLockTimeout}
            batteryLevel={batteryLevel}
          />
        )}
      </div>

      {showOverrideModal && (
        <ManagerApprovalModal
          isOpen={showOverrideModal}
          actionDescription="Authorize Access to Roles & Permissions Management"
          requiredPermission="roles.permissions.manage"
          currentOperator={currentUser}
          onSuccess={(manager) => {
            setShowOverrideModal(false);
            setEmployeeEditorUnlocked(true);
            AuditService.log({
              actorId: manager.id,
              actorName: manager.name,
              action: 'MANAGER_OVERRIDE_ROLES_PERMISSIONS_EDITOR_ACCESS',
              targetType: 'SYSTEM_SETTINGS',
              targetId: 'EMPLOYEES',
              details: {
                operatorId: currentUser.id,
                operatorName: currentUser.name,
                authorizedBy: manager.name,
              },
              status: 'EXECUTED',
            });
          }}
          onCancel={() => setShowOverrideModal(false)}
        />
      )}
    </div>
  );
};

export default PosSettingsHub;
