import React, { useState } from 'react';
import { DiscountCode } from '../../types';
import { MOCK_DEFAULT_DISCOUNTS } from '../../constants';
import { 
  Tag, Plus, Percent, DollarSign, Search, Edit2, Trash2, 
  Copy, CheckCircle2, ShieldAlert, Store, Globe, Sparkles, Gift
} from 'lucide-react';
import { DiscountModal } from './DiscountModal';
import { ActiveDiscountsTab, DefaultDiscountsTab, GiftCardsTab } from './DiscountTabs';

interface DiscountsProps {
  discounts?: DiscountCode[];
  setDiscounts?: React.Dispatch<React.SetStateAction<DiscountCode[]>>;
}

const Discounts: React.FC<DiscountsProps> = ({ discounts = [], setDiscounts }) => {
  const [activeTab, setActiveTab] = useState<'Active' | 'Default' | 'Gift Cards'>('Active');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createModalDefaultStatus, setCreateModalDefaultStatus] = useState<'Active' | 'Default'>('Active');
  const [editingDiscount, setEditingDiscount] = useState<DiscountCode | null>(null);

  const handleOpenCreate = (isDefault = false) => {
    setEditingDiscount(null);
    setCreateModalDefaultStatus(isDefault ? 'Default' : 'Active');
    setShowCreateModal(true);
  };

  const handleOpenEdit = (discount: DiscountCode) => {
    setEditingDiscount(discount);
    setShowCreateModal(true);
  };

  const handleDuplicate = (discount: DiscountCode) => {
    if (!setDiscounts) return;
    const newDiscount: DiscountCode = {
      ...discount,
      id: `D-${Date.now()}`,
      name: `${discount.name || 'Discount'} (Copy)`,
      code: `${discount.code || 'CODE'}COPY`,
      usageCount: 0
    };
    setDiscounts(prev => [...prev, newDiscount]);
  };

  const handleSaveDiscount = (formDiscount: Partial<DiscountCode>) => {
    if (!formDiscount.name?.trim() || !setDiscounts) return;

    if (editingDiscount) {
      setDiscounts(prev => prev.map(d => d.id === editingDiscount.id ? {
        ...d,
        name: formDiscount.name!.trim(),
        code: formDiscount.code || formDiscount.name!.toUpperCase().replace(/\s+/g, ''),
        type: (formDiscount.type || 'Percentage') as 'Percentage' | 'Fixed',
        value: Number(formDiscount.value || 0),
        status: (formDiscount.status || 'Active') as 'Active' | 'Expired' | 'Default',
        applicability: (formDiscount.applicability || 'Order') as 'Order' | 'Item' | 'Category',
        taxCalculation: (formDiscount.taxCalculation || 'BeforeTax') as 'BeforeTax' | 'AfterTax',
        showOnPos: formDiscount.showOnPos ?? true,
        showOnline: formDiscount.showOnline ?? true
      } : d));
    } else {
      const newDiscount: DiscountCode = {
        id: `D-${Date.now()}`,
        code: formDiscount.code || formDiscount.name!.toUpperCase().replace(/\s+/g, ''),
        name: formDiscount.name!.trim(),
        type: (formDiscount.type || 'Percentage') as 'Percentage' | 'Fixed',
        value: Number(formDiscount.value || 0),
        status: (formDiscount.status || createModalDefaultStatus) as 'Active' | 'Expired' | 'Default',
        applicability: (formDiscount.applicability || 'Order') as 'Order' | 'Item' | 'Category',
        taxCalculation: (formDiscount.taxCalculation || 'BeforeTax') as 'BeforeTax' | 'AfterTax',
        showOnPos: formDiscount.showOnPos ?? true,
        showOnline: formDiscount.showOnline ?? true,
        usageCount: 0
      };
      setDiscounts(prev => [newDiscount, ...prev]);
    }

    setShowCreateModal(false);
  };

  const handleDeleteDiscount = (id: string) => {
    if (setDiscounts) {
      setDiscounts(prev => prev.filter(d => d.id !== id));
    }
  };

  const allDiscountsList = [...discounts];
  // Ensure default discounts have entries from MOCK_DEFAULT_DISCOUNTS if missing
  MOCK_DEFAULT_DISCOUNTS.forEach(m => {
    if (!allDiscountsList.some(d => d.id === m.id || d.name === m.name)) {
      allDiscountsList.push(m);
    }
  });

  const activeDiscounts = allDiscountsList.filter(d => 
    d.status !== 'Default' &&
    ((d.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
     (d.code || '').toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const defaultDiscounts = allDiscountsList.filter(d => d.status === 'Default');

  return (
    <div className="space-y-6 animate-fade-in relative">
      {showCreateModal && (
        <DiscountModal
          editingDiscount={editingDiscount}
          defaultStatus={createModalDefaultStatus}
          onClose={() => setShowCreateModal(false)}
          onSave={handleSaveDiscount}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Discounts & Promotions</h1>
            <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-full border border-indigo-100">
              {allDiscountsList.length} Total
            </span>
          </div>
          <p className="text-slate-500 text-xs font-medium mt-0.5">Customize default POS presets, promo codes, and discount rules</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => handleOpenCreate(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200 transition-all"
          >
            <Sparkles size={16} className="text-indigo-600" /> Add POS Preset
          </button>
          <button 
            onClick={() => handleOpenCreate(false)}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-indigo-700 shadow-xs transition-all"
          >
            <Plus size={16} /> Create Custom Discount
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
        {(['Active', 'Default', 'Gift Cards'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === tab ? 'bg-white shadow-xs text-indigo-600' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab === 'Active' ? `Active Promos (${activeDiscounts.length})` : tab === 'Default' ? `POS Presets (${defaultDiscounts.length})` : 'Gift Cards'}
          </button>
        ))}
      </div>

      {/* Active Tab */}
      {activeTab === 'Active' && <ActiveDiscountsTab searchTerm={searchTerm} setSearchTerm={setSearchTerm} activeDiscounts={activeDiscounts} handleOpenEdit={handleOpenEdit} handleDuplicate={handleDuplicate} handleDeleteDiscount={handleDeleteDiscount} />}
      {activeTab === 'Default' && <DefaultDiscountsTab defaultDiscounts={defaultDiscounts} handleOpenCreate={handleOpenCreate} handleOpenEdit={handleOpenEdit} handleDeleteDiscount={handleDeleteDiscount} />}
      {activeTab === 'Gift Cards' && <GiftCardsTab />}
    </div>
  );
};

export default Discounts;
