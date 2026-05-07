import { useEffect, useState } from "react";
import { deleteExpenseFromFirestore, updateExpenseInFirestore } from "../services/firestoreService";
import { subscribeToExpenses } from "../services/firestoreService";
import type { Expense } from "../types";

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    try {
      unsubscribe = subscribeToExpenses((data: Expense[]) => {
        setExpenses(data);
        setLoading(false);
      });
    } catch {
      setTimeout(() => setLoading(false), 0);
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

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
