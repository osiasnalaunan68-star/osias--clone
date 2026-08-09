import { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  signInWithRedirect, getRedirectResult, onAuthStateChanged, signOut,
  setPersistence, indexedDBLocalPersistence,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider } from "./firebase";

const DEVICE_ID_KEY = "cuble_deviceId";
const PENDING_SIGNIN_KEY = "cuble_pendingSignIn";

function makeId() {
  if (window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID();
  return "dev-" + Date.now() + "-" + Math.random().toString(16).slice(2);
}

function getOrCreateDeviceId() {
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = makeId();
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}

function guessDeviceLabel() {
  const ua = navigator.userAgent || "";
  if (window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform()) {
    return "CuBLE App (Android)";
  }
  if (/Android/i.test(ua)) return "Android · Chrome";
  if (/iPhone|iPad|iPod/i.test(ua)) return "iOS · Safari";
  return "Desktop · Browser";
}

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [needsFullName, setNeedsFullName] = useState(false);
  const [deviceLimitReached, setDeviceLimitReached] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(() => localStorage.getItem(PENDING_SIGNIN_KEY) === "1");
  const [authError, setAuthError] = useState(null);
  const [signingIn, setSigningIn] = useState(() => localStorage.getItem(PENDING_SIGNIN_KEY) === "1");
  const currentDeviceId = getOrCreateDeviceId();

  const syncProfile = useCallback(async (fbUser) => {
    const ref = doc(db, "users", fbUser.uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      const fresh = {
        email: fbUser.email || "",
        displayName: fbUser.displayName || "",
        photoURL: fbUser.photoURL || "",
        fullName: null,
        createdAt: serverTimestamp(),
        devices: [{ id: currentDeviceId, label: guessDeviceLabel(), lastActive: Date.now() }],
        subscriptions: { CL: false, TL: false, CDP: false, PC: false },
      };
      await setDoc(ref, fresh);
      setProfile(fresh);
      setNeedsFullName(true);
      setDeviceLimitReached(false);
      return;
    }

    const data = snap.data();
    const devices = data.devices || [];
    const already = devices.find((d) => d.id === currentDeviceId);

    if (already) {
      const updated = devices.map((d) =>
        d.id === currentDeviceId ? { ...d, lastActive: Date.now() } : d
      );
      await updateDoc(ref, { devices: updated });
      setProfile({ ...data, devices: updated });
      setDeviceLimitReached(false);
    } else if (devices.length < 2) {
      const updated = [...devices, { id: currentDeviceId, label: guessDeviceLabel(), lastActive: Date.now() }];
      await updateDoc(ref, { devices: updated });
      setProfile({ ...data, devices: updated });
      setDeviceLimitReached(false);
    } else {
      setProfile(data);
      setDeviceLimitReached(true);
    }
    setNeedsFullName(!data.fullName);
  }, [currentDeviceId]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      setUser(fbUser);
      if (fbUser) {
        await syncProfile(fbUser);
      } else {
        setProfile(null);
        setNeedsFullName(false);
        setDeviceLimitReached(false);
      }
      setLoading(false);
    });
    return unsub;
  }, [syncProfile]);

  // Catch the result of signInWithRedirect after the page navigates back.
  useEffect(() => {
    const wasPending = localStorage.getItem(PENDING_SIGNIN_KEY) === "1";
    getRedirectResult(auth)
      .catch((err) => {
        console.warn("getRedirectResult error:", err);
        const code = err?.code || "unknown-error";
        const msg = err?.message || "";
        setAuthError(`[${code}] ${msg || "Hindi na-process ang sign-in. Subukan ulit."}`);
      })
      .finally(() => {
        if (wasPending) {
          localStorage.removeItem(PENDING_SIGNIN_KEY);
          setSigningIn(false);
        }
      });
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setAuthError(null);
    setSigningIn(true);
    localStorage.setItem(PENDING_SIGNIN_KEY, "1");
    try {
      await setPersistence(auth, indexedDBLocalPersistence);
    } catch (persistErr) {
      console.warn("setPersistence failed:", persistErr);
    }
    try {
      await signInWithRedirect(auth, googleProvider);
      // Page navigates away here — code after this line generally won't run.
    } catch (err) {
      console.warn("Google sign-in error:", err);
      const code = err?.code || "unknown-error";
      const msg = err?.message || "";
      setAuthError(`[${code}] ${msg || "Hindi na-process ang sign-in. Subukan ulit."}`);
      setSigningIn(false);
      localStorage.removeItem(PENDING_SIGNIN_KEY);
    }
  }, []);

  const signOutUser = useCallback(() => signOut(auth), []);

  const completeFullName = useCallback(async (fullName) => {
    if (!user) return;
    await updateDoc(doc(db, "users", user.uid), { fullName });
    setProfile((p) => ({ ...p, fullName }));
    setNeedsFullName(false);
  }, [user]);

  const removeDevice = useCallback(async (deviceId) => {
    if (!user || !profile) return;
    const ref = doc(db, "users", user.uid);
    const updated = (profile.devices || []).filter((d) => d.id !== deviceId);
    await updateDoc(ref, { devices: updated });
    setProfile((p) => ({ ...p, devices: updated }));

    if (deviceId === currentDeviceId) {
      await signOut(auth);
      return;
    }
    if (deviceLimitReached) {
      await syncProfile(user);
    }
  }, [user, profile, currentDeviceId, deviceLimitReached, syncProfile]);

  const value = {
    user, profile, loading, needsFullName, deviceLimitReached, currentDeviceId,
    overlayOpen, setOverlayOpen, authError, signingIn,
    signInWithGoogle, signOutUser, completeFullName, removeDevice,
  };

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
