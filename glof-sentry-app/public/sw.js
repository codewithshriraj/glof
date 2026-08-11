/**
 * GLOF SENTRY // DEFENSE-GRADE CRYOSPHERE MONITORING
 * Service Worker — Safe App Shell & Offline Telemetry Architecture
 * 
 * SAFETY CRITICAL RULE:
 * Never cache live GLOF risk, sensor telemetry, or emergency alert APIs
 * indiscriminately. Hazard data must remain fresh from network.
 */

const CACHE_VERSION = 'glof-sentry-v1.1.0-phase7';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const ASSET_CACHE = `${CACHE_VERSION}-assets`;

const PRECACHE_ASSETS = [
  '/offline',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon.svg',
  '/icons/apple-touch-icon.png',
  '/favicon.ico',
];

// Install Event — Pre-cache critical App Shell & Offline fallback
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  // Do not automatically force take over; allow user or hook to manage safe updates
});

// Activate Event — Clean old cache generations
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name.startsWith('glof-sentry-') && name !== STATIC_CACHE && name !== ASSET_CACHE)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event — Safe Multi-tier Caching
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignore non-GET requests and browser extensions
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // 1. Next.js Static Chunks, CSS, Images, Fonts -> Cache-First with Network fallback
  if (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/icons/') ||
    url.hostname === 'fonts.googleapis.com' ||
    url.hostname === 'fonts.gstatic.com'
  ) {
    event.respondWith(
      caches.open(ASSET_CACHE).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetch(request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          });
        });
      })
    );
    return;
  }

  // 2. HTML Navigation Requests -> Network-First with Cache / Offline fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(STATIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(async () => {
          const cachedPage = await caches.match(request);
          if (cachedPage) {
            return cachedPage;
          }
          const offlinePage = await caches.match('/offline');
          return offlinePage || new Response(
            '<!DOCTYPE html><html><body style="background:#0c141c;color:#dbe3ee;font-family:sans-serif;text-align:center;padding:40px;"><h1>GLOF SENTRY // OFFLINE</h1><p>Network disconnected. Live monitoring unavailable.</p></body></html>',
            { headers: { 'Content-Type': 'text/html' } }
          );
        })
    );
    return;
  }

  // 3. All other requests (e.g. APIs) -> Network only (strictly avoid stale disaster data)
  event.respondWith(fetch(request));
});

// Message listener for safe skipWaiting update triggers
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Push Notification Event Listener (Architecture Preparation)
self.addEventListener('push', (event) => {
  if (!event.data) return;

  try {
    const payload = event.data.json();
    const title = payload.title || 'GLOF SENTRY // CRITICAL ALERT';
    const options = {
      body: payload.body || 'Rapid moraine lake water level surge detected.',
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      tag: payload.tag || 'glof-alert',
      data: {
        url: payload.url || '/alerts',
      },
      vibrate: [300, 100, 400],
      requireInteraction: true,
    };

    event.waitUntil(self.registration.showNotification(title, options));
  } catch (e) {
    // Fallback for plain text push
    const text = event.data.text();
    event.waitUntil(
      self.registration.showNotification('GLOF SENTRY ALERT', {
        body: text,
        icon: '/icons/icon-192.png',
      })
    );
  }
});

// Push Notification Click Event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/alerts';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(targetUrl) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
