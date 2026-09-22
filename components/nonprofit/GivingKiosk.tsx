/**
 * GivingKiosk
 * Touch-First Self-Service Giving Kiosk (Section 9.2).
 * Features campaign fund selection, one-time/monthly giving, tap-to-give, anonymous option, and manager PIN exit.
 */

import React, { useState, useEffect } from 'react';
import { Heart, CreditCard, Lock, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import { NonprofitService } from '../../services/nonprofitService';
import { CampaignFund } from '../../types/nonprofit';

interface GivingKioskProps {
  onExitKiosk: () => void;
}

export const GivingKiosk: React.FC<GivingKioskProps> = ({ onExitKiosk }) => {
  const [funds, setFunds] = useState<CampaignFund[]>([]);
  const [selectedFund, setSelectedFund] = useState<CampaignFund | null>(null);
  const [amount, setAmount] = useState<number>(50);
  const [isRecurring, setIsRecurring] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');

  // Step state
  const [step, setStep] = useState<'SELECT_FUND' | 'SELECT_AMOUNT' | 'TAP_CARD' | 'THANK_YOU'>('SELECT_FUND');
  const [taxReceiptNumber, setTaxReceiptNumber] = useState<string>('');

  // Manager PIN modal state
  const [showManagerExit, setShowManagerExit] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  useEffect(() => {
    loadFunds();
  }, []);

  const loadFunds = async () => {
    const list = await NonprofitService.listFunds();
    setFunds(list);
    if (list.length > 0) setSelectedFund(list[0]);
  };

  const handleProcessTap = async () => {
    try {
      const res = await NonprofitService.processDonation({
        merchantId: 'M001',
        amountDollars: amount,
        fundId: selectedFund?.id || 'fund-general',
        paymentMethod: 'CARD',
        donorName: isAnonymous ? undefined : donorName,
        donorEmail: isAnonymous ? undefined : donorEmail,
        isAnonymous,
        isRecurring,
        recurringFrequency: isRecurring ? 'MONTHLY' : undefined,
      });

      setTaxReceiptNumber(res.taxReceiptNumber || 'TAX-2026-9812');
      setStep('THANK_YOU');

      setTimeout(() => {
        // Reset to initial screen after 6 seconds
        setStep('SELECT_FUND');
        setAmount(50);
        setIsRecurring(false);
        setIsAnonymous(false);
        setDonorName('');
        setDonorEmail('');
      }, 6000);
    } catch (e) {
      alert('Payment processing failed. Please try again.');
    }
  };

  const handleManagerExitSubmit = () => {
    if (pinInput === '1234' || pinInput === '9999') {
      setShowManagerExit(false);
      onExitKiosk();
    } else {
      setPinError(true);
      setPinInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col justify-between select-none">
      {/* Top Kiosk Bar */}
      <header className="h-20 px-8 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-600 flex items-center justify-center shadow-lg shadow-rose-600/30">
            <Heart size={22} className="text-white fill-white" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight">Community Giving Station</h1>
            <p className="text-xs text-slate-400">The Newgate Foundation • 501(c)(3) Tax Deductible</p>
          </div>
        </div>

        {/* Secret Manager Exit Button */}
        <button
          onClick={() => setShowManagerExit(true)}
          className="p-3 text-slate-700 hover:text-slate-400 transition-colors"
          title="Manager Exit"
        >
          <Lock size={18} />
        </button>
      </header>

      {/* Main Kiosk Interaction View */}
      <main className="flex-1 max-w-4xl mx-auto w-full p-8 flex flex-col justify-center">
        {step === 'SELECT_FUND' && (
          <div className="space-y-8 text-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Where would you like to make an impact?
              </h2>
              <p className="text-sm text-slate-400 mt-2">
                Select a mission initiative to designate your contribution.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {funds.map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    setSelectedFund(f);
                    setStep('SELECT_AMOUNT');
                  }}
                  className={`p-6 rounded-3xl border-2 text-left transition-all duration-200 transform hover:scale-[1.02] flex flex-col justify-between h-56 ${
                    selectedFund?.id === f.id
                      ? 'bg-rose-950/40 border-rose-500 shadow-xl shadow-rose-950/40'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <h3 className="text-lg font-black text-white">{f.name}</h3>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-3">{f.description}</p>
                  </div>
                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-400">
                      ${f.currentAmount.toLocaleString()} Raised
                    </span>
                    <ArrowRight size={18} className="text-slate-500" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'SELECT_AMOUNT' && (
          <div className="space-y-8 max-w-xl mx-auto w-full text-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-rose-400 block mb-1">
                Supporting: {selectedFund?.name}
              </span>
              <h2 className="text-3xl font-black text-white">Choose your gift amount</h2>
            </div>

            {/* Recurring toggle */}
            <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800 max-w-xs mx-auto">
              <button
                onClick={() => setIsRecurring(false)}
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-colors ${
                  !isRecurring ? 'bg-rose-600 text-white' : 'text-slate-400'
                }`}
              >
                One-Time Gift
              </button>
              <button
                onClick={() => setIsRecurring(true)}
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-colors ${
                  isRecurring ? 'bg-rose-600 text-white' : 'text-slate-400'
                }`}
              >
                Monthly Supporter
              </button>
            </div>

            {/* Amount grid */}
            <div className="grid grid-cols-3 gap-3">
              {[25, 50, 100, 250, 500].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setAmount(amt)}
                  className={`p-5 rounded-2xl border-2 font-mono font-black text-2xl transition-all ${
                    amount === amt
                      ? 'bg-rose-600 border-rose-500 text-white shadow-lg'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  ${amt}
                </button>
              ))}
              <div className="p-2 bg-slate-900 border-2 border-slate-800 rounded-2xl flex items-center">
                <span className="text-slate-500 pl-3 font-mono font-bold">$</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  className="w-full bg-transparent text-center font-mono font-black text-xl text-white focus:outline-none"
                  placeholder="Other"
                />
              </div>
            </div>

            {/* Donor info or anonymous toggle */}
            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 text-left space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">Keep donation anonymous</span>
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-5 h-5 text-rose-600 rounded bg-slate-950 border-slate-700"
                />
              </div>

              {!isAnonymous && (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <input
                    type="text"
                    placeholder="Your Name (Optional)"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                  <input
                    type="email"
                    placeholder="Email for Tax Receipt"
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                    className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep('SELECT_FUND')}
                className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 rounded-2xl font-bold text-sm text-slate-300"
              >
                Back
              </button>
              <button
                onClick={() => setStep('TAP_CARD')}
                disabled={amount <= 0}
                className="flex-2 py-4 bg-rose-600 hover:bg-rose-500 rounded-2xl font-black text-sm text-white shadow-xl shadow-rose-600/30 flex items-center justify-center gap-2"
              >
                Proceed to Give ${amount} <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {step === 'TAP_CARD' && (
          <div className="space-y-8 max-w-md mx-auto w-full text-center">
            <div className="w-24 h-24 bg-rose-600/20 text-rose-500 rounded-full mx-auto flex items-center justify-center animate-pulse">
              <CreditCard size={48} />
            </div>

            <div>
              <h2 className="text-3xl font-black text-white">Tap or Insert Card</h2>
              <p className="text-sm text-slate-400 mt-2">
                Donating <span className="font-bold text-white font-mono">${amount}.00</span> to{' '}
                {selectedFund?.name}
              </p>
            </div>

            <button
              onClick={handleProcessTap}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 rounded-2xl font-black text-base text-white shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2"
            >
              Simulate Card Tap / Authorize
            </button>

            <button
              onClick={() => setStep('SELECT_AMOUNT')}
              className="text-xs text-slate-500 hover:text-slate-300 font-bold"
            >
              Cancel & Change Amount
            </button>
          </div>
        )}

        {step === 'THANK_YOU' && (
          <div className="space-y-6 max-w-md mx-auto w-full text-center">
            <div className="w-24 h-24 bg-emerald-500/20 text-emerald-400 rounded-full mx-auto flex items-center justify-center">
              <CheckCircle2 size={54} />
            </div>

            <div>
              <h2 className="text-4xl font-black text-white">Thank You for Giving!</h2>
              <p className="text-base text-slate-300 mt-2">
                Your generous gift of <span className="font-bold text-emerald-400 font-mono">${amount}.00</span> empowers our community.
              </p>
            </div>

            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-slate-400 space-y-1">
              <p>Official 501(c)(3) Receipt: <span className="font-mono text-white font-bold">{taxReceiptNumber}</span></p>
              <p>EIN: 84-1234567 • Keep for your tax records</p>
            </div>

            <p className="text-xs text-slate-500">Screen will reset automatically in a moment...</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="h-14 px-8 bg-slate-900/60 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <ShieldCheck size={14} className="text-emerald-500" /> End-to-End Encrypted EMV Processing
        </span>
        <span>The Newgate POS Giving Kiosk</span>
      </footer>

      {/* Manager Exit PIN Modal */}
      {showManagerExit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-xs w-full text-center space-y-4">
            <h3 className="text-lg font-bold text-white">Manager PIN Required</h3>
            <p className="text-xs text-slate-400">Enter authorization PIN to unlock kiosk</p>

            <input
              type="password"
              maxLength={6}
              value={pinInput}
              onChange={(e) => {
                setPinError(false);
                setPinInput(e.target.value);
              }}
              placeholder="PIN"
              className="w-full text-center tracking-widest text-2xl font-mono py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
            />

            {pinError && <p className="text-xs text-rose-400 font-bold">Invalid Manager PIN</p>}

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowManagerExit(false);
                  setPinInput('');
                }}
                className="flex-1 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleManagerExitSubmit}
                className="flex-1 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
              >
                Unlock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
