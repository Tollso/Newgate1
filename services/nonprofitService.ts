/**
 * NonprofitService
 * First-class nonprofit and giving architecture (Section 9).
 * Handles Donors, Campaigns/Funds, Pledges, Memberships, Giving Kiosk, and Tax Receipts.
 */

import {
  Donor,
  CampaignFund,
  DonationRecord,
  Pledge,
  NonprofitMembership,
  VolunteerRecord,
  CombinedCheckoutPayload,
} from '../types/nonprofit';
import { DataRepository } from '../src/repositories/persistence/DataRepository';
import { AuditService } from './auditService';
import { Money } from '../src/domain/money';

export class NonprofitService {
  private static donorRepo = new DataRepository<Donor & { id: string }>('nonprofit_donors');
  private static fundRepo = new DataRepository<CampaignFund & { id: string }>('nonprofit_funds');
  private static donationRepo = new DataRepository<DonationRecord & { id: string }>('nonprofit_donations');
  private static pledgeRepo = new DataRepository<Pledge & { id: string }>('nonprofit_pledges');
  private static memberRepo = new DataRepository<NonprofitMembership & { id: string }>('nonprofit_memberships');
  private static volunteerRepo = new DataRepository<VolunteerRecord & { id: string }>('nonprofit_volunteers');

  private static defaultFunds: CampaignFund[] = [
    {
      id: 'fund-general',
      merchantId: 'M001',
      name: 'General Operating & Community Fund',
      description: 'Supports essential community programs and mission activities.',
      targetGoal: 100000,
      currentAmount: 64250,
      donorCount: 248,
      startDate: '2026-01-01',
      isActive: true,
      taxDeductiblePercentage: 100,
    },
    {
      id: 'fund-building',
      merchantId: 'M001',
      name: 'Youth Center Building Campaign',
      description: 'Capital campaign to construct a new sports and educational hall.',
      targetGoal: 250000,
      currentAmount: 142800,
      donorCount: 115,
      startDate: '2026-03-01',
      isActive: true,
      taxDeductiblePercentage: 100,
    },
    {
      id: 'fund-scholarship',
      merchantId: 'M001',
      name: 'Annual Student Scholarship Drive',
      description: 'Direct tuition aid for deserving local high school graduates.',
      targetGoal: 50000,
      currentAmount: 38400,
      donorCount: 89,
      startDate: '2026-05-01',
      isActive: true,
      taxDeductiblePercentage: 100,
    },
  ];

  private static defaultDonors: Donor[] = [
    {
      id: 'donor-1',
      merchantId: 'M001',
      type: 'INDIVIDUAL',
      firstName: 'Arthur',
      lastName: 'Pendelton',
      email: 'arthur.p@example.org',
      phone: '(555) 321-9988',
      lifetimeGivingTotal: 12500.00,
      totalDonationCount: 14,
      lastDonationDate: '2026-09-12',
      notes: 'Prefers Youth Center Building Campaign; patron member.',
      isTaxReceiptRequested: true,
      createdAt: '2025-01-10',
    },
    {
      id: 'donor-2',
      merchantId: 'M001',
      type: 'ORGANIZATION',
      organizationName: 'Midtown Rotary Foundation',
      email: 'grants@midtownrotary.org',
      phone: '(555) 432-1100',
      lifetimeGivingTotal: 25000.00,
      totalDonationCount: 4,
      lastDonationDate: '2026-08-15',
      taxIdOrEin: '12-3456789',
      isTaxReceiptRequested: true,
      createdAt: '2024-11-20',
    },
  ];

  /**
   * Process a donation (POS or Giving Kiosk)
   */
  static async processDonation(params: {
    merchantId: string;
    amountDollars: number;
    fundId: string;
    paymentMethod: 'CARD' | 'CASH' | 'CHECK' | 'ACH';
    donorId?: string;
    donorName?: string;
    donorEmail?: string;
    isAnonymous?: boolean;
    isRecurring?: boolean;
    recurringFrequency?: 'MONTHLY' | 'QUARTERLY' | 'ANNUAL';
  }): Promise<DonationRecord> {
    const funds = await this.listFunds();
    const fund = funds.find(f => f.id === params.fundId) || funds[0];

    const taxReceiptNumber = `TAX-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    const donation: DonationRecord = {
      id: `don-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      merchantId: params.merchantId,
      donorId: params.donorId,
      donorName: params.isAnonymous ? 'Anonymous Supporter' : (params.donorName || 'Generous Donor'),
      donorEmail: params.donorEmail,
      isAnonymous: !!params.isAnonymous,
      amount: params.amountDollars,
      fundId: fund.id,
      fundName: fund.name,
      paymentMethod: params.paymentMethod,
      isRecurring: !!params.isRecurring,
      recurringFrequency: params.recurringFrequency,
      taxReceiptNumber,
      einNumber: '84-1234567', // Canonical 501(c)(3) EIN
      timestamp: new Date().toISOString(),
      status: 'COMPLETED',
    };

    // Update fund progress
    fund.currentAmount = Money.fromDollars(fund.currentAmount).add(params.amountDollars).toDollars();
    fund.donorCount += 1;
    await this.fundRepo.upsert(fund);

    // Update donor record if known
    if (params.donorId) {
      const donor = await this.donorRepo.findById(params.donorId);
      if (donor) {
        donor.lifetimeGivingTotal = Money.fromDollars(donor.lifetimeGivingTotal).add(params.amountDollars).toDollars();
        donor.totalDonationCount += 1;
        donor.lastDonationDate = new Date().toISOString().split('T')[0];
        await this.donorRepo.upsert(donor);
      }
    }

    await this.donationRepo.upsert(donation);

    await AuditService.log({
      actorId: params.donorId || 'KIOSK',
      actorName: donation.donorName || 'Donor',
      action: 'DONATION_RECEIVED',
      targetType: 'DONATION',
      targetId: donation.id,
      details: { amount: donation.amount, fund: fund.name, isRecurring: donation.isRecurring },
    });

    return donation;
  }

  /**
   * Combined checkout (Sale + Charitable contribution)
   */
  static async processCombinedSaleAndDonation(payload: CombinedCheckoutPayload): Promise<{
    saleAmount: number;
    donationAmount: number;
    totalPaid: number;
    taxReceiptNumber?: string;
  }> {
    let donationRecord: DonationRecord | null = null;
    if (payload.donationAmount > 0) {
      donationRecord = await this.processDonation({
        merchantId: payload.merchantId,
        amountDollars: payload.donationAmount,
        fundId: payload.fundId || 'fund-general',
        paymentMethod: (payload.paymentMethod as any) || 'CARD',
        donorId: payload.donorId,
      });
    }

    return {
      saleAmount: payload.saleAmount,
      donationAmount: payload.donationAmount,
      totalPaid: payload.totalAmount,
      taxReceiptNumber: donationRecord?.taxReceiptNumber,
    };
  }

  /**
   * Donation refund (updates donor history and fund totals, distinct from retail return)
   */
  static async refundDonation(donationId: string, employeeId: string, reason: string): Promise<DonationRecord> {
    const donation = await this.donationRepo.findById(donationId);
    if (!donation) throw new Error('Donation record not found');
    if (donation.status === 'REFUNDED') throw new Error('Donation is already refunded');

    donation.status = 'REFUNDED';
    await this.donationRepo.upsert(donation);

    // Reconcile Fund
    const fund = await this.fundRepo.findById(donation.fundId);
    if (fund) {
      fund.currentAmount = Math.max(0, Money.fromDollars(fund.currentAmount).subtract(donation.amount).toDollars());
      await this.fundRepo.upsert(fund);
    }

    // Reconcile Donor history
    if (donation.donorId) {
      const donor = await this.donorRepo.findById(donation.donorId);
      if (donor) {
        donor.lifetimeGivingTotal = Math.max(0, Money.fromDollars(donor.lifetimeGivingTotal).subtract(donation.amount).toDollars());
        await this.donorRepo.upsert(donor);
      }
    }

    await AuditService.log({
      actorId: employeeId,
      actorName: 'Staff',
      action: 'DONATION_REFUNDED',
      targetType: 'DONATION',
      targetId: donationId,
      details: { amount: donation.amount, reason },
    });

    return donation;
  }

  static async listFunds(): Promise<CampaignFund[]> {
    const list = await this.fundRepo.find();
    if (list.length === 0) {
      for (const f of this.defaultFunds) {
        await this.fundRepo.upsert(f);
      }
      return this.defaultFunds;
    }
    return list;
  }

  static async listDonors(): Promise<Donor[]> {
    const list = await this.donorRepo.find();
    if (list.length === 0) {
      for (const d of this.defaultDonors) {
        await this.donorRepo.upsert(d);
      }
      return this.defaultDonors;
    }
    return list;
  }
}
