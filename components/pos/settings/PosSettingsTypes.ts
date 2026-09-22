import { Employee, InventoryItem, DiningTable, TipConfig, GlobalTaxConfig, KDSSettings } from '../../../types';

export interface PosSettingsHubProps {
  currentUser: Employee;
  employees: Employee[];
  inventory: InventoryItem[];
  tables: DiningTable[];
  tipConfig?: TipConfig;
  taxConfig?: GlobalTaxConfig;
  kdsSettings?: KDSSettings;
  onExit: () => void;
  onOpenWebAdmin?: () => void;
  onSaveItem?: (item: InventoryItem) => void;
  onUpdateTable?: (table: DiningTable) => void;
  onUpdateEmployee?: (employee: Employee) => void;
}

export type SettingsSection =
  | 'OVERVIEW'
  | 'EMPLOYEES'
  | 'MENU'
  | 'TABLES'
  | 'KITCHEN'
  | 'TIPS'
  | 'CASH'
  | 'DEVICES'
  | 'RECEIPTS'
  | 'NETWORK'
  | 'SECURITY'
  | 'HELP';
