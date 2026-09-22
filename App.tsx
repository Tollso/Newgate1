import React from 'react';
import { UserRole } from './types';
import Login from './components/auth/Login';
import ReceiptFeedback from './components/hardware/ReceiptFeedback';

import { RoleSwitcherModal } from './components/app/RoleSwitcherModal';
import { AppSidebarNavigation } from './components/app/AppSidebarNavigation';
import { AppHeaderBar } from './components/app/AppHeaderBar';
import { AppContentArea } from './components/app/AppContentArea';
import { PosShell } from './components/pos/PosShell';
import { GivingKiosk } from './components/nonprofit/GivingKiosk';
import { useAppState } from './hooks/useAppState';

const App: React.FC = () => {
  const state = useAppState();
  const {
    currentPath, currentUser, businesses, orders, transactions, customers,
    roles, setRoles, rolePermissions, setRolePermissions, matrixState, setMatrixState, employeesState, inventory, setInventory, categories, setCategories, modifierGroups, setModifierGroups, discounts, setDiscounts, reservations,
    schedules, cashLogs, invoices, recurringPlans, feedbacks, setFeedbacks, waitlist, setWaitlist, giftCards, setGiftCards,
    printerLabels, setPrinterLabels,
    feedbackSettings, setFeedbackSettings, activeTickets, serverNotifications,
    floorPlanTables, setFloorPlanTables, activeTableOrders, registerCart, setRegisterCart,
    currentRegisterOrderId, isImpersonating, kdsSettings, setKdsSettings,
    integrationConfig, setIntegrationConfig, receiptSettings, taxConfig, setTaxConfig,
    tipConfig, setTipConfig, removalReasons, setRemovalReasons, activeTab, setActiveTab,
    requestedPosApp, setRequestedPosApp, expandedMenu, setExpandedMenu,
    isSidebarOpen, setIsSidebarOpen, isProfileMenuOpen, setIsProfileMenuOpen,
    showRoleSwitcher, setShowRoleSwitcher, handleLogin, handleLogout, handleSwitchRole,
    handleProcessSale, handleUpdateTableOrder, handleUpdateTableStatus, handleSaveItem,
    handleDeleteItem, handleAddCustomer, handleUpdateCustomer, handleDeleteCustomer,
    handleAddInvoice, handleAddRecurringPlan, handleAddCashLog, handleUpdateReservation,
    handleAddSchedule, handleSyncSchedules, handleAddEmployee, handleUpdateEmployee,
    handleDeleteEmployee, handleAddBusiness, handleSwitchMerchant, handleStopImpersonating,
    handleSaveFloorPlan, handleFireToKitchen, handleTicketStatusChange,
    handleDismissNotification, getMergedOrders,
    
  } = state;

  if (currentPath === '/feedback' || currentPath.startsWith('/feedback/')) {
    return (
      <ReceiptFeedback
        feedbackSettings={feedbackSettings}
        onSaveFeedback={(feedback) => setFeedbacks(prev => [feedback, ...prev])}
      />
    );
  }

  if (!currentUser || activeTab === 'Login') {
    return <Login onLogin={handleLogin} employees={employeesState} businesses={businesses} />;
  }

  const currentBizId = currentUser?.businessId;

  const filteredEmployees = currentUser?.role === UserRole.SUPER_ADMIN && !isImpersonating 
    ? employeesState 
    : employeesState.filter(e => e.businessId === currentBizId);

  const filteredInventory = currentUser?.role === UserRole.SUPER_ADMIN && !isImpersonating
    ? inventory
    : inventory.filter(i => i.businessId === currentBizId);

  const filteredCategories = currentUser?.role === UserRole.SUPER_ADMIN && !isImpersonating
    ? categories
    : categories.filter(c => c.businessId === currentBizId);

  const filteredFloorPlanTables = currentUser?.role === UserRole.SUPER_ADMIN && !isImpersonating
    ? floorPlanTables
    : floorPlanTables.filter(t => !t.businessId || t.businessId === currentBizId);

  // Full-Screen Touch POS Shell
  if (activeTab === 'POS Shell') {
    const currentBusiness = businesses.find(b => b.id === currentUser.businessId);
    const activeMerchantMode = currentBusiness?.merchantMode || 'RESTAURANT';

    return (
      <PosShell
        currentUser={currentUser}
        merchantMode={activeMerchantMode}
        inventory={filteredInventory}
        categories={filteredCategories}
        modifierGroups={modifierGroups}
        discounts={discounts}
        orders={orders}
        transactions={transactions}
        customers={customers}
        floorPlanTables={filteredFloorPlanTables}
        setFloorPlanTables={setFloorPlanTables}
        activeTableOrders={activeTableOrders}
        onUpdateTableOrder={handleUpdateTableOrder}
        onUpdateTableStatus={handleUpdateTableStatus}
        onProcessSale={handleProcessSale}
        onFireToKitchen={handleFireToKitchen}
        activeTickets={activeTickets}
        onTicketStatusChange={handleTicketStatusChange}
        kdsSettings={kdsSettings}
        taxConfig={taxConfig}
        tipConfig={tipConfig}
        cashLogs={cashLogs}
        onAddCashLog={handleAddCashLog}
        reservations={reservations}
        waitlist={waitlist}
        onUpdateReservation={handleUpdateReservation}
        onSaveItem={handleSaveItem}
        printerLabels={printerLabels}
        schedules={schedules}
        filteredEmployees={filteredEmployees}
        businesses={businesses}
        onUpdateEmployee={handleUpdateEmployee}
        onNavigate={setActiveTab}
        onSwitchToAdmin={() => setActiveTab('Home')}
        onLogout={handleLogout}
      />
    );
  }

  // Full-Screen Giving Kiosk
  if (activeTab === 'Giving Kiosk') {
    return (
      <GivingKiosk
        onExitKiosk={() => setActiveTab('POS Shell')}
      />
    );
  }

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-800 overflow-hidden">
      {showRoleSwitcher && (
        <RoleSwitcherModal
          onClose={() => setShowRoleSwitcher(false)}
          onSwitchRole={handleSwitchRole}
        />
      )}

      <AppSidebarNavigation
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        expandedMenu={expandedMenu}
        setExpandedMenu={setExpandedMenu}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AppHeaderBar
          currentUser={currentUser}
          isImpersonating={isImpersonating}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          isProfileMenuOpen={isProfileMenuOpen}
          setIsProfileMenuOpen={setIsProfileMenuOpen}
          setShowRoleSwitcher={setShowRoleSwitcher}
          onLogout={handleLogout}
          onStopImpersonating={handleStopImpersonating}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50 relative">
          <AppContentArea
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            getMergedOrders={getMergedOrders}
            handleProcessSale={handleProcessSale}
            currentUser={currentUser}
            orders={orders}
            transactions={transactions}
            customers={customers}
            roles={roles}
            setRoles={setRoles}
            rolePermissions={rolePermissions}
            setRolePermissions={setRolePermissions}
            matrixState={matrixState}
            setMatrixState={setMatrixState}
            filteredEmployees={filteredEmployees}
            filteredInventory={filteredInventory}
            filteredCategories={filteredCategories}
            discounts={discounts}
            reservations={reservations}
            waitlist={waitlist}
            setWaitlist={setWaitlist}
            giftCards={giftCards}
            setGiftCards={setGiftCards}
            integrationConfig={integrationConfig}
            filteredFloorPlanTables={filteredFloorPlanTables}
            setFloorPlanTables={setFloorPlanTables}
            activeTableOrders={activeTableOrders}
            handleUpdateTableOrder={handleUpdateTableOrder}
            handleUpdateTableStatus={handleUpdateTableStatus}
            registerCart={registerCart}
            setRegisterCart={setRegisterCart}
            handleAddCustomer={handleAddCustomer}
            handleUpdateCustomer={handleUpdateCustomer}
            handleDeleteCustomer={handleDeleteCustomer}
            kdsSettings={kdsSettings}
            receiptSettings={receiptSettings}
            handleFireToKitchen={handleFireToKitchen}
            taxConfig={taxConfig}
            tipConfig={tipConfig}
            removalReasons={removalReasons}
            serverNotifications={serverNotifications}
            handleDismissNotification={handleDismissNotification}
            activeTickets={activeTickets}
            handleTicketStatusChange={handleTicketStatusChange}
            handleAddCashLog={handleAddCashLog}
            handleUpdateReservation={handleUpdateReservation}
            handleSaveItem={handleSaveItem}
            currentRegisterOrderId={currentRegisterOrderId}
            requestedPosApp={requestedPosApp}
            setRequestedPosApp={setRequestedPosApp}
            invoices={invoices}
            handleAddInvoice={handleAddInvoice}
            recurringPlans={recurringPlans}
            handleAddRecurringPlan={handleAddRecurringPlan}
            cashLogs={cashLogs}
            inventory={inventory}
            setInventory={setInventory}
            categories={categories}
            setCategories={setCategories}
            modifierGroups={modifierGroups}
            setModifierGroups={setModifierGroups}
            handleDeleteItem={handleDeleteItem}
            setDiscounts={setDiscounts}
            handleAddEmployee={handleAddEmployee}
            handleUpdateEmployee={handleUpdateEmployee}
            handleDeleteEmployee={handleDeleteEmployee}
            schedules={schedules}
            handleAddSchedule={handleAddSchedule}
            handleSyncSchedules={handleSyncSchedules}
            
            printerLabels={printerLabels}
            setPrinterLabels={setPrinterLabels}
            feedbacks={feedbacks}
            feedbackSettings={feedbackSettings}
            setFeedbackSettings={setFeedbackSettings}
            setFeedbacks={setFeedbacks}
            handleSaveFloorPlan={handleSaveFloorPlan}
            setKdsSettings={setKdsSettings}
            setIntegrationConfig={setIntegrationConfig}
            setTaxConfig={setTaxConfig}
            setTipConfig={setTipConfig}
            setRemovalReasons={setRemovalReasons}
            
            
            businesses={businesses}
            handleAddBusiness={handleAddBusiness}
            handleSwitchMerchant={handleSwitchMerchant}
          />
        </main>
      </div>
    </div>
  );
};

export default App;
