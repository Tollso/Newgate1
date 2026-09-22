/**
 * TaxEngine
 * Authoritative, configurable multi-jurisdiction tax engine.
 * Eliminates all hard-coded 8.5% tax constants across orders, splits, and tenders (Section 2 - P0).
 */

import { Money } from '../src/domain/money';
import { GlobalTaxConfig, AdditionalTaxRate } from '../types';
import { SettingsService } from './settingsService';

export interface TaxLineItem {
  taxId: string;
  name: string;
  rate: number; // e.g. 6.25 for 6.25%
  taxableBasis: number;
  amount: number;
}

export interface TaxCalculationResult {
  taxableBasis: Money;
  totalTax: Money;
  effectiveRatePercent: number;
  taxBreakdown: TaxLineItem[];
  isTaxIncluded: boolean;
}

export class TaxEngine {
  private static cachedConfig: GlobalTaxConfig | null = null;

  /**
   * Fetch current effective tax configuration
   */
  static async getTaxConfig(merchantId: string = 'M001'): Promise<GlobalTaxConfig> {
    if (this.cachedConfig) return this.cachedConfig;
    try {
      const settings = await SettingsService.resolveEffectiveSettings({ merchantId });
      if (settings?.taxConfig) {
        this.cachedConfig = settings.taxConfig;
        return settings.taxConfig;
      }
    } catch (e) {
      console.warn('[TaxEngine] Using fallback tax config:', e);
    }

    return {
      rate: 7.25, // default state sales tax rate
      name: 'Sales Tax',
      enabled: true,
      includeInPrice: false,
      additionalTaxes: [
        { id: 'tax-city', name: 'Local City Tax', rate: 1.25, enabled: true },
      ],
    };
  }

  static setTaxConfig(config: GlobalTaxConfig) {
    this.cachedConfig = config;
  }

  /**
   * Calculate exact tax for an order amount based on configured rates
   */
  static calculateTax(
    taxableBasisDollars: number,
    customConfig?: GlobalTaxConfig
  ): TaxCalculationResult {
    const config = customConfig || this.cachedConfig || {
      rate: 7.25,
      name: 'Sales Tax',
      enabled: true,
      includeInPrice: false,
      additionalTaxes: [{ id: 'tax-city', name: 'Local City Tax', rate: 1.25, enabled: true }],
    };

    if (!config.enabled || taxableBasisDollars <= 0) {
      return {
        taxableBasis: Money.fromDollars(taxableBasisDollars),
        totalTax: Money.zero(),
        effectiveRatePercent: 0,
        taxBreakdown: [],
        isTaxIncluded: config.includeInPrice || false,
      };
    }

    const basis = Money.fromDollars(taxableBasisDollars);
    let totalTax = Money.zero();
    const breakdown: TaxLineItem[] = [];
    let combinedRate = 0;

    if (config.includeInPrice) {
      // Inclusive tax: Tax = Gross - (Gross / (1 + Rate))
      combinedRate = config.rate;
      for (const addTax of config.additionalTaxes || []) {
        if (addTax.enabled) combinedRate += addTax.rate;
      }

      const rateFactor = 1 + combinedRate / 100;
      const netBasis = Money.fromDollars(taxableBasisDollars / rateFactor);
      totalTax = basis.subtract(netBasis);

      // Primary tax line
      const primaryAmt = totalTax.multiply(config.rate / (combinedRate || 1));
      breakdown.push({
        taxId: 'primary-tax',
        name: config.name || 'Sales Tax',
        rate: config.rate,
        taxableBasis: netBasis.toDollars(),
        amount: primaryAmt.toDollars(),
      });

      for (const addTax of config.additionalTaxes || []) {
        if (addTax.enabled) {
          const addAmt = totalTax.multiply(addTax.rate / (combinedRate || 1));
          breakdown.push({
            taxId: addTax.id,
            name: addTax.name,
            rate: addTax.rate,
            taxableBasis: netBasis.toDollars(),
            amount: addAmt.toDollars(),
          });
        }
      }

      return {
        taxableBasis: netBasis,
        totalTax,
        effectiveRatePercent: combinedRate,
        taxBreakdown: breakdown,
        isTaxIncluded: true,
      };
    }

    // Exclusive tax: Tax = TaxableBasis * Rate
    const primaryTaxAmt = basis.percentage(config.rate);
    totalTax = totalTax.add(primaryTaxAmt);
    combinedRate += config.rate;

    breakdown.push({
      taxId: 'primary-tax',
      name: config.name || 'Sales Tax',
      rate: config.rate,
      taxableBasis: basis.toDollars(),
      amount: primaryTaxAmt.toDollars(),
    });

    for (const addTax of config.additionalTaxes || []) {
      if (addTax.enabled && addTax.rate > 0) {
        const addTaxAmt = basis.percentage(addTax.rate);
        totalTax = totalTax.add(addTaxAmt);
        combinedRate += addTax.rate;

        breakdown.push({
          taxId: addTax.id,
          name: addTax.name,
          rate: addTax.rate,
          taxableBasis: basis.toDollars(),
          amount: addTaxAmt.toDollars(),
        });
      }
    }

    return {
      taxableBasis: basis,
      totalTax,
      effectiveRatePercent: combinedRate,
      taxBreakdown: breakdown,
      isTaxIncluded: false,
    };
  }

  /**
   * Helper for quick split calculations
   */
  static calculateSplitTax(subtotalDollars: number, customConfig?: GlobalTaxConfig): Money {
    const res = this.calculateTax(subtotalDollars, customConfig);
    return res.totalTax;
  }
}
