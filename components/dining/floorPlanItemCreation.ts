import { DiningTable, FloorItemType } from '../../types';

export const createFloorItem = (type: FloorItemType, clientX: number, clientY: number, rect: DOMRect, businessId: string = 'B001'): DiningTable => {
  let width = 140;
  let height = 140;
  let name = type.split('_').pop() || 'Item';
  let seats = 2;
  let color = '#ffffff';

  if (type === 'TABLE_RECT' || type === 'BOOTH_DOUBLE' || type === 'BOOTH_SINGLE' || type === 'BOOTH_L' || type === 'BOOTH_CURVE') {
    width = 180;
    height = 130;
    seats = 4;
    name = 'Table/Booth';
  } else if (type === 'TABLE_ROUND') {
    width = 160;
    height = 160;
    seats = 4;
    name = 'Round';
  } else if (type === 'TABLE_SQUARE') {
    width = 140;
    height = 140;
    seats = 4;
    name = 'Square';
  } else if (type === 'COUCH_STRAIGHT' || type === 'COUCH_L') {
    width = 140;
    height = 80;
    seats = 3;
    name = 'Couch';
  } else if (type === 'FURNITURE_BAR') {
    width = 200;
    height = 80;
    seats = 0;
    name = 'Bar';
    color = '#e2e8f0';
  } else if (type === 'FURNITURE_SHELF' || type === 'FURNITURE_COUNTER' || type === 'PRODUCT_DISPLAY' || type === 'RECEPTION_DESK') {
    width = 160;
    height = 40;
    seats = 0;
    name = type === 'PRODUCT_DISPLAY' ? 'Display' : (type === 'RECEPTION_DESK' ? 'Reception' : 'Shelf/Counter');
    color = '#f8fafc';
  } else if (type === 'QUEUE_LINE') {
    width = 40;
    height = 200;
    seats = 0;
    color = '#fbbf24';
    name = 'Queue';
  } else if (type === 'STYLING_STATION' || type === 'WASH_STATION') {
    width = 80;
    height = 80;
    seats = 1;
    color = '#fce7f3';
    name = type === 'STYLING_STATION' ? 'Styling' : 'Wash';
  } else if (type === 'WORKOUT_ZONE' || type === 'GYM_EQUIPMENT') {
    width = 120;
    height = 120;
    seats = 0;
    color = '#dcfce7';
    name = type === 'WORKOUT_ZONE' ? 'Zone' : 'Equipment';
  } else if (type === 'MEDICAL_BED' || type === 'TREATMENT_ROOM') {
    width = 80;
    height = 160;
    seats = 1;
    color = '#e0f2fe';
    name = type === 'MEDICAL_BED' ? 'Bed' : 'Treatment';
  } else if (type === 'DJ_BOOTH' || type === 'STAGE' || type === 'VIP_SECTION' || type === 'DANCE_FLOOR') {
    width = 200;
    height = 160;
    seats = type === 'VIP_SECTION' ? 8 : 0;
    color = '#2e1065';
    name = type;
  } else if (type === 'DECOR_PIANO') {
    width = 100;
    height = 100;
    seats = 0;
    name = 'Piano';
    color = '#020617';
  } else if (type?.startsWith('EQUIP_')) {
    width = 40;
    height = 40;
    seats = 0;
    name = type.replace('EQUIP_', '');
    color = '#3b82f6';
  } else if (type?.startsWith('DECOR') || type?.startsWith('PLANT')) {
    name = 'Decor';
    seats = 0;
    if (type?.startsWith('PLANT')) color = '#ebfbf5';
    else color = '#f1f5f9';
  }

  return {
    id: `ITEM-${Date.now()}`,
    name,
    type,
    section: 'Main Floor',
    x: Math.round((clientX - rect.left - (width / 2)) / 10) * 10,
    y: Math.round((clientY - rect.top - (height / 2)) / 10) * 10,
    width,
    height,
    color,
    seats,
    isSeatable: seats > 0,
    status: 'Available',
    rotation: 0,
    businessId
  };
};

export const BUSINESS_TYPES = [
  'Restaurant', 'Café', 'Coffee Shop', 'Bakery', 'Fast Food',
  'Fine Dining', 'Buffet', 'Food Truck', 'Bar', 'Pub', 'Nightclub',
  'Lounge', 'Hotel Restaurant', 'Resort Dining', 'Karaoke Bar', 'Hookah Lounge', 
  'Brewery', 'Winery', 'Retail Store', 'Supermarket', 'Grocery', 'Pharmacy', 
  'Salon', 'Spa', 'Barbershop', 'Gym', 'Coworking Space', 'Clinic', 
  'Dental Office', 'Pet Grooming', 'Gaming Lounge', 'Cinema', 'Event Hall', 
  'Hotel Front Desk', 'Airport Lounge', 'Casino', 'Bubble Tea Shop', 
  'Ice Cream Shop', 'Dessert Shop', 'Jewelry Store', 'Electronics Store', 
  'Fashion Boutique'
];
