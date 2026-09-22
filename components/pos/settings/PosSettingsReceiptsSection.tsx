import React, { useState, useEffect } from 'react';
import { Receipt, Save, CheckCircle2, FileText, QrCode } from 'lucide-react';
import { Employee } from '../../../types';
import { SettingsService } from '../../../services/settingsService';

interface PosSettingsReceiptsSectionProps {
  currentUser: Employee;
}

export const PosSettingsReceiptsSection: React.FC<PosSettingsReceiptsSectionProps> = ({
  currentUser,
}) => {
  const [header, setHeader] = useState('THE NEWGATE POS\n100 Market St, Suite 400\nTel: (555) 019-2831');
  const [footer, setFooter] = useState('Thank you for dining with us!\nVisit us online: newgate.example.com');
  const [showItemizedTax, setShowItemizedTax] = useState(true);
  const [showQrCode, setShowQrCode] = useState(true);
  const [autoPrintCustomerCopy, setAutoPrintCustomerCopy] = useState(false);
  const [savedNotification, setSavedNotification] = useState<string | null>(null);

  useEffect(() => {
    SettingsService.resolveEffectiveSettings({ merchantId: 'M001', locationId: 'LOC-1' }).then(cfg => {
      if (cfg.receiptHeader) setHeader(cfg.receiptHeader);
      if (cfg.receiptFooter) setFooter(cfg.receiptFooter);
    });
  }, []);

  const handleSave = async () => {
    await SettingsService.updateSettings(
      { merchantId: 'M001', locationId: 'LOC-1' },
      {
        receiptHeader: header,
        receiptFooter: footer,
      },
      currentUser.id,
      currentUser.name
    );
    setSavedNotification('Receipt template and print parameters saved to terminal.');
    setTimeout(() => setSavedNotification(null), 3500);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Receipt className="text-indigo-400" size={24} />
            <h3 className="text-xl font-black text-white">Receipt Templates & Customization</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Configure thermal receipt header, footer, tax itemization, and paper output settings.
          </p>
        </div>

        {savedNotification && (
          <div className="px-4 py-2 bg-emerald-950/80 border border-emerald-600/60 rounded-xl flex items-center gap-2 text-emerald-300 text-xs font-semibold">
            <CheckCircle2 size={16} />
            <span>{savedNotification}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Editor Form */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
              Receipt Header Lines
            </label>
            <textarea
              rows={4}
              value={header}
              onChange={(e) => setHeader(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-2xl text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
              placeholder="Store Name, Address, Phone Number..."
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
              Receipt Footer Lines
            </label>
            <textarea
              rows={3}
              value={footer}
              onChange={(e) => setFooter(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-2xl text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
              placeholder="Return Policy, Social Handles, WiFi Password..."
            />
          </div>

          <div className="space-y-3 pt-2">
            <div className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700 flex items-center justify-between">
              <span className="text-xs font-bold text-white">Show Itemized Tax Lines</span>
              <button
                onClick={() => setShowItemizedTax(!showItemizedTax)}
                className={`w-10 h-5 rounded-full transition-colors relative p-0.5 ${
                  showItemizedTax ? 'bg-indigo-600' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    showItemizedTax ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700 flex items-center justify-between">
              <span className="text-xs font-bold text-white">Show Digital Receipt QR Code</span>
              <button
                onClick={() => setShowQrCode(!showQrCode)}
                className={`w-10 h-5 rounded-full transition-colors relative p-0.5 ${
                  showQrCode ? 'bg-indigo-600' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    showQrCode ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              onClick={handleSave}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/30"
            >
              <Save size={14} />
              Save Receipt Format
            </button>
          </div>
        </div>

        {/* Live Thermal Receipt Preview */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col items-center">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
            Thermal Output Preview (80mm)
          </div>

          <div className="w-full max-w-[280px] bg-amber-50 text-slate-900 p-5 rounded-xl shadow-2xl font-mono text-[11px] leading-relaxed border border-amber-200/80">
            <div className="text-center font-bold whitespace-pre-line mb-3 pb-2 border-b border-dashed border-slate-400">
              {header}
            </div>

            <div className="space-y-1 mb-3">
              <div className="flex justify-between text-[10px] text-slate-600">
                <span>Date: 2026-09-22 13:45</span>
                <span>Server: Alex</span>
              </div>
              <div className="flex justify-between text-[10px] text-slate-600">
                <span>Order #1042</span>
                <span>Table 4</span>
              </div>
            </div>

            <div className="border-t border-b border-dashed border-slate-400 py-2 space-y-1 mb-2">
              <div className="flex justify-between">
                <span>1x Classic Burger</span>
                <span>$18.50</span>
              </div>
              <div className="flex justify-between">
                <span>1x House Draft IPA</span>
                <span>$8.50</span>
              </div>
            </div>

            <div className="space-y-1 mb-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>$27.00</span>
              </div>
              {showItemizedTax && (
                <div className="flex justify-between text-slate-600 text-[10px]">
                  <span>Sales Tax (7.25%)</span>
                  <span>$1.96</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-xs pt-1 border-t border-slate-300">
                <span>TOTAL</span>
                <span>$28.96</span>
              </div>
            </div>

            {showQrCode && (
              <div className="py-2 text-center flex flex-col items-center gap-1 border-t border-dashed border-slate-300">
                <QrCode size={40} className="text-slate-800" />
                <span className="text-[9px] text-slate-500">Scan for e-Receipt</span>
              </div>
            )}

            <div className="text-center text-[10px] text-slate-600 whitespace-pre-line pt-2 border-t border-dashed border-slate-400">
              {footer}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
