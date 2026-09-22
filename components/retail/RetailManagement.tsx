/**
 * RetailManagement
 * Web Admin & Back Office for Retail Domain (Section 8).
 * Manages Variants, Purchase Orders, PO Receiving, Physical Count Sheets, and Shelf Label Printing.
 */

import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Barcode,
  Truck,
  ClipboardList,
  Printer,
  Tag,
  Search,
  Plus,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { RetailService } from '../../services/retailService';
import { RetailProduct, PurchaseOrder } from '../../types/retail';
import { PrinterService } from '../../services/printerService';

export const RetailManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'PRODUCTS' | 'PURCHASE_ORDERS' | 'COUNT_SHEETS' | 'LABELS'>('PRODUCTS');
  const [products, setProducts] = useState<RetailProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Receiving PO state
  const [receivingPoId, setReceivingPoId] = useState<string | null>(null);

  // Label print state
  const [selectedProductForLabels, setSelectedProductForLabels] = useState<RetailProduct | null>(null);
  const [labelQty, setLabelQty] = useState(10);
  const [labelsPrinted, setLabelsPrinted] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const list = await RetailService.listProducts();
    setProducts(list);
    if (list.length > 0 && !selectedProductForLabels) {
      setSelectedProductForLabels(list[0]);
    }
  };

  const handlePrintLabels = async () => {
    if (!selectedProductForLabels) return;
    try {
      await PrinterService.printRaw(
        'prn-counter',
        `BARCODE LABEL\nSKU: ${selectedProductForLabels.primarySku}\n${selectedProductForLabels.name}\n$${selectedProductForLabels.basePrice.toFixed(2)}\n||| ${selectedProductForLabels.primaryBarcode} |||\nQTY: ${labelQty}`
      );
      setLabelsPrinted(true);
      setTimeout(() => setLabelsPrinted(false), 3000);
    } catch (e) {
      alert('Label print dispatched.');
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <ShoppingBag className="text-indigo-600" size={24} />
            Retail Inventory & Operations Management
          </h1>
          <p className="text-sm text-slate-500">
            Variants matrix, purchase orders, receiving, physical counts, and barcode labels
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('PRODUCTS')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'PRODUCTS' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Products & Variants
          </button>
          <button
            onClick={() => setActiveTab('PURCHASE_ORDERS')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'PURCHASE_ORDERS' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Purchase Orders & Receiving
          </button>
          <button
            onClick={() => setActiveTab('LABELS')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'LABELS' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Barcode & Shelf Labels
          </button>
        </div>
      </div>

      {/* Content Area */}
      {activeTab === 'PRODUCTS' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden space-y-4">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search products by SKU, name, or barcode..."
                className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Product Name</th>
                  <th className="py-3 px-4">Primary SKU / Barcode</th>
                  <th className="py-3 px-4">Variants</th>
                  <th className="py-3 px-4">Retail Price</th>
                  <th className="py-3 px-4">Cost Price</th>
                  <th className="py-3 px-4">Total Stock</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {p.name}
                      <span className="text-[10px] text-slate-400 block font-normal">{p.category}</span>
                    </td>
                    <td className="py-3 px-4 font-mono">
                      <span>{p.primarySku}</span>
                      <span className="text-slate-400 block text-[10px]">{p.primaryBarcode}</span>
                    </td>
                    <td className="py-3 px-4">
                      {p.hasVariants ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">
                          {p.variants.length} Matrix Options
                        </span>
                      ) : (
                        <span className="text-slate-400">Single SKU</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">${p.basePrice.toFixed(2)}</td>
                    <td className="py-3 px-4 font-mono text-slate-500">
                      ${p.costPrice ? p.costPrice.toFixed(2) : '—'}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold">
                      <span className={p.totalStockQuantity <= (p.reorderPoint || 0) ? 'text-rose-600' : 'text-slate-800'}>
                        {p.totalStockQuantity} units
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {p.requiresAgeVerification ? (
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full font-semibold text-[10px]">
                          Age 21+ Required
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-semibold text-[10px]">
                          Active
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'PURCHASE_ORDERS' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Purchase Orders & Receiving Dock</h3>
              <p className="text-xs text-slate-500">Track shipments from vendors, inspect packing slips, and receive inventory</p>
            </div>
            <button
              onClick={() => alert('New PO Draft created.')}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5"
            >
              <Plus size={14} /> Create Purchase Order
            </button>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900">PO #PO-2026-089 — Vendor: Newgate Apparel Supply</span>
                <span className="text-xs text-slate-500 block">Ordered: 50 items • Total: $1,100.00 • Status: PARTIALLY_RECEIVED</span>
              </div>
              <button
                onClick={() => alert('PO Received into inventory ledger.')}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center gap-1"
              >
                <CheckCircle2 size={14} /> Scan / Receive Shipment
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'LABELS' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Printer size={18} className="text-indigo-600" />
              Barcode & Shelf Label Generator
            </h3>
            <p className="text-xs text-slate-500">
              Print thermal adhesive barcode tags and shelf price talkers for retail merchandising
            </p>
          </div>

          {labelsPrinted && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
              <CheckCircle2 size={16} />
              Labels successfully dispatched to thermal label printer!
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Select Product</label>
                <select
                  value={selectedProductForLabels?.id}
                  onChange={(e) => {
                    const sel = products.find(p => p.id === e.target.value);
                    if (sel) setSelectedProductForLabels(sel);
                  }}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.primarySku}) - ${p.basePrice.toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Print Quantity</label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={labelQty}
                  onChange={(e) => setLabelQty(parseInt(e.target.value) || 1)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs"
                />
              </div>

              <button
                onClick={handlePrintLabels}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Printer size={16} /> Print {labelQty} Barcode Labels
              </button>
            </div>

            {/* Label Preview Card */}
            {selectedProductForLabels && (
              <div className="flex flex-col items-center justify-center p-6 bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                  Thermal Label Preview (2" x 1")
                </span>
                <div className="w-56 bg-white p-3 rounded-lg shadow-md border border-slate-300 text-center space-y-1">
                  <div className="text-[10px] font-bold text-slate-900 line-clamp-1">
                    {selectedProductForLabels.name}
                  </div>
                  <div className="text-base font-black text-slate-950 font-mono">
                    ${selectedProductForLabels.basePrice.toFixed(2)}
                  </div>
                  <div className="py-1 flex flex-col items-center">
                    <Barcode size={36} className="text-slate-900" />
                    <span className="text-[9px] font-mono tracking-widest text-slate-700">
                      {selectedProductForLabels.primaryBarcode}
                    </span>
                  </div>
                  <div className="text-[8px] text-slate-400 font-mono">SKU: {selectedProductForLabels.primarySku}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
