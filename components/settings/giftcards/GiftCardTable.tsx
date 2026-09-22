import React from 'react';
import { Smartphone, CreditCard, Store, Eye } from 'lucide-react';
import { GiftCard } from './GiftCardTypes';

interface GiftCardTableProps {
  giftCards: GiftCard[];
  getBusinessName: (id: string) => string;
  onViewCard: (card: GiftCard) => void;
}

export const GiftCardTable: React.FC<GiftCardTableProps> = ({
  giftCards,
  getBusinessName,
  onViewCard,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="text-left py-3 px-4 text-xs font-black text-slate-500 uppercase tracking-wider">Card Number</th>
            <th className="text-left py-3 px-4 text-xs font-black text-slate-500 uppercase tracking-wider">Type</th>
            <th className="text-left py-3 px-4 text-xs font-black text-slate-500 uppercase tracking-wider">Store Restriction</th>
            <th className="text-right py-3 px-4 text-xs font-black text-slate-500 uppercase tracking-wider">Balance</th>
            <th className="text-left py-3 px-4 text-xs font-black text-slate-500 uppercase tracking-wider">Expires</th>
            <th className="text-left py-3 px-4 text-xs font-black text-slate-500 uppercase tracking-wider">Status</th>
            <th className="text-right py-3 px-4 text-xs font-black text-slate-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {giftCards.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-8 text-center text-slate-500 text-sm">
                No gift cards issued yet.
              </td>
            </tr>
          ) : (
            giftCards.map(card => (
              <tr key={card.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-3 px-4">
                  <div className="font-mono text-sm font-bold text-slate-800">{card.code}</div>
                  <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500 mt-0.5">
                    <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">CVV: {card.securityCode || '---'}</span>
                    {card.customerName && <span>• {card.customerName}</span>}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1.5 text-sm text-slate-600">
                    {card.type === 'Digital' ? <Smartphone size={14} className="text-blue-500" /> : <CreditCard size={14} className="text-orange-500" />}
                    {card.type}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1.5 text-sm text-slate-600">
                    <Store size={14} className="text-slate-400" />
                    {getBusinessName(card.businessId)}
                  </div>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="font-bold text-slate-900">${card.balance.toFixed(2)}</div>
                  <div className="text-xs text-slate-500">of ${card.initialBalance.toFixed(2)}</div>
                </td>
                <td className="py-3 px-4 text-left">
                  <div className="text-sm font-bold text-slate-600">
                    {card.expirationDate ? new Date(card.expirationDate).toLocaleDateString() : 'Never'}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className={`inline-flex px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                    card.status === 'Active' ? 'bg-emerald-100 text-emerald-700' :
                    card.status === 'Redeemed' ? 'bg-slate-100 text-slate-600' :
                    'bg-rose-100 text-rose-700'
                  }`}>
                    {card.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button 
                    onClick={() => onViewCard(card)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    title="View / Print Card"
                  >
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
