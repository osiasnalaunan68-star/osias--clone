// Firebase setup — Google Sign-In + Firestore (user profile at subscriptions)
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBCAg768PHw5gy_yule6EpWsiAUQl9HgCE",
  authDomain: "cuble-app-fe94d.firebaseapp.com",
  projectId: "cuble-app-fe94d",
  storageBucket: "cuble-app-fe94d.firebasestorage.app",
  messagingSenderId: "415460175466",
  appId: "1:415460175466:web:48cf182f6a51916ca06413",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
