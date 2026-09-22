import React from 'react';
import { ArrowLeft, Sliders, Globe } from 'lucide-react';
import { SettingsSection } from './PosSettingsTypes';
import { Employee } from '../../../types';

interface PosSettingsHeaderProps {
  activeSection: SettingsSection;
  onBack: () => void;
  currentUser: Employee;
  isSuperAdminOrAdmin: boolean;
  onOpenWebAdmin?: () => void;
}

export const PosSettingsHeader: React.FC<PosSettingsHeaderProps> = ({
  activeSection,
  onBack,
  currentUser,
  isSuperAdminOrAdmin,
  onOpenWebAdmin,
}) => {
  return (
    <header className="h-16 px-6 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0 shadow-md">
      <div className="flex items-center space-x-4">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 border border-slate-700 transition-colors shadow-sm"
        >
          <ArrowLeft size={16} />
          <span>{activeSection === 'OVERVIEW' ? 'Back to POS Hub' : 'All Settings'}</span>
        </button>

        <div className="h-6 w-px bg-slate-800"></div>

        <div className="flex items-center space-x-2">
          <Sliders className="text-indigo-400" size={20} />
          <h1 className="text-base font-black uppercase tracking-tight text-white">
            POS Terminal Settings & Control
          </h1>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <span className="text-xs text-slate-400 font-mono hidden md:inline">
          Operator: <span className="text-white font-bold">{currentUser.name}</span> ({currentUser.role})
        </span>

        {isSuperAdminOrAdmin && onOpenWebAdmin && (
          <button
            onClick={onOpenWebAdmin}
            className="px-3 py-1.5 bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-800 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <Globe size={14} />
            <span>Open Web Admin</span>
          </button>
        )}
      </div>
    </header>
  );
};
