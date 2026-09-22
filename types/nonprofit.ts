/**
 * Nonprofit Domain Types
 * First-class nonprofit and giving architecture (Section 9).
 */

export type DonorType = 'INDIVIDUAL' | 'ORGANIZATION' | 'HOUSEHOLD' | 'ANONYMOUS';

export interface Donor {
  id: string;
  merchantId: string;
  type: DonorType;
  firstName?: string;
  lastName?: string;
  organizationName?: string;
  email: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  taxIdOrEin?: string;
  lifetimeGivingTotal: number;
  totalDonationCount: number;
  lastDonationDate?: string;
  preferredFundId?: string;
  notes?: string;
  tags?: string[];
  isTaxReceiptRequested: boolean;
  createdAt: string;
}

export interface CampaignFund {
  id: string;
  merchantId: string;
  name: string;
  description: string;
  targetGoal: number;
  currentAmount: number;
  donorCount: number;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  taxDeductiblePercentage: number; // usually 100%
}

export interface DonationRecord {
  id: string;
  merchantId: string;
  donorId?: string;
  donorName?: string;
  donorEmail?: string;
  isAnonymous: boolean;
  amount: number;
  fundId: string;
  fundName: string;
  paymentMethod: 'CARD' | 'CASH' | 'CHECK' | 'ACH';
  paymentReference?: string;
  isRecurring: boolean;
  recurringFrequency?: 'MONTHLY' | 'QUARTERLY' | 'ANNUAL';
  subscriptionId?: string;
  taxReceiptNumber: string;
  einNumber: string;
  notes?: string;
  timestamp: string;
  status: 'COMPLETED' | 'REFUNDED';
}

export interface CombinedCheckoutPayload {
  merchantId: string;
  donorId?: string;
  saleAmount: number; // e.g., tickets, gift shop items
  donationAmount: number; // charitable contribution portion
  fundId?: string;
  totalAmount: number;
  paymentMethod: string;
  isAnonymous?: boolean;
}

export interface Pledge {
  id: string;
  merchantId: string;
  donorId: string;
  donorName: string;
  fundId: string;
  totalPromised: number;
  amountPaid: number;
  balanceRemaining: number;
  startDate: string;
  dueDate: string;
  installmentsCount: number;
  status: 'ACTIVE' | 'FULFILLED' | 'CANCELLED';
}

export interface NonprofitMembership {
  id: string;
  merchantId: string;
  donorId: string;
  donorName: string;
  tierName: string; // e.g., 'Bronze', 'Silver', 'Gold', 'Patron'
  annualFee: number;
  startDate: string;
  expirationDate: string;
  benefits: string[];
  status: 'ACTIVE' | 'EXPIRED' | 'RENEWED' | 'CANCELLED';
  autoRenew: boolean;
}

export interface VolunteerRecord {
  id: string;
  merchantId: string;
  name: string;
  email: string;
  phone: string;
  programsAssigned: string[];
  totalHoursServed: number;
  status: 'ACTIVE' | 'INACTIVE';
  shifts: {
    id: string;
    eventName: string;
    date: string;
    hours: number;
    notes?: string;
  }[];
}
