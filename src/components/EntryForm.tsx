import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { NewEntry } from '../types';
import { DEFAULT_NEW_ENTRY, MINUTE_OPTIONS } from '../constants';

type EntryFormProps = {
  onAdd: (entry: NewEntry) => Promise<void>;
};

export default function EntryForm({ onAdd }: EntryFormProps) {
  const [newEntry, setNewEntry] = useState<NewEntry>(DEFAULT_NEW_ENTRY);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!newEntry.date || (newEntry.hours === 0 && newEntry.minutes === 0)) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onAdd(newEntry);
      setNewEntry(DEFAULT_NEW_ENTRY);
    } catch {
      alert('Fehler beim Speichern!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Neuer Einsatz</h2>
      <div className="space-y-3">
        <input
          type="date"
          value={newEntry.date}
          onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Anzahl Personen
          </label>
          <input
            type="number"
            min="1"
            value={newEntry.persons}
            onChange={(e) => setNewEntry({ 
              ...newEntry, 
              persons: parseInt(e.target.value) || 1 
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stunden
            </label>
            <input
              type="number"
              min="0"
              value={newEntry.hours}
              onChange={(e) => setNewEntry({ 
                ...newEntry, 
                hours: parseInt(e.target.value) || 0 
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minuten
            </label>
            <select
              value={newEntry.minutes}
              onChange={(e) => setNewEntry({ 
                ...newEntry, 
                minutes: parseInt(e.target.value) 
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {MINUTE_OPTIONS.map(min => (
                <option key={min} value={min}>{min}</option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          <Plus size={20} />
          Einsatz hinzufügen
        </button>
      </div>
    </div>
  );
}