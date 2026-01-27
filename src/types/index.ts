// Zentrale Type Definitions
export type Entry = {
  id: number | string;
  date: string;
  persons: number;
  hours: number;
  minutes: number;
  totalHours: number;
  cost: number;
};

export type Payment = {
  id: number | string;
  date: string;
  amount: number;
};

export type NewEntry = Omit<Entry, 'id' | 'totalHours' | 'cost'>;
export type NewPayment = Omit<Payment, 'id'>;
export type EditableEntry = Omit<Entry, 'id' | 'totalHours' | 'cost'>;

export type ImportData = {
  entries: Entry[];
  payments: Payment[];
  exportDate?: string;
};

export type Expense = {
  id: number | string;
  date: string;
  description: string;
  amount: number;
  buyer?: string;
};

export type NewExpense = Omit<Expense, 'id'>;