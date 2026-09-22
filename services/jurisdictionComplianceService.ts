/**
 * JurisdictionComplianceService
 * Structured credit-card surcharge and fee regulatory compliance metadata.
 * Evaluates state and card-network rules, effective dates, and disclosure requirements (Section 3 - P1).
 */

export type ComplianceStatus = 'ALLOWED' | 'RESTRICTED' | 'CONDITIONAL' | 'REVIEW_REQUIRED';

export interface StateJurisdictionRule {
  stateCode: string;
  stateName: string;
  status: ComplianceStatus;
  maxSurchargePercent: number;
  disclosureRequired: boolean;
  effectiveDate: string;
  legalCitation: string;
  notes: string;
}

export interface ComplianceEvaluation {
  status: ComplianceStatus;
  isAllowed: boolean;
  maxRatePercent: number;
  warnings: string[];
  requiresProviderConfirmation: boolean;
  stateRule?: StateJurisdictionRule;
}

export class JurisdictionComplianceService {
  private static jurisdictionRules: Record<string, StateJurisdictionRule> = {
    CA: {
      stateCode: 'CA',
      stateName: 'California',
      status: 'CONDITIONAL',
      maxSurchargePercent: 3.0,
      disclosureRequired: true,
      effectiveDate: '2024-07-01',
      legalCitation: 'Cal. Civ. Code § 1748.1',
      notes: 'Permitted if clear and conspicuous disclosure is provided prior to point of sale.',
    },
    NY: {
      stateCode: 'NY',
      stateName: 'New York',
      status: 'CONDITIONAL',
      maxSurchargePercent: 3.0,
      disclosureRequired: true,
      effectiveDate: '2024-02-11',
      legalCitation: 'N.Y. Gen. Bus. Law § 518',
      notes: 'Requires posting total credit card price alongside cash price. Percentage fees alone prohibited.',
    },
    TX: {
      stateCode: 'TX',
      stateName: 'Texas',
      status: 'ALLOWED',
      maxSurchargePercent: 3.5,
      disclosureRequired: true,
      effectiveDate: '2023-01-01',
      legalCitation: 'Tex. Fin. Code § 339.001',
      notes: 'Permitted up to actual processing cost with signage at entrance and register.',
    },
    FL: {
      stateCode: 'FL',
      stateName: 'Florida',
      status: 'ALLOWED',
      maxSurchargePercent: 3.5,
      disclosureRequired: true,
      effectiveDate: '2022-01-01',
      legalCitation: 'Fla. Stat. § 501.0117',
      notes: 'Permitted following Eleventh Circuit judicial injunction.',
    },
    CT: {
      stateCode: 'CT',
      stateName: 'Connecticut',
      status: 'RESTRICTED',
      maxSurchargePercent: 0,
      disclosureRequired: true,
      effectiveDate: '2023-10-01',
      legalCitation: 'Conn. Gen. Stat. § 42-133ff',
      notes: 'Credit card surcharging generally prohibited; cash discounts permitted.',
    },
    MA: {
      stateCode: 'MA',
      stateName: 'Massachusetts',
      status: 'RESTRICTED',
      maxSurchargePercent: 0,
      disclosureRequired: true,
      effectiveDate: '2021-01-01',
      legalCitation: 'Mass. Gen. Laws ch. 140D § 28A',
      notes: 'Strict statutory prohibition on credit card surcharges for retail sales.',
    },
    DEFAULT: {
      stateCode: 'US',
      stateName: 'Federal / Standard US',
      status: 'ALLOWED',
      maxSurchargePercent: 3.0,
      disclosureRequired: true,
      effectiveDate: '2023-04-15',
      legalCitation: 'Visa/Mastercard Core Network Operating Rules',
      notes: 'Network cap is 3.0%. Surcharging debit or prepaid cards is strictly prohibited by federal Durbin Amendment.',
    },
  };

  /**
   * Evaluate proposed credit-card surcharge against jurisdiction
   */
  static evaluateSurcharge(
    ratePercent: number,
    stateCode: string = 'DEFAULT'
  ): ComplianceEvaluation {
    const rule = this.jurisdictionRules[stateCode.toUpperCase()] || this.jurisdictionRules.DEFAULT;
    const warnings: string[] = [];

    let status: ComplianceStatus = rule.status;
    let isAllowed = true;

    if (rule.status === 'RESTRICTED') {
      warnings.push(`Jurisdiction Warning (${rule.stateName}): Surcharges are restricted under ${rule.legalCitation}.`);
      status = 'RESTRICTED';
      isAllowed = false;
    }

    if (ratePercent > rule.maxSurchargePercent) {
      warnings.push(`Rate Warning: Surcharge of ${ratePercent}% exceeds the ${rule.maxSurchargePercent}% network/state limit.`);
      status = 'REVIEW_REQUIRED';
    }

    if (rule.disclosureRequired) {
      warnings.push('Compliance Requirement: Itemized receipt line and point-of-entry signage are mandatory.');
    }

    warnings.push('Federal Rule: Durbin Amendment forbids applying credit card fee to debit or prepaid cards.');

    return {
      status,
      isAllowed,
      maxRatePercent: rule.maxSurchargePercent,
      warnings,
      requiresProviderConfirmation: ratePercent > 3.0 || status === 'CONDITIONAL',
      stateRule: rule,
    };
  }

  static getSupportedJurisdictions(): StateJurisdictionRule[] {
    return Object.values(this.jurisdictionRules || {});
  }
}
