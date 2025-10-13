import React from 'react';
import ReactDOM from 'react-dom/client';
import AppShell from './AppShell';
import HomeScreen from './pages/HomeScreen';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppShell>
      <HomeScreen />
    </AppShell>
  </React.StrictMode>
);

// Quitar el splash cuando React ya montó
document.getElementById('splash')?.remove();

/**
 * Registro del Service Worker
 * - En PRODUCCIÓN: usa el SW generado por Workbox (sw.js)
 * - En DESARROLLO: usa un SW manual de evidencia (service-worker.manual.js)
 *   para probar Background Sync sin backend.
 */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const isProd = import.meta.env.PROD;

    const swUrl = isProd
      ? `${import.meta.env.BASE_URL}sw.js`
      : `/service-worker.manual.js`;

    navigator.serviceWorker
      .register(swUrl)
      .then((reg) => console.log('[SW] registrado:', reg.scope))
      .catch((err) => console.error('[SW] error al registrar:', err));

    // (Opcional) logs de mensajes desde el SW (p. ej., "reports-synced")
    navigator.serviceWorker.addEventListener('message', (ev) => {
      console.log('[SW message]', ev.data);
    });
  });
}
