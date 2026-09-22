import React, { useState } from 'react';
import { Monitor, Printer, Wifi, CheckCircle2, RefreshCw, Smartphone, CreditCard } from 'lucide-react';

interface HardwareSettingsSectionProps {
  renderSectionHeader: (title: string, description: string, parentSection?: string) => React.ReactNode;
}

export const HardwareSettingsSection: React.FC<HardwareSettingsSectionProps> = ({ renderSectionHeader }) => {
  const [terminals, setTerminals] = useState([
    { id: '1', name: 'Main Register 01', type: 'POS Station', ip: '192.168.1.101', status: 'Connected' },
    { id: '2', name: 'Kitchen KDS Display', type: 'Kitchen Display', ip: '192.168.1.105', status: 'Connected' },
    { id: '3', name: 'Mobile Handheld 01', type: 'Server Tablet', ip: '192.168.1.112', status: 'Connected' },
  ]);

  const [printers, setPrinters] = useState([
    { id: 'p1', name: 'Front Counter Receipt Printer', ip: '192.168.1.201', paperSize: '80mm', autoCut: true, status: 'Online' },
    { id: 'p2', name: 'Kitchen Hot Prep Printer', ip: '192.168.1.202', paperSize: '80mm', autoCut: true, status: 'Online' },
    { id: 'p3', name: 'Bar Ticket Printer', ip: '192.168.1.203', paperSize: '58mm', autoCut: false, status: 'Online' },
  ]);

  const [testingId, setTestingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleTestPrint = (name: string, id: string) => {
    setTestingId(id);
    setTimeout(() => {
      setTestingId(null);
      triggerToast(`Test ticket printed on ${name}!`);
    }, 1200);
  };

  const handlePingTerminal = (name: string, id: string) => {
    setTestingId(id);
    setTimeout(() => {
      setTestingId(null);
      triggerToast(`${name} is active and responding (Latency 4ms)!`);
    }, 1000);
  };

  const handleTestDrawer = () => {
    triggerToast("Cash Drawer pulse signal sent — Drawer opened!");
  };

  return (
    <div className="max-w-4xl animate-fade-in pb-20 space-y-8">
      {renderSectionHeader("Hardware & Integrated Devices", "Receipt printers, kitchen display terminals, barcode scanners, and cash drawers.")}

      {toastMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 text-sm font-bold animate-fade-in">
          <CheckCircle2 size={18} /> {toastMessage}
        </div>
      )}

      {/* Terminals & KDS */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Monitor size={20} className="text-indigo-600" />
            <h4 className="font-bold text-slate-800 text-sm uppercase tracking-widest">Active POS Terminals & Displays</h4>
          </div>
          <button
            onClick={() => triggerToast("Network device scan completed. All 3 devices detected.")}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl text-xs font-bold transition-all"
          >
            <RefreshCw size={14} /> Detect Devices
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {terminals.map(t => (
            <div key={t.id} className="py-3 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900">{t.name}</span>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px] font-bold border border-emerald-200">{t.status}</span>
                </div>
                <p className="text-xs font-mono text-slate-400 mt-0.5">{t.type} • IP: {t.ip}</p>
              </div>

              <button
                onClick={() => handlePingTerminal(t.name, t.id)}
                disabled={testingId === t.id}
                className="px-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-indigo-600 hover:bg-indigo-50 transition-all flex items-center gap-1.5"
              >
                {testingId === t.id ? <RefreshCw size={12} className="animate-spin" /> : <Wifi size={14} />}
                Ping Device
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Receipt Printers */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Printer size={20} className="text-indigo-600" />
            <h4 className="font-bold text-slate-800 text-sm uppercase tracking-widest">Configured Receipt & Prep Printers</h4>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {printers.map(p => (
            <div key={p.id} className="py-4 flex items-center justify-between">
              <div>
                <span className="font-bold text-sm text-slate-900 block">{p.name}</span>
                <span className="text-xs font-mono text-slate-400">IP: {p.ip} | Paper: {p.paperSize} | Auto-cut: {p.autoCut ? 'Yes' : 'No'}</span>
              </div>

              <button
                onClick={() => handleTestPrint(p.name, p.id)}
                disabled={testingId === p.id}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-sm flex items-center gap-1.5"
              >
                {testingId === p.id ? <RefreshCw size={12} className="animate-spin" /> : <Printer size={14} />}
                Test Print
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Cash Drawer */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <h4 className="font-bold text-slate-800 text-sm uppercase tracking-widest">Cash Drawer Integration</h4>
          <button
            onClick={handleTestDrawer}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-md"
          >
            Kick Drawer Test
          </button>
        </div>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
            <span className="text-xs font-bold text-slate-700">Auto-open drawer on Cash Payments</span>
            <input type="checkbox" defaultChecked className="h-5 w-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
          </label>

          <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
            <span className="text-xs font-bold text-slate-700">Require Manager PIN to open drawer manually</span>
            <input type="checkbox" defaultChecked className="h-5 w-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
          </label>
        </div>
      </div>
    </div>
  );
};
