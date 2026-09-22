import React from 'react';
import { Smartphone, CreditCard, Store, X } from 'lucide-react';
import { NewGiftCardForm } from './GiftCardTypes';
import { GiftCardIssueCustomerFields } from './GiftCardIssueCustomerFields';

interface GiftCardIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  validationError: string;
  newCard: NewGiftCardForm;
  setNewCard: React.Dispatch<React.SetStateAction<NewGiftCardForm>>;
  businesses: any[];
  onIssueCard: () => void;
}

export const GiftCardIssueModal: React.FC<GiftCardIssueModalProps> = ({
  isOpen,
  onClose,
  validationError,
  newCard,
  setNewCard,
  businesses,
  onIssueCard,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl border border-slate-200">
        <div className="p-4 sm:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="text-lg font-black text-slate-900">Issue Gift Card</h3>
            <p className="text-xs text-slate-500 mt-1">Generate a new store-specific gift card</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {validationError && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm font-bold flex items-start gap-2">
              <span className="mt-0.5 shrink-0">⚠️</span>
              <span>{validationError}</span>
            </div>
          )}
          
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Card Type</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setNewCard({ ...newCard, type: 'Digital' })}
                className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${
                  newCard.type === 'Digital' 
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                    : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                }`}
              >
                <Smartphone size={24} />
                <span className="text-sm font-bold">Digital (Email/SMS)</span>
              </button>
              <button
                onClick={() => setNewCard({ ...newCard, type: 'Physical' })}
                className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${
                  newCard.type === 'Physical' 
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                    : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                }`}
              >
                <CreditCard size={24} />
                <span className="text-sm font-bold">Physical (Print)</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
              <input
                type="number"
                value={newCard.balance}
                onChange={(e) => setNewCard({ ...newCard, balance: parseFloat(e.target.value) || 0 })}
                className="w-full pl-7 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
            <div className="flex gap-2 mt-2">
              {[25, 50, 100].map(amt => (
                <button
                  key={amt}
                  onClick={() => setNewCard({ ...newCard, balance: amt })}
                  className="flex-1 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors"
                >
                  ${amt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Store Restriction</label>
            <select
              value={newCard.businessId}
              onChange={(e) => setNewCard({ ...newCard, businessId: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            >
              {businesses.map((b: any) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
            <p className="text-xs text-slate-500 mt-1.5 flex items-start gap-1">
              <Store size={12} className="mt-0.5 shrink-0" />
              Card will ONLY be valid at this specific location.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Expiration</label>
            <select
              value={newCard.expirationMode}
              onChange={(e) => setNewCard({ ...newCard, expirationMode: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            >
              <option value="6 Months">6 Months (Default)</option>
              <option value="15 Days">15 Days</option>
              <option value="1 Month">1 Month</option>
              <option value="3 Months">3 Months</option>
              <option value="1 Year">1 Year</option>
              <option value="Custom Date">Custom Date (Pick from calendar)</option>
              <option value="Never">Never Expires</option>
            </select>

            {newCard.expirationMode === 'Custom Date' && (
              <div className="mt-3">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Select Custom Date</label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={newCard.customExpirationDate}
                  onChange={(e) => setNewCard({ ...newCard, customExpirationDate: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
            )}
          </div>

          <GiftCardIssueCustomerFields newCard={newCard} setNewCard={setNewCard} />
        </div>
        
        <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-slate-600 font-bold text-sm hover:bg-slate-200 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={onIssueCard}
            className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors shadow-sm"
          >
            Generate Card
          </button>
        </div>
      </div>
    </div>
  );
};
