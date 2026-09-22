import React, { useState } from 'react';
import { DollarSign, Printer, Layers, Info } from 'lucide-react';

interface EditorProps {
  categoryId: string;
  selectedPageId: string | null;
  onFieldChange: () => void;
}

export const CashAndReceiptsEditor: React.FC<EditorProps> = ({
  categoryId,
  selectedPageId,
  onFieldChange
}) => {
  const [separateBatchSettlement, setSeparateBatchSettlement] = useState(true);
  const [openingCashFloat, setOpeningCashFloat] = useState(200);

  if (categoryId === 'cash_closeout') {
    return (
      <div className="space-y-6">
        <div className="bg-indigo-50/70 border border-indigo-200 p-5 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs">
            <DollarSign size={16} className="text-indigo-600" />
            <span>Operational Day Close vs. Card Processor Settlement Separation</span>
          </div>
          <p className="text-xs text-indigo-950 leading-relaxed font-medium">
            Operational day close and card settlement need separate settings and statuses. Clover documents closeout in connection with payment batching; your app should avoid treating every operational checkout as a processor settlement.
          </p>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="sepBatch"
              checked={separateBatchSettlement}
              onChange={(e) => { setSeparateBatchSettlement(e.target.checked); onFieldChange(); }}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="sepBatch" className="text-xs font-bold text-slate-900">
              Decouple store shift register closeout from credit card processor batch settlement
            </label>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-indigo-600 font-bold">
            <DollarSign size={18} />
            <h3 className="text-sm uppercase tracking-wider text-slate-800">11. Cash Drawer Float & Blind Counts</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Default Register Starting Cash Float ($)</label>
              <input
                type="number"
                value={openingCashFloat}
                onChange={(e) => { setOpeningCashFloat(Number(e.target.value)); onFieldChange(); }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Cash Counting Policy</label>
              <select
                defaultValue="Blind Count Required"
                onChange={onFieldChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
              >
                <option value="Blind Count Required">Blind Count Required (Cashier hides system total)</option>
                <option value="Open Count">Open Count (Show expected cash balance)</option>
              </select>
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
          <Printer size={18} />
          <h3 className="text-sm uppercase tracking-wider text-slate-800">12. Receipt Branding, Footers & Digital Delivery</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Receipt Footer Promotional Text</label>
            <input
              type="text"
              defaultValue="Thank you for dining at Grand Bistro! Visit grandbistro.com"
              onChange={onFieldChange}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Default Post-Checkout Prompt</label>
            <select
              defaultValue="Ask Guest (Print / Email / SMS)"
              onChange={onFieldChange}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
            >
              <option value="Ask Guest (Print / Email / SMS)">Ask Guest (Print / Email / SMS)</option>
              <option value="Auto Print Thermal">Always Auto-Print Thermal Receipt</option>
              <option value="Digital First">Digital First (Email / SMS only)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
