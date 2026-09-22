import React, { useState } from 'react';
import { MOCK_VENDORS, MOCK_BILLS } from '../../constants';
import { 
    Plus, Search, CheckCircle, Clock, CreditCard, 
    Landmark, FileText, RefreshCw 
} from 'lucide-react';
import { AddBillModal, Vendor, Bill } from './AddBillModal';

interface PayBillsProps {
    vendors?: Vendor[];
    bills?: Bill[];
    onAddBill?: (bill: Bill) => void;
    onPayBill?: (billId: string) => void;
}

const PayBills: React.FC<PayBillsProps> = ({ 
    vendors: propVendors, 
    bills: propBills, 
    onAddBill, 
    onPayBill 
}) => {
    const [vendors] = useState<Vendor[]>(propVendors || MOCK_VENDORS);
    const [bills, setBills] = useState<Bill[]>(propBills || MOCK_BILLS);
    const [activeTab, setActiveTab] = useState<'Unpaid Bills' | 'Vendors' | 'History'>('Unpaid Bills');
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [notification, setNotification] = useState<string | null>(null);

    const showMsg = (msg: string) => {
        setNotification(msg);
        setTimeout(() => setNotification(null), 3000);
    };

    const handlePayBillClick = (billId: string) => {
        if (onPayBill) {
            onPayBill(billId);
        }
        setBills(prev => prev.map(b => b.id === billId ? { ...b, status: 'Paid' } : b));
        showMsg("Bill marked as Paid!");
    };

    const handleCreateBill = (newBill: Bill) => {
        if (onAddBill) {
            onAddBill(newBill);
        }
        setBills(prev => [newBill, ...prev]);
        showMsg("New bill created successfully!");
    };

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'Paid': return 'bg-emerald-100 text-emerald-800';
            case 'Scheduled': return 'bg-blue-100 text-blue-800';
            case 'Unpaid': return 'bg-amber-100 text-amber-800';
            default: return 'bg-slate-100 text-slate-600';
        }
    };

    const unpaidBills = bills.filter(b => b.status !== 'Paid');
    const totalOutstanding = unpaidBills.reduce((sum, b) => sum + b.amount, 0);

    return (
        <div className="space-y-6 animate-fade-in relative">
            {notification && (
                <div className="fixed top-4 right-4 bg-emerald-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2">
                    <CheckCircle size={18} />
                    <span>{notification}</span>
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Pay Bills</h1>
                    <p className="text-slate-500 text-sm">Manage vendor accounts, scheduled payments, and accounts payable.</p>
                </div>
                <button 
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm transition-colors font-medium"
                >
                    <Plus size={18} /> Add Bill
                </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-200">
                {(['Unpaid Bills', 'Vendors', 'History'] as const).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2.5 font-medium text-sm transition-colors relative ${
                            activeTab === tab 
                                ? 'text-indigo-600 border-b-2 border-indigo-600' 
                                : 'text-slate-500 hover:text-slate-800'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {activeTab === 'Unpaid Bills' && (
                <div className="space-y-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <p className="text-sm font-medium text-slate-500 mb-1">Outstanding Amount</p>
                            <h3 className="text-2xl font-bold text-slate-900">${totalOutstanding.toFixed(2)}</h3>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <p className="text-sm font-medium text-slate-500 mb-1">Unpaid Bills</p>
                            <h3 className="text-2xl font-bold text-amber-600">{unpaidBills.length}</h3>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <p className="text-sm font-medium text-slate-500 mb-1">Scheduled Payments</p>
                            <h3 className="text-2xl font-bold text-blue-600">${bills.filter(b => b.status === 'Scheduled').reduce((s, b) => s + b.amount, 0).toFixed(2)}</h3>
                        </div>
                    </div>

                    {/* Bills List */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                            <h3 className="font-bold text-slate-800">Pending Vendor Invoices</h3>
                            <div className="relative">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input 
                                    type="text" 
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    placeholder="Search vendors..." 
                                    className="pl-9 pr-4 py-1.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {unpaidBills.filter(bill => {
                                const vendor = vendors.find(v => v.id === bill.vendorId);
                                return !searchTerm || vendor?.name.toLowerCase().includes(searchTerm.toLowerCase()) || bill.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
                            }).map(bill => {
                                const vendor = vendors.find(v => v.id === bill.vendorId);
                                return (
                                    <div key={bill.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                                                {vendor?.name.charAt(0) || 'V'}
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-slate-900">{vendor?.name || 'Vendor'}</h4>
                                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                                    <span>Inv: {bill.invoiceNumber}</span>
                                                    <span>•</span>
                                                    <span className="flex items-center gap-1"><Clock size={12}/> Due {bill.dueDate}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(bill.status)}`}>
                                                {bill.status}
                                            </span>
                                            <span className="font-bold text-slate-900 w-24 text-right">${bill.amount.toFixed(2)}</span>
                                            <button 
                                                onClick={() => handlePayBillClick(bill.id)}
                                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm transition-all"
                                            >
                                                Pay Now
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                            {unpaidBills.length === 0 && (
                                <div className="p-8 text-center text-slate-500">No unpaid bills at this time.</div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'History' && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-slate-800">Paid Bills History</div>
                    <div className="divide-y divide-slate-100">
                        {bills.filter(b => b.status === 'Paid').map(bill => {
                            const vendor = vendors.find(v => v.id === bill.vendorId);
                            return (
                                <div key={bill.id} className="p-4 flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium text-slate-900">{vendor?.name || 'Vendor'}</h4>
                                        <p className="text-xs text-slate-500">Inv: {bill.invoiceNumber}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded text-xs font-bold">Paid</span>
                                        <span className="font-bold text-slate-900">${bill.amount.toFixed(2)}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {activeTab === 'Vendors' && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                            <tr>
                                <th className="px-6 py-3 font-semibold">Vendor Name</th>
                                <th className="px-6 py-3 font-semibold">Payment Method</th>
                                <th className="px-6 py-3 font-semibold">Contact</th>
                                <th className="px-6 py-3 font-semibold text-right">Balance</th>
                                <th className="px-6 py-3 font-semibold text-right">Last Paid</th>
                                <th className="px-6 py-3 font-semibold text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {vendors.map(vendor => (
                                <tr key={vendor.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 font-medium text-slate-900">{vendor.name}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {vendor.paymentMethod === 'ACH' ? <Landmark size={16} className="text-emerald-600"/> : 
                                             vendor.paymentMethod === 'Card' ? <CreditCard size={16} className="text-blue-600"/> : 
                                             <FileText size={16} className="text-slate-500"/>}
                                            <span>{vendor.paymentMethod}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">{vendor.email}</td>
                                    <td className="px-6 py-4 text-right font-mono font-medium">${vendor.outstandingBalance.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-right text-slate-500">{vendor.lastPaidDate}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-indigo-600 hover:text-indigo-800 font-medium text-xs">Manage</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal for Add Bill */}
            <AddBillModal 
                isOpen={showAddModal} 
                onClose={() => setShowAddModal(false)} 
                vendors={vendors} 
                onSubmit={handleCreateBill} 
            />

            {/* Promo / Integration Info */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-6 text-white flex items-center justify-between shadow-lg">
                <div>
                    <h3 className="text-lg font-bold mb-1">Seamless Accounting Sync</h3>
                    <p className="text-slate-300 text-sm max-w-md">
                        Connect QuickBooks to automatically reconcile payments and bills. Save 15+ hours monthly on manual data entry.
                    </p>
                </div>
                <button 
                    onClick={() => showMsg("QuickBooks sync completed!")}
                    className="bg-white text-slate-900 px-4 py-2 rounded-lg font-bold text-sm hover:bg-slate-100 transition-colors flex items-center gap-2"
                >
                    <RefreshCw size={16} /> Sync Now
                </button>
            </div>
        </div>
    );
};

export default PayBills;
