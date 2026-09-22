/**
 * NonprofitPOS
 * First-class Nonprofit Register (Section 9).
 * Supports Merchandise Sale + Charitable Donation combined checkouts and 501(c)(3) tax receipts.
 */

import React, { useState, useEffect } from 'react';
import {
  Heart,
  CreditCard,
  DollarSign,
  Search,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  FileCheck,
  UserCheck,
  Building,
} from 'lucide-react';
import { NonprofitService } from '../../services/nonprofitService';
import { CampaignFund, Donor } from '../../types/nonprofit';
import { Employee } from '../../types/business';
import { Money } from '../../src/domain/money';

interface NonprofitPOSProps {
  currentUser: Employee;
  onExit: () => void;
}

export const NonprofitPOS: React.FC<NonprofitPOSProps> = ({ currentUser, onExit }) => {
  const [funds, setFunds] = useState<CampaignFund[]>([]);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [selectedFundId, setSelectedFundId] = useState<string>('fund-general');
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);

  // Sale items
  const [items, setItems] = useState([
    { id: 'item-1', name: 'Annual Gala Ticket', price: 75.00, quantity: 1 },
    { id: 'item-2', name: 'Mission T-Shirt & Pin', price: 25.00, quantity: 0 },
    { id: 'item-3', name: 'Charity Cook Book', price: 20.00, quantity: 0 },
  ]);

  // Donation add-on
  const [donationAmount, setDonationAmount] = useState<number>(50.00);
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Checkout state
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [completedReceipt, setCompletedReceipt] = useState<{
    taxReceiptNumber?: string;
    saleTotal: number;
    donationTotal: number;
    total: number;
  } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const fList = await NonprofitService.listFunds();
    setFunds(fList);
    const dList = await NonprofitService.listDonors();
    setDonors(dList);
  };

  const saleSubtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const grandTotal = saleSubtotal + donationAmount;

  const handleProcessCheckout = async (paymentMethod: 'CARD' | 'CASH') => {
    setIsCheckingOut(true);
    try {
      const result = await NonprofitService.processCombinedSaleAndDonation({
        merchantId: 'M001',
        saleAmount: saleSubtotal,
        donationAmount,
        totalAmount: grandTotal,
        fundId: selectedFundId,
        donorId: selectedDonor?.id,
        paymentMethod,
        isAnonymous,
      });

      setCompletedReceipt({
        taxReceiptNumber: result.taxReceiptNumber,
        saleTotal: result.saleAmount,
        donationTotal: result.donationAmount,
        total: result.totalPaid,
      });
    } catch (e: any) {
      alert(e.message || 'Payment processing failed');
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="h-screen bg-slate-950 text-slate-100 flex flex-col overflow-hidden">
      {/* Top Header */}
      <header className="h-16 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <button
            onClick={onExit}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-lg font-black text-white flex items-center gap-2">
              <Heart className="text-rose-500 fill-rose-500" size={18} />
              Nonprofit Giving & Sales Register
            </h1>
            <p className="text-xs text-slate-400">Combined Charitable Giving & Merchandise Sales</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-xs font-semibold px-2.5 py-1 bg-rose-950/60 border border-rose-800/80 text-rose-300 rounded-full">
            501(c)(3) Tax-Deductible Mode
          </span>
          <span className="text-xs text-slate-400 font-mono">Operator: {currentUser.name}</span>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Merchandise & Donor Selection */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {/* Donor Identification Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck className="text-indigo-400" size={20} />
                <h3 className="font-bold text-sm text-white">Donor / Supporter Record</h3>
              </div>
              {selectedDonor && (
                <button
                  onClick={() => setSelectedDonor(null)}
                  className="text-xs text-rose-400 hover:text-rose-300 font-semibold"
                >
                  Detach Donor
                </button>
              )}
            </div>

            {selectedDonor ? (
              <div className="p-4 bg-indigo-950/40 border border-indigo-800/60 rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-white text-base block">
                    {selectedDonor.type === 'ORGANIZATION'
                      ? selectedDonor.organizationName
                      : `${selectedDonor.firstName} ${selectedDonor.lastName}`}
                  </span>
                  <span className="text-xs text-slate-400 block">{selectedDonor.email} • {selectedDonor.phone}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-indigo-300 font-semibold block">Lifetime Giving</span>
                  <span className="text-base font-black text-white font-mono">
                    ${selectedDonor.lifetimeGivingTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {donors.map(d => (
                  <button
                    key={d.id}
                    onClick={() => setSelectedDonor(d)}
                    className="p-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 rounded-xl text-left transition-colors"
                  >
                    <span className="font-bold text-xs text-white block">
                      {d.type === 'ORGANIZATION' ? d.organizationName : `${d.firstName} ${d.lastName}`}
                    </span>
                    <span className="text-[11px] text-slate-400 block truncate">{d.email}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Campaign Fund Selection */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Building className="text-amber-400" size={20} />
              <h3 className="font-bold text-sm text-white">Designated Campaign Fund</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {funds.map(f => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFundId(f.id)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    selectedFundId === f.id
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg'
                      : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white'
                  }`}
                >
                  <span className="font-bold text-xs block">{f.name}</span>
                  <span className="text-[11px] opacity-80 block mt-1">
                    Progress: ${f.currentAmount.toLocaleString()} / ${f.targetGoal.toLocaleString()}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Sale Items / Event Tickets */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="font-bold text-sm text-white">Event Tickets & Merchandise</h3>
            <div className="space-y-2">
              {items.map(item => (
                <div
                  key={item.id}
                  className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/50 flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-xs text-white block">{item.name}</span>
                    <span className="text-xs text-indigo-400 font-mono">${item.price.toFixed(2)} each</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        setItems(prev =>
                          prev.map(i => (i.id === item.id ? { ...i, quantity: Math.max(0, i.quantity - 1) } : i))
                        )
                      }
                      className="p-1 bg-slate-700 hover:bg-slate-600 rounded text-slate-200"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center font-bold font-mono text-sm">{item.quantity}</span>
                    <button
                      onClick={() =>
                        setItems(prev =>
                          prev.map(i => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i))
                        )
                      }
                      className="p-1 bg-slate-700 hover:bg-slate-600 rounded text-slate-200"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Donation Preset & Summary */}
        <div className="w-96 bg-slate-900 border-l border-slate-800 flex flex-col justify-between overflow-hidden shrink-0">
          <div className="p-6 space-y-5 overflow-y-auto">
            {/* Charitable Gift Amount Box */}
            <div className="bg-slate-800/80 border border-rose-500/30 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1">
                  <Heart size={14} /> Charitable Donation
                </span>
                <span className="text-[10px] bg-rose-950 text-rose-300 px-2 py-0.5 rounded-full font-bold">
                  100% Tax Deductible
                </span>
              </div>

              {/* Amount buttons */}
              <div className="grid grid-cols-4 gap-2">
                {[25, 50, 100, 250].map(amt => (
                  <button
                    key={amt}
                    onClick={() => setDonationAmount(amt)}
                    className={`py-2 rounded-lg font-mono font-bold text-xs transition-colors ${
                      donationAmount === amt
                        ? 'bg-rose-600 text-white'
                        : 'bg-slate-900 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    ${amt}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Custom Donation Amount ($)</label>
                <input
                  type="number"
                  min="0"
                  step="5"
                  value={donationAmount}
                  onChange={e => setDonationAmount(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white font-mono"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="anonCheck"
                  checked={isAnonymous}
                  onChange={e => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4 text-rose-600 rounded border-slate-600 bg-slate-900"
                />
                <label htmlFor="anonCheck" className="text-xs text-slate-300">
                  Keep donation anonymous on public leaderboards
                </label>
              </div>
            </div>

            {/* Reconciliation breakdown */}
            <div className="space-y-2 text-xs text-slate-400 pt-2 border-t border-slate-800">
              <div className="flex justify-between">
                <span>Merchandise & Tickets (Sales)</span>
                <span>${saleSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-rose-400 font-semibold">
                <span>Charitable Gift (Tax-Deductible)</span>
                <span>${donationAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-black text-white pt-2 border-t border-slate-800">
                <span>Total Payment</span>
                <span className="font-mono text-emerald-400">${grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Bottom Action */}
          <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleProcessCheckout('CARD')}
                disabled={grandTotal <= 0}
                className="py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <CreditCard size={16} /> Pay Card
              </button>
              <button
                onClick={() => handleProcessCheckout('CASH')}
                disabled={grandTotal <= 0}
                className="py-3 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <DollarSign size={16} /> Pay Cash
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Completed 501(c)(3) Receipt Modal */}
      {completedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-emerald-500 rounded-2xl w-full max-w-md p-6 space-y-5 text-center shadow-2xl">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full mx-auto flex items-center justify-center">
              <FileCheck size={36} />
            </div>

            <div>
              <h3 className="text-xl font-black text-white">Payment & Gift Completed</h3>
              <p className="text-xs text-slate-400">Canonical 501(c)(3) Contribution Logged</p>
            </div>

            <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Tax Receipt #:</span>
                <span className="font-mono font-bold text-white">{completedReceipt.taxReceiptNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Organization EIN:</span>
                <span className="font-mono text-white">84-1234567</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Deductible Gift:</span>
                <span className="font-mono font-bold text-emerald-400">
                  ${completedReceipt.donationTotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Merchandise Sale:</span>
                <span className="font-mono text-white">${completedReceipt.saleTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setCompletedReceipt(null);
                setDonationAmount(50);
                setItems(prev => prev.map(i => ({ ...i, quantity: 0 })));
              }}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs"
            >
              Start New Transaction
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
