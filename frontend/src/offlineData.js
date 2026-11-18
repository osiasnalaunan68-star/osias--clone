// Offline-first loader para sa customs_law.db at sql.js wasm.
// Naka-save sa Cache Storage "cmta-data-v1" (hindi binubura ng sw.js).
// Ang page mismo ang nagse-save, hindi umaasa sa service worker.
/* global __DB_HASH__ */
export const DATA_CACHE = "cmta-data-v1"; // dapat pareho sa public/sw.js
const DB_HASH = typeof __DB_HASH__ !== "undefined" ? __DB_HASH__ : "dev";

export const absUrl = (p) => new URL(p, document.baseURI).href;
export const DB_URL = absUrl(import.meta.env.BASE_URL + "customs_law.db") + "?v=" + DB_HASH;

const MAGIC = {
  db: [0x53, 0x51, 0x4c, 0x69, 0x74, 0x65, 0x20, 0x66, 0x6f, 0x72, 0x6d, 0x61, 0x74, 0x20, 0x33, 0x00],
  wasm: [0x00, 0x61, 0x73, 0x6d],
};
const looksValid = (b, kind) => !!b && b.length > MAGIC[kind].length && MAGIC[kind].every((x, i) => b[i] === x);
const isOnline = () => typeof navigator === "undefined" || navigator.onLine !== false;
const isNative = () => {
  try { return !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform()); } catch (_) { return false; }
};
// APK (bundled na) at dev: walang cache, kapareho ng dati.
const cacheOn = () => typeof caches !== "undefined" && !isNative() && !import.meta.env.DEV;

async function readCached(key, kind, loose) {
  if (!cacheOn()) return null;
  try {
    const res = await caches.match(key, loose ? { ignoreSearch: true } : undefined);
    if (!res) return null;
    const bytes = new Uint8Array(await res.arrayBuffer());
    if (looksValid(bytes, kind)) return bytes;
    if (!loose) for (const n of await caches.keys()) await (await caches.open(n)).delete(key);
  } catch (_) {}
  return null;
}

async function fetchValid(url, kind) {
  const res = await fetch(url, { cache: "no-cache" });
  if (!res.ok) throw new Error("HTTP " + res.status);
  const bytes = new Uint8Array(await res.arrayBuffer());
  if (!looksValid(bytes, kind)) throw new Error("invalid file");
  return bytes;
}

async function store(key, bytes, kind) {
  if (!cacheOn()) return;
  try {
    const cache = await caches.open(DATA_CACHE);
    await cache.put(key, new Response(bytes, { headers: { "Content-Type": kind === "wasm" ? "application/wasm" : "application/octet-stream" } }));
    const ext = kind === "wasm" ? ".wasm" : ".db";
    for (const req of await cache.keys()) {
      if (req.url !== key && new URL(req.url).pathname.endsWith(ext)) await cache.delete(req); // lumang version
    }
    if (kind === "db") {
      const legacy = key.split("?")[0]; // lumang un-versioned copy
      for (const n of await caches.keys()) await (await caches.open(n)).delete(legacy);
    }
  } catch (_) {}
}

export async function loadOfflineBytes(key, kind) {
  const cached = await readCached(key, kind, false);
  if (cached) return cached;
  const online = isOnline();
  let netErr = null;
  if (online) {
    try {
      const bytes = await fetchValid(key, kind);
      await store(key, bytes, kind);
      return bytes;
    } catch (e) { netErr = e; }
  }
  const old = await readCached(key, kind, true); // kahit lumang copy, mas okay kaysa wala
  if (old) return old;
  const err = new Error(
    online
      ? "Could not download the CMTA data" + (netErr ? " (" + netErr.message + ")" : "") + ". Check your connection and try again."
      : "The CMTA data isn't saved on this device yet. Connect to the internet and open the app once — after that it works fully offline."
  );
  err.offline = !online;
  throw err;
}

// Download + save kung wala pa, para offline-ready agad.
export async function ensureOffline(items) {
  if (!cacheOn() || !isOnline()) return;
  try { if (navigator.storage && navigator.storage.persist) Promise.resolve(navigator.storage.persist()).catch(() => {}); } catch (_) {}
  for (const [key, kind] of items) {
    try {
      if (await caches.match(key)) continue;
      await store(key, await fetchValid(key, kind), kind);
    } catch (_) {}
  }
}
