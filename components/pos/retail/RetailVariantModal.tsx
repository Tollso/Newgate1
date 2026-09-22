import React from 'react';
import { RetailProduct, ProductVariant } from '../../../types/retail';

interface RetailVariantModalProps {
  product: RetailProduct | null;
  onClose: () => void;
  onSelectVariant: (product: RetailProduct, variant: ProductVariant) => void;
}

export const RetailVariantModal: React.FC<RetailVariantModalProps> = ({
  product,
  onClose,
  onSelectVariant,
}) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4">
        <div>
          <h3 className="text-lg font-bold text-white">Select Variant</h3>
          <p className="text-xs text-slate-400">{product.name}</p>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {product.variants.map(v => (
            <button
              key={v.id}
              onClick={() => onSelectVariant(product, v)}
              className="w-full p-3 bg-slate-800 hover:bg-indigo-600/80 border border-slate-700 rounded-xl flex items-center justify-between text-left transition-all"
            >
              <div>
                <span className="text-sm font-bold text-white block">
                  {v.size ? `Size: ${v.size}` : ''} {v.color ? `Color: ${v.color}` : ''}
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  SKU: {v.sku} • In Stock: {v.stockQuantity}
                </span>
              </div>
              <span className="text-sm font-extrabold text-emerald-400">${v.price.toFixed(2)}</span>
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
