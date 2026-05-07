
import { useState } from "react";
import { Plus } from "lucide-react";
import { saveExpenseToFirestore } from "../services/firestoreService";
import type { NewExpense } from "../types";

const initialState: NewExpense = {
  date: "",
  description: "",
  amount: 0,
  buyer: ""
};

export default function ExpenseForm({ onSaved }: { onSaved?: () => void }) {
  const [expense, setExpense] = useState<NewExpense>(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setExpense((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expense.date || !expense.description || !expense.amount) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await saveExpenseToFirestore(expense);
      setExpense(initialState);
      if (onSaved) onSaved();
    } catch {
      setError("Fehler beim Speichern der Auslage.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Auslage erfassen</h2>
      <div className="space-y-3">
        <input
          type="date"
          name="date"
          value={expense.date}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Beschreibung</label>
          <input
            type="text"
            name="description"
            value={expense.description}
            onChange={handleChange}
            placeholder="Beschreibung"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Betrag (€)</label>
          <input
            type="number"
            name="amount"
            value={expense.amount}
            onChange={handleChange}
            placeholder="Betrag (€)"
            min="0"
            step="0.01"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Käufer/in (optional)</label>
          <input
            type="text"
            name="buyer"
            value={expense.buyer}
            onChange={handleChange}
            placeholder="Käufer/in (optional)"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          <Plus size={20} />
          {loading ? "Speichern..." : "Auslage hinzufügen"}
        </button>
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
      </div>
    </div>
  );
}
