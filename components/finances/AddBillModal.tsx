import React, { useState } from 'react';
import { X } from 'lucide-react';

export interface Vendor {
    id: string;
    name: string;
    paymentMethod: string;
    email: string;
    outstandingBalance: number;
    lastPaidDate: string;
}

export interface Bill {
    id: string;
    vendorId: string;
    invoiceNumber: string;
    dueDate: string;
    amount: number;
    status: string;
}

interface AddBillModalProps {
    isOpen: boolean;
    onClose: () => void;
    vendors: Vendor[];
    onSubmit: (bill: Bill) => void;
}

export const AddBillModal: React.FC<AddBillModalProps> = ({
    isOpen,
    onClose,
    vendors,
    onSubmit
}) => {
    const [vendorId, setVendorId] = useState(vendors[0]?.id || '');
    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [amount, setAmount] = useState('');
    const [dueDate, setDueDate] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || !invoiceNumber) return;

        const newBill: Bill = {
            id: `BILL-${Date.now()}`,
            vendorId: vendorId || vendors[0]?.id || '',
            invoiceNumber,
            dueDate: dueDate || new Date().toISOString().split('T')[0],
            amount: parseFloat(amount),
            status: 'Unpaid'
        };

        onSubmit(newBill);
        setInvoiceNumber('');
        setAmount('');
        setDueDate('');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <h3 className="font-bold text-lg text-slate-900">Add New Vendor Bill</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Vendor</label>
                        <select 
                            value={vendorId} 
                            onChange={e => setVendorId(e.target.value)}
                            className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        >
                            {vendors.map(v => (
                                <option key={v.id} value={v.id}>{v.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Invoice Number</label>
                        <input 
                            type="text" 
                            required
                            value={invoiceNumber}
                            onChange={e => setInvoiceNumber(e.target.value)}
                            placeholder="e.g. INV-2026-99"
                            className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Amount ($)</label>
                            <input 
                                type="number" 
                                step="0.01"
                                required
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                                placeholder="0.00"
                                className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Due Date</label>
                            <input 
                                type="date" 
                                value={dueDate}
                                onChange={e => setDueDate(e.target.value)}
                                className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="flex-1 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="flex-1 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700"
                        >
                            Save Bill
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
