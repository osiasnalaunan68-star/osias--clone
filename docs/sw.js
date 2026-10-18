// Service worker — network-first, with a short timeout for this app's own files.
// On a weak or "connected but not really" network, a normal fetch can hang forever and the app
// freezes on the loading screen. Now, if a cached copy exists, it is used after NETWORK_TIMEOUT_MS.
const CACHE_NAME = "cmta-app-cache-v3";
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

function fetchAndCache(request) {
  return fetch(request).then((response) => {
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
  const sameOrigin = new URL(request.url).origin === self.location.origin;

  event.respondWith(
    (async () => {
      // Cross-origin (fonts, Firebase): old behavior, no timeout, so stale API data is never served.
      if (!sameOrigin) return fetchAndCache(request).catch(() => offlineFallback(request));

      const network = fetchAndCache(request);
      network.catch(() => {}); // avoid an unhandled rejection if the timeout wins the race
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
