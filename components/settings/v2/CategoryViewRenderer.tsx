import React from 'react';
import { getCategoryById, SettingOption } from '../categoriesIndex';
import { ProfileAndBusinessEditor } from './editors/ProfileAndBusinessEditor';
import { EmployeesAndLaborEditor } from './editors/EmployeesAndLaborEditor';
import { RegisterAndGuestEditor } from './editors/RegisterAndGuestEditor';
import { MenuAndKitchenEditor } from './editors/MenuAndKitchenEditor';
import { PaymentsAndTaxesEditor } from './editors/PaymentsAndTaxesEditor';
import { CashAndReceiptsEditor } from './editors/CashAndReceiptsEditor';
import { EcommerceAndLoyaltyEditor } from './editors/EcommerceAndLoyaltyEditor';
import { InventoryAndInvoicesEditor } from './editors/InventoryAndInvoicesEditor';
import { ReportsAndDevicesEditor } from './editors/ReportsAndDevicesEditor';
import { BankingAndIntegrationsEditor } from './editors/BankingAndIntegrationsEditor';
import { Info, Sparkles, CheckCircle, ChevronRight } from 'lucide-react';

interface CategoryViewRendererProps {
  categoryId: string;
  selectedPageId: string | null;
  setSelectedPageId: (id: string) => void;
  onFieldChange: () => void;
}

export const CategoryViewRenderer: React.FC<CategoryViewRendererProps> = ({
  categoryId,
  selectedPageId,
  setSelectedPageId,
  onFieldChange
}) => {
  const category = getCategoryById(categoryId);

  if (!category) {
    return <div className="p-8 text-center text-slate-400">Select a category from the sidebar.</div>;
  }

  const activePage: SettingOption = category.pages.find(p => p.id === selectedPageId) || category.pages[0];

  const renderEditorContent = () => {
    switch (category.id) {
      case 'profile_security':
      case 'business_locations':
        return <ProfileAndBusinessEditor categoryId={category.id} selectedPageId={activePage.id} onFieldChange={onFieldChange} />;
      case 'employees_permissions':
      case 'labor_timecards':
        return <EmployeesAndLaborEditor categoryId={category.id} selectedPageId={activePage.id} onFieldChange={onFieldChange} />;
      case 'register_order_behavior':
      case 'guest_tables_reservations':
        return <RegisterAndGuestEditor categoryId={category.id} selectedPageId={activePage.id} onFieldChange={onFieldChange} />;
      case 'menus_pricing':
      case 'kitchen_printers':
        return <MenuAndKitchenEditor categoryId={category.id} selectedPageId={activePage.id} onFieldChange={onFieldChange} />;
      case 'payments_fraud':
      case 'taxes_fees_tips':
        return <PaymentsAndTaxesEditor categoryId={category.id} selectedPageId={activePage.id} onFieldChange={onFieldChange} />;
      case 'cash_closeout':
      case 'receipts_displays':
        return <CashAndReceiptsEditor categoryId={category.id} selectedPageId={activePage.id} onFieldChange={onFieldChange} />;
      case 'online_ecommerce':
      case 'customers_loyalty':
        return <EcommerceAndLoyaltyEditor categoryId={category.id} selectedPageId={activePage.id} onFieldChange={onFieldChange} />;
      case 'inventory_purchasing':
      case 'invoices_catering':
        return <InventoryAndInvoicesEditor categoryId={category.id} selectedPageId={activePage.id} onFieldChange={onFieldChange} />;
      case 'reports_accounting':
      case 'devices_connectivity':
        return <ReportsAndDevicesEditor categoryId={category.id} selectedPageId={activePage.id} onFieldChange={onFieldChange} />;
      case 'banking_billing':
      case 'integrations_admin':
        return <BankingAndIntegrationsEditor categoryId={category.id} selectedPageId={activePage.id} onFieldChange={onFieldChange} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Category Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center shrink-0">
            {category.num}
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">{category.title}</h1>
            <p className="text-xs text-slate-500 font-medium">{category.description}</p>
          </div>
        </div>

        {/* Sub-Pages Tabs */}
        <div className="mt-5 flex flex-wrap gap-2 pt-4 border-t border-slate-100">
          {category.pages.map((p) => {
            const isActive = activePage.id === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPageId(p.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {p.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Page Details & Options Inside Banner */}
      <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100/80">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-black uppercase text-indigo-900 tracking-wider">
              Selected Page: {activePage.name}
            </h3>
            <p className="text-xs text-slate-600 font-medium mt-0.5">{activePage.description}</p>
          </div>
          <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100/80 px-2.5 py-1 rounded-md">
            {activePage.optionsInside.length} Settings Inside
          </span>
        </div>

        {/* Chips for Options Inside */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {activePage.optionsInside.map((opt, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-indigo-200/60 text-slate-700 text-[11px] font-bold rounded-lg shadow-2xs"
            >
              <CheckCircle size={12} className="text-emerald-500" />
              <span>{opt}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Category Specific Form Controls */}
      {renderEditorContent()}
    </div>
  );
};
