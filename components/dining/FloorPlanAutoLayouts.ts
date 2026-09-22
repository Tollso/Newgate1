import { DiningTable } from '../../types';

export function getAutoLayout(businessType: string, businessId: string = 'B001'): DiningTable[] {
  const getItems = (): DiningTable[] => {
    switch (businessType) {
    case 'Restaurant':
    case 'Fine Dining':
      return [
        { id: '1', name: 'Bar', type: 'FURNITURE_BAR', section: 'Main Floor', x: 50, y: 50, width: 320, height: 90, seats: 0, isSeatable: false, status: 'Available', color: '#1e293b' },
        { id: '2', name: 'Kitchen', type: 'EQUIP_KITCHEN', section: 'Main Floor', x: 50, y: 160, width: 320, height: 110, seats: 0, isSeatable: false, status: 'Available', color: '#cbd5e1' },
        { id: '3', name: 'Table 1', type: 'TABLE_ROUND', section: 'Main Floor', x: 450, y: 80, width: 160, height: 160, seats: 4, isSeatable: true, status: 'Available', color: '#ffffff' },
        { id: '4', name: 'Table 2', type: 'TABLE_ROUND', section: 'Main Floor', x: 670, y: 80, width: 160, height: 160, seats: 4, isSeatable: true, status: 'Available', color: '#ffffff' },
        { id: '5', name: 'Booth 1', type: 'BOOTH_DOUBLE', section: 'Main Floor', x: 450, y: 290, width: 180, height: 130, seats: 4, isSeatable: true, status: 'Available', color: '#ffffff' },
        { id: '6', name: 'Booth 2', type: 'BOOTH_DOUBLE', section: 'Main Floor', x: 670, y: 290, width: 180, height: 130, seats: 4, isSeatable: true, status: 'Available', color: '#ffffff' },
        { id: '7', name: 'Wait Station', type: 'WAITING_CHAIR', section: 'Main Floor', x: 50, y: 340, width: 70, height: 70, seats: 2, isSeatable: false, status: 'Available', color: '#f1f5f9' },
      ];
    case 'Retail Store':
    case 'Supermarket':
    case 'Pharmacy':
    case 'Grocery':
      return [
        { id: '1', name: 'Aisle 1', type: 'FURNITURE_SHELF', section: 'Main Floor', x: 100, y: 100, width: 300, height: 40, seats: 0, isSeatable: false, status: 'Available', color: '#f8fafc' },
        { id: '2', name: 'Aisle 2', type: 'FURNITURE_SHELF', section: 'Main Floor', x: 100, y: 200, width: 300, height: 40, seats: 0, isSeatable: false, status: 'Available', color: '#f8fafc' },
        { id: '3', name: 'Aisle 3', type: 'FURNITURE_SHELF', section: 'Main Floor', x: 100, y: 300, width: 300, height: 40, seats: 0, isSeatable: false, status: 'Available', color: '#f8fafc' },
        { id: '4', name: 'Checkout 1', type: 'EQUIP_REGISTER', section: 'Main Floor', x: 600, y: 100, width: 60, height: 60, seats: 0, isSeatable: false, status: 'Available', color: '#fcd34d' },
        { id: '5', name: 'Checkout 2', type: 'EQUIP_REGISTER', section: 'Main Floor', x: 600, y: 200, width: 60, height: 60, seats: 0, isSeatable: false, status: 'Available', color: '#fcd34d' },
        { id: '6', name: 'Display', type: 'PRODUCT_DISPLAY', section: 'Main Floor', x: 450, y: 100, width: 80, height: 80, seats: 0, isSeatable: false, status: 'Available', color: '#bfdbfe' },
      ];
    case 'Fast Food':
    case 'Coffee Shop':
    case 'Café':
    case 'Bakery':
      return [
        { id: '1', name: 'Counter', type: 'FURNITURE_COUNTER', section: 'Main Floor', x: 150, y: 50, width: 400, height: 60, seats: 0, isSeatable: false, status: 'Available', color: '#f1f5f9' },
        { id: '2', name: 'Register 1', type: 'EQUIP_REGISTER', section: 'Main Floor', x: 200, y: 40, width: 40, height: 40, seats: 0, isSeatable: false, status: 'Available', color: '#94a3b8' },
        { id: '3', name: 'Register 2', type: 'EQUIP_REGISTER', section: 'Main Floor', x: 350, y: 40, width: 40, height: 40, seats: 0, isSeatable: false, status: 'Available', color: '#94a3b8' },
        { id: '4', name: 'Queue', type: 'QUEUE_LINE', section: 'Main Floor', x: 200, y: 150, width: 40, height: 200, seats: 0, isSeatable: false, status: 'Available', color: '#fbbf24' },
        { id: '5', name: 'Kiosk 1', type: 'EQUIP_KIOSK', section: 'Main Floor', x: 50, y: 150, width: 50, height: 50, seats: 0, isSeatable: false, status: 'Available', color: '#38bdf8' },
        { id: '6', name: 'Kiosk 2', type: 'EQUIP_KIOSK', section: 'Main Floor', x: 50, y: 250, width: 50, height: 50, seats: 0, isSeatable: false, status: 'Available', color: '#38bdf8' },
        { id: '7', name: 'Booth 1', type: 'BOOTH_DOUBLE', section: 'Main Floor', x: 400, y: 250, width: 150, height: 110, seats: 4, isSeatable: true, status: 'Available', color: '#ffffff' },
        { id: '8', name: 'Booth 2', type: 'BOOTH_DOUBLE', section: 'Main Floor', x: 600, y: 250, width: 150, height: 110, seats: 4, isSeatable: true, status: 'Available', color: '#ffffff' },
      ];
    case 'Nightclub':
    case 'Bar':
    case 'Pub':
      return [
        { id: '1', name: 'Dance Floor', type: 'DANCE_FLOOR', section: 'Main Floor', x: 200, y: 150, width: 300, height: 200, seats: 0, isSeatable: false, status: 'Available', color: '#4c1d95' },
        { id: '2', name: 'DJ Booth', type: 'DJ_BOOTH', section: 'Main Floor', x: 250, y: 50, width: 200, height: 80, seats: 0, isSeatable: false, status: 'Available', color: '#111827' },
        { id: '3', name: 'Main Bar', type: 'FURNITURE_BAR', section: 'Main Floor', x: 50, y: 400, width: 600, height: 60, seats: 0, isSeatable: false, status: 'Available', color: '#334155' },
        { id: '4', name: 'VIP 1', type: 'VIP_SECTION', section: 'Main Floor', x: 550, y: 100, width: 140, height: 140, seats: 8, isSeatable: true, status: 'Available', color: '#9d174d' },
        { id: '5', name: 'VIP 2', type: 'VIP_SECTION', section: 'Main Floor', x: 550, y: 260, width: 140, height: 140, seats: 8, isSeatable: true, status: 'Available', color: '#9d174d' },
      ];
    case 'Salon':
    case 'Spa':
    case 'Clinic':
    case 'Dental Office':
      return [
        { id: '1', name: 'Reception', type: 'FURNITURE_COUNTER', section: 'Main Floor', x: 100, y: 50, width: 200, height: 60, seats: 0, isSeatable: false, status: 'Available', color: '#f8fafc' },
        { id: '2', name: 'Wait Area', type: 'COUCH_STRAIGHT', section: 'Main Floor', x: 50, y: 150, width: 160, height: 60, seats: 3, isSeatable: false, status: 'Available', color: '#cbd5e1' },
        { id: '3', name: 'Station 1', type: 'STYLING_STATION', section: 'Main Floor', x: 350, y: 50, width: 80, height: 80, seats: 1, isSeatable: true, status: 'Available', color: '#fbcfe8' },
        { id: '4', name: 'Station 2', type: 'STYLING_STATION', section: 'Main Floor', x: 500, y: 50, width: 80, height: 80, seats: 1, isSeatable: true, status: 'Available', color: '#fbcfe8' },
        { id: '5', name: 'Wash 1', type: 'WASH_STATION', section: 'Main Floor', x: 350, y: 200, width: 80, height: 80, seats: 1, isSeatable: true, status: 'Available', color: '#bae6fd' },
        { id: '6', name: 'Wash 2', type: 'WASH_STATION', section: 'Main Floor', x: 500, y: 200, width: 80, height: 80, seats: 1, isSeatable: true, status: 'Available', color: '#bae6fd' },
        { id: '7', name: 'Room A', type: 'TREATMENT_ROOM', section: 'Main Floor', x: 350, y: 350, width: 120, height: 120, seats: 1, isSeatable: true, status: 'Available', color: '#dcfce7' },
      ];
    case 'Gym':
      return [
        { id: '1', name: 'Front Desk', type: 'FURNITURE_COUNTER', section: 'Main Floor', x: 50, y: 50, width: 160, height: 60, seats: 0, isSeatable: false, status: 'Available', color: '#e2e8f0' },
        { id: '2', name: 'Free Weights', type: 'WORKOUT_ZONE', section: 'Main Floor', x: 300, y: 50, width: 200, height: 160, seats: 0, isSeatable: false, status: 'Available', color: '#bbf7d0' },
        { id: '3', name: 'Cardio', type: 'WORKOUT_ZONE', section: 'Main Floor', x: 550, y: 50, width: 200, height: 160, seats: 0, isSeatable: false, status: 'Available', color: '#fef08a' },
        { id: '4', name: 'Treadmills', type: 'GYM_EQUIPMENT', section: 'Main Floor', x: 550, y: 250, width: 200, height: 80, seats: 0, isSeatable: false, status: 'Available', color: '#94a3b8' },
        { id: '5', name: 'Locker Rm', type: 'LOCKER_ROOM', section: 'Main Floor', x: 50, y: 250, width: 160, height: 160, seats: 0, isSeatable: false, status: 'Available', color: '#ddd6fe' },
      ];
    default:
      return [
        { id: '1', name: 'Main Area', type: 'DECOR_RUG_RECT', section: 'Main Floor', x: 100, y: 100, width: 400, height: 400, seats: 0, isSeatable: false, status: 'Available', color: '#f8fafc' },
        { id: '2', name: 'Desk', type: 'FURNITURE_COUNTER', section: 'Main Floor', x: 150, y: 150, width: 160, height: 60, seats: 0, isSeatable: false, status: 'Available', color: '#e2e8f0' }
      ];
    }
  };

  return getItems().map(item => ({
    ...item,
    businessId: item.businessId || businessId
  }));
}
