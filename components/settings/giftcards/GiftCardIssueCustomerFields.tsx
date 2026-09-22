import React from 'react';
import { NewGiftCardForm } from './GiftCardTypes';

interface GiftCardIssueCustomerFieldsProps {
  newCard: NewGiftCardForm;
  setNewCard: React.Dispatch<React.SetStateAction<NewGiftCardForm>>;
}

export const GiftCardIssueCustomerFields: React.FC<GiftCardIssueCustomerFieldsProps> = ({
  newCard,
  setNewCard,
}) => {
  if (newCard.type === 'Digital') {
    return (
      <div className="space-y-3 pt-2 border-t border-slate-100">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Customer Name (Optional)</label>
          <input
            type="text"
            value={newCard.customerName}
            onChange={(e) => setNewCard({ ...newCard, customerName: e.target.value })}
            placeholder="e.g. Jane Doe"
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Customer Email (Optional)</label>
          <input
            type="email"
            value={newCard.customerEmail}
            onChange={(e) => setNewCard({ ...newCard, customerEmail: e.target.value })}
            placeholder="e.g. jane@example.com"
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
          <label className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              checked={newCard.sendViaEmail}
              onChange={e => setNewCard({ ...newCard, sendViaEmail: e.target.checked })}
              className="rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
            />
            <span className="text-xs text-slate-700 font-medium">Send via Email</span>
          </label>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Customer Phone (Optional)</label>
          <input
            type="tel"
            value={newCard.customerPhone}
            onChange={(e) => setNewCard({ ...newCard, customerPhone: e.target.value })}
            placeholder="e.g. 555-0100"
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
          <label className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              checked={newCard.sendViaSms}
              onChange={e => setNewCard({ ...newCard, sendViaSms: e.target.checked })}
              className="rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
            />
            <span className="text-xs text-slate-700 font-medium">Send via SMS</span>
          </label>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 pt-2 border-t border-slate-100">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Manual 16-Digit Card #</label>
          <input
            type="text"
            value={newCard.manualCode}
            onChange={(e) => setNewCard({ ...newCard, manualCode: e.target.value })}
            placeholder="Auto-generated if blank"
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Security Code / CVV</label>
          <input
            type="text"
            maxLength={4}
            value={newCard.manualSecurityCode}
            onChange={(e) => setNewCard({ ...newCard, manualSecurityCode: e.target.value })}
            placeholder="Auto-gen (3-digit)"
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono"
          />
        </div>
      </div>
      <p className="text-xs text-slate-500">If using pre-printed cards, enter the card number and security PIN above.</p>
    </div>
  );
};
