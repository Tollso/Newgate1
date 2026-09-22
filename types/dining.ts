import { CartItem } from './orders';

export interface FloorPlan {
  id: string;
  name: string;
  sections: string[];
}

export type FloorItemType = 
  | 'TABLE_RECT' | 'TABLE_SQUARE' | 'TABLE_ROUND' 
  | 'BOOTH_SINGLE' | 'BOOTH_DOUBLE' | 'BOOTH_L' | 'BOOTH_CURVE'
  | 'COUCH_STRAIGHT' | 'COUCH_L'
  | 'PLANT_MONSTERA' | 'PLANT_BANANA' | 'PLANT_PALM' | 'PLANT_SHRUB'
  | 'DECOR_WALL' | 'DECOR_WINDOW' | 'DECOR_DOOR' 
  | 'DECOR_PIANO' | 'DECOR_RUG_RECT' | 'DECOR_RUG_ROUND'
  | 'FURNITURE_BAR' | 'FURNITURE_SHELF' | 'FURNITURE_COUNTER' 
  | 'EQUIP_KIOSK' | 'EQUIP_REGISTER' | 'EQUIP_POS' | 'EQUIP_TV' | 'EQUIP_FRIDGE'
  | 'EQUIP_KITCHEN' | 'DECOR_LIGHTING' | 'WAITING_CHAIR'
  | 'DANCE_FLOOR' | 'DJ_BOOTH' | 'VIP_SECTION' | 'STAGE'
  | 'STYLING_STATION' | 'MIRROR' | 'WASH_STATION' | 'TREATMENT_ROOM'
  | 'WORKOUT_ZONE' | 'GYM_EQUIPMENT' | 'LOCKER_ROOM'
  | 'RECEPTION_DESK' | 'QUEUE_LINE' | 'MEDICAL_BED' | 'PRODUCT_DISPLAY'
  | 'DECOR_BILLIARDS';

export interface DiningTable {
  id: string;
  name: string;
  type: FloorItemType | string;
  section: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  color?: string;
  seats: number;
  status: 'Available' | 'Occupied' | 'Payment' | 'Dirty' | 'Overdue' | 'Reserved'; 
  employeeId?: string; 
  assignedToName?: string;
  timeSeated?: string;
  expectedDuration?: number;
  reservationId?: string;
  highlight?: boolean;
  isSeatable: boolean;
  orderId?: string;
  businessId?: string;
}

export interface DiningMetric {
  section: string;
  occupancy: number;
  avgDiningTime: number;
  revenue: number;
}

export interface DiningAutomationRule {
  id: string;
  name: string;
  condition: string;
  action: string;
  isEnabled: boolean;
  riskLevel: 'Low' | 'High';
}

export interface OptimizationRecommendation {
  id: string;
  type: 'Layout' | 'Staffing' | 'Revenue';
  suggestion: string;
  impact: string;
  confidence: number;
}

export interface Table {
  id: string;
  name: string;
  seats: number;
  status: 'Available' | 'Occupied' | 'Payment' | 'Dirty';
  orderId?: string;
  employeeId?: string;
  timeSeated?: string;
  reservationId?: string;
}

export type SeatNumber = number;

export interface DiningOrderItem extends CartItem {
  seatNumber: SeatNumber;
  fired: boolean;
  guestId?: number;
  prepStations?: string[];
  stationIds?: string[];
}
