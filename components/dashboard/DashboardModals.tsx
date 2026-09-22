import React from 'react';
import { Zap, X, CheckCircle, Award, Building2 } from 'lucide-react';

interface DashboardModalsProps {
  showInstantDepositModal: boolean;
  setShowInstantDepositModal: (show: boolean) => void;
  depositSuccess: boolean;
  instantDepositAmount: number;
  handleInstantDeposit: () => void;
  showTimeFilterModal: boolean;
  setShowTimeFilterModal: (show: boolean) => void;
  timeFilter: string;
  setTimeFilter: (tf: string) => void;
  showVoteModal: boolean;
  setShowVoteModal: (show: boolean) => void;
  showCapitalModal: boolean;
  setShowCapitalModal: (show: boolean) => void;
}

export const DashboardModals: React.FC<DashboardModalsProps> = ({
  showInstantDepositModal,
  setShowInstantDepositModal,
  depositSuccess,
  instantDepositAmount,
  handleInstantDeposit,
  showTimeFilterModal,
  setShowTimeFilterModal,
  timeFilter,
  setTimeFilter,
  showVoteModal,
  setShowVoteModal,
  showCapitalModal,
  setShowCapitalModal
}) => {
  return (
    <>
      {/* MODAL 1: Instant Deposit Modal */}
      {showInstantDepositModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-100 animate-scale-in">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 bg-orange-100 text-orange-600 rounded-xl">
                  <Zap size={22} />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900">Instant Deposit</h3>
              </div>
              <button onClick={() => setShowInstantDepositModal(false)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
                <X size={20} />
              </button>
            </div>

            {depositSuccess ? (
              <div className="text-center py-8 space-y-3 animate-fade-in">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle size={36} />
                </div>
                <h4 className="text-lg font-bold text-slate-900">Transfer Initiated!</h4>
                <p className="text-xs text-slate-500 font-medium">
                  ${instantDepositAmount.toFixed(2)} is being sent directly to your linked business bank account.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 text-center">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Available Balance</span>
                  <span className="text-4xl font-black text-slate-900">${instantDepositAmount.toFixed(2)}</span>
                  <span className="text-xs text-emerald-600 font-semibold block mt-1">Ready for immediate transfer</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100 text-slate-600">
                    <span>Destination</span>
                    <span className="font-bold text-slate-800">Chase Business (•••• 4821)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 text-slate-600">
                    <span>Speed</span>
                    <span className="font-bold text-emerald-600">Instant (Within 30 mins)</span>
                  </div>
                  <div className="flex justify-between py-1 text-slate-600">
                    <span>Processing Fee (1%)</span>
                    <span className="font-mono font-bold text-slate-800">${(instantDepositAmount * 0.01).toFixed(2)}</span>
                  </div>
                </div>

                <button 
                  onClick={handleInstantDeposit}
                  className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-black uppercase tracking-wider text-sm shadow-lg shadow-orange-200 transition-all cursor-pointer"
                >
                  Transfer ${instantDepositAmount.toFixed(2)} Now
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: Time Filter Modal */}
      {showTimeFilterModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-slate-100 animate-scale-in">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold text-slate-900">Select Time Comparison</h3>
              <button onClick={() => setShowTimeFilterModal(false)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-2">
              {[
                'Today vs. Yesterday',
                'This Week vs. Last Week',
                'This Month vs. Last Month',
                'Last 30 Days vs. Prior Period',
                'Custom Range'
              ].map(option => (
                <button
                  key={option}
                  onClick={() => {
                    setTimeFilter(option);
                    setShowTimeFilterModal(false);
                  }}
                  className={`w-full text-left p-3.5 rounded-xl font-bold text-xs transition-all flex items-center justify-between ${
                    timeFilter === option ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{option}</span>
                  {timeFilter === option && <CheckCircle size={16} />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Vote / Awards Modal */}
      {showVoteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-100 animate-scale-in text-center space-y-4">
            <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto">
              <Award size={32} />
            </div>
            <h3 className="text-xl font-black text-slate-900">2026 TableHere Community Awards</h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Cast your vote for local restaurant excellence on tablehere.com. Your submission helps shine a spotlight on top culinary teams across the region!
            </p>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-left text-xs space-y-2">
              <p className="font-bold text-slate-800">Nominated Categories:</p>
              <p className="text-slate-600">🥇 Best Local Dining Experience</p>
              <p className="text-slate-600">⚡ Fastest Table Turnaround</p>
              <p className="text-slate-600">🌟 Hospitality Innovation</p>
            </div>
            <button 
              onClick={() => {
                alert("Thank you for voting on tablehere.com!");
                setShowVoteModal(false);
              }}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-xs uppercase tracking-wider shadow-md"
            >
              Submit Vote
            </button>
          </div>
        </div>
      )}

      {/* MODAL 4: Financial Offers / Capital Modal */}
      {showCapitalModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-slate-100 animate-scale-in space-y-5">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Building2 size={24} className="text-orange-600" />
                <h3 className="text-xl font-black text-slate-900">Byte Capital Pre-Approvals</h3>
              </div>
              <button onClick={() => setShowCapitalModal(false)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <p className="text-xs text-slate-600 font-medium">
              Based on your steady sales volume over the past 90 days, you are pre-approved for flexible working capital:
            </p>

            <div className="space-y-3">
              <div className="p-4 bg-orange-50/80 border border-orange-200 rounded-2xl flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-black uppercase text-orange-800">Growth Loan</span>
                  <p className="text-lg font-black text-slate-900">$199,700 Offer</p>
                  <p className="text-[11px] text-slate-500">Fixed rate discount applied • Auto-repaid via daily sales %</p>
                </div>
                <button 
                  onClick={() => alert("Application started! Our team will contact you shortly.")}
                  className="px-4 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-orange-700"
                >
                  Apply
                </button>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-500">Instant Deposit Account</span>
                  <p className="text-lg font-black text-slate-900">1.0% Rate</p>
                  <p className="text-[11px] text-slate-500">Real-time access to batch payouts including weekends</p>
                </div>
                <button 
                  onClick={() => alert("Instant Deposit configured!")}
                  className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-slate-900"
                >
                  Activate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
