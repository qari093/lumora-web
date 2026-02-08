/* Lumora minimal PWA service worker (dev-friendly)
   - caches app shell assets + offline page
   - network-first for navigation, fallback to offline.html
   - stale-while-revalidate for same-origin GET assets
*/
const CACHE_VERSION = "lumora-pwa-v1-20260208170231";
const SHELL = [
  "/offline.html",
  "/manifest.webmanifest",
  "/pwa/apple-touch-icon.png",
  "/pwa/icon-192.png",
  "/pwa/icon-512.png",
  "/pwa/maskable-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_VERSION);
    await cache.addAll(SHELL);
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map((k) => (k === CACHE_VERSION ? Promise.resolve() : caches.delete(k))));
    await self.clients.claim();
  })());
});

function isSameOrigin(url) {
  try { return new URL(url).origin === self.location.origin; } catch { return false; }
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = req.url;

  if (req.method !== "GET") return;

  // Navigation requests: network-first, fallback offline
  if (req.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const res = await fetch(req);
        return res;
      } catch {
        const cache = await caches.open(CACHE_VERSION);
        return (await cache.match("/offline.html")) || new Response("offline", { status: 200 });
      }
    })());
    return;
  }

  // Same-origin assets: stale-while-revalidate
  if (isSameOrigin(url)) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_VERSION);
      const cached = await cache.match(req);
      const fetchPromise = fetch(req).then((res) => {
        if (res && res.ok) cache.put(req, res.clone());
        return res;
      }).catch(() => cached);
      return cached || fetchPromise;
    })());
  }
});
