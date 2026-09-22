import React from 'react';
import {
  Users, Utensils, LayoutGrid, Flame, DollarSign, Clock,
  Printer, Receipt, Activity, Shield, HelpCircle, ChevronRight
} from 'lucide-react';
import { SettingsSection } from './PosSettingsTypes';
import { DiningTable, Employee } from '../../../types';
import { StationConfig } from '../../../services/kitchenRoutingService';
import { PermissionService } from '../../../services/permissionService';
import { Lock } from 'lucide-react';

interface PosSettingsOverviewGridProps {
  onSelectSection: (section: SettingsSection) => void;
  tables: DiningTable[];
  stations: StationConfig[];
  batteryLevel: number;
  currentUser?: Employee;
}

export const PosSettingsOverviewGrid: React.FC<PosSettingsOverviewGridProps> = ({
  onSelectSection,
  tables,
  stations,
  batteryLevel,
  currentUser,
}) => {
  const canManageStaff = currentUser ? PermissionService.can(currentUser, 'roles.permissions.manage') : true;

  const sections = [
    {
      id: 'EMPLOYEES' as SettingsSection,
      name: 'Employees & Passcodes',
      desc: 'Staff roster, PIN passcodes, and override privileges',
      icon: <Users size={26} />,
      color: 'indigo',
      requiresPerm: 'roles.permissions.manage',
      hasPerm: canManageStaff,
    },
    {
      id: 'MENU' as SettingsSection,
      name: 'Menu & 86 Items',
      desc: 'Item stock toggles, prices, and categories',
      icon: <Utensils size={26} />,
      color: 'amber',
    },
    {
      id: 'TABLES' as SettingsSection,
      name: 'Tables & Floor Layout',
      desc: `${tables.length} tables active across dining sections`,
      icon: <LayoutGrid size={26} />,
      color: 'orange',
    },
    {
      id: 'KITCHEN' as SettingsSection,
      name: 'Kitchen Stations & KDS',
      desc: `${stations.length} prep stations, Expo mode & routing`,
      icon: <Flame size={26} />,
      color: 'rose',
    },
    {
      id: 'TIPS' as SettingsSection,
      name: 'Tips & Service Charges',
      desc: 'Suggested tip % and auto-gratuity party rules',
      icon: <DollarSign size={26} />,
      color: 'emerald',
    },
    {
      id: 'CASH' as SettingsSection,
      name: 'Cash & Closeout Rules',
      desc: 'Float defaults, blind close & variance alert thresholds',
      icon: <Clock size={26} />,
      color: 'teal',
    },
    {
      id: 'DEVICES' as SettingsSection,
      name: 'Devices & Printers',
      desc: 'Thermal ESC/POS, cash drawer kick & barcode scanners',
      icon: <Printer size={26} />,
      color: 'cyan',
    },
    {
      id: 'RECEIPTS' as SettingsSection,
      name: 'Receipts & Slips',
      desc: 'Header text, footer notes & kitchen chit layout',
      icon: <Receipt size={26} />,
      color: 'violet',
    },
    {
      id: 'NETWORK' as SettingsSection,
      name: 'Network & Diagnostics',
      desc: `Cloud sync, local IP & terminal battery (${batteryLevel}%)`,
      icon: <Activity size={26} />,
      color: 'blue',
    },
    {
      id: 'SECURITY' as SettingsSection,
      name: 'Terminal Security',
      desc: 'Auto-lock, manager PIN overrides & Kiosk LockTask',
      icon: <Shield size={26} />,
      color: 'red',
    },
    {
      id: 'HELP' as SettingsSection,
      name: 'Help & Appliance Info',
      desc: 'App v2.4.0 Android Appliance Edition • Logs',
      icon: <HelpCircle size={26} />,
      color: 'slate',
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-black text-white tracking-tight">Appliance Configuration</h2>
        <p className="text-sm text-slate-400">Touch a card to manage terminal policies, hardware, and operational rules</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {sections.map((sec) => (
          <button
            key={sec.id}
            onClick={() => onSelectSection(sec.id)}
            className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-850 text-left transition-all group flex flex-col justify-between h-44 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 bg-slate-800 text-slate-300 group-hover:text-indigo-400 rounded-xl border border-slate-700 transition-colors">
                {sec.icon}
              </div>
              <div className="flex items-center gap-2">
                {sec.requiresPerm && !sec.hasPerm && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-mono">
                    <Lock size={10} />
                    <span>Manager Override</span>
                  </span>
                )}
                <ChevronRight className="text-slate-600 group-hover:text-indigo-400 transition-colors" size={20} />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-black text-white">{sec.name}</h3>
              <p className="text-xs text-slate-400 line-clamp-2 mt-1">{sec.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
