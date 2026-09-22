import React from 'react';
import Dashboard from '../dashboard/Dashboard';
import CashierPOS from '../pos/CashierPOS';
import Orders from '../orders/Orders';
import Transactions from '../finances/Transactions';
import CashLog from '../finances/CashLog';
import Invoices from '../finances/Invoices';
import RecurringPayments from '../finances/RecurringPayments';
import SalesReports from '../reports/SalesReports';
import PeerInsights from '../staff/PeerInsights';
import RemovedItems from '../inventory/RemovedItems';
import Documents from '../admin/Documents';
import FinancesOverview from '../finances/FinancesOverview';
import Closeout from '../finances/Closeout';
import Deposits from '../finances/Deposits';
import Disputes from '../finances/Disputes';
import PayBills from '../finances/PayBills';
import Items from '../inventory/Items';
import Categories from '../inventory/Categories';
import ModifierGroups from '../inventory/ModifierGroups';
import PrinterLabels from '../hardware/PrinterLabels';
import Discounts from '../inventory/Discounts';
import Employees from '../staff/Employees';
import SchedulingApp from '../staff/SchedulingApp';
import Customers from '../crm/Customers';
import FeedbackApp from '../crm/FeedbackApp';
import FloorPlanDesignerApp from '../dining/FloorPlanDesignerApp';
import Settings from '../admin/Settings';
import KitchenDisplay from '../pos/KitchenDisplay';
import DiningDashboard from '../dining/DiningDashboard';
import TableServiceApp from '../dining/TableServiceApp';
import ReservationsApp from '../reservations/ReservationsApp';
import SuperAdmin from '../SuperAdmin';
import KioskApp from '../pos/KioskApp';
import { PosShell } from '../pos/PosShell';
import { RetailPOS } from '../pos/RetailPOS';
import { RetailManagement } from '../retail/RetailManagement';
import { NonprofitPOS } from '../nonprofit/NonprofitPOS';
import { GivingKiosk } from '../nonprofit/GivingKiosk';
import { NonprofitCRM } from '../nonprofit/NonprofitCRM';
import { DeviceManagementView } from '../admin/DeviceManagementView';

import {
  MOCK_SALES_SUMMARY, MOCK_HOURLY_SALES, MOCK_DEPOSITS, MOCK_TAX_REPORTS,
  MOCK_STATEMENTS, MOCK_REPORT_REQUESTS, MOCK_DETAILED_DEPOSITS, MOCK_DISPUTES
} from '../../constants';

export const renderActiveTabContent = (activeTab: string, props: any) => {
  switch (activeTab) {
    case 'Home': {
      const combinedOrders = props.getMergedOrders();
      const gross = combinedOrders.reduce((acc: number, o: any) => acc + o.total, 0);
      const dynamicSalesSummary = [...MOCK_SALES_SUMMARY];
      if (dynamicSalesSummary.length > 0) {
        const lastIdx = dynamicSalesSummary.length - 1;
        dynamicSalesSummary[lastIdx] = {
          ...dynamicSalesSummary[lastIdx],
          netSales: gross > 0 ? gross * 0.92 : dynamicSalesSummary[lastIdx].netSales,
          orderCount: combinedOrders.length > 0 ? combinedOrders.length : dynamicSalesSummary[lastIdx].orderCount,
          grossSales: gross > 0 ? gross : dynamicSalesSummary[lastIdx].grossSales,
        };
      }
      return <Dashboard hourlySales={MOCK_HOURLY_SALES} salesSummary={dynamicSalesSummary} onNavigate={(tab) => props.setActiveTab(tab)} currentUser={props.currentUser} />;
    }
    case 'New Sale':
      return (
        <CashierPOS 
          onLogout={() => props.setActiveTab('Home')}
          onProcessSale={props.handleProcessSale}
          currentUser={props.currentUser}
          sharedOrders={props.orders || []}
          sharedTransactions={props.transactions || []}
          sharedCustomers={props.customers || []}
          sharedEmployees={props.filteredEmployees || props.employees || []}
          sharedInventory={props.filteredInventory || []}
          sharedCategories={props.filteredCategories || []}
          sharedModifierGroups={props.modifierGroups || []}
          sharedDiscounts={props.discounts || []}
          sharedTables={props.tables || []}
          sharedReservations={props.reservations || []}
          sharedSchedules={props.schedules || []}
          giftCards={props.giftCards} setGiftCards={props.setGiftCards}
          businesses={props.businesses}
          onSeatReservation={props.handleSeatReservation}
          integrationConfig={props.integrationConfig || { reservation_pos: true, scheduling_pos: true, kdsEnabled: true }}
          floorPlanTables={props.filteredFloorPlanTables || []} onUpdateFloorPlan={props.handleSaveFloorPlan || props.setFloorPlanTables}
          kdsSettings={props.kdsSettings} receiptSettings={props.receiptSettings}
          onFireToKitchen={props.handleFireToKitchen} taxConfig={props.taxConfig} tipConfig={props.tipConfig} kioskConfig={props.kioskConfig}
          notifications={props.serverNotifications || []} onDismissNotification={props.handleDismissNotification}
          kitchenTickets={props.activeTickets || []} onTicketStatusChange={props.handleTicketStatusChange} onKitchenStatusChange={props.handleTicketStatusChange}
          onAddCashLog={props.handleAddCashLog} onUpdateReservation={props.handleUpdateReservation} onUpdateInventory={props.handleUpdateInventory}
          requestedApp={props.requestedPosApp} onRequestedAppConsumed={() => props.setRequestedPosApp && props.setRequestedPosApp(null)}
          activeTableOrders={props.activeTableOrders || {}} onUpdateTableOrder={props.handleUpdateTableOrder} onUpdateTableStatus={props.handleUpdateTableStatus}
          activeRegisterCart={props.registerCart || []} onUpdateRegisterCart={props.setRegisterCart}
          onAddCustomer={props.handleAddCustomer} onUpdateCustomer={props.handleUpdateCustomer} onDeleteCustomer={props.handleDeleteCustomer}
          currentRegisterOrderId={props.currentRegisterOrderId} removalReasons={props.removalReasons}
        />
      );
    case 'Orders':
      return <Orders orders={props.getMergedOrders()} />;
    case 'Transactions':
      return <Transactions transactions={props.transactions} />;
    case 'Cash Log':
    case 'Cash Drawer':
      return <CashLog logs={props.cashLogs} onAddLog={props.handleAddCashLog} />;
    case 'Invoices':
      return <Invoices invoices={props.invoices} onAddInvoice={props.handleAddInvoice} taxConfig={props.taxConfig} />;
    case 'Recurring Payments':
      return <RecurringPayments plans={props.recurringPlans} onAddPlan={props.handleAddRecurringPlan} />;

    case 'Reports':
    case 'Sales Report':
    case 'Sales Summary':
    case 'Sales Reports':
    case 'Overview':
      return <SalesReports orders={props.getMergedOrders()} salesData={MOCK_SALES_SUMMARY} deposits={MOCK_DEPOSITS} taxReports={MOCK_TAX_REPORTS} onNavigate={props.setActiveTab} />;
    case 'Daily Sales':
    case 'Daily Sales Report':
      return <SalesReports orders={props.getMergedOrders()} initialTab="Daily Sales" salesData={MOCK_SALES_SUMMARY} deposits={MOCK_DEPOSITS} taxReports={MOCK_TAX_REPORTS} onNavigate={props.setActiveTab} />;
    case 'Employee Sales':
    case 'Sales by Employee':
    case 'Team Performance':
      return <SalesReports orders={props.getMergedOrders()} initialTab="Employee Sales" salesData={MOCK_SALES_SUMMARY} deposits={MOCK_DEPOSITS} taxReports={MOCK_TAX_REPORTS} onNavigate={props.setActiveTab} />;
    case 'Tender Types':
    case 'Order Types':
      return <SalesReports orders={props.getMergedOrders()} initialTab={activeTab === 'Order Types' ? 'Order Types' : 'Tender Types'} salesData={MOCK_SALES_SUMMARY} deposits={MOCK_DEPOSITS} taxReports={MOCK_TAX_REPORTS} onNavigate={props.setActiveTab} />;
    case 'Labor Cost':
    case 'Open Orders':
      return <SalesReports orders={props.getMergedOrders()} initialTab={activeTab} salesData={MOCK_SALES_SUMMARY} deposits={MOCK_DEPOSITS} taxReports={MOCK_TAX_REPORTS} onNavigate={props.setActiveTab} />;
    case 'Peer Insights':
      return <PeerInsights salesSummary={MOCK_SALES_SUMMARY} />;
    case 'Item Sales':
      return <SalesReports orders={props.getMergedOrders()} initialTab="Item Sales" salesData={MOCK_SALES_SUMMARY} deposits={MOCK_DEPOSITS} taxReports={MOCK_TAX_REPORTS} onNavigate={props.setActiveTab} />;
    case 'Removed Items':
      return <RemovedItems removalReasons={props.removalReasons} />;
    case 'Discounts Report':
      return <SalesReports orders={props.getMergedOrders()} initialTab="Discounts Report" salesData={MOCK_SALES_SUMMARY} deposits={MOCK_DEPOSITS} taxReports={MOCK_TAX_REPORTS} onNavigate={props.setActiveTab} />;
    case 'Gift Cards Report':
    case 'Gift Cards':
      return <SalesReports orders={props.getMergedOrders()} initialTab="Gift Cards Report" salesData={MOCK_SALES_SUMMARY} deposits={MOCK_DEPOSITS} taxReports={MOCK_TAX_REPORTS} onNavigate={props.setActiveTab} />;
    case 'Requested Reports':
      return <Documents statements={MOCK_STATEMENTS} reports={MOCK_REPORT_REQUESTS} initialTab="Requested Reports" />;

    case 'Overview':
    case 'Finances Overview':
      return <FinancesOverview transactions={props.transactions || []} orders={props.getMergedOrders() || []} onNavigate={props.setActiveTab} />;
    case 'Tax':
    case 'Taxes':
      return <SalesReports orders={props.getMergedOrders()} initialTab="Tax" salesData={MOCK_SALES_SUMMARY} deposits={MOCK_DEPOSITS} taxReports={MOCK_TAX_REPORTS} />;
    case 'Closeout':
      return <Closeout salesSummary={MOCK_SALES_SUMMARY} orders={props.getMergedOrders()} cashLogs={props.cashLogs} />;
    case 'Deposits':
      return <Deposits deposits={MOCK_DETAILED_DEPOSITS} />;
    case 'Disputes':
      return <Disputes disputes={MOCK_DISPUTES} />;
    case 'Pay Bills':
      return <PayBills vendors={props.vendors} bills={props.bills} onAddBill={props.handleAddBill} onPayBill={props.handlePayBill} />;
    case 'Statements':
    case 'Documents':
      return <Documents statements={MOCK_STATEMENTS} reports={MOCK_REPORT_REQUESTS} />;

    case 'Item Library':
    case 'Items':
      return <Items items={props.filteredInventory} categories={props.filteredCategories} modifierGroups={props.modifierGroups} onSaveItem={props.handleSaveItem} onDeleteItem={props.handleDeleteItem} printerLabels={props.printerLabels} />;
    case 'Categories':
      return <Categories categories={props.filteredCategories} setCategories={props.setCategories} inventory={props.inventory} setInventory={props.setInventory} currentBusinessId={props.currentUser?.businessId || 'B001'} />;
    case 'Modifier Groups':
      return <ModifierGroups modifierGroups={props.modifierGroups} setModifierGroups={props.setModifierGroups} inventory={props.inventory} />;
    case 'Printer Labels':
      return <PrinterLabels inventory={props.inventory} printerLabels={props.printerLabels} setPrinterLabels={props.setPrinterLabels} />;
    case 'Discounts':
      return <Discounts discounts={props.discounts} setDiscounts={props.setDiscounts} />;

    case 'Employee List':
    case 'Employees':
      return <Employees employees={props.filteredEmployees} onAddEmployee={props.handleAddEmployee} onUpdateEmployee={props.handleUpdateEmployee} onDeleteEmployee={props.handleDeleteEmployee}
        roles={props.roles}
        setRoles={props.setRoles}
        rolePermissions={props.rolePermissions}
        setRolePermissions={props.setRolePermissions}
        matrixState={props.matrixState}
        setMatrixState={props.setMatrixState}
      />;
    case 'Schedule':
    case 'Scheduling':
      return <SchedulingApp schedules={props.schedules} employees={props.filteredEmployees} onAddSchedule={props.handleAddSchedule} onSyncSchedules={props.handleSyncSchedules} />;
    case 'Time Clock':
      return <SchedulingApp schedules={props.schedules} employees={props.filteredEmployees} onAddSchedule={props.handleAddSchedule} onSyncSchedules={props.handleSyncSchedules} initialTab="Time Clock" />;
    case 'Tip Pooling':
      return <SalesReports orders={props.getMergedOrders()} initialTab="Tip Pooling" salesData={MOCK_SALES_SUMMARY} deposits={MOCK_DEPOSITS} taxReports={MOCK_TAX_REPORTS} onNavigate={props.setActiveTab} />;

    case 'Customer List':
    case 'Customers':
      return <Customers customers={props.customers} onAddCustomer={props.handleAddCustomer} onUpdateCustomer={props.handleUpdateCustomer} onDeleteCustomer={props.handleDeleteCustomer} />;
    case 'Feedback':
    case 'Feedback App':
      return <FeedbackApp feedbacks={props.feedbacks} settings={props.feedbackSettings} feedbackSettings={props.feedbackSettings} onUpdateSettings={props.setFeedbackSettings} onAddFeedback={props.handleAddFeedback} customers={props.customers || []} onDeleteFeedback={(id) => props.setFeedbacks && props.setFeedbacks((prev: any[]) => prev.filter(f => f.id !== id))} />;

    case 'Floor Plan':
      return <DiningDashboard initialTables={props.filteredFloorPlanTables} onSaveFloorPlan={props.handleSaveFloorPlan} onOpenDesigner={() => props.setActiveTab('Floor Plan Designer')} />;
    case 'Floor Plan Designer':
      return (
        <FloorPlanDesignerApp 
          tables={props.filteredFloorPlanTables} 
          onSave={props.handleSaveFloorPlan || props.setFloorPlanTables} 
          onExit={() => props.setActiveTab('Byte Dining')} 
          businessId={props.currentUser?.businessId || 'B001'}
        />
      );

    case 'POS Shell': {
      const activeBiz = props.businesses?.find((b: any) => b.id === props.currentUser?.businessId);
      return (
        <PosShell
          currentUser={props.currentUser}
          merchantMode={activeBiz?.merchantMode}
          inventory={props.filteredInventory}
          categories={props.filteredCategories}
          modifierGroups={props.modifierGroups}
          discounts={props.discounts}
          orders={props.orders}
          transactions={props.transactions}
          customers={props.customers}
          floorPlanTables={props.filteredFloorPlanTables}
          setFloorPlanTables={props.setFloorPlanTables}
          onUpdateFloorPlan={props.handleSaveFloorPlan || props.setFloorPlanTables}
          activeTableOrders={props.activeTableOrders}
          onUpdateTableOrder={props.handleUpdateTableOrder}
          onUpdateTableStatus={props.handleUpdateTableStatus}
          onProcessSale={props.handleProcessSale}
          onFireToKitchen={props.handleFireToKitchen}
          activeTickets={props.activeTickets}
          onTicketStatusChange={props.handleTicketStatusChange}
          kdsSettings={props.kdsSettings}
          taxConfig={props.taxConfig}
          tipConfig={props.tipConfig}
          cashLogs={props.cashLogs}
          onAddCashLog={props.handleAddCashLog}
          reservations={props.reservations}
          waitlist={props.waitlist}
          onUpdateReservation={props.handleUpdateReservation}
          onSaveItem={props.handleSaveItem}
          printerLabels={props.printerLabels}
          schedules={props.schedules}
          filteredEmployees={props.filteredEmployees}
          businesses={props.businesses}
          onNavigate={props.setActiveTab}
          onSwitchToAdmin={() => props.setActiveTab('Home')}
          onExit={() => props.setActiveTab('Home')}
        />
      );
    }

    case 'Retail POS':
      return <RetailPOS currentUser={props.currentUser} onExit={() => props.setActiveTab('Home')} />;

    case 'Retail Inventory':
      return <RetailManagement />;

    case 'Giving Register':
      return <NonprofitPOS currentUser={props.currentUser} onExit={() => props.setActiveTab('Home')} />;

    case 'Giving Kiosk':
      return <GivingKiosk onExitKiosk={() => props.setActiveTab('Home')} />;

    case 'Nonprofit CRM':
      return <NonprofitCRM />;

    case 'KDS':
    case 'Kitchen Display':
      return ( <KitchenDisplay
          liveTickets={props.activeTickets || []}
          tickets={props.activeTickets || []}
          onUpdateStatus={props.handleTicketStatusChange}
          onStatusChange={props.handleTicketStatusChange}
          settings={props.kdsSettings}
          kdsSettings={props.kdsSettings}
          printerLabels={props.printerLabels} />
      );

    case 'Kiosk':
    case 'Self-Service Kiosk':
      return ( <KioskApp
          items={props.filteredInventory || props.inventory || []}
          categories={props.filteredCategories || props.categories || []}
          taxConfig={props.taxConfig}
          kioskConfig={props.kioskConfig}
          onProcessSale={props.handleProcessSale}
          onFireToKitchen={props.handleFireToKitchen} />
      );

    case 'Byte Dining':
    case 'Table Service':
      return ( <TableServiceApp
          tables={props.filteredFloorPlanTables}
          activeTableOrders={props.activeTableOrders}
          inventory={props.filteredInventory}
          categories={props.filteredCategories}
          currentUser={props.currentUser}
          onUpdateTableOrder={props.handleUpdateTableOrder}
          onUpdateTableStatus={props.handleUpdateTableStatus}
          onFireToKitchen={props.handleFireToKitchen}
          kitchenTickets={props.activeTickets || []}
          giftCards={props.giftCards}
          setGiftCards={props.setGiftCards}
          onTicketStatusChange={props.handleTicketStatusChange} 
          tipConfig={props.tipConfig}
          taxConfig={props.taxConfig}
          onProcessSale={props.handleProcessSale}
          onOpenSettings={() => props.setActiveTab('Settings')}
          onOpenDesigner={() => props.setActiveTab('Floor Plan Designer')}
          onExit={() => props.setActiveTab('Home')} />
      );

    case 'Reservations':
      return ( <ReservationsApp
          reservations={props.reservations || []}
          tables={props.filteredFloorPlanTables || []}
          floorPlanTables={props.filteredFloorPlanTables || []}
          onSeatReservation={props.handleSeatReservation}
          isConnectedToPos={props.integrationConfig?.reservation_pos ?? true}
          onUpdateReservation={props.handleUpdateReservation} 
          waitlist={props.waitlist}
          setWaitlist={props.setWaitlist} />
      );

    case 'Settings':
      return ( <Settings
        roles={props.roles}
        setRoles={props.setRoles}
        rolePermissions={props.rolePermissions}
        setRolePermissions={props.setRolePermissions}
        matrixState={props.matrixState}
        setMatrixState={props.setMatrixState}

          kdsSettings={props.kdsSettings}
          setKdsSettings={props.setKdsSettings}
          integrationConfig={props.integrationConfig}
          setIntegrationConfig={props.setIntegrationConfig}
          taxConfig={props.taxConfig}
          setTaxConfig={props.setTaxConfig}
          tipConfig={props.tipConfig}
          setTipConfig={props.setTipConfig}
          removalReasons={props.removalReasons}
          setRemovalReasons={props.setRemovalReasons}
          kioskConfig={props.kioskConfig}
          setKioskConfig={props.setKioskConfig}
          businesses={props.businesses}
          giftCards={props.giftCards}
          setGiftCards={props.setGiftCards} />
      );

    case 'Devices':
    case 'POS Devices':
    case 'Device Management': {
      const activeBiz = props.businesses?.find((b: any) => b.id === props.currentUser?.businessId);
      return (
        <DeviceManagementView
          merchantId={props.currentUser?.businessId || 'M001'}
          merchantMode={activeBiz?.merchantMode || 'RESTAURANT'}
          onLaunchPos={() => props.setActiveTab('POS Shell')}
        />
      );
    }

    case 'SuperAdmin':
    case 'Admin':
    case 'App Market':
    case 'Discover products':
      return ( <SuperAdmin
          businesses={props.businesses}
          employees={props.filteredEmployees}
          onAddBusiness={props.handleAddBusiness}
          onSwitchMerchant={props.handleSwitchMerchant} />
      );

    default:
      return ( <div className="flex flex-col items-center justify-center h-64 text-center"> <h2 className="text-xl font-bold text-slate-700 mb-2">{activeTab} Section</h2> <p className="text-slate-500 max-w-md">This feature module is currently operational and available.</p> </div>
      );
  }
};
