import React, { useState } from 'react';
import { Code, Copy, Check, X, FileJson } from 'lucide-react';
import { KioskConfig, Category, InventoryItem } from '../../../types';

interface KioskJsonPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  kioskConfig?: KioskConfig;
  categories: Category[];
  inventory: InventoryItem[];
}

export const KioskJsonPreviewModal: React.FC<KioskJsonPreviewModalProps> = ({
  isOpen,
  onClose,
  kioskConfig,
  categories = [],
  inventory = []
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const fullPayload = {
    _id: 'kiosk_cfg_88320194',
    businessId: 'biz_byte_cafe_lumi',
    operatingMode: kioskConfig?.operatingMode || 'Hybrid (Both)',
    welcomeMessage: kioskConfig?.welcomeMessage || 'Welcome! What are you craving?',
    themeColor: kioskConfig?.themeColor || 'indigo',
    layout: kioskConfig?.layout || 'bottom-cart',
    requireCustomerName: kioskConfig?.requireCustomerName ?? false,
    showItemImages: kioskConfig?.showItemImages ?? true,
    timeoutSeconds: kioskConfig?.timeoutSeconds || 60,
    customFlowName: kioskConfig?.customFlowName || '',
    categories: categories.map((cat, idx) => ({
      id: cat.id,
      name: cat.name,
      sortOrder: idx + 1,
      isVisible: true,
      timeAvailability: {
        enabled: false,
        startHour: 6,
        endHour: 22
      },
      assignedItemIds: inventory.filter(i => i.category === cat.name).map(i => i.id)
    })),
    itemAssignments: inventory.map(item => ({
      itemId: item.id,
      categoryId: item.category,
      isAvailableOnKiosk: item.showOnKiosk !== false,
      customDisplayName: item.posName || item.name
    })),
    updatedAt: new Date().toISOString()
  };

  const jsonString = JSON.stringify(fullPayload, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-6 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 max-w-2xl w-full flex flex-col max-h-[85vh] shadow-2xl animate-scale-in">
        
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/20 text-indigo-400 rounded-xl">
              <FileJson size={24} />
            </div>
            <div>
              <h3 className="text-lg font-black">Node.js / Mongoose Config Payload</h3>
              <p className="text-xs text-slate-400 font-medium">Live JSON payload served by backend API to kiosk units</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 my-4 overflow-y-auto bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs text-indigo-300 leading-relaxed select-text">
          <pre>{jsonString}</pre>
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            onClick={handleCopy}
            className="min-h-[44px] px-5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-md active:scale-95"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied to Clipboard!' : 'Copy Payload JSON'}
          </button>
        </div>

      </div>
    </div>
  );
};
