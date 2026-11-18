// Service worker v6 — atomic, per-build precache.
//
// 1. Kada deploy nagbabago ang sw.js -> bagong cache na "cmta-build-<id>".
// 2. Sa install, dina-download ang LAHAT ng files ng bagong build (precache.json).
//    Kapag may pumalya (nawalan ng signal / load), FAILED ang install at ang LUMANG
//    version ay tuloy pa ring gumagana. Walang halo-halong luma at bago.
//    Susubukan ulit sa susunod; yung na-download na ay hindi na uulitin.
// 3. Kapag kumpleto na saka lang mag-activate ang bagong version at saka lang buburahin
//    ang lumang cache (1 nakaraang build ang itinatago para sa bukas na page).
// 4. Pag-open ng app: galing agad sa cache, kahit walang internet / walang load.
// 5. Pag na-activate ang bagong version, sinasabihan ang page (SW_ACTIVATED)
//    para lumabas ang "New version" banner.
// customs_law.db: nasa DATA_CACHE, best-effort lang ang precache nito; ang page
// (src/offlineData.js) ang may fallback sa lumang copy.
const SW_BUILD = "__BUILD_ID__";
const DB_HASH = "__DB_HASH__";
const BUILD_PREFIX = "cmta-build-";
const CACHE_NAME = BUILD_PREFIX + SW_BUILD;
const DATA_CACHE = "cmta-data-v1"; // pareho sa src/offlineData.js

const isLocalScope = () => /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\//.test(self.registration.scope);
const readyUrl = () => new URL("__ready", self.registration.scope).href;

function isHtmlForAsset(url, response) {
  try {
    const ct = response.headers.get("content-type") || "";
    return ct.includes("text/html") && /\.(js|css|wasm|db|png|woff2?)(\?|$)/.test(url);
  } catch (_) { return false; }
}

async function fetchOk(url, fresh) {
  let lastErr;
  for (let i = 0; i < 2; i++) {
    try {
      const r = await fetch(url, { cache: fresh ? "no-cache" : "default" });
      if (!r.ok) throw new Error("HTTP " + r.status + " " + url);
      if (isHtmlForAsset(url, r)) throw new Error("HTML instead of file: " + url);
      return r;
    } catch (e) { lastErr = e; }
  }
  throw lastErr;
}

async function fromOldCaches(url, names) {
  for (const name of names) {
    try {
      const hit = await (await caches.open(name)).match(url);
      if (hit) return hit;
    } catch (_) {}
  }
  return null;
}

async function precacheAll() {
  const scope = self.registration.scope;
  if (isLocalScope()) return; // APK / dev: bundled na

  const res = await fetch(new URL("precache.json", scope), { cache: "no-store" });
  if (!res.ok) throw new Error("precache.json HTTP " + res.status);
  const data = await res.json();
  if (!SW_BUILD.startsWith("__") && data.id && String(data.id) !== SW_BUILD) throw new Error("precache.json is from another build");

  const files = Array.isArray(data.files) ? data.files : [];
  const cache = await caches.open(CACHE_NAME);
  const dataCache = await caches.open(DATA_CACHE);
  const oldNames = (await caches.keys()).filter((k) => k.startsWith("cmta-") && k !== CACHE_NAME && k !== DATA_CACHE);
  const failed = [];

  const one = async (f) => {
    const isDb = /\.db$/i.test(f);
    const hashed = f.includes("assets/") || /\.wasm$/i.test(f);
    const url = new URL(f, scope).href + (isDb ? "?v=" + DB_HASH : "");
    const target = isDb ? dataCache : cache;
    try {
      if (await target.match(url)) return;
      if (hashed) {
        const old = await fromOldCaches(url, oldNames);
        if (old) { await target.put(url, old); return; }
      }
      const r = await fetchOk(url, !hashed && !isDb);
      await target.put(url, r);
    } catch (e) {
      if (!isDb) failed.push(f);
    }
  };

  for (let i = 0; i < files.length; i += 6) await Promise.all(files.slice(i, i + 6).map(one));
  if (failed.length) throw new Error("Precache incomplete: " + failed.slice(0, 5).join(", "));

  await cache.put(readyUrl(), new Response("ok")); // marka: kumpleto ang build na ito
}

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(precacheAll());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const own = (await caches.keys()).filter((k) => k.startsWith("cmta-"));
    const builds = own
      .filter((k) => k.startsWith(BUILD_PREFIX) && k !== CACHE_NAME)
      .sort((a, b) => Number(b.slice(BUILD_PREFIX.length)) - Number(a.slice(BUILD_PREFIX.length)));
    let keepPrev = null;
    for (const name of builds) {
      try {
        if (await (await caches.open(name)).match(readyUrl())) { keepPrev = name; break; }
      } catch (_) {}
    }
    await Promise.all(
      own.filter((k) => k !== CACHE_NAME && k !== DATA_CACHE && k !== keepPrev).map((k) => caches.delete(k))
    );
    await self.clients.claim();
    const wins = await self.clients.matchAll({ type: "window" });
    wins.forEach((c) => c.postMessage({ type: "SW_ACTIVATED", build: SW_BUILD }));
  })());
});

async function shell(request) {
  const scope = self.registration.scope;
  const cache = await caches.open(CACHE_NAME);
  const hit =
    (await cache.match(request, { ignoreSearch: true })) ||
    (await cache.match(scope)) ||
    (await cache.match(scope + "index.html"));
  if (hit) return hit;
  try { return await fetch(request); } catch (_) {}
  const any = (await caches.match(scope, { ignoreSearch: true })) || (await caches.match(scope + "index.html"));
  return any || Response.error();
}

async function smallFile(request) {
  const cache = await caches.open(CACHE_NAME);
  const hit = (await cache.match(request, { ignoreSearch: true })) || (await caches.match(request, { ignoreSearch: true }));
  return hit || fetch(request);
}

async function bigFile(request, event, storeName) {
  const hit = await caches.match(request);
  if (hit) return hit;
  const res = await fetch(request);
  if (res && res.ok && !isHtmlForAsset(request.url, res)) {
    const copy = res.clone();
    event.waitUntil(caches.open(storeName).then((c) => c.put(request, copy)).catch(() => {}));
  }
  return res;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET" || isLocalScope()) return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (/\/(version|precache)\.json$|\/sw\.js$/.test(url.pathname)) return;

  if (request.mode === "navigate") {
    event.respondWith(shell(request));
    return;
  }
  const isDb = /\.db$/i.test(url.pathname);
  if (isDb || url.pathname.includes("/assets/") || /\.wasm$/i.test(url.pathname)) {
    event.respondWith(bigFile(request, event, isDb ? DATA_CACHE : CACHE_NAME));
    return;
  }
  event.respondWith(smallFile(request));
});
