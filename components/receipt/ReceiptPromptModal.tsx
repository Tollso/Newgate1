import React, { useState } from 'react';
import { CheckCircle2, Loader2, ArrowRight, X } from 'lucide-react';
import { ReceiptPromptModalProps, ReceiptDeliveryOption } from './receiptTypes';
import { ReceiptActionButtons } from './ReceiptActionButtons';
import { ReceiptDeliveryService } from './receiptService';
import { playBeep } from '../../utils';

export const ReceiptPromptModal: React.FC<ReceiptPromptModalProps> = ({
  isOpen,
  orderContext,
  onComplete,
  onClose
}) => {
  const [selectedOption, setSelectedOption] = useState<ReceiptDeliveryOption | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectOption = (option: ReceiptDeliveryOption) => {
    setSelectedOption(option);
    setErrorMessage(null);

    if (option === 'PRINT' || option === 'NONE') {
      finalizeDelivery(option);
    } else if (option === 'EMAIL') {
      setInputValue(orderContext.customerEmail || '');
    } else if (option === 'SMS') {
      setInputValue(orderContext.customerPhone || '');
    }
  };

  const finalizeDelivery = async (option: ReceiptDeliveryOption, destination?: string) => {
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const result = await ReceiptDeliveryService.deliverReceipt(option, orderContext, destination);
      playBeep('success');
      setSuccessMessage(result.message);

      setTimeout(() => {
        onComplete(option, destination);
      }, 1000);
    } catch (err: any) {
      playBeep('error');
      setErrorMessage(err.message || 'Failed to dispatch receipt');
      setIsProcessing(false);
    }
  };

  const handleSubmitContactForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOption) return;

    if (selectedOption === 'EMAIL') {
      if (!inputValue.includes('@') || !inputValue.includes('.')) {
        setErrorMessage('Please enter a valid email address');
        return;
      }
    } else if (selectedOption === 'SMS') {
      const digits = inputValue.replace(/\D/g, '');
      if (digits.length < 10) {
        setErrorMessage('Please enter a valid 10-digit phone number');
        return;
      }
    }

    finalizeDelivery(selectedOption, inputValue);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/75 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl animate-scale-in border border-slate-100 flex flex-col relative">
        {onClose && !isProcessing && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X size={20} />
          </button>
        )}

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
            <CheckCircle2 size={36} />
          </div>
          <span className="text-[11px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block mb-1">
            Card Company Payment Received
          </span>
          <h2 className="text-2xl font-black text-slate-900 mt-1">How would you like your receipt?</h2>
          <div className="flex items-center justify-center gap-2 text-sm text-slate-500 font-semibold mt-1">
            <span>Total Paid: <strong className="text-slate-900">${orderContext.total.toFixed(2)}</strong></span>
            <span>•</span>
            <span>{orderContext.paymentMethod}</span>
          </div>
        </div>

        {successMessage ? (
          <div className="py-8 text-center space-y-3 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={28} />
            </div>
            <h3 className="font-bold text-slate-900 text-lg">{successMessage}</h3>
            <p className="text-xs text-indigo-600 font-bold animate-pulse">
              Returning to {orderContext.appName}...
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <ReceiptActionButtons
              onSelectOption={handleSelectOption}
              activeOption={selectedOption}
              isProcessing={isProcessing}
            />

            {(selectedOption === 'EMAIL' || selectedOption === 'SMS') && (
              <form onSubmit={handleSubmitContactForm} className="mt-4 pt-4 border-t border-slate-100 space-y-3 animate-fade-in">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  {selectedOption === 'EMAIL' ? 'Enter Customer Email Address' : 'Enter Customer Mobile Number'}
                </label>
                <div className="flex gap-2">
                  <input
                    type={selectedOption === 'EMAIL' ? 'email' : 'tel'}
                    value={inputValue}
                    onChange={(e) => { setInputValue(e.target.value); setErrorMessage(null); }}
                    placeholder={selectedOption === 'EMAIL' ? 'guest@example.com' : '(555) 000-0000'}
                    className="flex-1 px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl font-bold text-slate-800 text-sm focus:border-indigo-600 outline-none"
                    autoFocus
                    required
                  />
                  <button
                    type="submit"
                    disabled={isProcessing || !inputValue.trim()}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-1.5 transition-colors shadow-md"
                  >
                    {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <span>Send</span>}
                    <ArrowRight size={16} />
                  </button>
                </div>
                {errorMessage && (
                  <p className="text-xs text-red-600 font-bold">{errorMessage}</p>
                )}
              </form>
            )}

            {isProcessing && !successMessage && (
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-500 pt-2">
                <Loader2 size={16} className="animate-spin text-indigo-600" />
                <span>Processing receipt preference...</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
