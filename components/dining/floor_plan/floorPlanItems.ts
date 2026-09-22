import { FloorItemType } from '../../../types';

export interface FloorCategoryItem {
  type: FloorItemType;
  label: string;
  shape?: 'round' | 'rect' | 'wall' | 'bar' | 'shelf' | 'counter';
  colorBorder?: string;
  colorBg?: string;
}

export interface FloorCategoryConfig {
  title: string;
  items: FloorCategoryItem[];
  showIf: (businessType: string) => boolean;
}

const isDining = (b: string) => ['Restaurant', 'Fine Dining', 'Fast Food', 'Buffet', 'Coffee Shop', 'Café', 'Bakery', 'Bar', 'Pub', 'Lounge', 'Brewery', 'Winery', 'Ice Cream Shop', 'Dessert Shop', 'Bubble Tea Shop'].includes(b);
const isRetail = (b: string) => ['Retail Store', 'Supermarket', 'Grocery', 'Pharmacy', 'Jewelry Store', 'Electronics Store', 'Fashion Boutique'].includes(b);
const isService = (b: string) => ['Salon', 'Spa', 'Barbershop', 'Clinic', 'Dental Office', 'Pet Grooming', 'Coworking Space', 'Hotel Front Desk', 'Airport Lounge'].includes(b);
const isEntertainment = (b: string) => ['Nightclub', 'Karaoke Bar', 'Hookah Lounge', 'Gaming Lounge', 'Casino', 'Event Hall', 'Cinema'].includes(b);
const isAthletic = (b: string) => ['Gym', 'Resort Dining'].includes(b);

export const FLOOR_PLAN_CATEGORIES: FloorCategoryConfig[] = [
  {
    title: 'Dining & Seating',
    showIf: isDining,
    items: [
      { type: 'TABLE_SQUARE', label: 'Square Table', shape: 'rect' },
      { type: 'TABLE_RECT', label: 'Rect Table', shape: 'rect' },
      { type: 'TABLE_ROUND', label: 'Round Table', shape: 'round' },
      { type: 'BOOTH_DOUBLE', label: 'Booth', shape: 'rect' },
      { type: 'WAITING_CHAIR', label: 'Wait Chair', shape: 'round' },
    ],
  },
  {
    title: 'Kitchen & POS',
    showIf: isDining,
    items: [
      { type: 'EQUIP_KIOSK', label: 'Order Kiosk', colorBorder: 'border-blue-400', colorBg: 'bg-blue-100' },
      { type: 'EQUIP_REGISTER', label: 'Register', colorBorder: 'border-blue-400', colorBg: 'bg-blue-100' },
      { type: 'EQUIP_KITCHEN', label: 'Kitchen Prep', colorBorder: 'border-blue-400', colorBg: 'bg-blue-100' },
    ],
  },
  {
    title: 'Professional Services',
    showIf: isService,
    items: [
      { type: 'STYLING_STATION', label: 'Styling Station', colorBorder: 'border-pink-300' },
      { type: 'WASH_STATION', label: 'Wash Station', colorBorder: 'border-pink-300' },
      { type: 'MEDICAL_BED', label: 'Medical Bed', colorBorder: 'border-pink-300' },
      { type: 'TREATMENT_ROOM', label: 'Treatment Room', colorBorder: 'border-pink-300' },
    ],
  },
  {
    title: 'Retail Fixtures',
    showIf: isRetail,
    items: [
      { type: 'PRODUCT_DISPLAY', label: 'Display', colorBorder: 'border-amber-300' },
      { type: 'FURNITURE_SHELF', label: 'Shelf', colorBorder: 'border-amber-300' },
      { type: 'QUEUE_LINE', label: 'Queue Line', colorBorder: 'border-amber-300' },
      { type: 'EQUIP_REGISTER', label: 'Checkout', colorBorder: 'border-amber-300' },
    ],
  },
  {
    title: 'Venue Objects',
    showIf: isEntertainment,
    items: [
      { type: 'DJ_BOOTH', label: 'DJ Booth', colorBorder: 'border-purple-300' },
      { type: 'DANCE_FLOOR', label: 'Dance Floor', colorBorder: 'border-purple-300' },
      { type: 'VIP_SECTION', label: 'VIP Section', colorBorder: 'border-purple-300' },
      { type: 'STAGE', label: 'Stage', colorBorder: 'border-purple-300' },
    ],
  },
  {
    title: 'Training & Facility',
    showIf: isAthletic,
    items: [
      { type: 'WORKOUT_ZONE', label: 'Workout Zone', colorBorder: 'border-emerald-300' },
      { type: 'GYM_EQUIPMENT', label: 'Equipment', colorBorder: 'border-emerald-300' },
      { type: 'LOCKER_ROOM', label: 'Locker Room', colorBorder: 'border-emerald-300' },
    ],
  },
];
