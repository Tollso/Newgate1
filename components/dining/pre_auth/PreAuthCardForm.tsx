import React from 'react';
import { User, CreditCard, Database } from 'lucide-react';

interface PreAuthCardFormProps {
  cardName: string;
  setCardName: (v: string) => void;
  cardLast4: string;
  setCardLast4: (v: string) => void;
  cardBrand: string;
  setCardBrand: (v: string) => void;
  storeCardData: boolean;
  setStoreCardData: (v: boolean) => void;
  tableName: string;
}

export const PreAuthCardForm: React.FC<PreAuthCardFormProps> = ({
  cardName,
  setCardName,
  cardLast4,
  setCardLast4,
  cardBrand,
  setCardBrand,
  storeCardData,
  setStoreCardData,
  tableName,
}) => {
  const cardBrands = ['Visa', 'Mastercard', 'Amex'];

  return (
    <>
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
          Cardholder & Brand
        </label>
        <div className="grid grid-cols-12 gap-2 mb-2">
          <div className="col-span-8 relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              placeholder="Cardholder Name"
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="col-span-4 relative">
            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              maxLength={4}
              value={cardLast4}
              onChange={(e) => setCardLast4(e.target.value)}
              placeholder="Last 4"
              className="w-full pl-9 pr-2 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
        <div className="flex gap-2">
          {cardBrands.map((brand) => (
            <button
              key={brand}
              type="button"
              onClick={() => setCardBrand(brand)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                cardBrand === brand
                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2">
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={storeCardData}
            onChange={(e) => setStoreCardData(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
          />
          <div>
            <span className="font-black text-xs text-slate-800 block flex items-center gap-1.5">
              <Database size={14} className="text-blue-600" /> Store Card Data on File
            </span>
            <span className="text-[11px] font-medium text-slate-500 block mt-0.5">
              Keeps pre-authorized card attached to Table {tableName} tab. Clicking Pay directly presents this saved card for 1-click checkout.
            </span>
          </div>
        </label>
      </div>
    </>
  );
};
