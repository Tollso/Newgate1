/**
 * CustomerService
 * Centralized customer registry, profile lookup, loyalty points tracking, and segment computation.
 */

import { Customer, CustomerSegment } from '../types/business';
import { DataRepository } from '../src/repositories/persistence/DataRepository';
import { Money } from '../src/domain/money';

export class CustomerService {
  private static repo = new DataRepository<Customer & { id: string }>('customers');
  private static defaultCustomers: Customer[] = [
    {
      id: 'cust-1',
      name: 'Eleanor Vance',
      email: 'eleanor.vance@example.com',
      phone: '(555) 234-5678',
      totalSpent: 1420.50,
      totalSpend: 1420.50,
      ordersCount: 18,
      visitCount: 18,
      lastVisit: '2026-09-15',
      segment: 'VIP',
      loyaltyPoints: 340,
    },
    {
      id: 'cust-2',
      name: 'Marcus Brody',
      email: 'marcus.b@example.com',
      phone: '(555) 876-5432',
      totalSpent: 380.00,
      totalSpend: 380.00,
      ordersCount: 6,
      visitCount: 6,
      lastVisit: '2026-09-18',
      segment: 'Regular',
      loyaltyPoints: 95,
    },
    {
      id: 'cust-3',
      name: 'Sophia Chen',
      email: 'sophia.c@example.com',
      phone: '(555) 345-9876',
      totalSpent: 75.00,
      totalSpend: 75.00,
      ordersCount: 1,
      visitCount: 1,
      lastVisit: '2026-09-19',
      segment: 'New',
      loyaltyPoints: 20,
    },
  ];

  static async listCustomers(): Promise<Customer[]> {
    const list = await this.repo.find();
    if (list.length === 0) {
      for (const c of this.defaultCustomers) {
        await this.repo.upsert(c);
      }
      return this.defaultCustomers;
    }
    return list;
  }

  static async search(query: string): Promise<Customer[]> {
    const q = query.toLowerCase().trim();
    if (!q) return this.listCustomers();

    return this.repo.find({
      predicate: c =>
        c.name.toLowerCase().includes(q) ||
        (c.phone && c.phone.includes(q)) ||
        (c.email && c.email.toLowerCase().includes(q)),
    });
  }

  static async addLoyaltyPoints(customerId: string, orderTotalDollars: number): Promise<Customer | null> {
    const customer = await this.repo.findById(customerId);
    if (!customer) return null;

    // 1 point per whole dollar spent
    const pointsEarned = Math.floor(orderTotalDollars);
    customer.loyaltyPoints = (customer.loyaltyPoints || 0) + pointsEarned;
    customer.totalSpend = Money.fromDollars(customer.totalSpend || 0).add(orderTotalDollars).toDollars();
    customer.visitCount = (customer.visitCount || 0) + 1;
    customer.lastVisit = new Date().toISOString().split('T')[0];

    // Re-evaluate segment
    if (customer.totalSpend >= 1000 || customer.visitCount >= 15) {
      customer.segment = 'VIP';
    } else if (customer.visitCount >= 3) {
      customer.segment = 'Regular';
    }

    await this.repo.upsert(customer);
    return customer;
  }
}
