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

// Registrar el Service Worker (solo en build/preview)
// ...
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const swUrl = `${import.meta.env.BASE_URL}sw.js`; // 👈 importante
    navigator.serviceWorker
      .register(swUrl)
      .then((reg) => console.log('[SW] registrado:', reg.scope))
      .catch((err) => console.error('[SW] error al registrar:', err));
  });
}
// ...
