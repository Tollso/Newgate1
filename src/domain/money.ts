/**
 * Money Domain Utility
 * Enforces integer-cent or fixed precision math to eliminate floating-point rounding inaccuracies.
 */

export interface MoneyAmount {
  cents: number;
  currency: string;
}

export class Money {
  readonly cents: number;
  readonly currency: string;

  constructor(cents: number, currency: string = 'USD') {
    this.cents = Math.round(cents);
    this.currency = currency;
  }

  static fromDollars(dollars: number, currency: string = 'USD'): Money {
    return new Money(Math.round(dollars * 100), currency);
  }

  static fromCents(cents: number, currency: string = 'USD'): Money {
    return new Money(cents, currency);
  }

  static zero(currency: string = 'USD'): Money {
    return new Money(0, currency);
  }

  toDollars(): number {
    return this.cents / 100;
  }

  add(other: Money | number): Money {
    const addendCents = typeof other === 'number' ? Math.round(other * 100) : other.cents;
    return new Money(this.cents + addendCents, this.currency);
  }

  subtract(other: Money | number): Money {
    const subtrahendCents = typeof other === 'number' ? Math.round(other * 100) : other.cents;
    return new Money(this.cents - subtrahendCents, this.currency);
  }

  multiply(factor: number): Money {
    return new Money(Math.round(this.cents * factor), this.currency);
  }

  percentage(rate: number): Money {
    return new Money(Math.round(this.cents * (rate / 100)), this.currency);
  }

  isZero(): boolean {
    return this.cents === 0;
  }

  isPositive(): boolean {
    return this.cents > 0;
  }

  isNegative(): boolean {
    return this.cents < 0;
  }

  equals(other: Money): boolean {
    return this.cents === other.cents && this.currency === other.currency;
  }

  format(locale: string = 'en-US'): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: this.currency,
    }).format(this.toDollars());
  }

  /**
   * Evenly splits an amount among n parts, distributing remaining penny cents
   * so total sum is mathematically guaranteed to equal original.
   */
  split(parts: number): Money[] {
    if (parts <= 0) return [];
    const baseCents = Math.floor(this.cents / parts);
    let remainder = this.cents % parts;

    const result: Money[] = [];
    for (let i = 0; i < parts; i++) {
      const extra = remainder > 0 ? 1 : remainder < 0 ? -1 : 0;
      result.push(new Money(baseCents + extra, this.currency));
      if (remainder > 0) remainder--;
      if (remainder < 0) remainder++;
    }
    return result;
  }
}

export const formatCurrency = (amountInDollars: number, currency: string = 'USD'): string => {
  return Money.fromDollars(amountInDollars, currency).format();
};

export const roundMoney = (dollars: number): number => {
  return Money.fromDollars(dollars).toDollars();
};
