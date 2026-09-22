import React, { useState } from 'react';
import { Globe, HeartHandshake, PackageCheck, Smartphone } from 'lucide-react';

interface EditorProps {
  categoryId: string;
  selectedPageId: string | null;
  onFieldChange: () => void;
}

export const EcommerceAndLoyaltyEditor: React.FC<EditorProps> = ({
  categoryId,
  selectedPageId,
  onFieldChange
}) => {
  const [leadTimeMinutes, setLeadTimeMinutes] = useState(25);
  const [loyaltyPointsDollar, setLoyaltyPointsDollar] = useState(1);

  if (categoryId === 'online_ecommerce') {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-indigo-600 font-bold">
            <Globe size={18} />
            <h3 className="text-sm uppercase tracking-wider text-slate-800">13. Online Storefront & Throttling Controls</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Standard Online Prep Lead Time (Minutes)</label>
              <input
                type="number"
                value={leadTimeMinutes}
                onChange={(e) => { setLeadTimeMinutes(Number(e.target.value)); onFieldChange(); }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Max Online Orders Per 15-Minute Slot</label>
              <input
                type="number"
                defaultValue={12}
                onChange={onFieldChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-indigo-600 font-bold">
          <HeartHandshake size={18} />
          <h3 className="text-sm uppercase tracking-wider text-slate-800">14. Customer Loyalty Program & Rewards Earning Rules</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Loyalty Earning Basis (Points per $1 spent)</label>
            <input
              type="number"
              value={loyaltyPointsDollar}
              onChange={(e) => { setLoyaltyPointsDollar(Number(e.target.value)); onFieldChange(); }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Redemption Threshold</label>
            <input
              type="text"
              defaultValue="100 Points = $10 Reward Voucher"
              onChange={onFieldChange}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
