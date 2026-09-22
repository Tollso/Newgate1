import React, { useState } from 'react';
import { Download, Printer, Filter, RefreshCw } from 'lucide-react';
import { DateRangeSelector, FilterSelect } from './ReportFilters';
import { DetailedOrder } from '../../types';
import { downloadCSV } from '../../src/utils/csvExportUtil';
import { ReportTotalDetailModal } from './ReportTotalDetailModal';
import { useItemSalesData } from './item_sales/useItemSalesData';
import { ItemSalesSummaryCards } from './item_sales/ItemSalesSummaryCards';
import { ItemSalesCharts } from './item_sales/ItemSalesCharts';
import { ItemSalesTable } from './item_sales/ItemSalesTable';

interface ItemSalesProps {
  orders?: DetailedOrder[];
}

const ItemSales: React.FC<ItemSalesProps> = ({ orders = [] }) => {
  const [dateRange, setDateRange] = useState('Today');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [employeeFilter, setEmployeeFilter] = useState('All Employees');
  const [locationFilter, setLocationFilter] = useState('All Locations');

  const [selectedDetail, setSelectedDetail] = useState<{
    title: string;
    label: string;
    value: number;
  } | null>(null);

  const {
    filteredItems,
    groupedItems,
    totalGrossSales,
    totalCOGS,
    totalGrossProfit,
    margin,
    categoryChartData,
    topItems,
    topMarginItems,
  } = useItemSalesData({
    orders,
    dateRange,
    categoryFilter,
    employeeFilter,
    locationFilter,
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Revenue Item Sales</h1>
          <p className="text-slate-500">Detailed breakdown of sales, costs, and profit margins</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => alert('QuickBooks accounting sync initiated! Data is up to date.')}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors"
          >
            <RefreshCw size={16} /> Sync QuickBooks
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors"
          >
            <Printer size={16} /> Print
          </button>
          <button
            onClick={() => downloadCSV(filteredItems, 'Revenue_Item_Sales')}
            className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium shadow-sm transition-colors"
          >
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex items-center gap-2 text-slate-500 font-medium whitespace-nowrap">
          <Filter size={18} /> Filters:
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
          <DateRangeSelector value={dateRange} onChange={setDateRange} />
          <FilterSelect
            value={categoryFilter}
            onChange={setCategoryFilter}
            options={['All Categories', ...Object.keys(groupedItems || {})]}
          />
          <FilterSelect value={employeeFilter} onChange={setEmployeeFilter} options={['All Employees']} />
          <FilterSelect value={locationFilter} onChange={setLocationFilter} options={['All Locations']} />
        </div>
      </div>

      {/* Summary Cards */}
      <ItemSalesSummaryCards
        totalGrossSales={totalGrossSales}
        totalCOGS={totalCOGS}
        totalGrossProfit={totalGrossProfit}
        margin={margin}
        onSelectDetail={setSelectedDetail}
      />

      {/* Charts Section */}
      <ItemSalesCharts
        categoryChartData={categoryChartData}
        topItems={topItems}
        topMarginItems={topMarginItems}
      />

      {/* Data Table */}
      <ItemSalesTable
        groupedItems={groupedItems}
        onSelectDetail={setSelectedDetail}
      />

      {selectedDetail && (
        <ReportTotalDetailModal
          isOpen={!!selectedDetail}
          onClose={() => setSelectedDetail(null)}
          title={selectedDetail.title}
          metricLabel={selectedDetail.label}
          metricValue={selectedDetail.value}
          orders={orders}
        />
      )}
    </div>
  );
};

export default ItemSales;
