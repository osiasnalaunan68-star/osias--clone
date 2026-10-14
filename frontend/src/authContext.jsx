import { createContext, useContext, useEffect, useState, useCallback, useMemo, useRef } from "react";
import {
  signInWithRedirect, getRedirectResult, onAuthStateChanged, signOut,
  setPersistence, indexedDBLocalPersistence,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, onSnapshot, runTransaction, getDocFromServer } from "firebase/firestore";
import { auth, db, googleProvider } from "./firebase";
import { setServerClock, persistClock, getAccess, hasAnyPractice, TRIAL_DAYS, CL_TRIAL_DAYS } from "./access";

const DEVICE_ID_KEY = "cuble_deviceId";
const PENDING_SIGNIN_KEY = "cuble_pendingSignIn";
const PROFILE_CACHE_KEY = "cuble_profileCache_";

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
  const [profileError, setProfileError] = useState(null);
  const [signingIn, setSigningIn] = useState(() => localStorage.getItem(PENDING_SIGNIN_KEY) === "1");
  const currentDeviceId = getOrCreateDeviceId();

  // ── Trial / App Access (oras ng server, real-time) ──────────────────
  const [serverData, setServerData] = useState(null);
  const [clockReady, setClockReady] = useState(false);
  const [tick, setTick] = useState(0);
  const [intentPlanId, setIntentPlanId] = useState(null);
  const initDoneFor = useRef(null);
  const uid = user ? user.uid : null;

  useEffect(() => {
    if (!uid) {
      setServerData(null);
      setClockReady(false);
      initDoneFor.current = null;
      return;
    }
    const ref = doc(db, "users", uid);
    const unsub = onSnapshot(
      ref,
      { includeMetadataChanges: true },
      (snap) => {
        if (!snap.exists()) return;
        setServerData(snap.data());
        // Hintayin ang totoong datos ng server (hindi cache) bago gumawa ng trial.
        if (snap.metadata.fromCache || initDoneFor.current === uid) return;
        initDoneFor.current = uid;
        (async () => {
          try {
            await runTransaction(db, async (tx) => {
              const s = await tx.get(ref);
              if (!s.exists()) return;
              const d = s.data();
              const upd = { lastSeenAt: serverTimestamp() };
              // Isang beses lang ang trial bawat account; hindi na ulit kapag meron na
              // o kapag may bayad na practice subject na.
              if (!d.trial && !hasAnyPractice(d)) {
                upd.trial = { startedAt: serverTimestamp(), days: TRIAL_DAYS };
              }
              // Hiwalay na 7-day trial para sa RA 10863 (CL) — isang beses lang din,
              // maliban kung bumili na ng lifetime access (subscriptions.CL).
              if (!d.clTrial && !(d.subscriptions && d.subscriptions.CL)) {
                upd.clTrial = { startedAt: serverTimestamp(), days: CL_TRIAL_DAYS };
              }
              tx.update(ref, upd);
            });
            const fresh = await getDocFromServer(ref);
            const ls = fresh.data() && fresh.data().lastSeenAt;
            if (ls && ls.toMillis) setServerClock(ls.toMillis());
          } catch (e) {
            console.warn("trial/clock sync failed:", e);
          }
          setClockReady(true);
        })();
      },
      (err) => {
        console.warn("profile listener error:", err);
        setClockReady(true);
      }
    );
    const fallback = setTimeout(() => setClockReady(true), 6000);
    return () => { unsub(); clearTimeout(fallback); };
  }, [uid]);

  useEffect(() => {
    const id = setInterval(() => { setTick((t) => t + 1); persistClock(); }, 15000);
    return () => clearInterval(id);
  }, []);

  // Ang server data ang masusunod para sa access fields (real-time kapag nag-approve si admin).
  const mergedProfile = useMemo(() => {
    if (!profile || !serverData) return profile;
    const pick = {};
    ["subscriptions", "subscriptionExpiry", "appAccess", "trial", "clTrial", "pendingPurchases", "pendingAccess", "isAdmin"].forEach((k) => {
      pick[k] = serverData[k];
    });
    if (!pick.subscriptions) pick.subscriptions = profile.subscriptions;
    return { ...profile, ...pick };
  }, [profile, serverData]);

  const access = getAccess(mergedProfile, { clockReady });

  const syncProfile = useCallback(async (fbUser) => {
    setProfileError(null);
    try {
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
        subscriptions: { CL: false, TL: false, CDP: false, PC: false, TCP: false },
      };
      await setDoc(ref, fresh);
      setProfile(fresh);
      try { localStorage.setItem(PROFILE_CACHE_KEY + fbUser.uid, JSON.stringify(fresh)); } catch (_) {}
      setNeedsFullName(true);
      setDeviceLimitReached(false);
      return;
    }

    const data = snap.data();
    try { localStorage.setItem(PROFILE_CACHE_KEY + fbUser.uid, JSON.stringify(data)); } catch (_) {}
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
    } catch (err) {
      console.warn("syncProfile failed:", err);
      setProfileError((err && err.code ? err.code : "error") + (err && err.message ? " — " + err.message : ""));
      let restored = false;
      try {
        const cached = localStorage.getItem(PROFILE_CACHE_KEY + fbUser.uid);
        if (cached) { setProfile(JSON.parse(cached)); restored = true; }
      } catch (_) {}
      if (!restored) {
        // Fallback: gamitin ang Google account info para hindi blangko ang profile.
        setProfile({
          email: fbUser.email || "",
          displayName: fbUser.displayName || "",
          photoURL: fbUser.photoURL || "",
          fullName: fbUser.displayName || fbUser.email || "",
          devices: [{ id: currentDeviceId, label: guessDeviceLabel(), lastActive: Date.now() }],
          subscriptions: { CL: false, TL: false, CDP: false, PC: false, TCP: false },
          _localOnly: true,
        });
        setNeedsFullName(false);
      }
      setDeviceLimitReached(false);
    }
  }, [currentDeviceId]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      setUser(fbUser);
      if (fbUser) {
        let hasCached = false;
        try {
          const cached = localStorage.getItem(PROFILE_CACHE_KEY + fbUser.uid);
          if (cached) {
            const parsedCached = JSON.parse(cached);
            setProfile(parsedCached);
            setNeedsFullName(!parsedCached.fullName);
            hasCached = true;
          }
        } catch (_) {}
        if (hasCached) {
          setLoading(false);
          syncProfile(fbUser);
        } else {
          await syncProfile(fbUser);
          setLoading(false);
        }
      } else {
        setProfile(null);
        setProfileError(null);
        setNeedsFullName(false);
        setDeviceLimitReached(false);
        setLoading(false);
      }
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
    user, profile: mergedProfile, loading, needsFullName, deviceLimitReached, currentDeviceId,
    access, clockReady, tick, intentPlanId, setIntentPlanId,
    overlayOpen, setOverlayOpen, authError, profileError, signingIn,
    signInWithGoogle, signOutUser, completeFullName, removeDevice,
  };

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
