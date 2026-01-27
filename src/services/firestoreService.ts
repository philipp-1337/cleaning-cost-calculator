export async function updatePaymentInFirestore(paymentId: string, payment: Partial<Payment>) {
  const userId = getUserId();
  if (!userId) throw new Error('Nicht eingeloggt!');
  await updateDoc(doc(db, `userData/${userId}/payments/${paymentId}`), payment);
}
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
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
export async function fetchEntriesFromFirestore() {
  const userId = getUserId();
  if (!userId) throw new Error('Nicht eingeloggt!');
  const snapshot = await getDocs(collection(db, `userData/${userId}/entries`));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function fetchPaymentsFromFirestore() {
  const userId = getUserId();
  if (!userId) throw new Error('Nicht eingeloggt!');
  const snapshot = await getDocs(collection(db, `userData/${userId}/payments`));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
import { db, auth } from "../firebase";
import type { Entry, Payment, Expense } from "../types";

function getUserId() {
  return auth.currentUser?.uid;
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

  export async function fetchExpensesFromFirestore() {
    const userId = getUserId();
    if (!userId) throw new Error('Nicht eingeloggt!');
    const snapshot = await getDocs(collection(db, `userData/${userId}/expenses`));
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        date: data.date ?? "",
        description: data.description ?? "",
        amount: typeof data.amount === "number" ? data.amount : 0,
        buyer: data.buyer ?? ""
      };
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
