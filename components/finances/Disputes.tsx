
import React from 'react';
import { MOCK_DISPUTES } from '../../constants';
import { AlertCircle, Filter, Download } from 'lucide-react';

const Disputes: React.FC = () => {
    return (
        <div className="space-y-6 animate-fade-in">
             <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Disputes</h1>
                    <p className="text-slate-500">Manage chargebacks and transaction inquiries</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {MOCK_DISPUTES.length === 0 ? (
                     <div className="p-12 flex flex-col items-center justify-center text-center">
                         <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                             <AlertCircle size={32} />
                         </div>
                         <h3 className="text-xl font-bold text-slate-800">No Open Disputes</h3>
                         <p className="text-slate-500 mt-2">Great job! You have no active chargebacks or inquiries.</p>
                     </div>
                ) : (
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                            <tr>
                                <th className="px-6 py-3 font-semibold">Date Received</th>
                                <th className="px-6 py-3 font-semibold">Transaction ID</th>
                                <th className="px-6 py-3 font-semibold">Reason</th>
                                <th className="px-6 py-3 font-semibold">Status</th>
                                <th className="px-6 py-3 font-semibold text-right">Amount</th>
                                <th className="px-6 py-3 font-semibold text-right">Due Date</th>
                                <th className="px-6 py-3 font-semibold text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {MOCK_DISPUTES.map(dispute => (
                                <tr key={dispute.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 text-slate-900">{dispute.date}</td>
                                    <td className="px-6 py-4 font-mono text-slate-600">{dispute.transactionId}</td>
                                    <td className="px-6 py-4 text-slate-700">{dispute.reason}</td>
                                    <td className="px-6 py-4">
                                        <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs font-bold uppercase">{dispute.status}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-bold text-slate-900">${dispute.amount.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-right text-red-600 font-medium">{dispute.dueDate}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-indigo-600 hover:text-indigo-800 font-medium">Respond</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Disputes;
