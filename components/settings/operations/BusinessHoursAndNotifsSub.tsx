import React, { useState } from 'react';
import { Clock, Bell, CheckCircle2, Shield } from 'lucide-react';

interface BusinessHoursAndNotifsSubProps {
  renderSectionHeader: (title: string, description: string, parentSection?: string) => React.ReactNode;
  mode: 'hours' | 'notifs';
  businessHours: any[];
  setBusinessHours: (val: any[]) => void;
  notifications: Record<string, boolean>;
  setNotifications: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

export const BusinessHoursAndNotifsSub: React.FC<BusinessHoursAndNotifsSubProps> = ({
  renderSectionHeader,
  mode,
  businessHours,
  setBusinessHours,
  notifications,
  setNotifications
}) => {
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setSavedMessage(msg);
    setTimeout(() => setSavedMessage(null), 3000);
  };

  if (mode === 'hours') {
    return (
      <div className="max-w-4xl animate-fade-in pb-20 space-y-8">
        {renderSectionHeader("Store Business Hours", "Set weekly opening and closing schedules for your location.", "Business operations")}
        
        {savedMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 text-sm font-bold animate-fade-in">
            <CheckCircle2 size={18} /> {savedMessage}
          </div>
        )}

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-6">
          <div className="space-y-4">
            {businessHours.map((item, index) => (
              <div key={item.day} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 gap-4">
                <div className="flex items-center gap-3 w-36">
                  <Clock size={18} className="text-indigo-600 shrink-0" />
                  <span className="font-bold text-sm text-slate-800">{item.day}</span>
                </div>

                <div className="flex items-center gap-3 flex-1">
                  <input
                    type="time"
                    disabled={item.closed}
                    value={item.open}
                    onChange={e => {
                      const updated = [...businessHours];
                      updated[index].open = e.target.value;
                      setBusinessHours(updated);
                    }}
                    className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-700 bg-white disabled:bg-slate-100 disabled:text-slate-400 outline-none"
                  />
                  <span className="text-xs font-bold text-slate-400">to</span>
                  <input
                    type="time"
                    disabled={item.closed}
                    value={item.close}
                    onChange={e => {
                      const updated = [...businessHours];
                      updated[index].close = e.target.value;
                      setBusinessHours(updated);
                    }}
                    className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-700 bg-white disabled:bg-slate-100 disabled:text-slate-400 outline-none"
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={item.closed}
                    onChange={e => {
                      const updated = [...businessHours];
                      updated[index].closed = e.target.checked;
                      setBusinessHours(updated);
                    }}
                    className="h-4 w-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                  />
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">Closed</span>
                </label>
              </div>
            ))}
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={() => triggerToast("Weekly business hours updated successfully!")}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-md transition-all"
            >
              Save Schedule
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl animate-fade-in pb-20 space-y-8">
      {renderSectionHeader("Notification Preferences", "Manage automated reports, inventory alerts, and security notifications.", "Business operations")}
      
      {savedMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 text-sm font-bold animate-fade-in">
          <CheckCircle2 size={18} /> {savedMessage}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-6">
        <div className="space-y-4">
          <label className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
            <div className="flex items-center gap-3">
              <Bell size={20} className="text-indigo-600" />
              <div>
                <span className="text-sm font-bold text-slate-800 block">Daily Email Receipts & Sales Summaries</span>
                <span className="text-xs text-slate-500 font-medium">Send aggregated end-of-day revenue reports to store owner</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={notifications.dailySummary ?? true}
              onChange={e => setNotifications({ ...notifications, dailySummary: e.target.checked })}
              className="h-5 w-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
            />
          </label>

          <label className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
            <div className="flex items-center gap-3">
              <Bell size={20} className="text-indigo-600" />
              <div>
                <span className="text-sm font-bold text-slate-800 block">Low Stock Inventory Alerts</span>
                <span className="text-xs text-slate-500 font-medium">Trigger instant alert when stock count drops below reorder threshold</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={notifications.inventoryAlerts ?? true}
              onChange={e => setNotifications({ ...notifications, inventoryAlerts: e.target.checked })}
              className="h-5 w-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
            />
          </label>

          <label className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
            <div className="flex items-center gap-3">
              <Shield size={20} className="text-indigo-600" />
              <div>
                <span className="text-sm font-bold text-slate-800 block">Security Audit & Void Threshold Alerts</span>
                <span className="text-xs text-slate-500 font-medium">Notify admin if item voids or manager overrides exceed 5 per shift</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={notifications.securityAlerts ?? true}
              onChange={e => setNotifications({ ...notifications, securityAlerts: e.target.checked })}
              className="h-5 w-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
            />
          </label>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            onClick={() => triggerToast("Notification rules saved!")}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-md transition-all"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};
