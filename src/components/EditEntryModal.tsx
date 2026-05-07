import { useState, useEffect } from 'react';
import type { Entry, NewEntry } from '../types';
import { MINUTE_OPTIONS } from '../constants';

type EditEntryModalProps = {
  entry: Entry;
  onSave: (entry: NewEntry) => Promise<void>;
  onClose: () => void;
};

export default function EditEntryModal({ entry, onSave, onClose }: EditEntryModalProps) {
  const [editValues, setEditValues] = useState<NewEntry>({
    date: entry.date,
    persons: entry.persons,
    hours: entry.hours,
    minutes: entry.minutes,
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setEditValues({
      date: entry.date,
      persons: entry.persons,
      hours: entry.hours,
      minutes: entry.minutes,
    });
  }, [entry]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(editValues);
    } catch (e) {
      console.error('Fehler beim Speichern:', e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: keyof NewEntry, value: string | number) => {
    setEditValues({ ...editValues, [field]: value });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Eintrag bearbeiten</h2>
        <div className="space-y-3">
          <input
            type="date"
            value={editValues.date}
            onChange={e => handleChange('date', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Anzahl Personen
            </label>
            <input
              type="number"
              min="1"
              value={editValues.persons}
              onChange={e => handleChange('persons', parseInt(e.target.value) || 1)}
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
                value={editValues.hours}
                onChange={e => handleChange('hours', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minuten
              </label>
              <select
                value={editValues.minutes}
                onChange={e => handleChange('minutes', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {MINUTE_OPTIONS.map(min => (
                  <option key={min} value={min}>{min}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? 'Speichern...' : 'Speichern'}
            </button>
            <button
              onClick={onClose}
              disabled={isSaving}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition disabled:opacity-50 cursor-pointer"
            >
              Abbrechen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}