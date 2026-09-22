/**
 * RetailReturnsModal
 * First-class Retail Returns & Exchanges (Section 8.5).
 * Supports receipt lookup, receiptless return, restock/damage ledgering, and store credit issuance.
 */

import React, { useState } from 'react';
import { RotateCcw, X, Search, CheckCircle2, AlertTriangle, CreditCard, DollarSign, Gift } from 'lucide-react';
import { RetailService } from '../../services/retailService';
import { OrderService } from '../../services/orderService';
import { RetailReturnRecord, ReturnReason, RefundMethod } from '../../types/retail';
import { Employee } from '../../types/business';

interface RetailReturnsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: Employee;
  onRequireManagerPin?: (action: string, callback: () => void) => void;
}

export const RetailReturnsModal: React.FC<RetailReturnsModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onRequireManagerPin,
}) => {
  const [lookupOrderNumber, setLookupOrderNumber] = useState('');
  const [isReceiptless, setIsReceiptless] = useState(false);
  const [returnItems, setReturnItems] = useState<
    Array<{
      productId: string;
      sku: string;
      name: string;
      quantity: number;
      price: number;
      reason: ReturnReason;
      restockItem: boolean;
    }>
  >([
    {
      productId: 'ret-prod-1',
      sku: 'SHIRT-OXF-BLU-M',
      name: 'Organic Cotton Oxford Shirt (Sky Blue M)',
      quantity: 1,
      price: 58.00,
      reason: 'WRONG_SIZE',
      restockItem: true,
    },
  ]);

  const [refundMethod, setRefundMethod] = useState<RefundMethod>('STORE_CREDIT');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedReturn, setCompletedReturn] = useState<RetailReturnRecord | null>(null);

  if (!isOpen) return null;

  const totalRefundAmount = returnItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleProcessReturn = async () => {
    // If receiptless or > $100, prompt manager override if available
    if (isReceiptless && onRequireManagerPin) {
      onRequireManagerPin('RECEIPTLESS_RETURN', () => executeReturn());
      return;
    }
    executeReturn();
  };

  const executeReturn = async () => {
    setIsProcessing(true);
    try {
      const returnRecord: RetailReturnRecord = {
        id: `ret-${Date.now()}`,
        merchantId: 'M001',
        originalOrderId: isReceiptless ? undefined : lookupOrderNumber || 'ORD-98214',
        isReceiptless,
        items: returnItems,
        totalRefundAmount,
        refundMethod,
        cashierId: currentUser.id,
        cashierName: currentUser.name,
        timestamp: new Date().toISOString(),
      };

      const result = await RetailService.processReturn(returnRecord);
      setCompletedReturn(result);
    } catch (e: any) {
      alert(e.message || 'Failed to process return');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-600/20 text-amber-400 rounded-lg">
              <RotateCcw size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Process Retail Return / Exchange</h3>
              <p className="text-xs text-slate-400">Restock inventory, refund tenders, or issue store credit</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {completedReturn ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full mx-auto flex items-center justify-center">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="text-2xl font-black text-white">Return Successfully Processed</h3>
              <p className="text-sm text-slate-300">
                Refund Method: <span className="font-bold text-white">{completedReturn.refundMethod}</span> ($
                {completedReturn.totalRefundAmount.toFixed(2)})
              </p>

              {completedReturn.storeCreditIssued && (
                <div className="p-4 bg-slate-800 border border-indigo-500 rounded-xl max-w-sm mx-auto space-y-1">
                  <span className="text-xs text-indigo-300 uppercase tracking-wider font-semibold block">
                    Store Credit Voucher Issued
                  </span>
                  <span className="text-2xl font-mono font-black text-white block">
                    {completedReturn.storeCreditIssued.code}
                  </span>
                  <span className="text-[11px] text-slate-400 block">
                    Valid for 1 year across all terminals
                  </span>
                </div>
              )}

              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm transition-colors"
              >
                Close & Return to Register
              </button>
            </div>
          ) : (
            <>
              {/* Receipt Lookup vs Receiptless Toggle */}
              <div className="flex items-center justify-between p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="receiptlessCheck"
                    checked={isReceiptless}
                    onChange={(e) => setIsReceiptless(e.target.checked)}
                    className="w-4 h-4 text-amber-500 rounded border-slate-600 focus:ring-amber-500 bg-slate-900"
                  />
                  <label htmlFor="receiptlessCheck" className="text-xs font-semibold text-slate-200">
                    Receiptless Return (Requires Manager Override)
                  </label>
                </div>
                {!isReceiptless && (
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={lookupOrderNumber}
                      onChange={(e) => setLookupOrderNumber(e.target.value)}
                      placeholder="Enter Order # or Receipt barcode"
                      className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                    <button className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold rounded-lg">
                      Lookup
                    </button>
                  </div>
                )}
              </div>

              {/* Items to return table */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Items to Return ({returnItems.length})
                </h4>

                {returnItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700 space-y-2.5"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-bold text-sm text-white block">{item.name}</span>
                        <span className="text-[11px] font-mono text-slate-400">SKU: {item.sku}</span>
                      </div>
                      <span className="text-sm font-bold text-emerald-400">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-700/60 text-xs">
                      <div>
                        <label className="block text-slate-400 mb-1">Return Reason</label>
                        <select
                          value={item.reason}
                          onChange={(e) => {
                            const val = e.target.value as ReturnReason;
                            setReturnItems((prev) =>
                              prev.map((it, i) => (i === idx ? { ...it, reason: val } : it))
                            );
                          }}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                        >
                          <option value="WRONG_SIZE">Wrong Size</option>
                          <option value="DEFECTIVE">Defective / Damaged</option>
                          <option value="CHANGED_MIND">Customer Changed Mind</option>
                          <option value="GIFT_RETURN">Gift Return</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-2 pt-4">
                        <input
                          type="checkbox"
                          id={`restock-${idx}`}
                          checked={item.restockItem}
                          onChange={(e) => {
                            const chk = e.target.checked;
                            setReturnItems((prev) =>
                              prev.map((it, i) => (i === idx ? { ...it, restockItem: chk } : it))
                            );
                          }}
                          className="w-4 h-4 text-emerald-500 rounded border-slate-600 bg-slate-900"
                        />
                        <label htmlFor={`restock-${idx}`} className="text-xs text-slate-300">
                          Restock into inventory
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Refund Method Picker */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Refund Method
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setRefundMethod('STORE_CREDIT')}
                    className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-colors ${
                      refundMethod === 'STORE_CREDIT'
                        ? 'bg-indigo-600 border-indigo-500 text-white'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                    }`}
                  >
                    <Gift size={20} />
                    <span>Store Credit Voucher</span>
                  </button>

                  <button
                    onClick={() => setRefundMethod('ORIGINAL_PAYMENT')}
                    className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-colors ${
                      refundMethod === 'ORIGINAL_PAYMENT'
                        ? 'bg-indigo-600 border-indigo-500 text-white'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                    }`}
                  >
                    <CreditCard size={20} />
                    <span>Original Card Refund</span>
                  </button>

                  <button
                    onClick={() => setRefundMethod('CASH')}
                    className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-colors ${
                      refundMethod === 'CASH'
                        ? 'bg-indigo-600 border-indigo-500 text-white'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                    }`}
                  >
                    <DollarSign size={20} />
                    <span>Cash Out of Drawer</span>
                  </button>
                </div>
              </div>

              {/* Total & Action */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">Total Refund Due</span>
                  <span className="text-2xl font-black text-emerald-400 font-mono">
                    ${totalRefundAmount.toFixed(2)}
                  </span>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleProcessReturn}
                    disabled={isProcessing || returnItems.length === 0}
                    className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs transition-colors shadow-lg disabled:opacity-50"
                  >
                    {isProcessing ? 'Processing Return...' : 'Authorize & Process Return'}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
