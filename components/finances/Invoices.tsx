
import React, { useState } from 'react';
import { MOCK_INVOICES } from '../../constants';
import { Plus, Download, Mail, X, Printer, CreditCard, CalendarDays, Hash, ShieldCheck } from 'lucide-react';
import { GlobalTaxConfig, getEffectiveTaxRate, getTaxBreakdown } from '../../types';

interface InvoicesProps {
    invoices?: any[];
    onAddInvoice?: (invoice: any) => void;
    taxConfig?: GlobalTaxConfig;
}

const Invoices: React.FC<InvoicesProps> = ({ invoices = MOCK_INVOICES, onAddInvoice, taxConfig }) => {
  const [showModal, setShowModal] = useState(false);
  const [newInvoice, setNewInvoice] = useState({ customerName: '', amount: '', dueDate: '' });
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);

  const effectiveTaxRate = getEffectiveTaxRate(taxConfig);

  const handleAdd = () => {
      if (!newInvoice.customerName || !newInvoice.amount || !onAddInvoice) return;
      onAddInvoice({
          id: `INV-${Date.now()}`,
          customerName: newInvoice.customerName,
          dateIssued: new Date().toLocaleDateString(),
          dueDate: newInvoice.dueDate || new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString(),
          status: 'Sent',
          amount: parseFloat(newInvoice.amount)
      });
      setShowModal(false);
      setNewInvoice({ customerName: '', amount: '', dueDate: '' });
  };

  const getInvoiceBreakdown = (inv: any) => {
    if (!inv) return { subtotal: 0, totalTax: 0, breakdown: [] };
    const baseAmt = inv.amount || 0;
    if (!taxConfig || !taxConfig.enabled || effectiveTaxRate === 0) {
      return {
        subtotal: baseAmt,
        totalTax: 0,
        breakdown: []
      };
    }
    const subtotal = baseAmt / (1 + effectiveTaxRate / 100);
    const taxInfo = getTaxBreakdown(subtotal, taxConfig);
    return {
      subtotal,
      totalTax: taxInfo.totalTax,
      breakdown: taxInfo.breakdown
    };
  };

  return (
    <div className="space-y-6 relative">
      {/* Create Modal */}
      {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
              <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 animate-scale-in">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-lg text-slate-900">Create Invoice</h3>
                      <button onClick={() => setShowModal(false)}><X size={20} className="text-slate-400 hover:text-slate-600" /></button>
                  </div>
                  <div className="space-y-4">
                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Customer Name</label>
                          <input type="text" value={newInvoice.customerName} onChange={e => setNewInvoice({...newInvoice, customerName: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium" />
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Invoice Total Amount ($)</label>
                          <input type="number" value={newInvoice.amount} onChange={e => setNewInvoice({...newInvoice, amount: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 font-mono font-bold text-sm" placeholder="0.00" />
                      </div>

                      {taxConfig && taxConfig.enabled && (
                        <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-1 text-xs">
                          <div className="flex justify-between font-bold text-indigo-900">
                            <span>Active Tax Configuration:</span>
                            <span>{effectiveTaxRate.toFixed(2)}% Total</span>
                          </div>
                          <p className="text-indigo-700">
                            {taxConfig.name} ({taxConfig.rate}%)
                            {taxConfig.additionalTaxes?.filter(t => t.enabled).map(t => `, ${t.name} (${t.rate}%)`).join('')}
                          </p>
                        </div>
                      )}

                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                          <input type="date" value={newInvoice.dueDate} onChange={e => setNewInvoice({...newInvoice, dueDate: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
                      </div>
                      <button onClick={handleAdd} className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 shadow-lg mt-4 transition-colors text-sm">Send Invoice</button>
                  </div>
              </div>
          </div>
      )}

      {/* Digital Receipt / Invoice Modal */}
      {selectedInvoice && (() => {
          const { subtotal, totalTax, breakdown } = getInvoiceBreakdown(selectedInvoice);
          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in bg-black/80 backdrop-blur-sm">
                <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-slate-800 font-sans relative">
                    
                    <button onClick={() => setSelectedInvoice(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-2 transition-colors z-20">
                        <X size={24} />
                    </button>

                    <div className="flex-1 overflow-y-auto">
                        <div className="p-8 md:p-12">
                            <div className="flex justify-between items-start border-b border-slate-100 pb-8 mb-8">
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center">
                                            <div className="w-4 h-4 bg-white rounded-sm"></div>
                                        </div>
                                        <span className="text-slate-900 font-bold tracking-widest text-lg">BYTE POS</span>
                                    </div>
                                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">INVOICE</h1>
                                    <div className="flex items-center gap-2 text-slate-500 font-mono text-sm">
                                        <Hash size={14} />
                                        {selectedInvoice.id}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <h3 className="font-bold text-slate-800 text-lg mb-1">{selectedInvoice.customerName}</h3>
                                    <div className="space-y-1 text-sm text-slate-500">
                                        <div className="flex items-center gap-2 justify-end">
                                            <CalendarDays size={14} /> Issued: {selectedInvoice.dateIssued}
                                        </div>
                                        <div className="flex items-center gap-2 justify-end font-medium text-slate-700">
                                            <CalendarDays size={14} className="text-indigo-500" /> Due: {selectedInvoice.dueDate}
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                         <span className={`inline-flex px-3 py-1 rounded-md text-xs font-bold tracking-widest uppercase border
                                            ${selectedInvoice.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                                              selectedInvoice.status === 'Overdue' ? 'bg-red-50 text-red-700 border-red-200' : 
                                              selectedInvoice.status === 'Sent' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                                            {selectedInvoice.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-50 rounded-xl border border-slate-100 p-6 mb-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
                                 <div>
                                   <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-1">Total Amount Due</p>
                                   <p className="text-5xl font-mono font-bold text-slate-900">${selectedInvoice.amount.toFixed(2)}</p>
                                 </div>
                                 {taxConfig && taxConfig.enabled && (
                                   <div className="text-right bg-white p-3 rounded-lg border border-slate-200 text-xs text-slate-600">
                                     <span className="font-bold text-slate-800 flex items-center justify-end gap-1">
                                       <ShieldCheck size={14} className="text-emerald-500" /> Dynamic Tax Applied
                                     </span>
                                     <p className="mt-0.5 text-slate-500">Effective Rate: {effectiveTaxRate.toFixed(2)}%</p>
                                   </div>
                                 )}
                            </div>

                            <div className="overflow-hidden border border-slate-200 rounded-xl mb-8">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 border-b border-slate-200">
                                        <tr>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Description</th>
                                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 bg-white">
                                        <tr className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-slate-900">Services & Items Subtotal</div>
                                                <div className="text-sm text-slate-500 mt-1">Invoice line item total</div>
                                            </td>
                                            <td className="px-6 py-4 text-right font-mono text-slate-700 font-bold">${subtotal.toFixed(2)}</td>
                                        </tr>

                                        {/* Dynamic Tax Rows */}
                                        {breakdown.map((taxItem, idx) => (
                                          <tr key={idx} className="bg-slate-50/40">
                                            <td className="px-6 py-3 pl-8 text-xs font-semibold text-slate-600">
                                              + {taxItem.name} ({taxItem.rate}%)
                                            </td>
                                            <td className="px-6 py-3 text-right font-mono text-xs font-bold text-slate-700">
                                              ${taxItem.amount.toFixed(2)}
                                            </td>
                                          </tr>
                                        ))}

                                        <tr className="bg-slate-100/70 font-bold">
                                          <td className="px-6 py-4 text-sm text-slate-900">Total Invoice Amount</td>
                                          <td className="px-6 py-4 text-right font-mono text-base text-slate-900">${selectedInvoice.amount.toFixed(2)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-4 border-t border-slate-200">
                                <div className="flex items-center gap-3 text-slate-500 text-sm">
                                    <CreditCard size={18} /> Payments can be made via portal
                                </div>
                                <div className="flex w-full sm:w-auto gap-3">
                                    <button onClick={() => { alert('Email sent successfully'); setSelectedInvoice(null); }} className="flex-1 sm:flex-none px-6 py-3 border border-slate-200 text-slate-700 rounded-lg font-bold tracking-wide hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 text-sm shadow-sm">
                                        <Mail size={16} /> EMAIL
                                    </button>
                                    <button onClick={() => window.print()} className="flex-1 sm:flex-none px-6 py-3 bg-indigo-600 text-white rounded-lg font-bold tracking-wide hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 text-sm shadow-sm border border-indigo-700">
                                        <Printer size={16} /> PRINT
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          );
      })()}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Invoices</h1>
          <p className="text-slate-500">Manage billing and payments</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm transition-colors font-medium">
            <Plus size={18} /> New Invoice
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Invoice ID</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Customer</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Date Issued</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Due Date</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Amount</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {invoices.map(inv => (
              <tr key={inv.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => setSelectedInvoice(inv)}>
                <td className="px-6 py-4 text-sm font-mono text-slate-600">{inv.id}</td>
                <td className="px-6 py-4 text-sm font-medium text-slate-900">{inv.customerName}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{inv.dateIssued}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{inv.dueDate}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium
                    ${inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 
                      inv.status === 'Overdue' ? 'bg-red-100 text-red-800' : 
                      inv.status === 'Sent' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-600'}`}>
                    {inv.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-mono font-bold text-slate-900">
                  ${inv.amount.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 text-slate-400">
                        <button onClick={(e) => { e.stopPropagation(); setSelectedInvoice(inv); }} className="hover:text-indigo-600 p-1" title="Print Invoice"><Printer size={16} /></button>
                        <button onClick={(e) => { e.stopPropagation(); setSelectedInvoice(inv); }} className="hover:text-indigo-600 p-1" title="Download"><Download size={16} /></button>
                        <button onClick={(e) => { e.stopPropagation(); setSelectedInvoice(inv); }} className="hover:text-indigo-600 p-1" title="Email"><Mail size={16} /></button>
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Invoices;
