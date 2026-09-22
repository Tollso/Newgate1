import React, { useState } from 'react';
import { Package, FileText, Calendar } from 'lucide-react';

interface EditorProps {
  categoryId: string;
  selectedPageId: string | null;
  onFieldChange: () => void;
}

export const InventoryAndInvoicesEditor: React.FC<EditorProps> = ({
  categoryId,
  selectedPageId,
  onFieldChange
}) => {
  const [costingMethod, setCostingMethod] = useState('FIFO (First-In, First-Out)');
  const [auto86ZeroStock, setAuto86ZeroStock] = useState(true);

  if (categoryId === 'inventory_purchasing') {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-indigo-600 font-bold">
            <Package size={18} />
            <h3 className="text-sm uppercase tracking-wider text-slate-800">15. Stock Depletion & Recipe Costing</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Costing Method</label>
              <select
                value={costingMethod}
                onChange={(e) => { setCostingMethod(e.target.value); onFieldChange(); }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
              >
                <option value="FIFO (First-In, First-Out)">FIFO (First-In, First-Out)</option>
                <option value="Weighted Average Cost">Weighted Average Cost</option>
              </select>
            </div>
            <div className="flex items-center gap-2 pt-5">
              <input
                type="checkbox"
                id="auto86"
                checked={auto86ZeroStock}
                onChange={(e) => { setAuto86ZeroStock(e.target.checked); onFieldChange(); }}
                className="rounded text-indigo-600"
              />
              <label htmlFor="auto86" className="text-xs font-bold text-slate-800">
                Automatically mark menu item as Sold-Out (86'd) when recipe stock reaches 0
              </label>
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
          <FileText size={18} />
          <h3 className="text-sm uppercase tracking-wider text-slate-800">16. Invoices, Catering Packages & Terms</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Default Catering Invoice Payment Terms</label>
            <select
              defaultValue="Net 30 Days"
              onChange={onFieldChange}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
            >
              <option value="Due Upon Receipt">Due Upon Receipt</option>
              <option value="Net 15 Days">Net 15 Days</option>
              <option value="Net 30 Days">Net 30 Days</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Required Event Booking Deposit %</label>
            <input
              type="number"
              defaultValue={50}
              onChange={onFieldChange}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
