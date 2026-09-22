import React, { useState } from 'react';
import { Globe, CheckCircle2, ShoppingBag, Clock, DollarSign } from 'lucide-react';

interface EcommerceSettingsSectionProps {
  renderSectionHeader: (title: string, description: string, parentSection?: string) => React.ReactNode;
  onlineStoreSettings: any;
  setOnlineStoreSettings: (val: any) => void;
}

export const EcommerceSettingsSection: React.FC<EcommerceSettingsSectionProps> = ({
  renderSectionHeader,
  onlineStoreSettings,
  setOnlineStoreSettings
}) => {
  const [toast, setToast] = useState<string | null>(null);

  const [prepTime, setPrepTime] = useState<number>(20);
  const [minDelivery, setMinDelivery] = useState<number>(25);
  const [deliveryFee, setDeliveryFee] = useState<number>(4.99);
  const [scheduledPickup, setScheduledPickup] = useState<boolean>(true);

  const handleSave = () => {
    setToast("Ecommerce and online store settings updated!");
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="max-w-4xl animate-fade-in pb-20 space-y-8">
      {renderSectionHeader("Ecommerce & Online Ordering", "Configure your hosted web store, online pickup, delivery fee rules, and brand presence.")}

      {toast && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 text-sm font-bold animate-fade-in">
          <CheckCircle2 size={18} /> {toast}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-8">
        <div>
          <h4 className="font-bold text-slate-800 text-sm uppercase tracking-widest mb-4">Online Ordering Channel Mode</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {['Branded website', 'Embedded order widget', 'QR Menu Only'].map(mode => (
              <div
                key={mode}
                onClick={() => setOnlineStoreSettings({ ...onlineStoreSettings, onlineOrderingType: mode })}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  onlineStoreSettings.onlineOrderingType === mode
                    ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Globe size={18} className="text-indigo-600" />
                  <span className="font-bold text-xs uppercase">{mode}</span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium">
                  {mode === 'Branded website' ? 'Full custom web domain & menu' : mode === 'Embedded order widget' ? 'Embed checkout widget into existing site' : 'Direct mobile QR digital ordering'}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h4 className="font-bold text-slate-800 text-sm uppercase tracking-widest">Brand Branding & Store Header</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Store Subdomain</label>
              <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-slate-50">
                <input
                  type="text"
                  value={onlineStoreSettings.domainName || 'lumirestaurant'}
                  onChange={e => setOnlineStoreSettings({ ...onlineStoreSettings, domainName: e.target.value })}
                  className="flex-1 px-4 py-2.5 text-sm font-bold bg-white outline-none"
                />
                <span className="px-3 text-xs font-bold text-slate-400">.bytepos.app</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Hero Button Label</label>
              <input
                type="text"
                value={onlineStoreSettings.actionButtonText || 'Order Online'}
                onChange={e => setOnlineStoreSettings({ ...onlineStoreSettings, actionButtonText: e.target.value })}
                className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-bold bg-white outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Welcome Announcement Banner</label>
            <input
              type="text"
              value={onlineStoreSettings.welcomeMessage || ''}
              onChange={e => setOnlineStoreSettings({ ...onlineStoreSettings, welcomeMessage: e.target.value })}
              className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-bold bg-white outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h4 className="font-bold text-slate-800 text-sm uppercase tracking-widest">Pickup & Delivery Timings</h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Estimated Prep Time (Mins)</label>
              <div className="relative">
                <input
                  type="number"
                  value={prepTime}
                  onChange={e => setPrepTime(parseInt(e.target.value) || 0)}
                  className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-bold bg-white outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <Clock size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Min Delivery Order ($)</label>
              <div className="relative">
                <input
                  type="number"
                  value={minDelivery}
                  onChange={e => setMinDelivery(parseFloat(e.target.value) || 0)}
                  className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-bold bg-white outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <DollarSign size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Flat Delivery Fee ($)</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.50"
                  value={deliveryFee}
                  onChange={e => setDeliveryFee(parseFloat(e.target.value) || 0)}
                  className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-bold bg-white outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <DollarSign size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
          </div>

          <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
            <input
              type="checkbox"
              checked={scheduledPickup}
              onChange={e => setScheduledPickup(e.target.checked)}
              className="h-5 w-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
            />
            <div>
              <span className="text-xs font-bold text-slate-800 block">Allow Customers to Schedule Future Pickup Orders</span>
              <span className="text-[11px] text-slate-500 font-medium">Allow customers to choose specific pickup date & time in advance</span>
            </div>
          </label>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            onClick={handleSave}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-md transition-all"
          >
            Save Ecommerce Settings
          </button>
        </div>
      </div>
    </div>
  );
};
