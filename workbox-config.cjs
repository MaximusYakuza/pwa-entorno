// workbox-config.cjs
module.exports = {
  globDirectory: "dist",
  globPatterns: ["**/*.{html,js,css,svg,png,ico,webmanifest}"],
  swDest: "dist/sw.js",
  clientsClaim: true,
  skipWaiting: true,
  runtimeCaching: [
    // Navegación/HTML: prioriza red para frescura, con timeout
    {
      urlPattern: ({ request }) => request.mode === "navigate",
      handler: "NetworkFirst",
      options: {
        cacheName: "html-pages",
        networkTimeoutSeconds: 3
      }
    },
    // App Shell y assets estáticos: sirve rápido y revalida en segundo plano
    {
      urlPattern: ({ request }) =>
        ["style", "script", "worker"].includes(request.destination),
      handler: "StaleWhileRevalidate",
      options: { cacheName: "static-assets" }
    },
    // Imágenes/íconos: caché primero con expiración
    {
      urlPattern: ({ request }) => request.destination === "image",
      handler: "CacheFirst",
      options: {
        cacheName: "images",
        expiration: { maxEntries: 60, maxAgeSeconds: 30 * 24 * 60 * 60 }
      }
    }
  ]
};
