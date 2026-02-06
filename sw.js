const CACHE_NAME = 'inventory-pwa-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://cdn.jsdelivr.net/npm/quagga@0.12.1/dist/quagga.min.js'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;

  // Always try network first for navigation requests (SPA / index.html)
  if (request.mode === 'navigate' || request.url.endsWith('/index.html')) {
    event.respondWith(
      fetch(request).then(response => {
        // Update the cache with fresh copy
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put('/index.html', copy));
        return response;
      }).catch(() => caches.match('/index.html'))
    );
    return;
  }

  // For other resources use cache-first, then network fallback
  event.respondWith(
    caches.match(request).then(response => response || fetch(request))
  );
});
