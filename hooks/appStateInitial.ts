import {
  MOCK_EMPLOYEES, MOCK_DETAILED_ORDERS, MOCK_TRANSACTIONS, MOCK_CUSTOMERS,
  MOCK_INVENTORY_ITEMS, MOCK_CATEGORIES, MOCK_RESERVATIONS, MOCK_SCHEDULES,
  MOCK_FLOOR_TABLES, MOCK_KDS_SETTINGS, MOCK_DISCOUNTS, MOCK_CASH_LOGS,
  MOCK_BUSINESSES, MOCK_INVOICES, MOCK_RECURRING_PLANS, MOCK_MODIFIER_GROUPS,
  MOCK_RECEIPT_SETTINGS, MOCK_TIP_CONFIG, MOCK_KITCHEN_TICKETS
} from '../constants';
import { FeedbackSettings, GlobalTaxConfig } from '../types';

export const initialFeedbackSettings: FeedbackSettings = {
  googleReviewUrl: 'https://g.page/r/your-restaurant',
  fiveStarMessage: 'Thank you for your 5-star review! We would love it if you could share your experience on Google.',
  lowStarMessage: 'We are sorry your experience was less than perfect. Please let us know how we can improve.',
};

export const initialTaxConfig: GlobalTaxConfig = {
  rate: 8.25,
  name: 'Sales Tax',
  enabled: true,
  includeInPrice: false
};

export const getInitialRemovalReasons = (): string[] => {
  const saved = localStorage.getItem('omni_removal_reasons');
  if (saved) {
    try { return JSON.parse(saved); } catch (e) { console.error('Failed to parse removal reasons', e); }
  }
  return [
    "Customer Changed Mind", "Sent in Error", "Kitchen Backed Up / Long Wait",
    "Item Unavailable / Out of Stock", "Ordered Double by Mistake",
    "Wrong Item Selected", "Spilled / Damaged before Serving"
  ];
};

export {
  MOCK_EMPLOYEES, MOCK_DETAILED_ORDERS, MOCK_TRANSACTIONS, MOCK_CUSTOMERS,
  MOCK_INVENTORY_ITEMS, MOCK_CATEGORIES, MOCK_RESERVATIONS, MOCK_SCHEDULES,
  MOCK_FLOOR_TABLES, MOCK_KDS_SETTINGS, MOCK_DISCOUNTS, MOCK_CASH_LOGS,
  MOCK_BUSINESSES, MOCK_INVOICES, MOCK_RECURRING_PLANS, MOCK_MODIFIER_GROUPS,
  MOCK_RECEIPT_SETTINGS, MOCK_TIP_CONFIG, MOCK_KITCHEN_TICKETS
};
