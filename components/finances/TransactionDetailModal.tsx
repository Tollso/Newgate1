import React, { useState } from 'react';
import { Transaction, DetailedOrder } from '../../types';
import { 
  X, Clock, CreditCard, CheckCircle2, Copy, Printer, Mail, ShieldCheck, 
  RefreshCw, User, Terminal, Receipt, Check
} from 'lucide-react';

interface TransactionDetailModalProps {
  tx: Transaction;
  orders: DetailedOrder[];
  onClose: () => void;
}

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({ tx, orders, onClose }) => {
  const [copyingId, setCopyingId] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopyingId(true);
    setTimeout(() => setCopyingId(false), 2000);
  };

  const handleSendEmail = () => {
    setEmailSending(true);
    setTimeout(() => {
      setEmailSending(false);
      setEmailSent(true);
      setTimeout(() => setEmailSent(false), 3000);
    }, 1500);
  };

  const getMatchingOrder = (t: Transaction): DetailedOrder | null => {
    if (!orders) return null;
    const match = orders.find(o => o.id === t.id || o.id.replace('ORD-', 'TRX-') === t.id || o.id.replace('TRX-', 'ORD-') === t.id);
    if (match) return match;
    return orders.find(o => o.date === t.date && Math.abs(o.total - t.amount) < 0.05) || null;
  };

  const getSimulatedOrder = (t: Transaction): DetailedOrder => {
    const matched = getMatchingOrder(t);
    if (matched) return matched;

    const amount = Math.abs(t.amount);
    let items = [];
    if (amount > 15) {
      const mainPrice = parseFloat((amount * 0.7).toFixed(2));
      const drinkPrice = parseFloat((amount - mainPrice).toFixed(2));
      items = [
        { id: 'sim-1', name: 'Premium Chef Specialty Entrée', quantity: 1, price: mainPrice },
        { id: 'sim-2', name: 'Artisanal Hand-crafted Beverage', quantity: 1, price: drinkPrice }
      ];
    } else {
      items = [
        { id: 'sim-1', name: 'Quick-Service Food Option', quantity: 1, price: amount }
      ];
    }

    return {
      id: t.id.replace('TRX-', 'ORD-').replace('T-', 'ORD-'),
      date: t.date,
      time: '02:45 PM',
      total: amount,
      status: t.type === 'Refund' ? 'Refunded' : 'Paid',
      paymentMethod: t.method === 'Card' ? 'Visa' : t.method === 'Gift Card' ? 'Gift Card' : 'Cash',
      employeeName: t.employeeId || 'Staff',
      device: 'Main Register Terminal 01',
      type: 'Dine-in',
      items: items,
      fees: 0,
      tip: 0,
      discount: 0
    };
  };

  const getActivitiesList = (t: Transaction) => {
    const isRefund = t.type === 'Refund';
    const isDeposit = t.type === 'Deposit';
    
    if (isRefund) {
      return [
        { title: 'Refund Request Received', description: `Admin override requested for terminal return. Refund code generated: ref_${t.id.toLowerCase()}`, time: '12:40:02 PM', status: 'success', icon: User },
        { title: 'Retrieving Original Auth Token', description: `Fiserv ledger trace matched terminal order ID with authorized card capture code.`, time: '12:40:15 PM', status: 'success', icon: Clock },
        { title: 'Authorization Release Dispatched', description: `Dispatched payment network release package to card-issuing institution gateway.`, time: '12:40:48 PM', status: 'success', icon: CreditCard },
        { title: 'Credit Return Completed', description: `Customer refund approved. Ledger adjusted. Total refund credit amount of -$${t.amount.toFixed(2)} finalized.`, time: '12:41:20 PM', status: 'success', icon: CheckCircle2 }
      ];
    } else if (isDeposit) {
      return [
        { title: 'Batch Consolidated', description: `Internal card processing logs summed up for the current day business ledger.`, time: '02:58:00 AM', status: 'success', icon: Clock },
        { title: 'Processor Funding Transfer Dispatched', description: `Consolidated payment cleared and routing instructions sent to commercial institution database system.`, time: '04:15:33 AM', status: 'success', icon: RefreshCw },
        { title: 'Wire Post Completed', description: `Fiserv ACH automated wire post finalized and funds posted to bank merchant balance.`, time: '09:00:10 AM', status: 'success', icon: CheckCircle2 }
      ];
    } else {
      const authCode = `AUTH_${Math.floor(100000 + Math.random() * 900000)}`;
      return [
        { title: 'Secure Checkout Initiated', description: `Customer order cart totals locked and encrypted payment session initialized.`, time: '02:43:10 PM', status: 'success', icon: Terminal },
        { title: 'Transaction Routing & Verification', description: `Routing transaction payload ($${t.amount.toFixed(2)}) via EMV chip integration to processor gateway.`, time: '02:43:25 PM', status: 'success', icon: ShieldCheck },
        { title: 'Network Authorization Succeeded', description: `Bank verification matches and funds blocked. Gate code: ${authCode}. Card-present tokenized verify OK.`, time: '02:43:50 PM', status: 'success', icon: CreditCard },
        { title: 'Settlement Cleared & Captured', description: `Successfully captured. Transaction recorded and queued in active open batch ready for closeout.`, time: '02:44:02 PM', status: 'success', icon: CheckCircle2 },
        { title: 'Receipt & Analytics Sync Complete', description: `Customer receipt rendered and system ledger databases updated on server nodes.`, time: '02:44:15 PM', status: 'success', icon: Receipt }
      ];
    }
  };

  const order = getSimulatedOrder(tx);
  const activities = getActivitiesList(tx);
  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg flex flex-col h-full overflow-hidden animate-fade-in relative z-10">
      <div className="p-4 bg-slate-900 text-white flex justify-between items-center shrink-0">
        <div>
          <span className="font-mono text-xs text-indigo-400 font-bold uppercase tracking-widest">Payment Activities</span>
          <h2 className="text-base font-bold flex items-center gap-2">{tx.id}</h2>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg transition-colors">
          <X size={18} className="text-slate-400" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-hide">
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase">Amount</span>
            <span className="text-xl font-extrabold text-slate-900">${tx.amount.toFixed(2)}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mt-2 pt-2 border-t border-slate-200">
            <div><span className="text-slate-400">Method:</span> <span className="font-bold">{tx.method}</span></div>
            <div><span className="text-slate-400">Type:</span> <span className="font-bold">{tx.type}</span></div>
            <div><span className="text-slate-400">Date:</span> <span className="font-bold">{tx.date}</span></div>
            <div><span className="text-slate-400">Staff:</span> <span className="font-bold">{tx.employeeId}</span></div>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3">Audit Logs</h3>
          <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {activities.map((act, idx) => {
              const Icon = act.icon;
              return (
                <div key={idx} className="flex gap-3 relative pl-1">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 z-10">
                    <Icon size={12} />
                  </div>
                  <div className="bg-white border border-slate-100 p-2.5 rounded-lg flex-1 shadow-2xs">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="text-xs font-bold text-slate-800">{act.title}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{act.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-tight">{act.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="border-t border-slate-200 pt-4">
          <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3">Receipt Summary</h3>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 font-mono text-xs space-y-2">
            <div className="border-b border-slate-200 pb-2">
              <p className="font-bold text-slate-800">OmniPOS Merchant Receipt</p>
              <p className="text-[10px] text-slate-500">Order ID: {order.id}</p>
            </div>
            <div className="space-y-1 py-1">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-slate-700">
                  <span>{item.quantity}x {item.name}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-200 pt-2 space-y-1">
              <div className="flex justify-between text-slate-500"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-slate-900 font-bold text-sm pt-1"><span>Total</span><span>${tx.amount.toFixed(2)}</span></div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-3 bg-slate-50 border-t border-slate-200 flex gap-2 shrink-0">
        <button onClick={() => handleCopyId(tx.id)} className="flex-1 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors">
          {copyingId ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />} {copyingId ? 'Copied' : 'Copy ID'}
        </button>
        <button onClick={handleSendEmail} disabled={emailSending || emailSent} className="flex-1 py-2 bg-indigo-600 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 hover:bg-indigo-700 transition-colors disabled:opacity-50">
          {emailSent ? <Check size={14} /> : <Mail size={14} />} {emailSent ? 'Sent' : emailSending ? 'Sending...' : 'Email'}
        </button>
        <button onClick={() => window.print()} className="py-2 px-3 bg-slate-800 text-white font-bold text-xs rounded-lg flex items-center justify-center hover:bg-slate-900 transition-colors">
          <Printer size={14} />
        </button>
      </div>
    </div>
  );
};
