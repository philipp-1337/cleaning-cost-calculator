import { useState } from 'react';
import type { Entry, Payment, ImportData } from '../types';
import { saveEntryToFirestore, savePaymentToFirestore } from '../services/firestoreService';
import { calculateTotalHours, calculateCost } from '../utils/calculations';

export function useImportExport(
  entries: Entry[], 
  payments: Payment[],
  onImportSuccess: (entries: Entry[], payments: Payment[]) => void
) {
  const [dragActive, setDragActive] = useState(false);

  const handleImport = async (file: File) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const data: ImportData = JSON.parse(e.target?.result as string);
        
        // Import entries
        if (data.entries && Array.isArray(data.entries)) {
          for (const entry of data.entries) {
            const totalHours = calculateTotalHours(entry.hours, entry.minutes);
            const cost = calculateCost(entry.persons, totalHours);
            const entryData = {
              date: entry.date,
              persons: entry.persons,
              hours: entry.hours,
              minutes: entry.minutes,
              totalHours,
              cost
            };
            try {
              await saveEntryToFirestore(entryData);
            } catch (err) {
              console.error('Fehler beim Speichern eines Eintrags:', err);
            }
          }
        }
        
        // Import payments
        if (data.payments && Array.isArray(data.payments)) {
          for (const payment of data.payments) {
            const paymentData = {
              date: payment.date,
              amount: payment.amount
            };
            try {
              await savePaymentToFirestore(paymentData);
            } catch (err) {
              console.error('Fehler beim Speichern einer Zahlung:', err);
            }
          }
        }
        
        onImportSuccess(data.entries || [], data.payments || []);
      } catch (err) {
        alert('Ungültige JSON-Datei!');
      }
    };
    
    reader.readAsText(file);
  };

  const handleExport = () => {
    const exportData: ImportData = {
      entries,
      payments,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cleaning-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    };

    // Neue Exportfunktion für menschenlesbaren Text
    const handleHumanExport = () => {
    let text = `Reinigungs- und Zahlungsübersicht\n\n`;
    if (entries.length === 0 && payments.length === 0) {
      text += 'Es wurden keine Reinigungseinträge oder Zahlungen gefunden.\n';
    } else {
      // Kombiniere alle Einträge und Zahlungen nach Datum
      type CombinedItem =
        | { type: 'entry'; date: string; entry: Entry }
        | { type: 'payment'; date: string; payment: Payment };
      const combined: CombinedItem[] = [];
      entries.forEach(entry => {
        combined.push({
          type: 'entry',
          date: entry.date,
          entry
        });
      });
      payments.forEach(payment => {
        combined.push({
          type: 'payment',
          date: payment.date,
          payment
        });
      });
      // Sortiere nach Datum, Einträge zuerst falls gleiches Datum
      combined.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        if (dateA !== dateB) return dateA - dateB;
        if (a.type === b.type) return 0;
        return a.type === 'entry' ? -1 : 1;
      });

      let saldo = 0;
      let gesamtKosten = 0;
      let gesamtZahlungen = 0;
      text += `Chronologische Übersicht:\n\n`;
      combined.forEach(item => {
        const date = new Date(item.date).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' });
        if (item.type === 'entry') {
          const entry = item.entry;
          const stunden = entry.hours;
          const minuten = entry.minutes;
          const personen = entry.persons;
          gesamtKosten += entry.cost;
          saldo -= entry.cost;
          text += `Am ${date} wurde die Reinigung von ${personen} Person${personen === 1 ? '' : 'en'} für ${stunden} Stunde${stunden === 1 ? '' : 'n'}${minuten > 0 ? ` und ${minuten} Minute${minuten === 1 ? '' : 'n'}` : ''} durchgeführt. Die Kosten betrugen ${entry.cost.toFixed(2)} €.\n`;
        } else if (item.type === 'payment') {
          const payment = item.payment;
          gesamtZahlungen += payment.amount;
          saldo += payment.amount;
          text += `Am ${date} wurde eine Zahlung in Höhe von ${payment.amount.toFixed(2)} € geleistet.\n`;
          text += `Der Saldo betrug ${saldo.toFixed(2)} €`;
          if (saldo > 0) {
            text += ' (Guthaben)';
          }
          text += `.\n`;
        }
      });
      text += `\nGesamtkosten: ${gesamtKosten.toFixed(2)} €\n`;
      text += `Gesamte Zahlungen: ${gesamtZahlungen.toFixed(2)} €\n`;
      text += `Endsaldo: ${saldo.toFixed(2)} €\n`;
    }
    text += `\nFreundliche Grüße!`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reinigungsbericht-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleImport(e.dataTransfer.files[0]);
    }
  };

  return {
    dragActive,
    handleImport,
    handleExport,
    handleHumanExport,
    handleDragOver,
    handleDragLeave,
    handleDrop
  };
}