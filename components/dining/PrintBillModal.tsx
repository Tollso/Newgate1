import React from 'react';
import { DiningTable, DiningOrderItem } from '../../types';
import { Printer, X, Check, Utensils } from 'lucide-react';

interface PrintBillModalProps {
  table: DiningTable;
  orderItems: DiningOrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  autoGratuityAmount?: number;
  serviceFeeAmount?: number;
  serviceFeeName?: string;
  onClose: () => void;
  onPrintCompleted?: () => void;
}

export const PrintBillModal: React.FC<PrintBillModalProps> = ({
  table,
  orderItems,
  subtotal,
  tax,
  total,
  autoGratuityAmount = 0,
  serviceFeeAmount = 0,
  serviceFeeName = 'Service Fee',
  onClose,
  onPrintCompleted
}) => {
  const activeItems = orderItems.filter(i => !i.isVoided);

  const handlePrint = () => {
    window.print();
    if (onPrintCompleted) onPrintCompleted();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/70 backdrop-blur-sm animate-fade-in text-slate-800 p-4">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl animate-scale-in relative max-h-[90vh] flex flex-col">
        
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center">
              <Printer size={22} />
            </div>
            <div>
              <h3 className="font-black text-xl text-slate-900">Print Table Bill</h3>
              <p className="text-xs font-bold text-slate-400">Table {table.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Thermal Receipt Preview */}
        <div className="flex-1 overflow-y-auto bg-amber-50/50 border border-amber-200/60 rounded-2xl p-5 font-mono text-xs text-slate-800 space-y-3 shadow-inner my-2">
          <div className="text-center space-y-1 pb-3 border-b border-dashed border-amber-300">
            <h4 className="font-black text-sm uppercase tracking-wide">Gourmet Bistro & Grill</h4>
            <p className="text-[11px] text-slate-500">100 Restaurant Row, City Center</p>
            <p className="text-[11px] text-slate-500">Tel: (555) 019-2834</p>
            <div className="pt-2 text-[11px] font-bold text-slate-700 flex justify-between">
              <span>Table: {table.name}</span>
              <span>Server: {table.assignedToName || 'Staff'}</span>
            </div>
            <div className="text-[10px] text-slate-400 flex justify-between">
              <span>Order: {table.orderId || 'ORD-8821'}</span>
              <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>

          <div className="space-y-2 py-2">
            <div className="grid grid-cols-12 font-bold border-b border-amber-200 pb-1 text-[11px]">
              <span className="col-span-2">Qty</span>
              <span className="col-span-7">Item</span>
              <span className="col-span-3 text-right">Price</span>
            </div>

            {activeItems.length === 0 ? (
              <p className="text-center py-4 text-slate-400 italic">No items in order</p>
            ) : (
              activeItems.map((item) => (
                <div key={item.cartId} className="grid grid-cols-12 text-[11px] items-center">
                  <span className="col-span-2 font-bold">{item.quantity}x</span>
                  <span className="col-span-7 truncate">{item.name}</span>
                  <span className="col-span-3 text-right font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))
            )}
          </div>

          <div className="pt-3 border-t border-dashed border-amber-300 space-y-1.5 text-[11px]">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-bold">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax ({subtotal > 0 ? ((tax / subtotal) * 100).toFixed(2) : '0.00'}%):</span>
              <span className="font-bold">${tax.toFixed(2)}</span>
            </div>
            {autoGratuityAmount > 0 && (
              <div className="flex justify-between text-amber-900">
                <span>Auto Gratuity:</span>
                <span className="font-bold">${autoGratuityAmount.toFixed(2)}</span>
              </div>
            )}
            {serviceFeeAmount > 0 && (
              <div className="flex justify-between text-indigo-900">
                <span>{serviceFeeName}:</span>
                <span className="font-bold">${serviceFeeAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-black pt-1 border-t border-amber-300">
              <span>TOTAL DUE:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="pt-4 text-center border-t border-dashed border-amber-300 space-y-2">
            <div className="border border-slate-300 rounded p-2 text-center text-[10px] font-sans">
              <span className="block font-bold text-slate-600">Tip Suggestions:</span>
              <span className="block text-slate-500">15%: ${(subtotal * 0.15).toFixed(2)} | 18%: ${(subtotal * 0.18).toFixed(2)} | 20%: ${(subtotal * 0.20).toFixed(2)}</span>
            </div>
            <p className="text-[10px] text-slate-400 italic">Thank you for dining with us!</p>
          </div>
        </div>

        <div className="flex gap-3 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-2xl transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 py-3.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-sky-900/20 text-sm flex items-center justify-center gap-2"
          >
            <Printer size={18} /> Print Bill
          </button>
        </div>
      </div>
    </div>
  );
};
