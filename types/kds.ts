import { UserRole } from './business';
import { DiningOrderItem } from './dining';

export interface KitchenPayload {
  orderId: string;
  tableId: string;
  serverName: string;
  guestCount: number;
  items: DiningOrderItem[];
  timestamp: string;
  notes?: string;
}

export interface KDSStation {
  id: string;
  name: string;
  printerId?: string;
  screenId?: string;
}

export type KDSRoutingMode = 'KDS_ONLY' | 'PRINTER_ONLY' | 'BOTH';
export type KDSLayoutMode = 'GRID' | 'LIST' | 'SPLIT_BY_STATION';
export type KDSGroupingMode = 'COURSE' | 'TABLE' | 'PREP_STATION' | 'GUEST';
export type KDSColoringMode = 'STATUS' | 'PRIORITY' | 'TIME_BASED';

export interface KDSSettings {
  isEnabled: boolean;
  routingMode: KDSRoutingMode;
  autoReleaseTable: boolean;
  
  stations: KDSStation[];
  itemRouting: { category: string; stationIds: string[] }[];
  
  warningThresholdMinutes: number;
  criticalThresholdMinutes: number;
  
  layoutMode: KDSLayoutMode;
  ticketGrouping: KDSGroupingMode;
  colorCoding: KDSColoringMode;
  showCompletedHistory: boolean;
  ticketSize: 'COMPACT' | 'EXPANDED';
  showTimers: boolean;
  fontSize: 'SMALL' | 'MEDIUM' | 'LARGE';
  contrastMode: 'NORMAL' | 'HIGH';
  
  enableItemStatusTracking: boolean;
  allowBumpRecall: boolean;
  groupItemsByGuest: boolean;
  enablePriorityHighlighting: boolean;
  
  soundAlerts: boolean;
  visualAlerts: boolean;
  printerBackup: boolean;
  errorLogging: boolean;
  
  allowedEditRoles: UserRole[];
  auditLogChanges: boolean;
  realtimeSync: boolean;
  maintenanceMode: boolean;

  showServer?: boolean;
  showTable?: boolean;
}

export interface KitchenTicket {
  id: string;
  orderId: string;
  type: 'Dine-in' | 'Takeout' | 'Delivery' | 'Kiosk';
  items: {
    name: string;
    qty: number;
    modifiers: string[];
    seatNumber?: number;
    status?: 'Pending' | 'Prep' | 'Ready' | 'Served';
    printerLabels?: string[];
  }[];
  status: 'Pending' | 'Prep' | 'Ready' | 'Delivered';
  timeIn: string;
  table?: string;
  server?: string;
  serverEmployeeId?: string;
  priority?: boolean;
}

export interface KitchenMetric {
  metric: string;
  value: string | number;
  trend: 'up' | 'down' | 'neutral';
}

export type KDSStationName = 'Hot' | 'Cold' | 'Bar' | 'Expo';

export interface KDSTicketItem {
  id: string;
  name: string;
  quantity: number;
  modifiers?: string[];
  notes?: string;
  status: 'PENDING' | 'PREPARING' | 'READY' | 'SERVED';
}

export interface KDSTicket {
  id: string;
  orderId: string;
  orderNumber: string;
  tableNumber?: string;
  serverName?: string;
  orderType: 'DINE_IN' | 'TAKEOUT' | 'DELIVERY';
  station: KDSStationName | string;
  status: 'NEW' | 'PREPARING' | 'READY' | 'COMPLETED';
  items: KDSTicketItem[];
  createdAt: string;
  timeElapsedMinutes?: number;
}

