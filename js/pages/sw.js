/* =====================================================
   SERVICE WORKER — sw.js
   Enables offline access via browser caching.

   What is a Service Worker?
   A script that runs in the background, separate from
   the web page, enabling offline functionality, push
   notifications, and background sync. For this simulator,
   the service worker caches all files so it works without
   an internet connection — perfect for learning Azure
   on an itel Vista Tab 30s where connectivity may be
   intermittent.

   Strategy used: Cache-First with Network Fallback
   - On first visit: all files are cached
   - On subsequent visits: served from cache instantly
   - Updates: old cache replaced when new version deployed
   ===================================================== */

const CACHE_NAME = 'azure-sim-v2.0';

// All files to cache for offline use
const CACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/styles/main.css',
  '/styles/sidebar.css',
  '/styles/dashboard.css',
  '/styles/services.css',
  '/styles/modals.css',
  '/styles/terminal.css',
  '/styles/enhancements.css',
  '/js/data.js',
  '/js/state.js',
  '/js/router.js',
  '/js/terminal.js',
  '/js/search.js',
  '/js/notifications.js',
  '/js/learning.js',
  '/js/quiz.js',
  '/js/arm-builder.js',
  '/js/activity-log.js',
  '/js/dark-mode.js',
  '/js/whatif.js',
  '/js/persistence.js',
  '/js/main.js',
  '/js/pages/dashboard.js',
  '/js/pages/resource-groups.js',
  '/js/pages/compute.js',
  '/js/pages/storage.js',
  '/js/pages/data-analytics.js',
  '/js/pages/networking.js',
  '/js/pages/security.js',
  '/js/pages/devops.js',
  '/js/pages/monitor.js',
  '/js/pages/cost.js',
  '/js/pages/all-resources.js',
  '/js/pages/subscriptions.js',
  '/js/pages/new-services.js',
  '/assets/azure-icon.svg'
];

// Install: cache all files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Caching all files for offline use');
      return cache.addAll(CACHE_URLS);
    }).then(() => self.skipWaiting())
  );
});

// Activate: clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => {
          console.log('[SW] Deleting old cache:', k);
          return caches.delete(k);
        })
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch: serve from cache first, network fallback
self.addEventListener('fetch', event => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  // Skip external requests (Google Fonts)
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin && !url.hostname.includes('fonts.googleapis')) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        // Cache successful responses
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => {
        // Fallback: serve index.html for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});
