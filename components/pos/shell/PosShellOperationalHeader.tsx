import React from 'react';
import { ArrowLeft, LogOut } from 'lucide-react';
import { Employee } from '../../../types';
import { PosInternalRoute } from './PosShellTypes';

interface PosShellOperationalHeaderProps {
  posRoute: PosInternalRoute;
  currentUser: Employee;
  onBackToHub: () => void;
}

const ROUTE_LABELS: Record<PosInternalRoute, string> = {
  HUB: 'App Hub',
  REGISTER: 'Counter Register',
  TABLES: 'Tables & Floor Plan',
  KDS: 'Kitchen Display System',
  ORDERS: 'Orders & History',
  RESERVATIONS: 'Host & Reservations',
  CASH_DRAWER: 'Cash Drawer Management',
  END_OF_DAY: 'End of Day Closeout',
  '86_AVAILABILITY': '86 / Item Availability Control',
  SHIFT_CLOCK: 'Shift Time Clock',
  POS_SETTINGS: 'POS Settings Hub',
  MANAGER_TOOLS: 'Manager & Device Tools',
  RETAIL_REGISTER: 'Retail Register',
  RETAIL_INVENTORY: 'Retail Inventory & POs',
  RETAIL_RETURNS: 'Returns & Exchanges',
  CUSTOMERS: 'Customer CRM',
  GIVING_REGISTER: 'Giving Register',
  GIVING_KIOSK: 'Giving Kiosk',
  DONOR_CRM: 'Donor CRM',
  KIOSK: 'Self-Service Kiosk',
};

export const PosShellOperationalHeader: React.FC<PosShellOperationalHeaderProps> = ({
  posRoute,
  currentUser,
  onBackToHub,
}) => {
  return (
    <header className="h-16 px-6 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0 shadow-md z-30">
      <div className="flex items-center space-x-4">
        <button
          onClick={onBackToHub}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs flex items-center gap-2 border border-slate-700 transition-colors shadow-sm"
        >
          <ArrowLeft size={18} />
          <span>Back to POS Hub</span>
        </button>

        <div className="h-6 w-px bg-slate-800"></div>

        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-sm font-black uppercase tracking-tight text-white">
            {ROUTE_LABELS[posRoute] || 'Operational App'}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <div className="text-right hidden sm:block">
          <span className="text-xs font-bold text-white block">{currentUser.name}</span>
          <span className="text-[10px] text-slate-400 block uppercase tracking-wider">{currentUser.role}</span>
        </div>
        <button
          onClick={onBackToHub}
          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700"
          title="Close to Hub"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
};
