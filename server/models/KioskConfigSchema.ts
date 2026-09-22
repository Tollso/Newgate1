import { Schema, model, Document } from 'mongoose';

/**
 * Interface for Mongoose Kiosk Configuration Document
 */
export interface IKioskConfigDocument extends Document {
  businessId: string;
  operatingMode: 'Coffee Only' | 'Restaurant Only' | 'Hybrid (Both)' | 'Custom';
  welcomeMessage: string;
  themeColor: 'indigo' | 'slate' | 'rose' | 'emerald' | 'amber';
  layout: 'bottom-cart' | 'sidebar-right' | 'sidebar-left' | 'grid-only';
  requireCustomerName: boolean;
  showItemImages: boolean;
  timeoutSeconds: number;
  customFlowName?: string;
  categories: Array<{
    id: string;
    name: string;
    sortOrder: number;
    isVisible: boolean;
    icon?: string;
    timeAvailability?: {
      enabled: boolean;
      startHour: number;
      endHour: number;
    };
    assignedItemIds: string[];
  }>;
  itemAssignments: Array<{
    itemId: string;
    categoryId: string;
    sortOrder?: number;
    isAvailableOnKiosk: boolean;
    customDisplayName?: string;
    priceOverride?: number;
  }>;
  updatedAt: Date;
}

const TimeAvailabilitySchema = new Schema(
  {
    enabled: { type: Boolean, default: false },
    startHour: { type: Number, min: 0, max: 23, default: 6 },
    endHour: { type: Number, min: 0, max: 23, default: 22 }
  },
  { _id: false }
);

const KioskCategorySchema = new Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    sortOrder: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
    icon: { type: String, default: 'Coffee' },
    timeAvailability: { type: TimeAvailabilitySchema, default: () => ({}) },
    assignedItemIds: [{ type: String }]
  },
  { _id: false }
);

const MenuItemAssignmentSchema = new Schema(
  {
    itemId: { type: String, required: true },
    categoryId: { type: String, required: true },
    sortOrder: { type: Number, default: 0 },
    isAvailableOnKiosk: { type: Boolean, default: true },
    customDisplayName: { type: String },
    priceOverride: { type: Number }
  },
  { _id: false }
);

export const KioskConfigSchema = new Schema<IKioskConfigDocument>(
  {
    businessId: { type: String, required: true, index: true, unique: true },
    operatingMode: {
      type: String,
      enum: ['Coffee Only', 'Restaurant Only', 'Hybrid (Both)', 'Custom'],
      default: 'Hybrid (Both)'
    },
    welcomeMessage: { type: String, default: 'Welcome! What are you craving?' },
    themeColor: {
      type: String,
      enum: ['indigo', 'slate', 'rose', 'emerald', 'amber'],
      default: 'indigo'
    },
    layout: {
      type: String,
      enum: ['bottom-cart', 'sidebar-right', 'sidebar-left', 'grid-only'],
      default: 'bottom-cart'
    },
    requireCustomerName: { type: Boolean, default: false },
    showItemImages: { type: Boolean, default: true },
    timeoutSeconds: { type: Number, default: 60, min: 15, max: 300 },
    customFlowName: { type: String, default: '' },
    categories: [KioskCategorySchema],
    itemAssignments: [MenuItemAssignmentSchema]
  },
  {
    timestamps: true
  }
);

export const KioskConfigModel = model<IKioskConfigDocument>('KioskConfig', KioskConfigSchema);
