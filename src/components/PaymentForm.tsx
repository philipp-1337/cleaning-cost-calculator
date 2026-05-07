import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { NewPayment } from '../types';
import { DEFAULT_NEW_PAYMENT } from '../constants';

type PaymentFormProps = {
  onAdd: (payment: NewPayment) => Promise<void>;
};

export default function PaymentForm({ onAdd }: PaymentFormProps) {
  const [newPayment, setNewPayment] = useState<{ date: string; amount: string }>(
    DEFAULT_NEW_PAYMENT
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!newPayment.date || !newPayment.amount) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onAdd({
        date: newPayment.date,
        amount: parseFloat(newPayment.amount)
      });
      setNewPayment(DEFAULT_NEW_PAYMENT);
    } catch {
      alert('Fehler beim Speichern!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        Zahlung erfassen
      </h2>
      <div className="space-y-3">
        <input
          type="date"
          value={newPayment.date}
          onChange={(e) => setNewPayment({ ...newPayment, date: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Betrag (€)
          </label>
          <input
            type="number"
            step="0.01"
            value={newPayment.amount}
            onChange={(e) => setNewPayment({ 
              ...newPayment, 
              amount: e.target.value 
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="270.00"
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          <Plus size={20} />
          Zahlung hinzufügen
        </button>
      </div>
    </div>
  );
}