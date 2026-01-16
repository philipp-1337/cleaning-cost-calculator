import { useState } from 'react';
import Spinner from '../Spinner';
import { Trash2, Pencil } from 'lucide-react';
import type { Entry, NewEntry, Payment } from '../types';
import EditEntryModal from './EditEntryModal';
import { formatDate, formatHours, formatCurrency } from '../utils/formatters';

interface CombinedListProps {
  entries: Entry[];
  payments: Payment[];
  onDeleteEntry: (id: string | number) => Promise<void>;
  onUpdateEntry: (id: string | number, entry: NewEntry) => Promise<void>;
  onDeletePayment: (id: string | number) => Promise<void>;
  onUpdatePayment: (id: string | number, payment: Payment) => Promise<void>;
}

function mapCombined(entries: Entry[], payments: Payment[]) {
  return [
    ...entries.map(e => ({ ...e, type: 'entry' as const })),
    ...payments.map(p => ({ ...p, type: 'payment' as const })),
  ].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    if (dateA !== dateB) {
      return dateB - dateA;
    }
    // Bei gleichem Datum: Zahlungen vor Einträgen (Reinigungen)
    if (a.type === b.type) return 0;
    return a.type === 'payment' ? -1 : 1;
  });
}

export default function CombinedList({
  entries,
  payments,
  onDeleteEntry,
  onUpdateEntry,
  onDeletePayment,
  onUpdatePayment,
}: CombinedListProps) {
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [savingPayment, setSavingPayment] = useState(false);
  const combined = mapCombined(entries, payments);

  const handleDeleteEntry = async (id: string | number) => {
    if (confirm('Eintrag wirklich löschen?')) {
      try {
        await onDeleteEntry(id);
      } catch (e) {
        alert('Fehler beim Löschen!');
      }
    }
  };

  const handleDeletePayment = async (id: string | number) => {
    if (confirm('Zahlung wirklich löschen?')) {
      try {
        await onDeletePayment(id);
      } catch (e) {
        alert('Fehler beim Löschen!');
      }
    }
  };

  const handleSaveEdit = async (entry: NewEntry) => {
    if (!editingEntry) return;
    try {
      await onUpdateEntry(editingEntry.id, entry);
      setEditingEntry(null);
    } catch (e) {
      alert('Fehler beim Speichern!');
    }
  };

  const handleSaveEditPayment = async (payment: Payment) => {
    if (!editingPayment) return;
    setSavingPayment(true);
    try {
      await onUpdatePayment(editingPayment.id, payment);
      setEditingPayment(null);
    } catch (e) {
      alert('Fehler beim Speichern!');
    } finally {
      setSavingPayment(false);
    }
  };

  function ItemRow({ item }: { item: any }) {
    const isEntry = item.type === 'entry';
    return (
      <div
        key={item.id}
        className={`flex items-center justify-between border-b px-1 py-2 ${!isEntry ? 'bg-green-50' : ''}`}
        style={{ gap: 8 }}
      >
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-800 text-xs">{formatDate(item.date)}</p>
          {isEntry ? (
            <p className="text-xs text-gray-600 truncate">
              {item.persons} Person{item.persons > 1 ? 'en' : ''} × {formatHours(item.hours, item.minutes)}
            </p>
          ) : (
            <p className="text-xs text-gray-600">Zahlung geleistet</p>
          )}
        </div>
        <div className="text-right flex items-center gap-2">
          {isEntry ? (
            <span className="font-bold text-gray-800 text-xs">{formatCurrency(item.cost)}</span>
          ) : (
            <span className="font-bold text-green-600 text-xs">+{formatCurrency(item.amount)}</span>
          )}
          <button
            onClick={() => isEntry ? handleDeleteEntry(item.id) : handleDeletePayment(item.id)}
            className="text-red-500 hover:text-red-700 transition p-0.5 flex items-center"
            title="Löschen"
            aria-label="Löschen"
          >
            <Trash2 size={18} />
            <span className="hidden sm:inline ml-1">Löschen</span>
          </button>
          <button
            onClick={() => isEntry ? setEditingEntry(item as Entry) : setEditingPayment(item as Payment)}
            className="text-blue-500 hover:text-blue-700 transition p-0.5 flex items-center"
            title="Bearbeiten"
            aria-label="Bearbeiten"
          >
            <Pencil size={18} />
            <span className="hidden sm:inline ml-1">Bearbeiten</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {combined.map(item => (
        <ItemRow key={item.id} item={item} />
      ))}

      {editingEntry && (
        <EditEntryModal
          entry={editingEntry}
          onSave={handleSaveEdit}
          onClose={() => setEditingEntry(null)}
        />
      )}

      {editingPayment && (
        // Modal für Zahlungen mit Spinner und deaktiviertem Button
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg min-w-[300px]">
            <h2 className="text-lg font-semibold mb-4">Zahlung bearbeiten</h2>
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSaveEditPayment(editingPayment);
              }}
              className="space-y-3"
            >
              <input
                type="date"
                value={editingPayment.date}
                onChange={e => setEditingPayment({ ...editingPayment, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={savingPayment}
              />
              <input
                type="number"
                step="0.01"
                value={editingPayment.amount}
                onChange={e => setEditingPayment({ ...editingPayment, amount: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Betrag (€)"
                disabled={savingPayment}
              />
              {savingPayment && (
                <div className="flex justify-center py-2">
                  <Spinner />
                </div>
              )}
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setEditingPayment(null)}
                  className="px-4 py-2 bg-gray-200 rounded-lg"
                  disabled={savingPayment}
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg"
                  disabled={savingPayment}
                >
                  {savingPayment ? 'Speichern...' : 'Speichern'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
