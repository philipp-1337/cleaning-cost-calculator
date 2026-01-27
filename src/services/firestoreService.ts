import { collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot } from "firebase/firestore";
import { db, auth } from "../firebase";
import type { Entry, Payment, Expense } from "../types";

function getUserId() {
  return auth.currentUser?.uid;
}

export async function updatePaymentInFirestore(paymentId: string, payment: Partial<Payment>) {
  const userId = getUserId();
  if (!userId) throw new Error('Nicht eingeloggt!');
  await updateDoc(doc(db, `userData/${userId}/payments/${paymentId}`), payment);
}

export async function deleteEntryFromFirestore(entryId: string) {
  const userId = getUserId();
  if (!userId) throw new Error('Nicht eingeloggt!');
  await deleteDoc(doc(db, `userData/${userId}/entries/${entryId}`));
}

export async function deletePaymentFromFirestore(paymentId: string) {
  const userId = getUserId();
  if (!userId) throw new Error('Nicht eingeloggt!');
  await deleteDoc(doc(db, `userData/${userId}/payments/${paymentId}`));
}

export async function updateEntryInFirestore(entryId: string, entry: Partial<Entry>) {
  const userId = getUserId();
  if (!userId) throw new Error('Nicht eingeloggt!');
  await updateDoc(doc(db, `userData/${userId}/entries/${entryId}`), entry);
}

export function subscribeToEntries(callback: (entries: Entry[]) => void) {
  const userId = getUserId();
  if (!userId) throw new Error('Nicht eingeloggt!');
  const entriesRef = collection(db, `userData/${userId}/entries`);
  return onSnapshot(entriesRef, (snapshot) => {
    const entries = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        date: data.date ?? "",
        persons: typeof data.persons === "number" ? data.persons : 0,
        hours: typeof data.hours === "number" ? data.hours : 0,
        minutes: typeof data.minutes === "number" ? data.minutes : 0,
        totalHours: typeof data.totalHours === "number" ? data.totalHours : 0,
        cost: typeof data.cost === "number" ? data.cost : 0
      };
    });
    callback(entries);
  });
}

export function subscribeToPayments(callback: (payments: Payment[]) => void) {
  const userId = getUserId();
  if (!userId) throw new Error('Nicht eingeloggt!');
  const paymentsRef = collection(db, `userData/${userId}/payments`);
  return onSnapshot(paymentsRef, (snapshot) => {
    const payments = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        date: data.date ?? "",
        amount: typeof data.amount === "number" ? data.amount : 0
      };
    });
    callback(payments);
  });
}

export async function saveEntryToFirestore(entry: Omit<Entry, 'id'>) {
  const userId = getUserId();
  if (!userId) throw new Error('Nicht eingeloggt!');
  try {
    const docRef = await addDoc(collection(db, `userData/${userId}/entries`), entry);
    return docRef.id;
  } catch (e) {
    console.error("Fehler beim Speichern des Eintrags:", e);
    throw e;
  }
}

export async function savePaymentToFirestore(payment: Omit<Payment, 'id'>) {
  const userId = getUserId();
  if (!userId) throw new Error('Nicht eingeloggt!');
  try {
    const docRef = await addDoc(collection(db, `userData/${userId}/payments`), payment);
    return docRef.id;
  } catch (e) {
    console.error("Fehler beim Speichern der Zahlung:", e);
    throw e;
  }
}

export async function saveExpenseToFirestore(expense: Omit<Expense, 'id'>) {
  const userId = getUserId();
  if (!userId) throw new Error('Nicht eingeloggt!');
  try {
    const docRef = await addDoc(collection(db, `userData/${userId}/expenses`), expense);
    return docRef.id;
  } catch (e) {
    console.error("Fehler beim Speichern der Auslage:", e);
    throw e;
  }
}

export function subscribeToExpenses(callback: (expenses: Expense[]) => void) {
  const userId = getUserId();
  if (!userId) throw new Error('Nicht eingeloggt!');
  const expensesRef = collection(db, `userData/${userId}/expenses`);
  return onSnapshot(expensesRef, (snapshot) => {
    const expenses = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        date: data.date ?? "",
        description: data.description ?? "",
        amount: typeof data.amount === "number" ? data.amount : 0,
        buyer: data.buyer ?? ""
      };
    });
    callback(expenses);
  });
}

export async function updateExpenseInFirestore(expenseId: string, expense: Partial<Expense>) {
  const userId = getUserId();
  if (!userId) throw new Error('Nicht eingeloggt!');
  await updateDoc(doc(db, `userData/${userId}/expenses/${expenseId}`), expense);
}

export async function deleteExpenseFromFirestore(expenseId: string) {
  const userId = getUserId();
  if (!userId) throw new Error('Nicht eingeloggt!');
  await deleteDoc(doc(db, `userData/${userId}/expenses/${expenseId}`));
}
