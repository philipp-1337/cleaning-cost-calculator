import { useState, useEffect } from 'react';
import type { Entry, NewEntry } from '../types';
import { 
  fetchEntriesFromFirestore, 
  saveEntryToFirestore, 
  deleteEntryFromFirestore,
  updateEntryInFirestore 
} from '../services/firestoreService';
import { calculateTotalHours, calculateCost } from '../utils/calculations';
import { sortByDate } from '../utils/dateUtils';

export function useEntries() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load entries from Firestore
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const loadedEntries = await fetchEntriesFromFirestore();
        const processedEntries = loadedEntries.map((entry: any) => ({
          id: entry.id,
          date: entry.date || '',
          persons: entry.persons || 0,
          hours: entry.hours || 0,
          minutes: entry.minutes || 0,
          totalHours: calculateTotalHours(entry.hours || 0, entry.minutes || 0),
          cost: calculateCost(
            entry.persons || 0, 
            calculateTotalHours(entry.hours || 0, entry.minutes || 0)
          ),
        }));
        setEntries(sortByDate(processedEntries));
      } catch (e) {
        console.error('Fehler beim Laden der Einträge:', e);
        setError('Fehler beim Laden der Einträge');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Add new entry
  const addEntry = async (newEntry: NewEntry) => {
    if (!newEntry.date || (newEntry.hours === 0 && newEntry.minutes === 0)) {
      return;
    }

    const totalHours = calculateTotalHours(newEntry.hours, newEntry.minutes);
    const cost = calculateCost(newEntry.persons, totalHours);
    
    const entryData = {
      date: newEntry.date,
      persons: newEntry.persons,
      hours: newEntry.hours,
      minutes: newEntry.minutes,
      totalHours,
      cost
    };

    try {
      await saveEntryToFirestore(entryData);
      const newEntryWithId = {
        id: Date.now(),
        ...entryData
      };
      setEntries(sortByDate([...entries, newEntryWithId]));
    } catch (e) {
      console.error('Fehler beim Speichern:', e);
      throw e;
    }
  };

  // Update entry
  const updateEntry = async (id: string | number, updatedData: NewEntry) => {
    const totalHours = calculateTotalHours(updatedData.hours, updatedData.minutes);
    const cost = calculateCost(updatedData.persons, totalHours);
    
    const updated = { 
      ...updatedData, 
      totalHours, 
      cost 
    };

    try {
      await updateEntryInFirestore(id.toString(), updated);
      setEntries(entries.map(e => 
        e.id === id ? { ...e, ...updated } : e
      ));
    } catch (e) {
      console.error('Fehler beim Aktualisieren:', e);
      throw e;
    }
  };

  // Delete entry
  const deleteEntry = async (id: string | number) => {
    setEntries(entries.filter(e => e.id !== id));
    if (typeof id === 'string') {
      try {
        await deleteEntryFromFirestore(id);
      } catch (e) {
        console.error('Fehler beim Löschen:', e);
        throw e;
      }
    }
  };

  return {
    entries,
    loading,
    error,
    addEntry,
    updateEntry,
    deleteEntry
  };
}