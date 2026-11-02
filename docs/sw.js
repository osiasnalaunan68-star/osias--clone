// Service worker v4
// - /assets/*, .wasm, .db: cache-first (no re-download on every open)
// - Firebase / Google APIs: not cached, browser handles them
// - Everything else (index.html etc.): network-first with a 4s timeout
// NOTE: bump CACHE_NAME whenever you change customs_law.db
const CACHE_NAME = "cmta-app-cache-v4";
const NETWORK_TIMEOUT_MS = 4000;

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

function fetchAndCache(request, init) {
  return fetch(request, init).then((response) => {
    if (response && (response.ok || response.type === "opaque")) {
      const copy = response.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)).catch(() => {});
    }
    return response;
  });
}

async function offlineFallback(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  if (request.mode === "navigate") {
    const shell = await caches.match(self.registration.scope);
    if (shell) return shell;
  }
  return Response.error();
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  const sameOrigin = url.origin === self.location.origin;
  if (sameOrigin && url.pathname.endsWith("/version.json")) return; // always straight to the network

  // Cross-origin: only cache Google Fonts. Firebase/Auth/APIs go straight to the browser.
  if (!sameOrigin) {
    if (!/(^|\.)fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)) return;
    event.respondWith(fetchAndCache(request).catch(() => offlineFallback(request)));
    return;
  }

  // Big static files: cache-first. Vite hashes /assets/ names, so new deploys still load.
  if (url.pathname.includes("/assets/") || /\.(wasm|db)$/.test(url.pathname)) {
    event.respondWith(
      caches.match(request).then((hit) => hit || fetchAndCache(request).catch(() => offlineFallback(request)))
    );
    return;
  }

  // Rest of same-origin files: network-first with short timeout.
  event.respondWith(
    (async () => {
      const network = fetchAndCache(request, { cache: "no-cache" }); // skip the 10-min HTTP cache of GitHub Pages
      network.catch(() => {});
      const cached = await caches.match(request);
      if (!cached) return network.catch(() => offlineFallback(request));

      const timeout = new Promise((resolve) => setTimeout(() => resolve(null), NETWORK_TIMEOUT_MS));
      try {
        const fresh = await Promise.race([network, timeout]);
        if (fresh) return fresh;
      } catch (_) {}
      return cached;
    })()
  );
});
