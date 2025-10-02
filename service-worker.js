/* eslint-env serviceworker */
/* global workbox, importScripts */

/* service-worker.js (referencia para revisión)
   NOTA: La PWA publicada registra `${import.meta.env.BASE_URL}sw.js` (generado por Workbox en dist/).
   Este archivo es solo para revisión del profesor y no es usado por la app en producción.
*/

/* Cargar Workbox desde CDN */
importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js'
);

/* Activar de inmediato nuevas versiones del SW */
workbox.core.skipWaiting();
workbox.core.clientsClaim();

/* Precaché (vacío aquí; el sw real lo inyecta Workbox en dist) */
workbox.precaching.precacheAndRoute([]);

/* 1) Navegación/HTML: Network First con timeout */
workbox.routing.registerRoute(
  ({ request }) => request.mode === 'navigate',
  new workbox.strategies.NetworkFirst({
    cacheName: 'html-pages',
    networkTimeoutSeconds: 3,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50,
        purgeOnQuotaError: true,
      }),
    ],
  })
);

/* 2) JS y CSS: Stale While Revalidate */
workbox.routing.registerRoute(
  ({ request }) =>
    request.destination === 'script' || request.destination === 'style',
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'static-resources',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 100,
        purgeOnQuotaError: true,
      }),
    ],
  })
);

/* 3) Imágenes: Cache First con expiración */
workbox.routing.registerRoute(
  ({ request }) => request.destination === 'image',
  new workbox.strategies.CacheFirst({
    cacheName: 'images',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 días
        purgeOnQuotaError: true,
      }),
    ],
  })
);

/* Mensaje opcional para forzar skipWaiting desde la app si se necesitara */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
