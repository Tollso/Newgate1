import React, { useState } from 'react';
import { MOCK_TAX_DETAILS } from '../../constants';
import { ShieldCheck, FileText } from 'lucide-react';
import { LaborCostTab } from './LaborCostTab';
import { TeamPerformanceTab } from './TeamPerformanceTab';
import { ReportTotalDetailModal } from './ReportTotalDetailModal';

interface OrderTenderDepositsTabProps {
  activeTab: string;
  filteredOrderTypesData: any[];
  filteredTenderTypesData: any[];
  deposits: any[];
  expandedWeek: string | null;
  setExpandedWeek: (val: string | null) => void;
  expandedMonth: string | null;
  setExpandedMonth: (val: string | null) => void;
  expandedEmployee: string | null;
  setExpandedEmployee: (val: string | null) => void;
  handleAction: (action: string) => void;
  orders?: any[];
}

export const OrderTenderDepositsTab: React.FC<OrderTenderDepositsTabProps> = ({
  activeTab,
  filteredOrderTypesData,
  filteredTenderTypesData,
  deposits,
  expandedWeek,
  setExpandedWeek,
  expandedMonth,
  setExpandedMonth,
  expandedEmployee,
  setExpandedEmployee,
  handleAction,
  orders = []
}) => {
  const [selectedDetail, setSelectedDetail] = useState<{
    title: string;
    label: string;
    value: number;
  } | null>(null);

  const paidOrders = React.useMemo(() => {
    return orders ? orders.filter(o => o.status !== 'Open' && o.status !== 'Void') : [];
  }, [orders]);

  const taxApplicableSales = React.useMemo(() => {
    return paidOrders.reduce((sum, o) => sum + ((o.total || 0) - (o.discount || 0)), 0);
  }, [paidOrders]);

  const taxTaxesCollected = React.useMemo(() => {
    return paidOrders.reduce((sum, o) => {
      const net = (o.total || 0) - (o.discount || 0);
      return sum + (o.fees || (net * 0.0825));
    }, 0);
  }, [paidOrders]);

  const taxTaxesRefunded = 0;
  const taxNetTaxes = taxTaxesCollected - taxTaxesRefunded;

  const dynamicTaxes = React.useMemo(() => {
    const totalCollected = taxTaxesCollected;
    const stateCollected = totalCollected * (6.25 / 8.25);
    const cityCollected = totalCollected * (1.0 / 8.25);
    const countyCollected = totalCollected * (1.0 / 8.25);

    return [
      { id: 'T1', name: 'State Sales Tax', taxRate: 6.25, applicableSales: taxApplicableSales, taxesCollected: stateCollected, taxesRefunded: 0, netTaxes: stateCollected },
      { id: 'T2', name: 'City Sales Tax', taxRate: 1.0, applicableSales: taxApplicableSales, taxesCollected: cityCollected, taxesRefunded: 0, netTaxes: cityCollected },
      { id: 'T3', name: 'County Sales Tax', taxRate: 1.0, applicableSales: taxApplicableSales, taxesCollected: countyCollected, taxesRefunded: 0, netTaxes: countyCollected }
    ];
  }, [taxTaxesCollected, taxApplicableSales]);
  if (activeTab === 'Order Types') {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div onClick={() => setSelectedDetail({ title: 'In-Store Net Sales Details', label: 'In-Store Sales', value: filteredOrderTypesData.filter(t => t.type !== 'Online').reduce((acc, curr) => acc + curr.netSales, 0) })} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:border-indigo-400 hover:shadow-md transition-all group">
            <p className="text-xs text-slate-500 uppercase font-bold mb-1 group-hover:text-indigo-600 transition-colors">In-Store Net Sales</p>
            <h3 className="text-xl font-bold text-slate-900">
              ${filteredOrderTypesData.filter(t => t.type !== 'Online').reduce((acc, curr) => acc + curr.netSales, 0).toLocaleString(undefined, {minimumFractionDigits: 2})}
            </h3>
            <p className="text-[10px] text-indigo-500 font-medium mt-1">Audit →</p>
          </div>
          <div onClick={() => setSelectedDetail({ title: 'Total Gross Sales Audit', label: 'Gross Sales', value: filteredOrderTypesData.reduce((acc, curr) => acc + curr.grossSales, 0) })} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:border-indigo-400 hover:shadow-md transition-all group">
            <p className="text-xs text-slate-500 uppercase font-bold mb-1 group-hover:text-indigo-600 transition-colors">Total Gross Sales</p>
            <h3 className="text-xl font-bold text-slate-900">${filteredOrderTypesData.reduce((acc, curr) => acc + curr.grossSales, 0).toLocaleString(undefined, {minimumFractionDigits: 2})}</h3>
            <p className="text-[10px] text-indigo-500 font-medium mt-1">Audit →</p>
          </div>
          <div onClick={() => setSelectedDetail({ title: 'Total Net Sales Audit', label: 'Net Sales', value: filteredOrderTypesData.reduce((acc, curr) => acc + curr.netSales, 0) })} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:border-indigo-400 hover:shadow-md transition-all group">
            <p className="text-xs text-slate-500 uppercase font-bold mb-1 group-hover:text-indigo-600 transition-colors">Total Net Sales</p>
            <h3 className="text-xl font-bold text-indigo-600">${filteredOrderTypesData.reduce((acc, curr) => acc + curr.netSales, 0).toLocaleString(undefined, {minimumFractionDigits: 2})}</h3>
            <p className="text-[10px] text-indigo-500 font-medium mt-1">Audit →</p>
          </div>
          <div onClick={() => setSelectedDetail({ title: 'Total Orders Count Audit', label: 'Orders Count', value: filteredOrderTypesData.reduce((acc, curr) => acc + curr.ordersCount, 0) })} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:border-indigo-400 hover:shadow-md transition-all group">
            <p className="text-xs text-slate-500 uppercase font-bold mb-1 group-hover:text-indigo-600 transition-colors">Orders Count</p>
            <h3 className="text-xl font-bold text-slate-700">{filteredOrderTypesData.reduce((acc, curr) => acc + curr.ordersCount, 0)}</h3>
            <p className="text-[10px] text-indigo-500 font-medium mt-1">Audit →</p>
          </div>
          <div onClick={() => setSelectedDetail({ title: 'Average Ticket Size Audit', label: 'Avg Ticket', value: (filteredOrderTypesData.reduce((acc, curr) => acc + curr.grossSales, 0) / (filteredOrderTypesData.reduce((acc, curr) => acc + curr.ordersCount, 0) || 1)) })} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:border-indigo-400 hover:shadow-md transition-all group">
            <p className="text-xs text-slate-500 uppercase font-bold mb-1 group-hover:text-indigo-600 transition-colors">Avg Ticket Size</p>
            <h3 className="text-xl font-bold text-emerald-600">${(filteredOrderTypesData.reduce((acc, curr) => acc + curr.grossSales, 0) / (filteredOrderTypesData.reduce((acc, curr) => acc + curr.ordersCount, 0) || 1)).toFixed(2)}</h3>
            <p className="text-[10px] text-emerald-500 font-medium mt-1">Audit →</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
            <h3 className="font-bold text-slate-800">Sales by Order Type</h3>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
              <tr>
                <th className="px-6 py-3 font-semibold">Order Type</th>
                <th className="px-6 py-3 font-semibold text-right">Orders Count</th>
                <th className="px-6 py-3 font-semibold text-right">Gross Sales</th>
                <th className="px-6 py-3 font-semibold text-right">Net Sales</th>
                <th className="px-6 py-3 font-semibold text-right">Avg Ticket Size</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrderTypesData.map((ot) => (
                <tr key={ot.type} onClick={() => setSelectedDetail({ title: `${ot.type} Order Type Audit`, label: 'Net Sales', value: ot.netSales })} className="hover:bg-indigo-50/50 cursor-pointer transition-colors group">
                  <td className="px-6 py-3 font-medium text-slate-900 group-hover:text-indigo-600 transition-colors">{ot.type}</td>
                  <td className="px-6 py-3 text-right text-slate-600">{ot.ordersCount}</td>
                  <td className="px-6 py-3 text-right font-mono text-slate-900 font-medium">${ot.grossSales.toFixed(2)}</td>
                  <td className="px-6 py-3 text-right font-mono text-indigo-600 font-bold">${ot.netSales.toFixed(2)}</td>
                  <td className="px-6 py-3 text-right font-mono text-slate-600">${ot.avgTicketSize.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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
  }

  if (activeTab === 'Tender Types') {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div onClick={() => setSelectedDetail({ title: 'Total Collected Tender Audit', label: 'Collected', value: filteredTenderTypesData.reduce((a, b) => a + b.totalAmount, 0) })} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:border-indigo-400 hover:shadow-md transition-all group">
            <p className="text-xs text-slate-500 uppercase font-bold mb-1 group-hover:text-indigo-600 transition-colors">Total Collected</p>
            <h3 className="text-2xl font-bold text-slate-900">${filteredTenderTypesData.reduce((a, b) => a + b.totalAmount, 0).toLocaleString()}</h3>
            <p className="text-[10px] text-indigo-500 font-medium mt-1">Audit Details →</p>
          </div>
          <div onClick={() => setSelectedDetail({ title: 'Cards Tender Audit', label: 'Card Total', value: filteredTenderTypesData.filter(g => g.group === 'Credit' || g.group === 'Debit').reduce((a, b) => a + b.totalAmount, 0) })} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:border-indigo-400 hover:shadow-md transition-all group">
            <p className="text-xs text-slate-500 uppercase font-bold mb-1 group-hover:text-indigo-600 transition-colors">Cards (Credit + Debit)</p>
            <h3 className="text-2xl font-bold text-indigo-600">
              ${filteredTenderTypesData.filter(g => g.group === 'Credit' || g.group === 'Debit').reduce((a, b) => a + b.totalAmount, 0).toLocaleString()}
            </h3>
            <p className="text-[10px] text-indigo-500 font-medium mt-1">Audit Details →</p>
          </div>
          <div onClick={() => setSelectedDetail({ title: 'Cash Tender Audit', label: 'Cash Total', value: filteredTenderTypesData.find(g => g.group === 'Cash')?.totalAmount || 0 })} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:border-emerald-400 hover:shadow-md transition-all group">
            <p className="text-xs text-slate-500 uppercase font-bold mb-1 group-hover:text-emerald-600 transition-colors">Cash</p>
            <h3 className="text-2xl font-bold text-emerald-600">
              ${(filteredTenderTypesData.find(g => g.group === 'Cash')?.totalAmount || 0).toLocaleString()}
            </h3>
            <p className="text-[10px] text-emerald-500 font-medium mt-1">Audit Details →</p>
          </div>
        </div>

        <div className="space-y-6">
          {filteredTenderTypesData.map((group) => (
            <div key={group.group} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div onClick={() => setSelectedDetail({ title: `${group.group} Tender Breakdown Audit`, label: group.group, value: group.totalAmount })} className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center cursor-pointer hover:bg-indigo-50/50 transition-colors">
                <h4 className="font-bold text-slate-800">{group.group} Breakdown</h4>
                <span className="text-xs font-mono font-bold text-indigo-600">${group.totalAmount.toLocaleString()}</span>
              </div>
              <table className="w-full text-left text-sm">
                <tbody className="divide-y divide-slate-100">
                  {group.networks ? group.networks.map((net: any) => (
                    <tr key={net.network} onClick={() => setSelectedDetail({ title: `${net.network} Network Audit`, label: net.network, value: net.amount })} className="hover:bg-slate-50 cursor-pointer">
                      <td className="px-6 py-3 text-slate-700 font-medium">{net.network}</td>
                      <td className="px-6 py-3 text-right text-slate-500">{net.count}</td>
                      <td className="px-6 py-3 text-right font-mono font-medium text-slate-900">${net.amount.toLocaleString()}</td>
                    </tr>
                  )) : (
                    <tr onClick={() => setSelectedDetail({ title: `Total ${group.group} Audit`, label: group.group, value: group.totalAmount })} className="hover:bg-slate-50 cursor-pointer">
                      <td className="px-6 py-3 text-slate-700 font-medium">Total {group.group}</td>
                      <td className="px-6 py-3 text-right text-slate-500">{group.totalCount}</td>
                      <td className="px-6 py-3 text-right font-mono font-medium text-slate-900">${group.totalAmount.toLocaleString()}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ))}
        </div>

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
  }

  if (activeTab === 'Deposits') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-fade-in">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Date</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Collected</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Fees</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Net Deposit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {(deposits || []).map(dep => (
              <tr key={dep.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 text-slate-900 font-medium">{dep.date}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    dep.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 
                    dep.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {dep.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-slate-600 font-mono">${dep.totalCollected.toFixed(2)}</td>
                <td className="px-6 py-4 text-right text-red-500 font-mono">-${dep.fees.toFixed(2)}</td>
                <td className="px-6 py-4 text-right text-slate-900 font-bold font-mono">${dep.netDeposit.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (activeTab === 'Tax') {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">Tax Compliance Center</h4>
              <p className="text-sm text-slate-500">Download your 1099-K forms and view tax liability.</p>
            </div>
          </div>
          <button onClick={() => handleAction('1099-K Download')} className="px-4 py-2 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 text-sm flex items-center gap-2 transition-colors">
            <FileText size={16} /> View 1099-K
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs text-slate-500 uppercase font-bold mb-1">Applicable Sales</p>
            <h3 className="text-2xl font-bold text-slate-900">${taxApplicableSales.toLocaleString(undefined, {minimumFractionDigits: 2})}</h3>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs text-slate-500 uppercase font-bold mb-1">Taxes Collected</p>
            <h3 className="text-2xl font-bold text-indigo-600">${taxTaxesCollected.toLocaleString(undefined, {minimumFractionDigits: 2})}</h3>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-xs text-slate-500 uppercase font-bold mb-1">Taxes Refunded</p>
            <h3 className="text-2xl font-bold text-red-500">-${taxTaxesRefunded.toLocaleString(undefined, {minimumFractionDigits: 2})}</h3>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-emerald-500">
            <p className="text-xs text-slate-500 uppercase font-bold mb-1">Net Taxes</p>
            <h3 className="text-2xl font-bold text-emerald-600">${taxNetTaxes.toLocaleString(undefined, {minimumFractionDigits: 2})}</h3>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
            <h3 className="font-bold text-slate-800">Tax Liability Breakdown</h3>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
              <tr>
                <th className="px-6 py-3 font-semibold">Tax Name</th>
                <th className="px-6 py-3 font-semibold">Rate</th>
                <th className="px-6 py-3 font-semibold text-right">Applicable Sales</th>
                <th className="px-6 py-3 font-semibold text-right">Collected</th>
                <th className="px-6 py-3 font-semibold text-right">Refunded</th>
                <th className="px-6 py-3 font-semibold text-right">Net Taxes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dynamicTaxes.map((tax) => (
                <tr key={tax.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">{tax.name}</td>
                  <td className="px-6 py-4 text-slate-600">{tax.taxRate > 0 ? `${tax.taxRate}%` : 'N/A'}</td>
                  <td className="px-6 py-4 text-right font-mono text-slate-700">${tax.applicableSales.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                  <td className="px-6 py-4 text-right font-mono font-medium text-indigo-600">${tax.taxesCollected.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right font-mono text-red-500">${tax.taxesRefunded.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right font-mono font-bold text-slate-900">${tax.netTaxes.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (activeTab === 'Labor Cost') {
    return <LaborCostTab orders={orders} />;
  }

  if (activeTab === 'Team Performance') {
    return <TeamPerformanceTab orders={orders} />;
  }

  return null;
};
