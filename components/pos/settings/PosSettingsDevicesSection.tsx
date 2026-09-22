import React, { useState } from 'react';
import { Printer, DollarSign } from 'lucide-react';
import { NativeBridge } from '../../../services/nativeBridge';
import { Employee } from '../../../types';

interface PosSettingsDevicesSectionProps {
  currentUser: Employee;
  printerIp: string;
  setPrinterIp: (val: string) => void;
  printerPort: number;
  setPrinterPort: (val: number) => void;
}

export const PosSettingsDevicesSection: React.FC<PosSettingsDevicesSectionProps> = ({
  currentUser,
  printerIp,
  setPrinterIp,
  printerPort,
  setPrinterPort,
}) => {
  const [testPrintSuccess, setTestPrintSuccess] = useState<boolean | null>(null);
  const [drawerKickSuccess, setDrawerKickSuccess] = useState<boolean | null>(null);

  const handleTestPrint = async () => {
    NativeBridge.beep(2000, 100);
    const receiptSample = `
================================
       THE NEWGATE POS
       LUMI RESTAURANT
================================
DATE: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}
TERMINAL: DEV-POS-01 (ANDROID HAL)
CASHIER: ${currentUser.name}
--------------------------------
1x COLD BREW COFFEE       $4.50
1x AVOCADO ARTISAN TOAST  $9.50
--------------------------------
SUBTOTAL:                $14.00
TAX (8.25%):              $1.16
TOTAL:                   $15.16
================================
   PRINTER TEST SUCCESSFUL!
================================
`;
    const res = await NativeBridge.printReceipt(receiptSample, printerIp, printerPort);
    setTestPrintSuccess(res);
    setTimeout(() => setTestPrintSuccess(null), 3000);
  };

  const handleDrawerKick = async () => {
    const res = await NativeBridge.pulseCashDrawer(printerIp, printerPort);
    setDrawerKickSuccess(res);
    setTimeout(() => setDrawerKickSuccess(null), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <h3 className="text-xl font-bold text-white">Thermal Receipt Printer</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-400 uppercase font-mono font-bold block mb-1">Printer IP Address</label>
            <input
              type="text"
              value={printerIp}
              onChange={e => setPrinterIp(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase font-mono font-bold block mb-1">Printer Port (ESC/POS)</label>
            <input
              type="number"
              value={printerPort}
              onChange={e => setPrinterPort(parseInt(e.target.value) || 9100)}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono text-sm"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-4 pt-2">
          <button
            onClick={handleTestPrint}
            className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg"
          >
            <Printer size={16} />
            <span>Send Test ESC/POS Receipt</span>
          </button>

          <button
            onClick={handleDrawerKick}
            className="px-5 py-3 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg"
          >
            <DollarSign size={16} />
            <span>Pulse Cash Drawer Solenoid</span>
          </button>
        </div>

        {testPrintSuccess !== null && (
          <div className="p-3 bg-emerald-950/60 border border-emerald-800 text-emerald-300 rounded-xl text-xs font-bold">
            ✓ Receipt printed through NativeBridge HAL!
          </div>
        )}

        {drawerKickSuccess !== null && (
          <div className="p-3 bg-emerald-950/60 border border-emerald-800 text-emerald-300 rounded-xl text-xs font-bold">
            ✓ Solenoid kick command dispatched (ESC p 0 25 250)!
          </div>
        )}
      </div>
    </div>
  );
};
