// workbox-config.cjs

// Ajusta BASE si despliegas en otra ruta (GitHub Pages usa /pwa-entorno/)
const BASE = process.env.PWA_BASE || '/pwa-entorno/';

module.exports = {
  globDirectory: 'dist',
  globPatterns: ['**/*.{html,js,css,svg,png,ico,webmanifest,woff2,woff}'],
  swDest: 'dist/sw.js',
  clientsClaim: true,
  skipWaiting: true,

  // Precarga de la página offline + fallback de navegación
  additionalManifestEntries: [
    { url: `${BASE}offline.html`, revision: null },
  ],
  navigateFallback: `${BASE}offline.html`,
  // Evita aplicar el fallback a llamadas de API o recursos estáticos
  navigateFallbackDenylist: [
    new RegExp(`^${BASE.replace(/\//g, '\\/')}api\\/`),
    /\/assets\//,
  ],

  runtimeCaching: [
    // 1) Navegación/HTML: prioriza red para frescura, con timeout
    {
      urlPattern: ({ request }) => request.mode === 'navigate',
      handler: 'NetworkFirst',
      options: {
        cacheName: 'html-pages',
        networkTimeoutSeconds: 3,
      },
    },

    // 2) App Shell y assets estáticos: sirve rápido y revalida en segundo plano
    {
      urlPattern: ({ request }) =>
        ['style', 'script', 'worker'].includes(request.destination),
      handler: 'StaleWhileRevalidate',
      options: { cacheName: 'static-assets' },
    },

    // 3) Imágenes/íconos: caché primero con expiración
    {
      urlPattern: ({ request }) => request.destination === 'image',
      handler: 'CacheFirst',
      options: {
        cacheName: 'images',
        expiration: { maxEntries: 60, maxAgeSeconds: 30 * 24 * 60 * 60 }, // 30 días
      },
    },

    // 4) Fuentes: Cache First con expiración (mejora de CLS/INP)
    {
      urlPattern: ({ request }) => request.destination === 'font',
      handler: 'CacheFirst',
      options: {
        cacheName: 'fonts',
        expiration: { maxEntries: 30, maxAgeSeconds: 60 * 24 * 60 * 60 }, // 60 días
      },
    },

    // 5) Datos dinámicos (API): Network First con timeout
    {
      urlPattern: ({ url }) => url.pathname.startsWith(`${BASE}api/`) || url.pathname.startsWith('/api/'),
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api',
        networkTimeoutSeconds: 3,
      },
    },
  ],
};
