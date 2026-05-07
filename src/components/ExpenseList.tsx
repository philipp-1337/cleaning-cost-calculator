import { useEffect, useState } from "react";
import { subscribeToExpenses, deleteExpenseFromFirestore } from "../services/firestoreService";
import type { Expense } from "../types";

export default function ExpenseList() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    try {
      unsubscribe = subscribeToExpenses((data: Expense[]) => {
        setExpenses(data);
        setLoading(false);
      });
    } catch {
      setTimeout(() => {
        setError("Fehler beim Laden der Auslagen.");
        setLoading(false);
      }, 0);
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  async function handleDelete(id: string | number) {
    if (!window.confirm("Auslage wirklich löschen?")) return;
    try {
      await deleteExpenseFromFirestore(String(id));
      setExpenses(expenses.filter(e => e.id !== id));
    } catch {
      setError("Fehler beim Löschen.");
    }
  }

  if (loading) return <div>Lade Auslagen...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (expenses.length === 0) return <div>Keine Auslagen erfasst.</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4 text-blue-700">Auslagen</h3>
      <ul className="space-y-3">
        {expenses.map(exp => (
          <li key={exp.id} className="flex justify-between items-center border rounded p-3 bg-blue-50 hover:bg-blue-100 transition">
            <div className="flex flex-col">
              <span className="font-medium text-gray-800">{exp.description}</span>
              <span className="text-xs text-gray-500">{exp.date}{exp.buyer ? ` • ${exp.buyer}` : ""}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-bold text-blue-700">{exp.amount.toFixed(2)} €</span>
              <button
                onClick={() => handleDelete(exp.id)}
                className="text-red-500 hover:text-red-700 text-sm px-2 py-1 rounded transition border border-red-200 bg-white cursor-pointer"
                title="Löschen"
              >
                &#10006;
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
