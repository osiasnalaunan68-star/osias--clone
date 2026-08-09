// Firebase setup — Google Sign-In + Firestore (user profile at subscriptions)
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyARhpqrQM2WysnLDYNi7zHAm7gnsJt4X5I",
  authDomain: "ra10863.firebaseapp.com",
  projectId: "ra10863",
  storageBucket: "ra10863.firebasestorage.app",
  messagingSenderId: "160101866737",
  appId: "1:160101866737:web:3fce8b9e40a9139b211d50",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Local IndexedDB cache para may bumabalik pang datos (profile, subscriptions)
// kahit walang internet — kailangan lalo na sa APK offline-first na app.
enableIndexedDbPersistence(db).catch((err) => {
  console.warn("Firestore offline persistence not enabled:", err.code || err);
});
