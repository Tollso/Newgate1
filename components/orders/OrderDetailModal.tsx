import React from 'react';
import { DetailedOrder } from '../../types';
import { X, Printer, Mail, RefreshCw } from 'lucide-react';

interface OrderDetailModalProps {
  order: DetailedOrder;
  onClose: () => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ order, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-4xl bg-[#0f1115] border border-slate-800 rounded-2xl shadow-2xl flex flex-col h-[85vh] overflow-hidden text-slate-300 relative">
        <div className="p-6 border-b border-slate-800 bg-[#16181d] flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">Order #{order.id}</h2>
            <p className="text-xs text-slate-400">{order.date} • {order.time} • Server: {order.employeeName}</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="bg-[#16181d] border border-slate-800 rounded-xl p-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Order Items</h3>
            <div className="divide-y divide-slate-800">
              {order.items?.map((item, idx) => (
                <div key={idx} className="py-3 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-white text-sm">{item.quantity}x {item.name}</span>
                  </div>
                  <span className="font-mono text-white text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#16181d] border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Status</span>
              <span className="font-bold text-emerald-400">{order.status}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Payment Method</span>
              <span className="text-white">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t border-slate-800 pt-2 mt-2">
              <span className="text-white">Total</span>
              <span className="text-blue-400 font-mono">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-[#16181d] border-t border-slate-800 flex justify-between">
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-2">
              <Printer size={14} /> Print Receipt
            </button>
            <button className="px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-2">
              <Mail size={14} /> Email
            </button>
          </div>
          <button onClick={onClose} className="px-5 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
