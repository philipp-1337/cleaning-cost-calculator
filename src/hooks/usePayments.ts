import { useState, useEffect } from 'react';
import type { Payment, NewPayment } from '../types';
import { 
  subscribeToPayments, 
  savePaymentToFirestore, 
  deletePaymentFromFirestore, 
  updatePaymentInFirestore
} from '../services/firestoreService';
import { sortByDate } from '../utils/dateUtils';

export function usePayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load payments from Firestore
  // Realtime-Updates für Zahlungen
  useEffect(() => {
    setLoading(true);
    let unsubscribe: (() => void) | undefined;
    try {
      unsubscribe = subscribeToPayments((loadedPayments: Payment[]) => {
        const processedPayments = loadedPayments.map((payment: any) => ({
          id: payment.id,
          date: payment.date || '',
          amount: payment.amount || 0,
        }));
        setPayments(sortByDate(processedPayments));
        setLoading(false);
      });
    } catch (e) {
      setError('Fehler beim Laden der Zahlungen');
      setLoading(false);
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Add new payment
  const addPayment = async (newPayment: NewPayment) => {
    if (!newPayment.date || !newPayment.amount) {
      return;
    }

    const paymentData = {
      date: newPayment.date,
      amount: typeof newPayment.amount === 'string' 
        ? parseFloat(newPayment.amount) 
        : newPayment.amount
    };

    try {
      await savePaymentToFirestore(paymentData);
      const newPaymentWithId = {
        id: Date.now(),
        ...paymentData
      };
      setPayments(sortByDate([...payments, newPaymentWithId]));
    } catch (e) {
      console.error('Fehler beim Speichern:', e);
      throw e;
    }
  };

  // Delete payment
  const deletePayment = async (id: string | number) => {
    setPayments(payments.filter(p => p.id !== id));
    if (typeof id === 'string') {
      try {
        await deletePaymentFromFirestore(id);
      } catch (e) {
        console.error('Fehler beim Löschen:', e);
        throw e;
      }
    }
  };

  // Update payment
  const updatePayment = async (id: string | number, updatedPayment: Payment) => {
    if (!id || !updatedPayment) return;
    if (typeof id === 'string') {
      try {
        await updatePaymentInFirestore(id, updatedPayment);
      } catch (e) {
        console.error('Fehler beim Aktualisieren:', e);
        throw e;
      }
    }
    setPayments(payments => payments.map(p => p.id === id ? { ...p, ...updatedPayment } : p));
  };

  return {
    payments,
    loading,
    error,
    addPayment,
    deletePayment,
    updatePayment
  };
}