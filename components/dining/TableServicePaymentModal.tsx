import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { playBeep } from '../../utils';
import { TableTerminalTapModal } from './TableTerminalTapModal';
import { TableSplitPaymentModes } from './TableSplitPaymentModes';
import { TableServicePaymentModalProps } from './payment_modal/TablePaymentModalTypes';
import { useTableSplitChecks } from './payment_modal/useTableSplitChecks';
import { TablePaymentSelectMode } from './payment_modal/TablePaymentSelectMode';

export const TableServicePaymentModal: React.FC<TableServicePaymentModalProps> = ({
  showPayment, setShowPayment, tableCardPaymentStep, setTableCardPaymentStep,
  tableSelectedTip, setTableSelectedTip, total, activeTable, billDiscount,
  handleCloseCheck, giftCards, setGiftCards, orderItems, guests, preAuthInfo,
  totals, serviceFeeName = 'Service Fee', taxRate = 8.25, initialPaymentMode = 'SELECT'
}) => {
  const [paymentMode, setPaymentMode] = useState<'SELECT' | 'SPLIT_EVEN' | 'SPLIT_GUEST' | 'SPLIT_ITEM'>(initialPaymentMode);
  const [gcCode, setGcCode] = useState('');
  const [gcError, setGcError] = useState('');
  const [amountToPay, setAmountToPay] = useState(total);
  const [splitWays, setSplitWays] = useState(2);

  const {
    splitChecks, setSplitChecks, activeSplitCheckId, setActiveSplitCheckId,
    activeSplitCheck, activeSplitCheckTotal, addSplitCheck, assignItemToCheck, unassignItemFromCheck,
  } = useTableSplitChecks({ orderItems, totals, taxRate });

  useEffect(() => {
    setPaymentMode(initialPaymentMode);
  }, [initialPaymentMode]);

  let finalTotal = amountToPay;
  if (billDiscount && paymentMode === 'SELECT') {
    finalTotal = billDiscount.type === 'Percentage' ? amountToPay * (1 - billDiscount.value / 100) : Math.max(0, amountToPay - billDiscount.value);
  }

  const handleGiftCardPay = () => {
    if (!gcCode) {
      setGcError('Please enter a gift card code');
      return;
    }
    const card = (giftCards || []).find((c: any) => c.code === gcCode);
    if (!card) {
      setGcError('Invalid gift card code');
      return;
    }
    if (card.balance < finalTotal) {
      setGcError(`Insufficient balance. Available: $${card.balance.toFixed(2)}`);
      return;
    }
    
    if (setGiftCards) {
      setGiftCards((prev: any[]) => prev.map(c => c.code === gcCode ? { ...c, balance: c.balance - finalTotal } : c));
    }
    playBeep('success');
    handleCloseCheck('Gift Card', 0, finalTotal);
    if (amountToPay < total - 0.01) {
      setTableCardPaymentStep('NONE');
      if (paymentMode === 'SPLIT_ITEM') {
        setSplitChecks(checks => checks.map(c => c.id === activeSplitCheckId ? { ...c, paid: true } : c));
      }
    }
  };

  if (tableCardPaymentStep === 'NONE') {
    return (
      <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in p-4">
        <div className="bg-white w-[95%] md:w-full max-w-[600px] max-h-[95vh] rounded-3xl overflow-hidden shadow-2xl animate-scale-in flex flex-col">
          <div className="bg-slate-900 p-6 flex justify-between items-center text-white">
            <div>
              <h3 className="font-black text-xl tracking-tight">Payment</h3>
              <p className="text-sm font-medium text-slate-400">Table {activeTable?.name} • Balance: ${total.toFixed(2)}</p>
            </div>
            <button onClick={() => setShowPayment(false)} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-white">
              <X size={20} />
            </button>
          </div>

          <div className="p-6 overflow-y-auto">
            {paymentMode === 'SELECT' && (
              <TablePaymentSelectMode
                preAuthInfo={preAuthInfo}
                finalTotal={finalTotal}
                total={total}
                handleCloseCheck={handleCloseCheck}
                setAmountToPay={setAmountToPay}
                setTableCardPaymentStep={setTableCardPaymentStep}
                setPaymentMode={setPaymentMode}
                paymentMode={paymentMode}
                setSplitChecks={setSplitChecks}
                activeSplitCheckId={activeSplitCheckId}
              />
            )}

            <TableSplitPaymentModes
              paymentMode={paymentMode}
              setPaymentMode={setPaymentMode}
              splitWays={splitWays}
              setSplitWays={setSplitWays}
              finalTotal={finalTotal}
              setAmountToPay={setAmountToPay}
              setTableCardPaymentStep={setTableCardPaymentStep}
              guests={guests}
              orderItems={orderItems}
              splitChecks={splitChecks}
              setSplitChecks={setSplitChecks}
              activeSplitCheckId={activeSplitCheckId}
              setActiveSplitCheckId={setActiveSplitCheckId}
              assignItemToCheck={assignItemToCheck}
              unassignItemFromCheck={unassignItemFromCheck}
              addSplitCheck={addSplitCheck}
              activeSplitCheckTotal={activeSplitCheckTotal}
              activeSplitCheck={activeSplitCheck}
              totals={totals}
              serviceFeeName={serviceFeeName}
              taxRate={taxRate}
            />
          </div>
        </div>
      </div>
    );
  }

  if (tableCardPaymentStep !== 'NONE') {
    return (
      <TableTerminalTapModal
        tableCardPaymentStep={tableCardPaymentStep}
        setTableCardPaymentStep={setTableCardPaymentStep}
        tableSelectedTip={tableSelectedTip}
        setTableSelectedTip={setTableSelectedTip}
        amountToPay={amountToPay}
        total={total}
        gcCode={gcCode}
        setGcCode={setGcCode}
        gcError={gcError}
        setGcError={setGcError}
        handleGiftCardPay={handleGiftCardPay}
        handleCloseCheck={handleCloseCheck}
        paymentMode={paymentMode}
        setSplitChecks={setSplitChecks}
        activeSplitCheckId={activeSplitCheckId}
        setShowPayment={setShowPayment}
        tableName={activeTable?.name}
      />
    );
  }

  return null;
};
