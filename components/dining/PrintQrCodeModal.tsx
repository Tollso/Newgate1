import React from 'react';
import { QrCode, Printer, X, Smartphone, Check } from 'lucide-react';

interface PrintQrCodeModalProps {
  tableName: string;
  orderId?: string;
  onClose: () => void;
  onPrinted?: () => void;
}

export const PrintQrCodeModal: React.FC<PrintQrCodeModalProps> = ({
  tableName,
  orderId,
  onClose,
  onPrinted
}) => {
  const qrUrl = `https://pos.restaurant.app/pay?table=${encodeURIComponent(tableName)}&order=${orderId || 'ORD-9821'}`;

  const handlePrint = () => {
    window.print();
    if (onPrinted) onPrinted();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/70 backdrop-blur-sm animate-fade-in text-slate-800 p-4">
      <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-scale-in relative">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <QrCode size={22} />
            </div>
            <div>
              <h3 className="font-black text-xl text-slate-900">Table QR Code</h3>
              <p className="text-xs font-bold text-slate-400">Table {tableName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* QR Code Printable Card */}
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-4 mb-6">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-md">
            {/* SVG QR Code Simulation */}
            <svg className="w-36 h-36 text-slate-900" viewBox="0 0 100 100" fill="currentColor">
              <rect x="0" y="0" width="30" height="30" rx="4" />
              <rect x="5" y="5" width="20" height="20" fill="white" rx="2" />
              <rect x="10" y="10" width="10" height="10" rx="1" />
              
              <rect x="70" y="0" width="30" height="30" rx="4" />
              <rect x="75" y="5" width="20" height="20" fill="white" rx="2" />
              <rect x="80" y="10" width="10" height="10" rx="1" />

              <rect x="0" y="70" width="30" height="30" rx="4" />
              <rect x="5" y="75" width="20" height="20" fill="white" rx="2" />
              <rect x="10" y="80" width="10" height="10" rx="1" />

              {/* QR Pattern dots */}
              <rect x="35" y="5" width="8" height="8" />
              <rect x="50" y="5" width="12" height="8" />
              <rect x="35" y="20" width="12" height="10" />
              <rect x="50" y="20" width="8" height="8" />

              <rect x="5" y="35" width="10" height="12" />
              <rect x="20" y="35" width="12" height="8" />
              <rect x="5" y="50" width="8" height="12" />
              <rect x="20" y="50" width="10" height="10" />

              <rect x="35" y="35" width="30" height="30" rx="2" fill="#4f46e5" />
              <rect x="42" y="42" width="16" height="16" fill="white" rx="2" />
              <circle cx="50" cy="50" r="5" fill="#4f46e5" />

              <rect x="70" y="35" width="10" height="12" />
              <rect x="85" y="35" width="10" height="8" />
              <rect x="70" y="50" width="12" height="10" />
              <rect x="85" y="50" width="8" height="12" />

              <rect x="35" y="70" width="12" height="8" />
              <rect x="50" y="70" width="10" height="12" />
              <rect x="65" y="70" width="12" height="8" />
              <rect x="80" y="70" width="15" height="10" />
              <rect x="35" y="85" width="15" height="10" />
              <rect x="55" y="85" width="10" height="10" />
              <rect x="70" y="85" width="25" height="10" />
            </svg>
          </div>

          <div>
            <span className="font-black text-lg text-slate-800 block">Scan to Pay or Order</span>
            <span className="text-xs font-bold text-slate-400 block mt-0.5">Table {tableName} • {orderId || 'ORD-9821'}</span>
          </div>

          <div className="flex items-center gap-2 bg-amber-50 text-amber-800 px-3 py-1.5 rounded-full text-[11px] font-bold border border-amber-200">
            <Smartphone size={14} /> Digital Contactless Menu Active
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-2xl transition-colors text-sm"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-2xl transition-all shadow-lg shadow-amber-900/20 text-sm flex items-center justify-center gap-2"
          >
            <Printer size={18} /> Print QR Card
          </button>
        </div>
      </div>
    </div>
  );
};
