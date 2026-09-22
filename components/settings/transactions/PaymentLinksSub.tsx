import React, { useState } from 'react';
import { Link as LinkIcon, Plus, Copy, Check, Trash2 } from 'lucide-react';

interface PaymentLinksSubProps {
  renderSectionHeader: (title: string, description: string, parentSection?: string) => React.ReactNode;
  paymentLinks: any[];
  setPaymentLinks: (val: any[]) => void;
}

export const PaymentLinksSub: React.FC<PaymentLinksSubProps> = ({
  renderSectionHeader,
  paymentLinks,
  setPaymentLinks
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState<number>(100);

  const handleCopy = (id: string, name: string) => {
    const fakeUrl = `https://pay.lumirestaurant.com/link/${id}`;
    navigator.clipboard.writeText(fakeUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddLink = () => {
    if (newTitle.trim()) {
      const newObj = {
        id: Date.now().toString(),
        name: newTitle.trim(),
        amount: newAmount,
        active: true
      };
      setPaymentLinks([...paymentLinks, newObj]);
      setNewTitle('');
      setNewAmount(100);
      setShowAddForm(false);
    }
  };

  const handleDelete = (id: string) => {
    setPaymentLinks(paymentLinks.filter(p => p.id !== id));
  };

  const handleToggle = (id: string) => {
    setPaymentLinks(paymentLinks.map(p => p.id === id ? { ...p, active: !p.active } : p));
  };

  return (
    <div className="max-w-4xl animate-fade-in pb-20 space-y-8">
      <div className="flex justify-between items-end">
        {renderSectionHeader("Payment Links & Digital Checkout", "Create reusable checkout URLs for deposit collections, catering, and private events.", "Transactions")}
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-indigo-700 transition-all shadow-md mb-8"
        >
          <Plus size={16} /> Create Payment Link
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-2xl border border-indigo-200 shadow-lg p-6 space-y-4 animate-fade-in">
          <h4 className="font-bold text-sm text-slate-800">New Payment Link</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Link Description / Event Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="e.g. Wedding Reception Deposit"
                className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-bold bg-white outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Fixed Amount ($)</label>
              <input
                type="number"
                value={newAmount}
                onChange={e => setNewAmount(parseFloat(e.target.value) || 0)}
                className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-bold bg-white outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={handleAddLink}
              className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold text-xs shadow-md"
            >
              Generate Link
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-100">
          {(paymentLinks || []).length === 0 ? (
            <div className="p-8 text-center text-slate-400 font-medium text-sm">
              No payment links generated yet. Click "Create Payment Link" above to generate one.
            </div>
          ) : (
            paymentLinks.map(link => (
              <div key={link.id} className="p-6 flex items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                    <LinkIcon size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{link.name}</h4>
                    <p className="text-xs font-black text-indigo-600 mt-0.5">${link.amount.toFixed(2)} USD</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleCopy(link.id, link.name)}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all"
                  >
                    {copiedId === link.id ? (
                      <>
                        <Check size={14} className="text-emerald-600" />
                        <span className="text-emerald-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={link.active}
                      onChange={() => handleToggle(link.id)}
                      className="h-4 w-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                    />
                    <span className="text-xs font-bold text-slate-500 uppercase">Active</span>
                  </label>

                  <button
                    onClick={() => handleDelete(link.id)}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete Link"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
