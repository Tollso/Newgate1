import React from 'react';
import { Gift, Store, X, Printer } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface GiftCardViewPrintModalProps {
  card: any | null;
  onClose: () => void;
  getBusinessName: (id: string) => string;
}

export const GiftCardViewPrintModal: React.FC<GiftCardViewPrintModalProps> = ({
  card,
  onClose,
  getBusinessName,
}) => {
  if (!card) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl relative">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 bg-black/10 hover:bg-black/20 text-white rounded-full transition-colors z-10"
        >
          <X size={20} />
        </button>
        
        {/* Card Graphic */}
        <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 p-8 pt-10 text-white relative overflow-hidden shadow-inner">
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <Gift size={36} className="text-indigo-300 mb-2" />
            <div className="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-300 mb-1">Digital Gift Card</div>
            <div className="text-4xl font-black tracking-tight mb-4">${card.balance.toFixed(2)}</div>

            {/* 16-Digit Card Box */}
            <div className="w-full bg-black/30 border border-white/10 rounded-2xl p-3 my-2 backdrop-blur-md">
              <div className="text-[9px] font-black uppercase tracking-widest text-indigo-200 mb-1">Card Number</div>
              <div className="font-mono text-lg font-black tracking-widest text-white">
                {card.code}
              </div>
            </div>

            {/* CVV & Expiration Row */}
            <div className="grid grid-cols-2 gap-2 w-full mt-1 text-left">
              <div className="bg-black/20 border border-white/5 rounded-xl p-2.5">
                <span className="text-[8px] font-black uppercase tracking-widest text-indigo-200 block">CVV / Security</span>
                <span className="font-mono text-sm font-bold text-white">{card.securityCode || '---'}</span>
              </div>
              <div className="bg-black/20 border border-white/5 rounded-xl p-2.5">
                <span className="text-[8px] font-black uppercase tracking-widest text-indigo-200 block">Expiration</span>
                <span className="text-xs font-bold text-white">
                  {card.expirationDate ? new Date(card.expirationDate).toLocaleDateString() : 'Never'}
                </span>
              </div>
            </div>
            
            <div className="mt-4 px-3 py-1 bg-black/30 rounded-full flex items-center justify-center gap-1.5 w-full">
              <Store size={12} className="text-indigo-300" />
              <span className="text-[11px] font-bold text-indigo-100 truncate">Valid at {getBusinessName(card.businessId)}</span>
            </div>
          </div>
        </div>
        
        <div className="p-8 flex flex-col items-center text-center">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6">
            <QRCodeSVG value={card.code} size={160} level="M" fgColor="#0f172a" />
          </div>
          
          <div className="font-mono text-xl font-black tracking-widest text-slate-800 mb-1">
            {card.code}
          </div>
          <p className="text-xs text-slate-500 max-w-[200px]">
            Scan this QR code or enter the number manually at checkout.
          </p>
          
          <div className="w-full flex flex-col gap-3 mt-8">
            <div className="flex gap-2">
              {card._sendViaEmail && card.customerEmail && (
                <button 
                  onClick={() => alert(`Emailing card to ${card.customerEmail}`)}
                  className="flex-1 py-2.5 bg-indigo-50 text-indigo-600 font-bold text-sm rounded-xl transition-colors hover:bg-indigo-100"
                >
                  Email
                </button>
              )}
              {card._sendViaSms && card.customerPhone && (
                <button 
                  onClick={() => alert(`Texting card to ${card.customerPhone}`)}
                  className="flex-1 py-2.5 bg-indigo-50 text-indigo-600 font-bold text-sm rounded-xl transition-colors hover:bg-indigo-100"
                >
                  SMS
                </button>
              )}
            </div>

            <div className="flex gap-3">
              <button 
                onClick={onClose}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-colors"
              >
                Done
              </button>
              <button 
                onClick={() => {
                  alert('Printing functionality would execute here.');
                  onClose();
                }}
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Printer size={16} />
                Print
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
