// Service Worker for Lokmanya Mandal App
const CACHE_NAME = 'lokmanya-mandal-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Let network handle requests normally
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
