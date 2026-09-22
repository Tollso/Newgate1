import React, { useState } from 'react';
import { User, Lock, Shield, CreditCard, Smartphone, Moon, Bell, Building, Clock, MapPin, Globe } from 'lucide-react';

interface EditorProps {
  categoryId: string;
  selectedPageId: string | null;
  onFieldChange: () => void;
}

export const ProfileAndBusinessEditor: React.FC<EditorProps> = ({
  categoryId,
  selectedPageId,
  onFieldChange
}) => {
  const [profileName, setProfileName] = useState('Senior Store Manager');
  const [profileEmail, setProfileEmail] = useState('manager@bytepos.com');
  const [profilePhone, setProfilePhone] = useState('+1 (555) 234-5678');
  const [personalPin, setPersonalPin] = useState('8832');
  const [businessName, setBusinessName] = useState('Grand Bistro & Nightclub');
  const [businessType, setBusinessType] = useState('Restaurant & Bar');
  const [rolloverTime, setRolloverTime] = useState('04:00 AM');
  const [weekStart, setWeekStart] = useState('Monday');

  if (categoryId === 'profile_security') {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-indigo-600 font-bold">
            <User size={18} />
            <h3 className="text-sm uppercase tracking-wider text-slate-800">1. Personal Profile & Credentials</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Full Name</label>
              <input
                type="text"
                value={profileName}
                onChange={(e) => { setProfileName(e.target.value); onFieldChange(); }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Email Address</label>
              <input
                type="email"
                value={profileEmail}
                onChange={(e) => { setProfileEmail(e.target.value); onFieldChange(); }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Phone Number</label>
              <input
                type="text"
                value={profilePhone}
                onChange={(e) => { setProfilePhone(e.target.value); onFieldChange(); }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Personal POS Terminal PIN</label>
              <input
                type="password"
                maxLength={4}
                value={personalPin}
                onChange={(e) => { setPersonalPin(e.target.value); onFieldChange(); }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold"
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-indigo-600 font-bold">
            <Shield size={18} />
            <h3 className="text-sm uppercase tracking-wider text-slate-800">Two-Factor Authentication & Active Sessions</h3>
          </div>
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800 font-medium">
            <span>2FA Authenticator App Enabled (Google Authenticator / Authy)</span>
            <button className="px-2.5 py-1 bg-emerald-600 text-white rounded font-bold hover:bg-emerald-700">Manage 2FA</button>
          </div>
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700">Active Terminals & Signed-In Devices</h4>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-800">Bar Terminal #1 (iPad Air)</span>
                <span className="block text-[10px] text-slate-400">Downtown Bistro • Active now</span>
              </div>
              <button className="text-rose-600 hover:underline font-bold">Sign Out</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-indigo-600 font-bold">
          <Building size={18} />
          <h3 className="text-sm uppercase tracking-wider text-slate-800">2. Business Profile & Multi-Location Overview</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Legal Business Name</label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => { setBusinessName(e.target.value); onFieldChange(); }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Primary Business Type</label>
            <select
              value={businessType}
              onChange={(e) => { setBusinessType(e.target.value); onFieldChange(); }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
            >
              <option value="Restaurant & Bar">Restaurant & Bar / Nightclub</option>
              <option value="Quick Service">Quick Service / Cafe</option>
              <option value="Fine Dining">Fine Dining & Catering</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-indigo-50/70 border border-indigo-200 p-5 rounded-2xl space-y-3">
        <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs">
          <Clock size={16} className="text-indigo-600" />
          <span>Business Day & Overnight Rollover Settings</span>
        </div>
        <p className="text-xs text-indigo-950 leading-relaxed font-medium">
          The business-day rollover is especially useful for your bar/nightclub operations: transactions after midnight can remain part of the previous evening's service.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Business Day Rollover Cutoff Time</label>
            <select
              value={rolloverTime}
              onChange={(e) => { setRolloverTime(e.target.value); onFieldChange(); }}
              className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-lg text-xs font-bold text-indigo-900"
            >
              <option value="02:00 AM">02:00 AM (Early Bar Close)</option>
              <option value="04:00 AM">04:00 AM (Recommended for Nightclubs)</option>
              <option value="05:00 AM">05:00 AM (Late Night Service)</option>
              <option value="06:00 AM">06:00 AM (Morning Shift Start)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Reporting Week Start Day</label>
            <select
              value={weekStart}
              onChange={(e) => { setWeekStart(e.target.value); onFieldChange(); }}
              className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-lg text-xs font-bold text-indigo-900"
            >
              <option value="Monday">Monday</option>
              <option value="Sunday">Sunday</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
