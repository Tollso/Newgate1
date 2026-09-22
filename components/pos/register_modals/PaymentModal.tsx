import React from 'react';
import { X, CheckCircle } from 'lucide-react';
import { playBeep } from '../../../utils';
import { PaymentModalProps } from './split_payment/splitTypes';
import { PaymentLeftPanel } from './split_payment/PaymentLeftPanel';
import { SplitSetupView } from './split_payment/SplitSetupView';
import { PaymentMethodsView } from './split_payment/PaymentMethodsView';
import { CardTapView, TipPromptView, GiftCardView } from './split_payment/CardAndTipViews';
import { usePaymentModalState, getOrdinal } from './split_payment/usePaymentModalState';

export const PaymentModal: React.FC<PaymentModalProps> = ({
  total,
  cart,
  onClose,
  onPay,
  giftCards = [],
  setGiftCards,
  initialSplitMode = false,
}) => {
  const state = usePaymentModalState({ total, initialSplitMode, giftCards, setGiftCards, onPay });

  const handleSelectCard = (method: string = 'Card') => {
    state.setSelectedMethod(method);
    state.setView('CARD_TAP');
  };

  const handleClose = () => {
    playBeep('error');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in p-2 md:p-4">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-scale-in flex flex-col md:flex-row min-h-[540px]">
        <PaymentLeftPanel
          total={total}
          currentDue={state.currentDue}
          cart={cart}
          isSplitMode={state.isSplitMode}
          splitParts={state.splitParts}
          currentPartIndex={state.currentPartIndex}
          selectedTip={state.selectedTip}
          partialPaidMessage={state.partialPaidMessage}
          partialPayments={state.partialPayments}
          getOrdinal={getOrdinal}
        />

        <div className="flex-1 p-6 md:p-7 bg-slate-50 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-black text-slate-800 text-lg uppercase tracking-wide">
                  {state.view === 'SPLIT_SETUP' ? 'Split Order Setup' : state.isSplitMode ? `Take ${getOrdinal(state.currentPartIndex + 1)} Payment` : state.view === 'CARD_TAP' ? 'Tap Card' : state.view === 'TIP_PROMPT' ? 'Select Gratuity' : 'Select Payment Method'}
                </h3>
                {state.isSplitMode && state.view === 'METHODS' && (
                  <p className="text-xs text-indigo-600 font-bold mt-0.5">
                    Payment {state.currentPartIndex + 1} of {state.splitParts.length} • Amount: ${state.currentPayableAmount.toFixed(2)}
                  </p>
                )}
              </div>
              <button onClick={handleClose} className="p-1 hover:bg-slate-200 rounded-full transition-colors cursor-pointer">
                <X size={22} className="text-slate-400 hover:text-slate-600" />
              </button>
            </div>

            {state.statusNotification && (
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3 mb-4 text-xs font-bold text-indigo-900 flex items-center gap-2 animate-fade-in shadow-sm">
                <CheckCircle size={15} className="text-indigo-600 shrink-0" />
                <span>{state.statusNotification}</span>
              </div>
            )}
          </div>

          {state.view === 'SPLIT_SETUP' ? (
            <SplitSetupView
              total={total}
              splitCount={state.splitCount}
              splitParts={state.splitParts}
              onUpdateSplitCount={state.handleUpdateSplitCount}
              onSetSplitParts={state.setSplitParts}
              onStartSplitPayments={state.handleStartSplitPayments}
              onCancelSplit={() => { state.setIsSplitMode(false); state.setView('METHODS'); }}
              getOrdinal={getOrdinal}
            />
          ) : state.view === 'METHODS' ? (
            <PaymentMethodsView
              isSplitMode={state.isSplitMode}
              splitParts={state.splitParts}
              currentPartIndex={state.currentPartIndex}
              currentPayableAmount={state.currentPayableAmount}
              amountMode={state.amountMode}
              setAmountMode={state.setAmountMode}
              customAmount={state.customAmount}
              setCustomAmount={state.setCustomAmount}
              effectivePayAmount={state.effectivePayAmount}
              onSelectCard={handleSelectCard}
              onSelectCash={() => state.handleProcessPayment('Cash', 0)}
              onSelectGiftCard={() => state.setView('GIFT_CARD')}
              onInitiateSplit={state.handleInitiateSplit}
              onChangeSplit={() => state.setView('SPLIT_SETUP')}
              getOrdinal={getOrdinal}
            />
          ) : state.view === 'CARD_TAP' ? (
            <CardTapView
              isSplitMode={state.isSplitMode}
              currentPartIndex={state.currentPartIndex}
              currentPayableAmount={state.effectivePayAmount}
              getOrdinal={getOrdinal}
              onBack={() => state.setView('METHODS')}
              onCardTapped={() => { playBeep('success'); state.setView('TIP_PROMPT'); }}
            />
          ) : state.view === 'TIP_PROMPT' ? (
            <TipPromptView
              isSplitMode={state.isSplitMode}
              currentPartIndex={state.currentPartIndex}
              currentPayableAmount={state.effectivePayAmount}
              selectedTip={state.selectedTip}
              customTipInput={state.customTipInput}
              selectedMethod={state.selectedMethod}
              getOrdinal={getOrdinal}
              onSetSelectedTip={state.setSelectedTip}
              onSetCustomTipInput={state.setCustomTipInput}
              onCompletePayment={() => state.handleProcessPayment(state.selectedMethod, state.selectedTip)}
            />
          ) : (
            <GiftCardView
              isSplitMode={state.isSplitMode}
              currentPartIndex={state.currentPartIndex}
              currentPayableAmount={state.effectivePayAmount}
              gcCode={state.gcCode}
              gcError={state.gcError}
              getOrdinal={getOrdinal}
              onSetGcCode={(val) => { state.setGcCode(val); state.setGcError(''); }}
              onBack={() => state.setView('METHODS')}
              onProcessPay={state.handleGiftCardPay}
            />
          )}
        </div>
      </div>
    </div>
  );
};
