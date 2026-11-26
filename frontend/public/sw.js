// Service worker v8 — atomic precache, pero mas matibay.
//
// Bago sa v8 (offline fixes):
//  a. Ang customs_law.db ay hinihintay na rin sa install (hanggang 45s), para offline-ready agad pagka-install.
//     Kapag mabagal ang net, tuloy pa rin ang install at tuloy ang download sa background.
//  b. Kapag walang net at wala sa kasalukuyang cache ang page, ang PINAKABAGONG cache ang gagamitin
//     (dati ang PINAKALUMA ang unang tinitingnan -> lumang version ang lumalabas).
//  c. Kapag talagang wala pang naka-save, may malinaw na offline page (hindi blangko / freeze).
//
// Bago kumpara sa v6:
// 1. Ang kailangan lang para mag-install ay ang CORE ng app (index.html, .js, .css, .wasm, .json).
//    Ang images / fonts / customs_law.db ay dina-download sa background pagkatapos (best-effort).
//    Hindi na maiipit sa lumang version dahil lang sa isang maliit na file na pumalya.
// 2. Bawat file may timeout (30s) at 4 na retry na may pahinga. Hindi na nakabitin sa mahinang signal.
// 3. Cache-busting sa precache.json at index.html (iwas lumang kopya mula sa GitHub Pages CDN),
//    at tinitiyak na ang index.html ay galing sa SAME build bago i-save.
// 4. Kapag kumpleto na ang core saka lang mag-activate ang bagong version.
//    Kapag pumalya, tuloy ang lumang version at susubukan ulit ng page (updateCheck.js).
// 5. Pag-open ng app: galing agad sa cache, kahit walang internet / walang load.
// 6. Pag na-activate, sinasabihan ang page (SW_ACTIVATED) para lumabas ang "New version" banner.
const SW_BUILD = "__BUILD_ID__";
const DB_HASH = "__DB_HASH__";
const BUILD_PREFIX = "cmta-build-";
const CACHE_NAME = BUILD_PREFIX + SW_BUILD;
const DATA_CACHE = "cmta-data-v1"; // pareho sa src/offlineData.js

const isLocalScope = () => /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\//.test(self.registration.scope);
const scopeUrl = (p) => new URL(p, self.registration.scope).href;
const readyUrl = () => scopeUrl("__ready"); // marka: kumpleto ang CORE ng build na ito
const fullUrl = () => scopeUrl("__full"); // marka: kumpleto na pati images/fonts/db
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const isDbFile = (f) => /\.db$/i.test(f);
const isShellFile = (f) => f === "./" || /(^|\/)index\.html$/i.test(f);
const isCritical = (f) => f === "./" || /\.(html|js|css|wasm|json|webmanifest)$/i.test(f);

function isHtmlForAsset(url, response) {
  try {
    const ct = response.headers.get("content-type") || "";
    return ct.includes("text/html") && /\.(js|css|wasm|db|png|woff2?)(\?|$)/.test(url);
  } catch (_) { return false; }
}

// May timeout + retry. Binabasa ang buong file sa loob ng timeout.
async function download(url, bust, ms) {
  let lastErr;
  for (let i = 0; i < 4; i++) {
    if (i) await sleep(700 * i);
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), ms);
    try {
      const target = bust ? url + (url.includes("?") ? "&" : "?") + "_=" + Date.now() : url;
      const r = await fetch(target, { cache: bust ? "no-store" : "default", signal: ctl.signal });
      if (!r.ok) throw new Error("HTTP " + r.status + " " + url);
      if (isHtmlForAsset(url, r)) throw new Error("HTML instead of file: " + url);
      const blob = await r.blob();
      return { blob, type: r.headers.get("content-type") || "" };
    } catch (e) {
      lastErr = e;
    } finally {
      clearTimeout(timer);
    }
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

// Mga cache ng bawat build, PINAKABAGO muna. (caches.match() ay PINAKALUMA ang inuuna — iyon ang sanhi ng lumang version.)
async function buildNamesNewestFirst() {
  return (await caches.keys())
    .filter((k) => k.startsWith(BUILD_PREFIX))
    .sort((a, b) => Number(b.slice(BUILD_PREFIX.length)) - Number(a.slice(BUILD_PREFIX.length)));
}

async function fromAnyBuild(urls) {
  for (const name of await buildNamesNewestFirst()) {
    try {
      const c = await caches.open(name);
      for (const u of urls) {
        const hit = await c.match(u, { ignoreSearch: true });
        if (hit) return hit;
      }
    } catch (_) {}
  }
  return null;
}

const OFFLINE_PAGE =
  '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
  '<title>Offline</title></head><body style="font-family:system-ui,sans-serif;background:#0f172a;color:#f1f5f9;display:flex;min-height:100vh;align-items:center;justify-content:center;margin:0;padding:24px;text-align:center">' +
  '<div><h2>Hindi pa naka-save ang app sa device na ito</h2>' +
  '<p style="opacity:.8">Kumonekta sa internet at buksan ang app nang ilang segundo. Pagkatapos nito, gagana na ito kahit walang internet.</p>' +
  '<button onclick="location.reload()" style="margin-top:12px;padding:10px 20px;border:0;border-radius:999px;background:#c9a227;color:#0f172a;font-weight:700">Subukan ulit</button></div></body></html>';

async function loadFileList() {
  let lastErr;
  for (let i = 0; i < 3; i++) {
    if (i) await sleep(1500 * i);
    try {
      const res = await fetch(scopeUrl("precache.json") + "?_=" + Date.now(), { cache: "no-store" });
      if (!res.ok) throw new Error("precache.json HTTP " + res.status);
      const data = await res.json();
      if (!SW_BUILD.startsWith("__") && data.id && String(data.id) !== SW_BUILD) throw new Error("precache.json is from another build");
      return Array.isArray(data.files) ? data.files : [];
    } catch (e) { lastErr = e; }
  }
  throw lastErr;
}

// Ang index.html ay dapat tumutukoy lang sa files ng SAME build. Kung hindi, lumang kopya ito (CDN).
async function assertFreshShell(blob, fileSet) {
  const html = await blob.text();
  const refs = html.match(/assets\/[^"'\s)<>]+/g) || [];
  for (const ref of refs) {
    if (!fileSet.has(ref)) throw new Error("index.html is from another build: " + ref);
  }
}

// I-download ang mga files na wala pa sa cache. Returns ang listahan ng pumalya.
async function syncFiles(list, allFiles) {
  const fileSet = new Set(allFiles);
  const cache = await caches.open(CACHE_NAME);
  const dataCache = await caches.open(DATA_CACHE);
  const oldNames = (await caches.keys()).filter((k) => k.startsWith(BUILD_PREFIX) && k !== CACHE_NAME);
  const failed = [];

  const one = async (f) => {
    const isDb = isDbFile(f);
    const hashed = f.includes("assets/") || /\.wasm$/i.test(f);
    const url = scopeUrl(f) + (isDb ? "?v=" + DB_HASH : "");
    const target = isDb ? dataCache : cache;
    try {
      if (await target.match(url)) return;
      if (hashed) {
        const old = await fromOldCaches(url, oldNames);
        if (old) { await target.put(url, old); return; }
      }
      const got = await download(url, !hashed && !isDb, isDb ? 120000 : 30000);
      if (isShellFile(f)) await assertFreshShell(got.blob, fileSet);
      const init = got.type ? { headers: { "Content-Type": got.type } } : undefined;
      await target.put(url, new Response(got.blob, init));
    } catch (e) {
      failed.push(f);
    }
  };

  for (let i = 0; i < list.length; i += 6) await Promise.all(list.slice(i, i + 6).map(one));
  return failed;
}

// INSTALL: CORE lang ang hinihintay. Kapag may pumalya -> FAILED ang install, tuloy ang lumang version.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil((async () => {
    if (isLocalScope()) return; // APK / dev: bundled na
    const files = await loadFileList();
    const failed = await syncFiles(files.filter(isCritical), files);
    if (failed.length) throw new Error("Precache incomplete: " + failed.slice(0, 5).join(", "));
    const cache = await caches.open(CACHE_NAME);
    await cache.put(readyUrl(), new Response("ok"));
    // Ang customs_law.db ang puso ng app. Hintayin ito hanggang 45s para offline-ready agad.
    // Hindi pumapalya ang install kung mabagal / pumalya (tuloy sa background at sa page).
    try {
      await Promise.race([syncFiles(files.filter(isDbFile), files), sleep(45000)]);
    } catch (_) {}
  })());
});

// Background: images / fonts / customs_law.db. Best-effort, uulitin sa susunod kung kulang pa.
let warmStarted = false;
async function warmOptional() {
  if (isLocalScope()) return;
  const cache = await caches.open(CACHE_NAME);
  if (await cache.match(fullUrl())) return;
  const files = await loadFileList(); // mag-throw kung ibang build na ang nasa server
  const failed = await syncFiles(files.filter((f) => !isCritical(f)), files);
  if (!failed.length) await cache.put(fullUrl(), new Response("ok"));
}

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

// Sinasagot ang tanong ng page: "anong build ka?" (ginagamit ng updateCheck.js)
self.addEventListener("message", (event) => {
  const d = event.data;
  if (d && d.type === "GET_BUILD" && event.ports && event.ports[0]) {
    event.ports[0].postMessage({ build: SW_BUILD });
  }
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
  const any = await fromAnyBuild([scope, scope + "index.html"]);
  if (any) return any;
  return new Response(OFFLINE_PAGE, { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } });
}

async function smallFile(request, event) {
  const cache = await caches.open(CACHE_NAME);
  const hit = (await cache.match(request, { ignoreSearch: true })) || (await fromAnyBuild([request.url]));
  if (hit) return hit;
  const res = await fetch(request);
  if (res && res.ok && !isHtmlForAsset(request.url, res)) {
    const copy = res.clone();
    event.waitUntil(cache.put(request, copy).catch(() => {}));
  }
  return res;
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

  if (!warmStarted) {
    warmStarted = true;
    event.waitUntil(sleep(3000).then(warmOptional).catch(() => {}));
  }

  if (request.mode === "navigate") {
    event.respondWith(shell(request));
    return;
  }
  const isDb = /\.db$/i.test(url.pathname);
  if (isDb || url.pathname.includes("/assets/") || /\.wasm$/i.test(url.pathname)) {
    event.respondWith(bigFile(request, event, isDb ? DATA_CACHE : CACHE_NAME));
    return;
  }
  event.respondWith(smallFile(request, event));
});
