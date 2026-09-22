import React, { useState, useEffect } from 'react';
import { SalesSummary, DepositLog, TaxReport, DetailedOrder } from '../../types';
import { MOCK_HOURLY_BREAKDOWN, MOCK_SALES_SUMMARY, MOCK_DEPOSITS, MOCK_TAX_REPORTS } from '../../constants';
import { ReportsHeaderNav } from './ReportsHeaderNav';
import { SalesOverviewTab } from './SalesOverviewTab';
import { DailySalesTab } from './DailySalesTab';
import { OrderTenderDepositsTab } from './OrderTenderDepositsTab';
import ItemSales from './ItemSales';
import EmployeeSalesReport from './EmployeeSalesReport';
import DiscountsReport from './DiscountsReport';
import GiftCardReport from './GiftCardReport';
import { OpenOrdersTab } from './OpenOrdersTab';
import { TipPoolingReportTab } from './TipPoolingReportTab';
import { CustomDateModal } from './CustomDateModal';
import { downloadCSV } from '../../src/utils/csvExportUtil';
import { useSalesReportsData } from './sales/useSalesReportsData';

interface SalesReportsProps {
  salesData?: SalesSummary[];
  deposits?: DepositLog[];
  taxReports?: TaxReport[];
  orders?: DetailedOrder[];
  initialTab?: string;
  onNavigate?: (tab: string) => void;
}

const SalesReports: React.FC<SalesReportsProps> = ({
  deposits = MOCK_DEPOSITS,
  orders = [],
  initialTab,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<string>('Overview');
  const [expandedWeek, setExpandedWeek] = useState<string | null>(null);
  const [expandedMonth, setExpandedMonth] = useState<string | null>(null);
  const [expandedEmployee, setExpandedEmployee] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (initialTab) {
      if (['Overview', 'Daily Sales', 'Item Sales', 'Employee Sales', 'Sales by Employee', 'Team Performance', 'Order Types', 'Tender Types', 'Discounts', 'Discounts Report', 'Gift Cards', 'Gift Cards Report', 'Deposits', 'Tax', 'Taxes', 'Labor Cost', 'Tip Pooling'].includes(initialTab)) {
        if (initialTab === 'Sales by Employee') setActiveTab('Employee Sales');
        else if (initialTab === 'Discounts') setActiveTab('Discounts Report');
        else if (initialTab === 'Gift Cards') setActiveTab('Gift Cards Report');
        else if (initialTab === 'Taxes') setActiveTab('Tax');
        else setActiveTab(initialTab);
      }
    }
  }, [initialTab]);

  const [dateRange, setDateRange] = useState('Today');
  const [employeeFilter, setEmployeeFilter] = useState('All');
  const [orderTypeFilter, setOrderTypeFilter] = useState('All');
  const [daypartFilter, setDaypartFilter] = useState('All');
  const [deviceFilter, setDeviceFilter] = useState('All');

  const {
    filteredHourlyData,
    filteredOrderTypesData,
    filteredTenderTypesData,
    dynamicMetrics,
    currentSalesData,
  } = useSalesReportsData({
    orders,
    dateRange,
    employeeFilter,
    orderTypeFilter,
    daypartFilter,
    deviceFilter,
  });

  const handleAction = (action: string) => {
    if (action === 'Export CSV' || action.toLowerCase().includes('export')) {
      if (activeTab === 'Overview' || activeTab === 'Daily Sales') {
        downloadCSV(filteredHourlyData, `Financial_Report_${activeTab.replace(/\s+/g, '_')}`);
      } else if (activeTab === 'Order Types') {
        downloadCSV(filteredOrderTypesData, 'Sales_By_Order_Type');
      } else if (activeTab === 'Tender Types') {
        downloadCSV(filteredTenderTypesData, 'Sales_By_Tender_Type');
      } else if (activeTab === 'Deposits') {
        downloadCSV(deposits, 'Deposits_Summary');
      } else {
        downloadCSV(filteredHourlyData, `Report_${activeTab}`);
      }
    } else if (action === 'Print Report' || action.toLowerCase().includes('print')) {
      window.print();
    } else {
      alert(`${action} performed successfully!`);
    }
  };

  const calculateTotal = (key: keyof typeof MOCK_HOURLY_BREAKDOWN[0]) => {
    return filteredHourlyData.reduce((acc, curr) => acc + (typeof curr[key] === 'number' ? curr[key] as number : 0), 0);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (onNavigate) onNavigate(tab);
  };

  return (
    <div className="space-y-6">
      <ReportsHeaderNav
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        dateRange={dateRange}
        setDateRange={setDateRange}
        employeeFilter={employeeFilter}
        setEmployeeFilter={setEmployeeFilter}
        orderTypeFilter={orderTypeFilter}
        setOrderTypeFilter={setOrderTypeFilter}
        daypartFilter={daypartFilter}
        setDaypartFilter={setDaypartFilter}
        deviceFilter={deviceFilter}
        setDeviceFilter={setDeviceFilter}
        setShowDatePicker={setShowDatePicker}
        handleAction={handleAction}
      />

      <CustomDateModal
        isOpen={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onApply={(customStr) => setDateRange(customStr)}
      />

      {activeTab === 'Overview' && (
        <SalesOverviewTab
          dateRange={dateRange}
          dynamicMetrics={dynamicMetrics}
          filteredHourlyData={filteredHourlyData}
          currentSalesData={currentSalesData}
          onNavigate={handleTabChange}
          orders={orders}
        />
      )}

      {activeTab === 'Daily Sales' && (
        <DailySalesTab
          filteredHourlyData={filteredHourlyData}
          daypartFilter={daypartFilter}
          setDaypartFilter={setDaypartFilter}
          calculateTotal={calculateTotal}
          orders={orders}
        />
      )}

      {activeTab === 'Item Sales' && <ItemSales orders={orders} />}
      {(activeTab === 'Employee Sales' || activeTab === 'Sales by Employee') && <EmployeeSalesReport orders={orders} />}
      {(activeTab === 'Discounts Report' || activeTab === 'Discounts') && <DiscountsReport orders={orders} />}
      {(activeTab === 'Gift Cards Report' || activeTab === 'Gift Cards') && <GiftCardReport orders={orders} />}
      {activeTab === 'Open Orders' && <OpenOrdersTab orders={orders} />}
      {activeTab === 'Tip Pooling' && <TipPoolingReportTab onNavigateToPolicy={() => onNavigate && onNavigate('Settings')} />}

      {['Order Types', 'Tender Types', 'Deposits', 'Tax', 'Labor Cost', 'Team Performance'].includes(activeTab) && (
        <OrderTenderDepositsTab
          activeTab={activeTab}
          filteredOrderTypesData={filteredOrderTypesData}
          filteredTenderTypesData={filteredTenderTypesData}
          deposits={deposits}
          expandedWeek={expandedWeek}
          setExpandedWeek={setExpandedWeek}
          expandedMonth={expandedMonth}
          setExpandedMonth={setExpandedMonth}
          expandedEmployee={expandedEmployee}
          setExpandedEmployee={setExpandedEmployee}
          handleAction={handleAction}
          orders={orders}
        />
      )}
    </div>
  );
};

export default SalesReports;
