export interface InventoryItem {
  id: string;
  name: string;
  price: number;
  cost: number;
  category: string;
  modifierGroups: string[];
  printerLabels: string[];
  inStock: boolean;
  showOnPos: boolean;
  showOnline: boolean;
  showOnKiosk?: boolean;
  sku?: string;
  businessId?: string;
  posName?: string;
  description?: string;
  containsAlcohol?: boolean;
  prepStations?: string[];
  stationIds?: string[];
  deliveryPolicy?: 'KDS_ONLY' | 'PRINTER_ONLY' | 'BOTH';
  imageUrl?: string;
  stock?: number;
  barcode?: string;
}

export interface Category {
  id: string;
  name: string;
  itemsCount: number;
  modifierGroups: string[];
  showOnPos: boolean;
  showOnline: boolean;
  sku?: string;
  businessId?: string;
}

export interface ModifierOption {
  id: string;
  name: string;
  price: number;
  required?: boolean;
  inStock: boolean;
  onlineOrdering: boolean;
  onlineName?: string;
  label?: string;
  showOnline: boolean;
}

export interface ModifierGroup {
  id: string;
  name: string;
  required?: boolean;
  modifiersCount: number;
  itemsCount: number;
  showOnPos: boolean;
  showOnline: boolean;
  onlineOrdering?: boolean;
  modifiers?: ModifierOption[];
  sku?: string;
}

export interface PrinterLabel {
  id: string;
  name: string;
  itemsCount: number;
  assignedPrinter: string;
  isActive: boolean;
}

export interface PrinterDevice {
  ipAddress?: string;
  type?: string;
  status?: string;
  id: string;
  name: string;
  location?: string;
}

export interface DiscountCode {
  id: string;
  code?: string;
  name?: string;
  type: 'Percentage' | 'Fixed';
  value: number;
  usageCount?: number;
  status: 'Active' | 'Expired' | 'Default';
  applicability?: 'Item' | 'Order' | 'Category';
  taxCalculation?: 'BeforeTax' | 'AfterTax';
  showOnPos?: boolean;
  showOnline?: boolean;
}

export interface StockTrackingSettings {
  trackStock: boolean;
  autoUpdateCounts: boolean;
  allowNegativeCounts: boolean;
}
