// Detects when a newer build was deployed and applies it.
// 1) version.json sa server (kailangan ng internet)
// 2) ang service worker: kapag na-download na ang bagong version sa background,
//    nagpapadala ito ng "SW_ACTIVATED" -> lalabas ang banner kahit OFFLINE na,
//    at ang "Update now" ay reload na lang.
import { useEffect, useState } from "react";
import { isNativeApp } from "./pwaInstall";

/* global __BUILD_ID__ */
export const BUILD_ID = typeof __BUILD_ID__ !== "undefined" ? __BUILD_ID__ : "dev";

let remoteId = null;
let lastCheck = 0;
let inflight = null;
let swReady = false;
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

function kickSwUpdate() {
  try {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistration().then((r) => r && r.update()).catch(() => {});
    }
  } catch (_) {}
}

export function checkForUpdate(force) {
  if (import.meta.env.DEV || isNativeApp()) return Promise.resolve(false);
  if (inflight) return inflight;
  if (!force && Date.now() - lastCheck < 60000) return Promise.resolve(isUpdateAvailable());
  inflight = fetchRemoteId().then((id) => {
    lastCheck = Date.now();
    inflight = null;
    if (id) {
      remoteId = id;
      notify();
      if (id !== BUILD_ID) kickSwUpdate();
    }
    return isUpdateAvailable();
  });
  return inflight;
}

// Tinatanong ang active service worker kung anong build siya (v7+ lang ang sumasagot).
async function activeBuild() {
  try {
    const reg = await navigator.serviceWorker.getRegistration();
    const sw = reg && reg.active;
    if (!sw) return null;
    return await new Promise((resolve) => {
      const ch = new MessageChannel();
      const t = setTimeout(() => resolve(null), 2000);
      ch.port1.onmessage = (e) => {
        clearTimeout(t);
        resolve(e.data && e.data.build ? String(e.data.build) : null);
      };
      sw.postMessage({ type: "GET_BUILD" }, [ch.port2]);
    });
  } catch (_) {
    return null;
  }
}

async function installLatest(timeoutMs) {
  try {
    const reg = "serviceWorker" in navigator ? await navigator.serviceWorker.getRegistration() : null;
    if (!reg) return true;
    await reg.update();
    const w = reg.installing || reg.waiting;
    if (!w) {
      // Walang bagong ini-install. Okay lang i-reload kung ang active SW ay ang pinakabago na.
      const b = await activeBuild();
      return !b || !remoteId || b === remoteId;
    }
    if (w.state === "activated") return true;
    return await new Promise((resolve) => {
      const t = setTimeout(() => resolve(false), timeoutMs);
      w.addEventListener("statechange", () => {
        if (w.state === "activated") { clearTimeout(t); resolve(true); }
        else if (w.state === "redundant") { clearTimeout(t); resolve(false); }
      });
    });
  } catch (_) {
    return false;
  }
}

// Wala nang binubura na cache: kapag pumalya ang download (walang signal / load),
// buo pa rin ang lumang version. Returns false kung hindi natuloy.
export async function applyUpdate() {
  if (!swReady) {
    if (typeof navigator !== "undefined" && navigator.onLine === false) return false;
    const ok = await installLatest(90000);
    if (!ok) return false;
  }
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

if (typeof window !== "undefined") {
  const recheck = () => { if (document.visibilityState !== "hidden") checkForUpdate(false); };
  document.addEventListener("visibilitychange", recheck);
  window.addEventListener("online", recheck);
  window.addEventListener("focus", recheck);
  setInterval(recheck, 30 * 60 * 1000);
  setTimeout(recheck, 1500);

  if ("serviceWorker" in navigator && !import.meta.env.DEV && !isNativeApp()) {
    const hadController = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.addEventListener("message", (e) => {
      const d = e.data;
      if (!hadController || !d || d.type !== "SW_ACTIVATED" || !d.build) return;
      if (String(d.build) === BUILD_ID) return;
      swReady = true;
      remoteId = String(d.build);
      notify();
    });

    // Kapag pumalya ang pag-install ng bagong version (nawalan ng signal, atbp.),
    // subukan ulit nang kusa hanggang matapos. Ang na-download na ay hindi na uulitin.
    let retries = 0;
    const retry = () => {
      if (swReady || !isUpdateAvailable() || retries >= 8) return;
      if (document.visibilityState === "hidden" || navigator.onLine === false) return;
      retries++;
      kickSwUpdate();
    };
    navigator.serviceWorker.ready.then((reg) => {
      reg.addEventListener("updatefound", () => {
        const w = reg.installing;
        if (!w) return;
        w.addEventListener("statechange", () => {
          if (w.state === "redundant") setTimeout(retry, 15000);
        });
      });
    }).catch(() => {});
    setInterval(retry, 2 * 60 * 1000);
  }
}
