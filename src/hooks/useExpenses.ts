import { useEffect, useState } from "react";
import { fetchExpensesFromFirestore, deleteExpenseFromFirestore, updateExpenseInFirestore } from "../services/firestoreService";
import type { Expense } from "../types";

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExpenses();
  }, []);

  async function fetchExpenses() {
    setLoading(true);
    try {
      const data = await fetchExpensesFromFirestore();
      setExpenses(data as Expense[]);
    } finally {
      setLoading(false);
    }
  }

  async function deleteExpense(id: string | number) {
    await deleteExpenseFromFirestore(String(id));
    setExpenses(expenses => expenses.filter(e => e.id !== id));
  }

  async function updateExpense(id: string | number, expense: Partial<Expense>) {
    await updateExpenseInFirestore(String(id), expense);
    setExpenses(expenses => expenses.map(e => e.id === id ? { ...e, ...expense } : e));
  }

  return { expenses, loading, deleteExpense, updateExpense };
}
