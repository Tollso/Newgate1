import React, { useState } from 'react';
import { InventoryItem } from '../../../types';

interface PosSettingsMenuSectionProps {
  inventory: InventoryItem[];
  onSaveItem?: (item: InventoryItem) => void;
}

export const PosSettingsMenuSection: React.FC<PosSettingsMenuSectionProps> = ({
  inventory,
  onSaveItem,
}) => {
  const [searchItemText, setSearchItemText] = useState('');

  const filteredItems = inventory.filter(i =>
    i.name.toLowerCase().includes(searchItemText.toLowerCase()) ||
    i.category.toLowerCase().includes(searchItemText.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-white">Item Availability (86 Stock)</h3>
            <p className="text-xs text-slate-400">Instantly toggle items out of stock across Register, Tables & KDS</p>
          </div>
          <input
            type="text"
            placeholder="Search item..."
            value={searchItemText}
            onChange={e => setSearchItemText(e.target.value)}
            className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs outline-none w-48"
          />
        </div>

        <div className="max-h-96 overflow-y-auto space-y-2 pr-1">
          {filteredItems.map(item => {
            const isAvail = item.inStock !== false;
            return (
              <div key={item.id} className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/80 flex items-center justify-between">
                <div>
                  <div className={`text-sm font-bold ${isAvail ? 'text-white' : 'text-slate-400 line-through'}`}>
                    {item.name}
                  </div>
                  <div className="text-xs text-slate-400">${item.price.toFixed(2)} • {item.category}</div>
                </div>
                <button
                  onClick={() => {
                    if (onSaveItem) {
                      onSaveItem({ ...item, inStock: !isAvail });
                    }
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-colors ${
                    isAvail
                      ? 'bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/60'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  {isAvail ? '86 Item' : 'Restore Stock'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
