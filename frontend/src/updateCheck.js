// Detects when a newer build was deployed (compares __BUILD_ID__ with /version.json).
import { useEffect, useState } from "react";
import { isNativeApp } from "./pwaInstall";

/* global __BUILD_ID__ */
export const BUILD_ID = typeof __BUILD_ID__ !== "undefined" ? __BUILD_ID__ : "dev";

let remoteId = null;
let lastCheck = 0;
let inflight = null;
const subs = new Set();
const notify = () => subs.forEach((f) => f());

export function getRemoteId() { return remoteId; }
export function isUpdateAvailable() { return !!remoteId && remoteId !== BUILD_ID; }

async function fetchRemoteId() {
  try {
    const res = await fetch(import.meta.env.BASE_URL + "version.json?t=" + Date.now(), { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    return data && data.id ? String(data.id) : null;
  } catch (_) {
    return null;
  }
}

// force = true ignores the 60-second throttle.
export function checkForUpdate(force) {
  if (import.meta.env.DEV || isNativeApp()) return Promise.resolve(false);
  if (inflight) return inflight;
  if (!force && Date.now() - lastCheck < 60000) return Promise.resolve(isUpdateAvailable());
  inflight = fetchRemoteId().then((id) => {
    lastCheck = Date.now();
    inflight = null;
    if (id) { remoteId = id; notify(); }
    return isUpdateAvailable();
  });
  return inflight;
}

// Removes the stale page files (index.html etc.) but keeps the big offline
// files (/assets/, .wasm, .db, fonts), then reloads. Needs internet.
export async function applyUpdate() {
  if (typeof navigator !== "undefined" && navigator.onLine === false) return false;
  try {
    if ("caches" in window) {
      const keys = await caches.keys();
      for (const k of keys) {
        const cache = await caches.open(k);
        const reqs = await cache.keys();
        await Promise.all(reqs.map((r) => {
          const u = new URL(r.url);
          const keep = u.origin !== location.origin || u.pathname.includes("/assets/") || /\.(wasm|db)$/.test(u.pathname);
          return keep ? null : cache.delete(r);
        }));
      }
    }
  } catch (_) {}
  try {
    const reg = "serviceWorker" in navigator ? await navigator.serviceWorker.getRegistration() : null;
    if (reg) await reg.update();
  } catch (_) {}
  location.reload();
  return true;
}

export function useUpdateAvailable() {
  const [, force] = useState(0);
  useEffect(() => {
    const f = () => force((n) => n + 1);
    subs.add(f);
    checkForUpdate(false);
    return () => { subs.delete(f); };
  }, []);
  return isUpdateAvailable();
}

// Re-check when the app opens, comes back to the front, or gets internet again.
if (typeof window !== "undefined") {
  const recheck = () => { if (document.visibilityState !== "hidden") checkForUpdate(false); };
  document.addEventListener("visibilitychange", recheck);
  window.addEventListener("online", recheck);
  window.addEventListener("focus", recheck);
  setInterval(recheck, 30 * 60 * 1000);
  setTimeout(recheck, 1500);
}
