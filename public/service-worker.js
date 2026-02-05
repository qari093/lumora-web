/* Lumora minimal service worker (launch-safe)
 * - No caching (launch steps enforce max-age=0 via headers)
 * - Immediate activation
 */
self.addEventListener('install', (event) => {
  self.skipWaiting();
});
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});
self.addEventListener('fetch', (event) => {
  // passthrough (no cache)
  event.respondWith(fetch(event.request));
});
