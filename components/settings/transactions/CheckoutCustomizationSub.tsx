import React, { useState } from 'react';
import { ShoppingCart, CheckCircle2 } from 'lucide-react';

interface CheckoutCustomizationSubProps {
  renderSectionHeader: (title: string, description: string, parentSection?: string) => React.ReactNode;
  checkoutSettings: any;
  setCheckoutSettings: (val: any) => void;
}

export const CheckoutCustomizationSub: React.FC<CheckoutCustomizationSubProps> = ({
  renderSectionHeader,
  checkoutSettings,
  setCheckoutSettings
}) => {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl animate-fade-in pb-20 space-y-8">
      {renderSectionHeader("Checkout Customization", "Customize hosted checkout fields, visual styling, and webhook triggers.", "Transactions")}
      
      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 text-sm font-bold animate-fade-in">
          <CheckCircle2 size={18} /> Checkout preferences updated successfully!
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-6">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Business Header Title</label>
          <input 
            type="text" 
            value={checkoutSettings.businessName}
            onChange={e => setCheckoutSettings({...checkoutSettings, businessName: e.target.value})}
            className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm font-bold bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Transaction Webhook Endpoint URL</label>
          <input 
            type="text" 
            value={checkoutSettings.webhookUrl}
            onChange={e => setCheckoutSettings({...checkoutSettings, webhookUrl: e.target.value})}
            className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm font-bold bg-white focus:ring-2 focus:ring-indigo-500 outline-none font-mono"
          />
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Required Customer Checkout Fields</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
              <input type="checkbox" defaultChecked className="h-5 w-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
              <span className="text-xs font-bold text-slate-700">Require Phone Number for SMS Receipts</span>
            </label>

            <label className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
              <input type="checkbox" defaultChecked className="h-5 w-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
              <span className="text-xs font-bold text-slate-700">Require Table / Pickup Station Selection</span>
            </label>

            <label className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
              <input type="checkbox" defaultChecked className="h-5 w-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
              <span className="text-xs font-bold text-slate-700">Allow Order Special Notes</span>
            </label>

            <label className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
              <input type="checkbox" className="h-5 w-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
              <span className="text-xs font-bold text-slate-700">Enable Tax Exempt Customer Toggle</span>
            </label>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            onClick={handleSave}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-md transition-all"
          >
            Save Checkout Customization
          </button>
        </div>
      </div>
    </div>
  );
};
