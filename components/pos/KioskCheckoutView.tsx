import React, { useState } from 'react';
import { CartItem } from '../../types';
import { ArrowLeft, CreditCard, Smartphone, Gift, Cpu, CheckCircle2, Loader2 } from 'lucide-react';
import { KioskCartSummaryPanel } from './kiosk/KioskCartSummaryPanel';
import { KioskFulfillmentPanel } from './kiosk/KioskFulfillmentPanel';
import { ReceiptPromptModal } from '../receipt/ReceiptPromptModal';
import { ReceiptOrderContext, ReceiptDeliveryOption } from '../receipt/receiptTypes';

interface KioskCheckoutViewProps {
  cart: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  orderType: 'Dine In' | 'Takeout';
  setIsCheckout: (val: boolean) => void;
  handleCheckout: (method: string, fulfillmentData: { tableTentNumber?: string; customerName?: string }) => void;
}

export const KioskCheckoutView: React.FC<KioskCheckoutViewProps> = ({
  cart, subtotal, tax, total, orderType, setIsCheckout, handleCheckout
}) => {
  const [tableTentNumber, setTableTentNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [activePaymentMethod, setActivePaymentMethod] = useState<string | null>(null);
  const [isTerminalApproved, setIsTerminalApproved] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receiptContext, setReceiptContext] = useState<ReceiptOrderContext | null>(null);

  const initiatePaymentHandoff = (method: string) => {
    setActivePaymentMethod(method);
    setIsTerminalApproved(false);

    // Simulate PCI-compliant terminal handshake & authorization with card company
    setTimeout(() => {
      setIsTerminalApproved(true);
      setTimeout(() => {
        setActivePaymentMethod(null);
        setReceiptContext({
          orderNumber: Math.floor(100 + Math.random() * 900).toString(),
          total,
          subtotal,
          tax,
          paymentMethod: method,
          tableTentOrName: orderType === 'Dine In' ? `Tent #${tableTentNumber || 'Unassigned'}` : customerName || 'Valued Guest',
          customerName: customerName || undefined,
          appName: 'Kiosk',
          items: cart.map(item => ({ name: item.name, qty: item.quantity || 1, price: item.price }))
        });
        setShowReceiptModal(true);
      }, 800);
    }, 1500);
  };

  const handleReceiptOptionComplete = (_option: ReceiptDeliveryOption) => {
    setShowReceiptModal(false);
    const method = receiptContext?.paymentMethod || 'Credit Card';
    handleCheckout(method, {
      tableTentNumber: orderType === 'Dine In' ? tableTentNumber || 'Unassigned' : undefined,
      customerName: orderType === 'Takeout' ? customerName || 'Valued Guest' : undefined
    });
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 animate-slide-in-right relative">
      {activePaymentMethod && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/85 backdrop-blur-md p-6 text-white animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-lg w-full text-center space-y-6 shadow-2xl animate-scale-in">
            <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mx-auto">
              {isTerminalApproved ? (
                <CheckCircle2 size={44} className="text-emerald-400 animate-scale-in" />
              ) : (
                <Cpu size={40} className="animate-pulse" />
              )}
            </div>

            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Card Terminal Integration</span>
              <h3 className="text-2xl font-black mt-1">
                {isTerminalApproved ? 'Payment Received & Approved!' : `Connecting to ${activePaymentMethod} Terminal...`}
              </h3>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-left font-mono text-xs space-y-2 text-slate-300">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Terminal Connection:</span>
                <span className="font-bold text-emerald-400 flex items-center gap-1">
                  {!isTerminalApproved ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
                  PAX E700 (192.168.1.120:8080)
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Status:</span>
                <span className="font-bold text-slate-200">
                  {isTerminalApproved ? 'Card Company Authorized ✓' : 'Awaiting Card Insertion / Tap...'}
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 font-medium">Please follow the instructions on the customer card reader terminal.</p>
          </div>
        </div>
      )}

      {showReceiptModal && receiptContext && (
        <ReceiptPromptModal
          isOpen={showReceiptModal}
          orderContext={receiptContext}
          onComplete={handleReceiptOptionComplete}
          onClose={() => handleReceiptOptionComplete('NONE')}
        />
      )}

      <div className="p-6 bg-white shadow-sm flex items-center justify-between shrink-0 border-b border-slate-200">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsCheckout(false)}
            className="min-h-[48px] min-w-[48px] flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-black text-slate-900">Final Checkout & Fulfillment</h1>
            <p className="text-xs font-semibold text-slate-500">Order Mode: <span className="text-indigo-600 font-bold uppercase">{orderType}</span></p>
          </div>
        </div>

        <div className="bg-slate-100 px-4 py-2 rounded-2xl border border-slate-200 text-right">
          <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Due</span>
          <span className="text-2xl font-black text-slate-900">${total.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 p-8 overflow-y-auto space-y-8">
          <KioskFulfillmentPanel
            orderType={orderType}
            tableTentNumber={tableTentNumber}
            customerName={customerName}
            onTableTentChange={setTableTentNumber}
            onCustomerNameChange={setCustomerName}
          />

          <div>
            <h2 className="text-2xl font-black text-slate-800 mb-4">Select Payment Method</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button 
                onClick={() => initiatePaymentHandoff('Credit Card')}
                className="p-6 min-h-[120px] rounded-3xl border-2 border-slate-200 bg-white hover:border-indigo-600 hover:shadow-xl transition-all flex flex-col items-center text-center gap-3 group active:scale-98 cursor-pointer"
              >
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <CreditCard size={32} />
                </div>
                <span className="text-lg font-black text-slate-900">Credit / Debit</span>
                <span className="text-xs text-slate-500 font-medium">Tap, Insert or Chip</span>
              </button>

              <button 
                onClick={() => initiatePaymentHandoff('Apple Pay')}
                className="p-6 min-h-[120px] rounded-3xl border-2 border-slate-200 bg-white hover:border-indigo-600 hover:shadow-xl transition-all flex flex-col items-center text-center gap-3 group active:scale-98 cursor-pointer"
              >
                <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-900 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Smartphone size={32} />
                </div>
                <span className="text-lg font-black text-slate-900">Contactless / Phone</span>
                <span className="text-xs text-slate-500 font-medium">Apple Pay / Google Pay</span>
              </button>

              <button 
                onClick={() => initiatePaymentHandoff('Gift Card')}
                className="p-6 min-h-[120px] rounded-3xl border-2 border-slate-200 bg-white hover:border-indigo-600 hover:shadow-xl transition-all flex flex-col items-center text-center gap-3 group active:scale-98 cursor-pointer"
              >
                <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Gift size={32} />
                </div>
                <span className="text-lg font-black text-slate-900">16-Digit Gift Card</span>
                <span className="text-xs text-slate-500 font-medium">Digital or Physical PIN</span>
              </button>
            </div>
          </div>
        </div>
        
        <KioskCartSummaryPanel cart={cart} subtotal={subtotal} tax={tax} total={total} />
      </div>
    </div>
  );
};
