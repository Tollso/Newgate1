import React from 'react';
import { FileText, History, Percent, DollarSign, Clock, Bell, Utensils } from 'lucide-react';
import { GlobalTaxConfig, TipConfig } from '../../types';
import { MOCK_AUDIT_LOGS } from '../../constants';

import { RemovalReasonsSub } from './operations/RemovalReasonsSub';
import { HistorySub } from './operations/HistorySub';
import { TaxesAndTipsSub } from './operations/TaxesAndTipsSub';
import { BusinessHoursAndNotifsSub } from './operations/BusinessHoursAndNotifsSub';
import { OrderSettingsSub } from './operations/OrderSettingsSub';

interface BusinessOperationsSectionProps {
  subSection: string | null;
  setSubSection: (val: string | null) => void;
  renderSectionHeader: (title: string, description: string, parentSection?: string) => React.ReactNode;
  SettingCard: React.FC<any>;
  localRemovalReasons: string[];
  newReason: string;
  setNewReason: (val: string) => void;
  handleAddReason: () => void;
  handleDeleteReason: (reason: string) => void;
  historySearchQuery: string;
  setHistorySearchQuery: (val: string) => void;
  historyActionFilter: string;
  setHistoryActionFilter: (val: string) => void;
  historyEmployeeFilter: string;
  setHistoryEmployeeFilter: (val: string) => void;
  historyDateRange: string;
  setHistoryDateRange: (val: string) => void;
  filteredAuditLogs: typeof MOCK_AUDIT_LOGS;
  taxConfig?: GlobalTaxConfig;
  setTaxConfig?: React.Dispatch<React.SetStateAction<GlobalTaxConfig>>;
  tipConfig?: TipConfig;
  setTipConfig?: React.Dispatch<React.SetStateAction<TipConfig>>;
  businessHours: any[];
  setBusinessHours: (val: any[]) => void;
  notifications: Record<string, boolean>;
  setNotifications: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  onlineStoreSettings: any;
  setOnlineStoreSettings: (val: any) => void;
  setActiveSection: (sec: string) => void;
}

export const BusinessOperationsSection: React.FC<BusinessOperationsSectionProps> = ({
  subSection,
  setSubSection,
  renderSectionHeader,
  SettingCard,
  localRemovalReasons,
  newReason,
  setNewReason,
  handleAddReason,
  handleDeleteReason,
  historySearchQuery,
  setHistorySearchQuery,
  historyActionFilter,
  setHistoryActionFilter,
  historyEmployeeFilter,
  setHistoryEmployeeFilter,
  historyDateRange,
  setHistoryDateRange,
  filteredAuditLogs,
  taxConfig,
  setTaxConfig,
  tipConfig,
  setTipConfig,
  businessHours,
  setBusinessHours,
  notifications,
  setNotifications
}) => {
  if (subSection === 'Removal reasons') {
    return (
      <RemovalReasonsSub
        renderSectionHeader={renderSectionHeader}
        localRemovalReasons={localRemovalReasons}
        newReason={newReason}
        setNewReason={setNewReason}
        handleAddReason={handleAddReason}
        handleDeleteReason={handleDeleteReason}
      />
    );
  }

  if (subSection === 'History') {
    return (
      <HistorySub
        renderSectionHeader={renderSectionHeader}
        historySearchQuery={historySearchQuery}
        setHistorySearchQuery={setHistorySearchQuery}
        historyActionFilter={historyActionFilter}
        setHistoryActionFilter={setHistoryActionFilter}
        historyEmployeeFilter={historyEmployeeFilter}
        setHistoryEmployeeFilter={setHistoryEmployeeFilter}
        historyDateRange={historyDateRange}
        setHistoryDateRange={setHistoryDateRange}
        filteredAuditLogs={filteredAuditLogs}
      />
    );
  }

  if (subSection === 'Taxes and fees') {
    return (
      <TaxesAndTipsSub
        renderSectionHeader={renderSectionHeader}
        mode="taxes"
        taxConfig={taxConfig}
        setTaxConfig={setTaxConfig}
      />
    );
  }

  if (subSection === 'Tips') {
    return (
      <TaxesAndTipsSub
        renderSectionHeader={renderSectionHeader}
        mode="tips"
        tipConfig={tipConfig}
        setTipConfig={setTipConfig}
      />
    );
  }

  if (subSection === 'Business hours') {
    return (
      <BusinessHoursAndNotifsSub
        renderSectionHeader={renderSectionHeader}
        mode="hours"
        businessHours={businessHours}
        setBusinessHours={setBusinessHours}
        notifications={notifications}
        setNotifications={setNotifications}
      />
    );
  }

  if (subSection === 'Notification preferences') {
    return (
      <BusinessHoursAndNotifsSub
        renderSectionHeader={renderSectionHeader}
        mode="notifs"
        businessHours={businessHours}
        setBusinessHours={setBusinessHours}
        notifications={notifications}
        setNotifications={setNotifications}
      />
    );
  }

  if (subSection === 'Order settings') {
    return (
      <OrderSettingsSub
        renderSectionHeader={renderSectionHeader}
      />
    );
  }

  return (
    <div className="max-w-4xl animate-fade-in pb-20">
      {renderSectionHeader("Business Operations", "Manage taxes, tipping rules, removal reasons, and store history.")}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SettingCard icon={FileText} title="Removal reasons" description="Configure choices when cashiers remove or void items." onClick={() => setSubSection('Removal reasons')} />
        <SettingCard icon={History} title="History" description="Audit log of all transactions, item voids, and setting modifications." onClick={() => setSubSection('History')} />
        <SettingCard icon={Percent} title="Taxes and fees" description="Set tax rates and backward inclusion options." onClick={() => setSubSection('Taxes and fees')} />
        <SettingCard icon={DollarSign} title="Tips" description="Set custom tip percentages and defaults." onClick={() => setSubSection('Tips')} />
        <SettingCard icon={Clock} title="Business hours" description="Define weekly open and closing hours for your store." onClick={() => setSubSection('Business hours')} />
        <SettingCard icon={Bell} title="Notification preferences" description="Configure automated daily email reports and low stock alerts." onClick={() => setSubSection('Notification preferences')} />
        <SettingCard icon={Utensils} title="Order settings" description="Configure automated service rules, kitchen printing, and automatic firing policies for table orders." onClick={() => setSubSection('Order settings')} />
      </div>
    </div>
  );
};
