import { RATE_PER_PERSON_PER_HOUR } from '../constants';
import type { Entry, Payment } from '../types';

export function calculateTotalHours(hours: number, minutes: number): number {
  return hours + minutes / 60;
}

export function calculateCost(persons: number, totalHours: number): number {
  return persons * totalHours * RATE_PER_PERSON_PER_HOUR;
}

export function calculateTotalCosts(entries: Entry[]): number {
  return entries.reduce((sum, entry) => sum + entry.cost, 0);
}

export function calculateTotalPaid(payments: Payment[]): number {
  return payments.reduce((sum, payment) => sum + payment.amount, 0);
}

export function calculateBalance(totalPaid: number, totalCosts: number): number {
  return totalPaid - totalCosts;
}