// Firebase-Konfiguration und Firestore-Initialisierung
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBFaoX4RtCQuGOTCK4XaTrEYaubv8ZzPJ8",
  authDomain: "cleaning-cost-calculator.firebaseapp.com",
  projectId: "cleaning-cost-calculator",
  storageBucket: "cleaning-cost-calculator.firebasestorage.app",
  messagingSenderId: "632817611939",
  appId: "1:632817611939:web:c2ddd5ef0d31a45143fb16"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };