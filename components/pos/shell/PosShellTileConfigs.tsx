import React from 'react';
import {
  ShoppingBag, FileText, RotateCcw, DollarSign, Clock, Coffee,
  Settings, LayoutGrid, Users, Wrench, Heart, Monitor, CreditCard,
  Utensils, Flame, EyeOff
} from 'lucide-react';
import { MerchantMode } from '../../../types/device';
import { Employee } from '../../../types';
import { PermissionService } from '../../../services/permissionService';
import { PosInternalRoute } from './PosShellTypes';

export const ROUTE_PERMISSION_MAP: Record<PosInternalRoute, string> = {
  HUB: '',
  REGISTER: 'pos.register.access',
  TABLES: 'pos.tables.access',
  KDS: 'pos.kds.access',
  ORDERS: 'pos.orders.access',
  RESERVATIONS: 'pos.reservations.access',
  CASH_DRAWER: 'pos.cash_drawer.access',
  END_OF_DAY: 'pos.closeout.access',
  '86_AVAILABILITY': 'pos.86.access',
  SHIFT_CLOCK: 'pos.shifts.access',
  POS_SETTINGS: 'pos.settings.access',
  CUSTOMERS: 'pos.customers.access',
  KIOSK: 'pos.kiosk.access',
  MANAGER_TOOLS: 'pos.diagnostics.access',
  RETAIL_REGISTER: 'pos.register.access',
  RETAIL_INVENTORY: 'pos.inventory.access',
  RETAIL_RETURNS: 'pos.refunds.access',
  GIVING_REGISTER: 'pos.register.access',
  GIVING_KIOSK: 'pos.kiosk.access',
  DONOR_CRM: 'pos.customers.access',
};

export interface AppTileConfig {
  id: PosInternalRoute;
  label: string;
  sub: string;
  icon: React.ReactNode;
  color: string;
  badge: string | null;
  page: 0 | 1;
  permissionRequired: string;
}

interface TileContext {
  mode: MerchantMode;
  openOrdersCount: number;
  drawerBalance: string;
  isClockedIn: boolean;
  clockInTime: string;
  activeTicketsCount: number;
  effectiveUser: Employee;
}

export const getAppTiles = (ctx: TileContext): AppTileConfig[] => {
  let rawTiles: AppTileConfig[] = [];

  if (ctx.mode === 'RETAIL') {
    rawTiles = [
      { id: 'RETAIL_REGISTER', label: 'Retail Register', sub: 'Scan barcodes, cart & fast checkout', icon: <ShoppingBag size={32} />, color: 'bg-indigo-600 hover:bg-indigo-700 text-white', badge: null, page: 0, permissionRequired: 'pos.register.access' },
      { id: 'ORDERS', label: 'Orders & Receipts', sub: 'Search receipts & transaction history', icon: <FileText size={32} />, color: 'bg-slate-800 hover:bg-slate-700 text-white', badge: ctx.openOrdersCount > 0 ? `${ctx.openOrdersCount} open` : null, page: 0, permissionRequired: 'pos.orders.access' },
      { id: 'RETAIL_RETURNS', label: 'Returns & Exchanges', sub: 'Process returns, restock & store credit', icon: <RotateCcw size={32} />, color: 'bg-amber-600 hover:bg-amber-700 text-white', badge: null, page: 0, permissionRequired: 'pos.refunds.access' },
      { id: 'CASH_DRAWER', label: 'Cash Drawer', sub: `Expected balance: ${ctx.drawerBalance}`, icon: <DollarSign size={32} />, color: 'bg-emerald-700 hover:bg-emerald-800 text-white', badge: null, page: 0, permissionRequired: 'pos.cash_drawer.access' },
      { id: 'END_OF_DAY', label: 'End of Day (EOD)', sub: 'Close business day & print Z-Report', icon: <Clock size={32} />, color: 'bg-rose-700 hover:bg-rose-800 text-white', badge: null, page: 0, permissionRequired: 'pos.closeout.access' },
      { id: 'SHIFT_CLOCK', label: 'Shift Clock', sub: ctx.isClockedIn ? `In since ${ctx.clockInTime}` : 'Clocked Out', icon: <Coffee size={32} />, color: 'bg-blue-800 hover:bg-blue-700 text-white', badge: ctx.isClockedIn ? 'ACTIVE' : null, page: 0, permissionRequired: 'pos.shifts.access' },
      { id: 'POS_SETTINGS', label: 'POS Settings', sub: 'Appliance setup, printers & policies', icon: <Settings size={32} />, color: 'bg-indigo-900 hover:bg-indigo-800 text-indigo-100', badge: null, page: 0, permissionRequired: 'pos.settings.access' },
      { id: 'RETAIL_INVENTORY', label: 'Inventory & POs', sub: 'Stock counts, shelf labels & POs', icon: <LayoutGrid size={32} />, color: 'bg-sky-700 hover:bg-sky-800 text-white', badge: null, page: 1, permissionRequired: 'pos.inventory.access' },
      { id: 'CUSTOMERS', label: 'Customer CRM', sub: 'Profiles, loyalty points & history', icon: <Users size={32} />, color: 'bg-teal-700 hover:bg-teal-800 text-white', badge: null, page: 1, permissionRequired: 'pos.customers.access' },
      { id: 'MANAGER_TOOLS', label: 'Hardware Diagnostics', sub: 'Thermal ESC/POS & cash drawer tests', icon: <Wrench size={32} />, color: 'bg-purple-900 hover:bg-purple-800 text-purple-100', badge: null, page: 1, permissionRequired: 'pos.diagnostics.access' },
    ];
  } else if (ctx.mode === 'NONPROFIT') {
    rawTiles = [
      { id: 'GIVING_REGISTER', label: 'Giving Register', sub: 'Sale + Charitable gift checkout', icon: <Heart size={32} />, color: 'bg-rose-600 hover:bg-rose-700 text-white', badge: null, page: 0, permissionRequired: 'pos.register.access' },
      { id: 'GIVING_KIOSK', label: 'Donation Kiosk', sub: 'Unattended donor giving station', icon: <Monitor size={32} />, color: 'bg-indigo-700 hover:bg-indigo-800 text-white', badge: null, page: 0, permissionRequired: 'pos.kiosk.access' },
      { id: 'ORDERS', label: 'Receipts & Tax Letters', sub: 'Reprint receipts & deductible reports', icon: <FileText size={32} />, color: 'bg-slate-800 hover:bg-slate-700 text-white', badge: null, page: 0, permissionRequired: 'pos.orders.access' },
      { id: 'CASH_DRAWER', label: 'Cash Drawer', sub: `Petty cash: ${ctx.drawerBalance}`, icon: <DollarSign size={32} />, color: 'bg-emerald-700 hover:bg-emerald-800 text-white', badge: null, page: 0, permissionRequired: 'pos.cash_drawer.access' },
      { id: 'END_OF_DAY', label: 'End of Day (EOD)', sub: 'Reconcile donations & Z-Report', icon: <Clock size={32} />, color: 'bg-rose-700 hover:bg-rose-800 text-white', badge: null, page: 0, permissionRequired: 'pos.closeout.access' },
      { id: 'SHIFT_CLOCK', label: 'Shift Clock', sub: 'Volunteer & staff hours log', icon: <Coffee size={32} />, color: 'bg-blue-800 hover:bg-blue-700 text-white', badge: null, page: 0, permissionRequired: 'pos.shifts.access' },
      { id: 'POS_SETTINGS', label: 'POS Settings', sub: 'Appliance policies & receipt headers', icon: <Settings size={32} />, color: 'bg-indigo-900 hover:bg-indigo-800 text-indigo-100', badge: null, page: 0, permissionRequired: 'pos.settings.access' },
      { id: 'DONOR_CRM', label: 'Donor CRM', sub: 'Constituent profiles & giving records', icon: <Users size={32} />, color: 'bg-teal-700 hover:bg-teal-800 text-white', badge: null, page: 1, permissionRequired: 'pos.customers.access' },
      { id: 'MANAGER_TOOLS', label: 'Hardware Diagnostics', sub: 'Thermal test & solenoid pulse', icon: <Wrench size={32} />, color: 'bg-purple-900 hover:bg-purple-800 text-purple-100', badge: null, page: 1, permissionRequired: 'pos.diagnostics.access' },
    ];
  } else {
    // RESTAURANT (default)
    rawTiles = [
      { id: 'REGISTER', label: 'Register', sub: 'Quick order entry & bar counter', icon: <CreditCard size={32} />, color: 'bg-indigo-600 hover:bg-indigo-700 text-white', badge: null, page: 0, permissionRequired: 'pos.register.access' },
      { id: 'TABLES', label: 'Tables & Dining', sub: 'Floor plan, seat courses & checks', icon: <Utensils size={32} />, color: 'bg-orange-600 hover:bg-orange-700 text-white', badge: 'Floors', page: 0, permissionRequired: 'pos.tables.access' },
      { id: 'KDS', label: 'Kitchen Display', sub: 'Station routing, line prep & Expo', icon: <Flame size={32} />, color: 'bg-amber-600 hover:bg-amber-700 text-white', badge: ctx.activeTicketsCount > 0 ? `${ctx.activeTicketsCount} active` : null, page: 0, permissionRequired: 'pos.kds.access' },
      { id: 'ORDERS', label: 'Orders & Receipts', sub: 'Open checks, takeout & order lookups', icon: <FileText size={32} />, color: 'bg-slate-800 hover:bg-slate-700 text-white', badge: ctx.openOrdersCount > 0 ? `${ctx.openOrdersCount} open` : null, page: 0, permissionRequired: 'pos.orders.access' },
      { id: 'RESERVATIONS', label: 'Host & Reservations', sub: 'Guest reservations & seating queue', icon: <Users size={32} />, color: 'bg-teal-700 hover:bg-teal-800 text-white', badge: null, page: 0, permissionRequired: 'pos.reservations.access' },
      { id: 'CASH_DRAWER', label: 'Cash Drawer', sub: `Current float: ${ctx.drawerBalance}`, icon: <DollarSign size={32} />, color: 'bg-emerald-800 hover:bg-emerald-700 text-white', badge: null, page: 0, permissionRequired: 'pos.cash_drawer.access' },
      { id: 'END_OF_DAY', label: 'End of Day (EOD)', sub: 'Close business day & Z-Report', icon: <Clock size={32} />, color: 'bg-rose-700 hover:bg-rose-800 text-white', badge: null, page: 0, permissionRequired: 'pos.closeout.access' },
      { id: '86_AVAILABILITY', label: '86 / Availability', sub: 'Quick item out-of-stock toggle', icon: <EyeOff size={32} />, color: 'bg-stone-800 hover:bg-stone-700 text-amber-300 border border-amber-500/30', badge: null, page: 0, permissionRequired: 'pos.86.access' },
      { id: 'SHIFT_CLOCK', label: 'Shift Clock', sub: ctx.isClockedIn ? `In since ${ctx.clockInTime}` : 'Clocked Out', icon: <Coffee size={32} />, color: 'bg-blue-800 hover:bg-blue-700 text-white', badge: ctx.isClockedIn ? 'ACTIVE' : null, page: 0, permissionRequired: 'pos.shifts.access' },
      { id: 'POS_SETTINGS', label: 'POS Settings', sub: 'Appliance config, stations & rules', icon: <Settings size={32} />, color: 'bg-indigo-900 hover:bg-indigo-800 text-indigo-100', badge: null, page: 0, permissionRequired: 'pos.settings.access' },
      { id: 'CUSTOMERS', label: 'Customer CRM', sub: 'Guest profiles, loyalty & history', icon: <Users size={32} />, color: 'bg-teal-700 hover:bg-teal-800 text-white', badge: null, page: 1, permissionRequired: 'pos.customers.access' },
      { id: 'KIOSK', label: 'Customer Kiosk', sub: 'Self-order touch screen mode', icon: <Monitor size={32} />, color: 'bg-indigo-800 hover:bg-indigo-700 text-white', badge: null, page: 1, permissionRequired: 'pos.kiosk.access' },
      { id: 'RETAIL_RETURNS', label: 'Refunds & Voids', sub: 'Item voids, returns & store credit', icon: <RotateCcw size={32} />, color: 'bg-amber-700 hover:bg-amber-600 text-white', badge: null, page: 1, permissionRequired: 'pos.refunds.access' },
      { id: 'MANAGER_TOOLS', label: 'Hardware Diagnostics', sub: 'Thermal ESC/POS & solenoid pulse', icon: <Wrench size={32} />, color: 'bg-purple-900 hover:bg-purple-800 text-purple-100', badge: null, page: 1, permissionRequired: 'pos.diagnostics.access' },
    ];
  }

  // Purely permission-driven filtering - No hardcoded role string heuristics
  return rawTiles.filter(t => {
    return PermissionService.can(ctx.effectiveUser, t.permissionRequired);
  });
};
