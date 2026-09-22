import React, { useState } from 'react';
import { BarChart3, MonitorSmartphone, Layers, Server } from 'lucide-react';

interface EditorProps {
  categoryId: string;
  selectedPageId: string | null;
  onFieldChange: () => void;
}

export const ReportsAndDevicesEditor: React.FC<EditorProps> = ({
  categoryId,
  selectedPageId,
  onFieldChange
}) => {
  const [glProvider, setGlProvider] = useState('QuickBooks Online');
  const [deviceProfile, setDeviceProfile] = useState('Bar Terminal Mode');

  if (categoryId === 'reports_accounting') {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-indigo-600 font-bold">
            <BarChart3 size={18} />
            <h3 className="text-sm uppercase tracking-wider text-slate-800">17. Accounting Integration & GL Chart of Accounts</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Accounting Provider Link</label>
              <select
                value={glProvider}
                onChange={(e) => { setGlProvider(e.target.value); onFieldChange(); }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
              >
                <option value="QuickBooks Online">QuickBooks Online</option>
                <option value="Xero">Xero Accounting</option>
                <option value="Sage Intacct">Sage Intacct</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Automated Sync Frequency</label>
              <select
                defaultValue="Nightly at 04:00 AM"
                onChange={onFieldChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
              >
                <option value="Nightly at 04:00 AM">Nightly Post-Close (04:00 AM)</option>
                <option value="Real-time per sale">Real-time per transaction</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-indigo-50/70 border border-indigo-200 p-5 rounded-2xl space-y-3">
        <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs">
          <MonitorSmartphone size={16} className="text-indigo-600" />
          <span>Reusable Hardware Device Profiles</span>
        </div>
        <p className="text-xs text-indigo-950 leading-relaxed font-medium">
          Reusable device profiles help you configure several terminals consistently. Square uses reusable modes for shared checkout, security, and other settings.
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-indigo-600 font-bold">
          <MonitorSmartphone size={18} />
          <h3 className="text-sm uppercase tracking-wider text-slate-800">18. Device Directory & Profiles</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="font-bold text-xs text-slate-800 block">Bar Terminal Profile</span>
            <span className="text-[10px] text-slate-500">4 Terminals • Fast Bar UI</span>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="font-bold text-xs text-slate-800 block">Floor Handheld Profile</span>
            <span className="text-[10px] text-slate-500">8 Mobiles • Mobile Tableside</span>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="font-bold text-xs text-slate-800 block">Kitchen KDS Profile</span>
            <span className="text-[10px] text-slate-500">3 Monitors • High-Contrast</span>
          </div>
        </div>
      </div>
    </div>
  );
};
