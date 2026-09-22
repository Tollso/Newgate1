import React, { useState } from 'react';
import { DiscountCode } from '../../types';
import { X, Tag, DollarSign, Percent, ShieldAlert, Store, Globe, Layers } from 'lucide-react';

interface DiscountModalProps {
  editingDiscount: DiscountCode | null;
  defaultStatus?: 'Active' | 'Default';
  onClose: () => void;
  onSave: (discount: Partial<DiscountCode>) => void;
}

export const DiscountModal: React.FC<DiscountModalProps> = ({
  editingDiscount,
  defaultStatus = 'Active',
  onClose,
  onSave
}) => {
  const [formDiscount, setFormDiscount] = useState<Partial<DiscountCode>>(
    editingDiscount ? {
      ...editingDiscount,
      taxCalculation: editingDiscount.taxCalculation || 'BeforeTax',
      applicability: editingDiscount.applicability || 'Order',
      status: editingDiscount.status || defaultStatus,
      showOnPos: editingDiscount.showOnPos ?? true,
      showOnline: editingDiscount.showOnline ?? true
    } : {
      name: '',
      code: '',
      type: 'Percentage',
      value: 10,
      status: defaultStatus,
      applicability: 'Order',
      taxCalculation: 'BeforeTax',
      showOnPos: true,
      showOnline: true
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formDiscount.name?.trim()) return;

    const generatedCode = formDiscount.code?.trim() 
      ? formDiscount.code.trim().toUpperCase() 
      : formDiscount.name.trim().toUpperCase().replace(/\s+/g, '');

    onSave({
      ...formDiscount,
      name: formDiscount.name.trim(),
      code: generatedCode,
      value: Number(formDiscount.value || 0)
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 my-8 animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Tag size={18} />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-800">
                {editingDiscount ? 'Customize Discount' : 'Create New Discount'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">Configure promo code rules, rates & visibility</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Discount Name *</label>
            <input 
              type="text" 
              required
              placeholder="e.g., Happy Hour 20%, Summer Promo"
              value={formDiscount.name || ''}
              onChange={e => {
                const nameVal = e.target.value;
                const autoCode = nameVal.toUpperCase().replace(/\s+/g, '');
                setFormDiscount(prev => ({
                  ...prev,
                  name: nameVal,
                  code: prev.code && prev.code !== prev.name?.toUpperCase().replace(/\s+/g, '') ? prev.code : autoCode
                }));
              }}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 font-medium text-sm text-slate-800 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Promo Code</label>
              <input 
                type="text" 
                placeholder="e.g., HAPPY20"
                value={formDiscount.code || ''}
                onChange={e => setFormDiscount({ ...formDiscount, code: e.target.value.toUpperCase() })}
                className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 font-mono text-sm font-bold text-slate-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Discount Type</label>
              <select 
                value={formDiscount.type}
                onChange={e => setFormDiscount({ ...formDiscount, type: e.target.value as 'Percentage' | 'Fixed' })}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 bg-white font-semibold text-sm text-slate-800 outline-none focus:border-indigo-500"
              >
                <option value="Percentage">Percentage (%)</option>
                <option value="Fixed">Fixed Amount ($)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Value ({formDiscount.type === 'Percentage' ? '%' : '$'}) *
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
                  {formDiscount.type === 'Percentage' ? <Percent size={15} /> : <DollarSign size={15} />}
                </div>
                <input 
                  type="number" 
                  step="0.01"
                  min="0"
                  max={formDiscount.type === 'Percentage' ? "100" : "10000"}
                  required
                  placeholder="0.00"
                  value={formDiscount.value ?? ''}
                  onChange={e => setFormDiscount({ ...formDiscount, value: parseFloat(e.target.value) || 0 })}
                  className="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 font-bold text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Applicability</label>
              <select 
                value={formDiscount.applicability || 'Order'}
                onChange={e => setFormDiscount({ ...formDiscount, applicability: e.target.value as any })}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 bg-white font-semibold text-sm text-slate-800 outline-none focus:border-indigo-500"
              >
                <option value="Order">Entire Order</option>
                <option value="Item">Specific Item</option>
                <option value="Category">Category</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Status</label>
              <select 
                value={formDiscount.status || 'Active'}
                onChange={e => setFormDiscount({ ...formDiscount, status: e.target.value as any })}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 bg-white font-semibold text-sm text-slate-800 outline-none focus:border-indigo-500"
              >
                <option value="Active">Active Promo</option>
                <option value="Default">Default POS Preset</option>
                <option value="Expired">Expired / Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Tax Calculation</label>
              <select 
                value={formDiscount.taxCalculation || 'BeforeTax'}
                onChange={e => setFormDiscount({ ...formDiscount, taxCalculation: e.target.value as any })}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 bg-white font-semibold text-sm text-slate-800 outline-none focus:border-indigo-500"
              >
                <option value="BeforeTax">Before Tax</option>
                <option value="AfterTax">After Tax</option>
              </select>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-2.5">
            <span className="block text-xs font-bold uppercase tracking-wider text-slate-500">Channels & Display</span>
            
            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100/80 transition-colors">
              <div className="flex items-center gap-2.5">
                <Store size={16} className="text-indigo-600" />
                <span className="text-xs font-bold text-slate-700">Show on POS Register Quick Bar</span>
              </div>
              <input 
                type="checkbox"
                checked={formDiscount.showOnPos ?? true}
                onChange={e => setFormDiscount({ ...formDiscount, showOnPos: e.target.checked })}
                className="w-4 h-4 text-indigo-600 rounded-md focus:ring-indigo-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100/80 transition-colors">
              <div className="flex items-center gap-2.5">
                <Globe size={16} className="text-indigo-600" />
                <span className="text-xs font-bold text-slate-700">Allow in Online Ordering</span>
              </div>
              <input 
                type="checkbox"
                checked={formDiscount.showOnline ?? true}
                onChange={e => setFormDiscount({ ...formDiscount, showOnline: e.target.checked })}
                className="w-4 h-4 text-indigo-600 rounded-md focus:ring-indigo-500"
              />
            </label>
          </div>

          <div className="px-6 py-4 -mx-6 -mb-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-2.5 mt-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 text-slate-600 font-bold text-xs hover:bg-slate-200/50 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-5 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-indigo-700 shadow-xs transition-all flex items-center gap-1.5"
            >
              {editingDiscount ? 'Update Discount' : 'Save Discount'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
