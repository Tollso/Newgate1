export type OperatingMode = 'Coffee Only' | 'Restaurant Only' | 'Hybrid (Both)' | 'Custom';

export interface MenuItemAssignment {
  itemId: string;
  categoryId: string;
  sortOrder?: number;
  isAvailableOnKiosk: boolean;
  customDisplayName?: string;
  priceOverride?: number;
}

export interface KioskCategoryConfig {
  id: string;
  name: string;
  sortOrder: number;
  isVisible: boolean;
  icon?: string;
  timeAvailability?: {
    enabled: boolean;
    startHour: number; // 0-23
    endHour: number;   // 0-23
  };
  assignedItemIds: string[];
}

export interface KioskConfig {
  enabled?: boolean;
  operatingMode: OperatingMode;
  welcomeMessage: string;
  themeColor: 'indigo' | 'slate' | 'rose' | 'emerald' | 'amber';
  layout: 'bottom-cart' | 'sidebar-right' | 'sidebar-left' | 'grid-only';
  requireCustomerName: boolean;
  showItemImages: boolean;
  timeoutSeconds: number;
  idleTimeoutSeconds?: number;
  bannerImageUrl?: string;
  brandColor?: string;
  allowCashPayment?: boolean;
  customFlowName?: string;
  categories?: KioskCategoryConfig[];
  itemAssignments?: MenuItemAssignment[];
  updatedAt?: string;
}
