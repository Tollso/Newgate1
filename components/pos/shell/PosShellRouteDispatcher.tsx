import React, { useState, useEffect } from 'react';
import { RotateCcw, ShieldAlert, ArrowLeft, KeyRound, Lock } from 'lucide-react';
import { PosShellProps, PosShellPropsState, PosInternalRoute } from './PosShellTypes';
import { PermissionService } from '../../../services/permissionService';
import { AuditService } from '../../../services/auditService';
import { ROUTE_PERMISSION_MAP } from './PosShellTileConfigs';
import { ManagerApprovalModal } from '../../auth/ManagerApprovalModal';
import CashierPOS from '../CashierPOS';
import TableServiceApp from '../../dining/TableServiceApp';
import KitchenDisplay from '../KitchenDisplay';
import { PosShellOrdersView } from './PosShellOrdersView';
import { PosSettingsHub } from '../PosSettingsHub';
import ReservationsApp from '../../reservations/ReservationsApp';
import { PosShellCashDrawer } from './PosShellCashDrawer';
import CashierCloseout from '../CashierCloseout';
import { PosShell86Availability } from './PosShell86Availability';
import { PosShellShiftClock } from './PosShellShiftClock';
import { PosShellManagerTools } from './PosShellManagerTools';
import { RetailPOS } from '../RetailPOS';
import { RetailManagement } from '../../retail/RetailManagement';
import Customers from '../../crm/Customers';
import { NonprofitPOS } from '../../nonprofit/NonprofitPOS';
import { GivingKiosk } from '../../nonprofit/GivingKiosk';
import { NonprofitCRM } from '../../nonprofit/NonprofitCRM';
import KioskApp from '../KioskApp';

export interface RouteDispatcherProps extends PosShellProps, PosShellPropsState {
  onRefreshStatus: () => void;
  onAdminExit: () => void;
  onOpenCfd: () => void;
}

export const PosShellRouteDispatcher: React.FC<RouteDispatcherProps> = (props) => {
  const { posRoute, setPosRoute, currentUser, activeUser, filteredEmployees } = props;
  const effectiveUser = activeUser || currentUser;

  const [overrideApprovedRoute, setOverrideApprovedRoute] = useState<string | null>(null);
  const [showOverrideModal, setShowOverrideModal] = useState(false);

  const requiredPerm = ROUTE_PERMISSION_MAP[posRoute];
  const hasAccess = !requiredPerm || PermissionService.can(effectiveUser, requiredPerm) || overrideApprovedRoute === posRoute;

  useEffect(() => {
    if (!hasAccess && requiredPerm) {
      AuditService.log({
        actorId: effectiveUser.id,
        actorName: effectiveUser.name,
        action: 'UNAUTHORIZED_DIRECT_ROUTE_BLOCKED',
        targetType: 'ROUTE',
        targetId: posRoute,
        details: {
          attemptedRoute: posRoute,
          requiredPermission: requiredPerm,
          employeeRolePreset: effectiveUser.role,
        },
        status: 'REJECTED',
        merchantId: effectiveUser.businessId,
      }).catch(err => console.error('[AuditService] Failed to log unauthorized route attempt:', err));
    }
  }, [posRoute, hasAccess, requiredPerm, effectiveUser]);

  if (!hasAccess && requiredPerm) {
    return (
      <div className="h-full bg-slate-950 flex items-center justify-center p-6 select-none animate-fade-in">
        <div className="max-w-md w-full bg-slate-900 border border-rose-900/60 rounded-3xl p-8 text-center shadow-2xl space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-rose-950/80 border border-rose-800 flex items-center justify-center mx-auto text-rose-400 shadow-inner">
            <ShieldAlert size={36} />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] font-black uppercase tracking-wider">
              <Lock size={12} />
              <span>Permission Guard Enforced</span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">Direct Access Restricted</h2>
          </div>

          <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80 text-left space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Target Application:</span>
              <span className="font-mono font-bold text-white uppercase">{posRoute}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Required Permission:</span>
              <code className="bg-slate-800 px-2 py-0.5 rounded text-amber-300 font-mono text-[11px]">{requiredPerm}</code>
            </div>
            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/60">
              <span className="text-slate-400">Active Operator:</span>
              <span className="font-bold text-slate-200">{effectiveUser.name} <span className="text-slate-500 font-normal">({effectiveUser.role})</span></span>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Direct navigation to this application is prohibited for this user profile. Permission must be explicitly granted in POS Settings or authorized via Manager Override PIN.
          </p>

          <div className="pt-2 space-y-2">
            <button
              onClick={() => setShowOverrideModal(true)}
              className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-600/20 active:scale-95"
            >
              <KeyRound size={16} />
              <span>Request Manager PIN Override</span>
            </button>

            <button
              onClick={() => setPosRoute('HUB')}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all border border-slate-700 active:scale-95"
            >
              <ArrowLeft size={16} />
              <span>Return to POS Hub</span>
            </button>
          </div>
        </div>

        <ManagerApprovalModal
          isOpen={showOverrideModal}
          actionTitle={`ROUTE_ACCESS_${posRoute}`}
          actionDescription={`Manager override authorization for operator ${effectiveUser.name} to access ${posRoute} (requires ${requiredPerm})`}
          currentUser={effectiveUser}
          onApprove={(mgr) => {
            setOverrideApprovedRoute(posRoute);
            setShowOverrideModal(false);
          }}
          onCancel={() => setShowOverrideModal(false)}
        />
      </div>
    );
  }

  switch (posRoute) {
    case 'REGISTER':
      return (
        <CashierPOS
          currentUser={effectiveUser}
          onLogout={() => setPosRoute('HUB')}
          onProcessSale={(cart, total, method, orderId) => props.onProcessSale?.(cart, total, method, orderId)}
          activeRegisterCart={props.registerCart}
          onUpdateRegisterCart={props.setRegisterCart}
          sharedOrders={props.orders}
          sharedTransactions={props.transactions}
          sharedCustomers={props.customers}
          sharedEmployees={filteredEmployees}
          sharedInventory={props.inventory}
          sharedCategories={props.categories}
          sharedModifierGroups={props.modifierGroups}
          sharedDiscounts={props.discounts}
          sharedTables={props.floorPlanTables}
          floorPlanTables={props.floorPlanTables}
          onUpdateFloorPlan={props.onUpdateFloorPlan || props.setFloorPlanTables}
          sharedReservations={props.reservations}
          taxConfig={props.taxConfig}
          tipConfig={props.tipConfig}
          kdsSettings={props.kdsSettings}
          onTicketStatusChange={props.onTicketStatusChange}
          printerLabels={props.printerLabels}
        />
      );
    case 'TABLES':
      return (
        <TableServiceApp
          tables={props.floorPlanTables}
          inventory={props.inventory}
          categories={props.categories}
          currentUser={effectiveUser}
          onBackToAdmin={() => setPosRoute('HUB')}
          onExit={() => setPosRoute('HUB')}
          onFireToKitchen={props.onFireToKitchen}
          taxConfig={props.taxConfig}
          tipConfig={props.tipConfig}
          onProcessSale={props.onProcessSale}
          onUpdateReservation={props.onUpdateReservation}
          reservations={props.reservations}
          activeTableOrders={props.activeTableOrders}
          onUpdateTableOrder={props.onUpdateTableOrder}
          onUpdateTableStatus={props.onUpdateTableStatus}
        />
      );
    case 'KDS':
      return (
        <KitchenDisplay
          tickets={props.activeTickets}
          liveTickets={props.activeTickets}
          onStatusChange={props.onTicketStatusChange}
          onUpdateStatus={props.onTicketStatusChange}
          printerLabels={props.printerLabels}
          kdsSettings={props.kdsSettings}
          settings={props.kdsSettings}
          onExit={() => setPosRoute('HUB')}
          currentUser={effectiveUser}
        />
      );
    case 'ORDERS':
      return <PosShellOrdersView orders={props.orders} currentUser={effectiveUser} onOpenManagerPin={props.onOpenManagerPin} />;
    case 'POS_SETTINGS':
      return (
        <PosSettingsHub
          currentUser={effectiveUser}
          employees={filteredEmployees || [effectiveUser]}
          inventory={props.inventory}
          tables={props.floorPlanTables as any}
          tipConfig={props.tipConfig}
          taxConfig={props.taxConfig}
          kdsSettings={props.kdsSettings}
          onExit={() => setPosRoute('HUB')}
          onOpenWebAdmin={props.onAdminExit}
          onSaveItem={props.onSaveItem}
          onUpdateEmployee={props.onUpdateEmployee}
        />
      );
    case 'RESERVATIONS':
      return (
        <div className="h-full bg-slate-900 overflow-y-auto">
          <ReservationsApp reservations={props.reservations} onUpdateReservation={props.onUpdateReservation} />
        </div>
      );
    case 'CASH_DRAWER':
      return (
        <PosShellCashDrawer
          drawerBalance={props.drawerBalance}
          businessDate={props.businessDate}
          currentUser={effectiveUser}
          onRefreshStatus={props.onRefreshStatus}
          onExitToHub={() => setPosRoute('HUB')}
        />
      );
    case 'END_OF_DAY':
      return (
        <div className="h-full bg-slate-900 overflow-y-auto">
          <CashierCloseout
            onCloseout={({ actual, variance }) => {
              alert(`End of day Z-Report submitted. Actual: $${actual.toFixed(2)}, Variance: $${variance.toFixed(2)}`);
              setPosRoute('HUB');
            }}
          />
        </div>
      );
    case '86_AVAILABILITY':
      return <PosShell86Availability inventory={props.inventory} categories={props.categories} onSaveItem={props.onSaveItem} />;
    case 'SHIFT_CLOCK':
      return (
        <PosShellShiftClock
          currentUser={effectiveUser}
          isClockedIn={props.isClockedIn}
          setIsClockedIn={props.setIsClockedIn}
          onBreak={props.onBreak}
          setOnBreak={props.setOnBreak}
          clockInTime={props.clockInTime}
          setClockInTime={props.setClockInTime}
          shiftHours={props.shiftHours}
          onExitToHub={() => setPosRoute('HUB')}
        />
      );
    case 'MANAGER_TOOLS': {
      const activeBiz = (props.businesses || []).find((b: any) => b.id === (effectiveUser?.businessId));
      return (
        <PosShellManagerTools
          currentMode={props.currentMode}
          currentUser={effectiveUser}
          businessName={activeBiz?.name}
          onExitToHub={() => setPosRoute('HUB')}
          onSwitchToAdmin={props.onAdminExit}
          onOpenCfd={props.onOpenCfd}
        />
      );
    }
    case 'RETAIL_REGISTER':
      return <RetailPOS currentUser={effectiveUser} onExit={() => setPosRoute('HUB')} />;
    case 'RETAIL_INVENTORY':
      return <div className="h-full bg-slate-900 overflow-y-auto"><RetailManagement /></div>;
    case 'RETAIL_RETURNS':
      return (
        <div className="h-full bg-slate-950 p-6 flex items-center justify-center">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center shadow-2xl">
            <RotateCcw size={40} className="text-amber-400 mx-auto mb-4" />
            <h3 className="text-xl font-black text-white">Retail Returns & Exchanges</h3>
            <p className="text-xs text-slate-400 mt-1 mb-6">Scan receipt barcode or enter order ID to process return</p>
            <button onClick={() => setPosRoute('HUB')} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm">Return to Hub</button>
          </div>
        </div>
      );
    case 'CUSTOMERS':
      return (
        <div className="h-full bg-slate-900 overflow-y-auto">
          <Customers customers={props.customers} onSelectCustomer={() => {}} onAddCustomer={() => {}} onUpdateCustomer={() => {}} onDeleteCustomer={() => {}} />
        </div>
      );
    case 'GIVING_REGISTER':
      return <NonprofitPOS currentUser={effectiveUser} onExit={() => setPosRoute('HUB')} />;
    case 'GIVING_KIOSK':
      return <GivingKiosk onExitKiosk={() => setPosRoute('HUB')} />;
    case 'DONOR_CRM':
      return <div className="h-full bg-slate-900 overflow-y-auto"><NonprofitCRM /></div>;
    case 'KIOSK':
      return <KioskApp onExit={() => setPosRoute('HUB')} />;
    default:
      return null;
  }
};
