import React from 'react';
import { Building2, MapPin, Monitor, User, ShieldCheck, History, Save, Clock, Info } from 'lucide-react';

interface SettingsHeaderScopeBarProps {
  currentScope: 'organization' | 'location' | 'device' | 'personal';
  setCurrentScope: (scope: 'organization' | 'location' | 'device' | 'personal') => void;
  selectedLocation: string;
  setSelectedLocation: (loc: string) => void;
  isDraft: boolean;
  hasUnsavedChanges: boolean;
  onSave: () => void;
  onSaveDraft: () => void;
  onViewHistory: () => void;
}

export const SettingsHeaderScopeBar: React.FC<SettingsHeaderScopeBarProps> = ({
  currentScope,
  setCurrentScope,
  selectedLocation,
  setSelectedLocation,
  isDraft,
  hasUnsavedChanges,
  onSave,
  onSaveDraft,
  onViewHistory
}) => {
  return (
    <div className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-xs">
      {/* Top Scope and Status Bar */}
      <div className="px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Scope Selector */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Scope Selector:</span>
          <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setCurrentScope('organization')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                currentScope === 'organization'
                  ? 'bg-white text-indigo-600 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 size={14} />
              <span>Organization</span>
            </button>
            <button
              onClick={() => setCurrentScope('location')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                currentScope === 'location'
                  ? 'bg-white text-indigo-600 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MapPin size={14} />
              <span>Location</span>
            </button>
            <button
              onClick={() => setCurrentScope('device')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                currentScope === 'device'
                  ? 'bg-white text-indigo-600 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Monitor size={14} />
              <span>Device Profile</span>
            </button>
            <button
              onClick={() => setCurrentScope('personal')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                currentScope === 'personal'
                  ? 'bg-white text-indigo-600 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User size={14} />
              <span>Personal</span>
            </button>
          </div>

          {currentScope === 'location' && (
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Downtown Bistro">Downtown Bistro (#101)</option>
              <option value="Uptown Lounge">Uptown Lounge & Nightclub (#102)</option>
              <option value="Westside Patio">Westside Patio & Grill (#103)</option>
            </select>
          )}
        </div>

        {/* Save & Draft Actions */}
        <div className="flex items-center gap-3">
          {hasUnsavedChanges && (
            <span className="flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md animate-pulse">
              <Clock size={12} />
              Unsaved Draft Changes
            </span>
          )}
          {!hasUnsavedChanges && (
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
              <ShieldCheck size={12} />
              Published & Live
            </span>
          )}

          <button
            onClick={onViewHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all"
          >
            <History size={14} />
            <span>Audit History</span>
          </button>

          <button
            onClick={onSaveDraft}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-600 border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-all"
          >
            Save Draft
          </button>

          <button
            onClick={onSave}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all active:scale-95"
          >
            <Save size={14} />
            <span>Publish Changes</span>
          </button>
        </div>
      </div>

      {/* Inheritance & Scope Warning Bar */}
      <div className="bg-slate-50 border-t border-slate-100 px-6 py-2 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <Info size={14} className="text-indigo-500 shrink-0" />
          <span>
            {currentScope === 'organization' && 'Editing master defaults for all store locations. Local locations can override specific options if permitted.'}
            {currentScope === 'location' && `Editing active parameters for ${selectedLocation}. Options marked as "Inherited" use Organization defaults.`}
            {currentScope === 'device' && 'Editing hardware terminal profile (Bar POS / Kitchen KDS). Rules apply to all paired terminals in this profile.'}
            {currentScope === 'personal' && 'Editing current authenticated staff member profile and personal terminal preferences.'}
          </span>
        </div>
        <span className="font-semibold text-slate-400">Mode: Admin View & Edit</span>
      </div>
    </div>
  );
};
