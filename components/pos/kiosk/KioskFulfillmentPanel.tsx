import React from 'react';
import { Hash, User } from 'lucide-react';

interface KioskFulfillmentPanelProps {
  orderType: 'Dine In' | 'Takeout';
  tableTentNumber: string;
  customerName: string;
  onTableTentChange: (val: string) => void;
  onCustomerNameChange: (val: string) => void;
}

export const KioskFulfillmentPanel: React.FC<KioskFulfillmentPanelProps> = ({
  orderType,
  tableTentNumber,
  customerName,
  onTableTentChange,
  onCustomerNameChange
}) => {
  const handleKeypadPress = (val: string) => {
    if (val === 'CLEAR') {
      onTableTentChange('');
    } else if (val === 'BACK') {
      onTableTentChange(tableTentNumber.slice(0, -1));
    } else if (tableTentNumber.length < 3) {
      onTableTentChange(tableTentNumber + val);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
      {orderType === 'Dine In' ? (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
              <Hash size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">Enter Your Table Tent Number</h3>
              <p className="text-xs font-medium text-slate-500">Grab a numbered acrylic tent from the stack and enter the number below so staff can deliver your food.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 mt-4">
            <div className="w-48 h-24 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-mono text-4xl font-black tracking-widest border-2 border-indigo-500 shadow-inner">
              {tableTentNumber || '---'}
            </div>

            <div className="grid grid-cols-3 gap-2 w-full max-w-xs">
              {['1','2','3','4','5','6','7','8','9','CLEAR','0','BACK'].map(k => (
                <button
                  key={k}
                  type="button"
                  onClick={() => handleKeypadPress(k)}
                  className={`min-h-[52px] py-3 rounded-xl font-bold text-base transition-all cursor-pointer ${
                    k === 'CLEAR' ? 'bg-rose-100 text-rose-700 hover:bg-rose-200' :
                    k === 'BACK' ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' :
                    'bg-slate-100 text-slate-800 hover:bg-indigo-600 hover:text-white'
                  }`}
                >
                  {k}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
              <User size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">Name for Pickup Counter Callout</h3>
              <p className="text-xs font-medium text-slate-500">We will announce your name at the pickup station when your order is ready.</p>
            </div>
          </div>

          <input
            type="text"
            value={customerName}
            onChange={(e) => onCustomerNameChange(e.target.value)}
            placeholder="Enter your first name (e.g. Sarah)"
            className="w-full p-4 min-h-[52px] bg-slate-50 border-2 border-slate-200 rounded-2xl font-bold text-lg text-slate-900 focus:border-indigo-600 focus:bg-white outline-none transition-all"
          />
        </div>
      )}
    </div>
  );
};
