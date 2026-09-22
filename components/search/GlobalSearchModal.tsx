/**
 * GlobalSearchModal
 * Unified omni-search modal across Orders, Customers, Donors, Products, and SKUs/Barcodes (Section 12).
 */

import React, { useState, useEffect } from 'react';
import { Search, X, ShoppingBag, Users, FileText, Heart, ArrowRight } from 'lucide-react';
import { GlobalSearchService, GlobalSearchResultItem } from '../../services/globalSearchService';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string, payload?: any) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GlobalSearchResultItem[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
      return;
    }
  }, [isOpen]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setSearching(true);
        const res = await GlobalSearchService.searchAll(query);
        setResults(res);
        setSearching(false);
      } else {
        setResults([]);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const handleSelectResult = (item: GlobalSearchResultItem) => {
    onClose();
    switch (item.category) {
      case 'ORDER':
        onNavigate('Orders', item.actionPayload);
        break;
      case 'CUSTOMER':
        onNavigate('Customer List', item.actionPayload);
        break;
      case 'DONOR':
        onNavigate('Nonprofit CRM', item.actionPayload);
        break;
      case 'RETAIL_PRODUCT':
      case 'BARCODE':
        onNavigate('Retail POS', item.actionPayload);
        break;
      default:
        onNavigate('Home');
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'ORDER':
        return <FileText size={16} className="text-indigo-600" />;
      case 'CUSTOMER':
        return <Users size={16} className="text-teal-600" />;
      case 'DONOR':
        return <Heart size={16} className="text-rose-600" />;
      case 'RETAIL_PRODUCT':
      case 'BARCODE':
        return <ShoppingBag size={16} className="text-amber-600" />;
      default:
        return <Search size={16} className="text-slate-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-slate-950/70 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3">
          <Search size={20} className="text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search orders, receipts, customer names, donor records, SKUs, or barcodes..."
            className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
          />
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
            <X size={18} />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2">
          {searching ? (
            <div className="py-8 text-center text-xs text-slate-400">Searching system database...</div>
          ) : query.trim().length < 2 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              Type at least 2 characters to search across orders, donors, customers, and barcodes.
            </div>
          ) : results.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No matching records found for "{query}".
            </div>
          ) : (
            <div className="space-y-1">
              {results.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleSelectResult(item)}
                  className="w-full p-3 rounded-xl hover:bg-slate-50 flex items-center justify-between text-left transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-white transition-colors">
                      {getCategoryIcon(item.category)}
                    </div>
                    <div>
                      <span className="font-bold text-xs text-slate-800 block">{item.title}</span>
                      <span className="text-[11px] text-slate-500 block">{item.subtitle}</span>
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-slate-300 group-hover:text-indigo-600 transition-colors" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer shortcuts tip */}
        <div className="bg-slate-50 px-4 py-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Search scope: Orders • Customers • Donors • Products • Barcodes</span>
          <span className="font-mono">ESC to close</span>
        </div>
      </div>
    </div>
  );
};
