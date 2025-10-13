/* =========================================================================
   Service Worker MANUAL (DEV)
   - Fallback offline (offline.html) para navegación en modo dev
   - Background Sync sin backend (marca registros como sincronizados)
   - Notificación manual al completar la sync (si hay permiso)
   - Manejo de eventos 'push' y 'message' (para disparo local desde la app)
   ========================================================================= */

const SCOPE_PATH = new URL(self.registration.scope).pathname; // p. ej. "/pwa-entorno/"
const OFFLINE_URL = `${SCOPE_PATH}offline.html`;
const OFFLINE_CACHE = 'dev-offline-v1';

/* ----------------------------- INSTALL ----------------------------- */
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(OFFLINE_CACHE);
      await cache.add(new Request(OFFLINE_URL, { cache: 'reload' }));
      await self.skipWaiting();
    })()
  );
});

/* ----------------------------- ACTIVATE ---------------------------- */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keep = new Set([OFFLINE_CACHE]);
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => (keep.has(k) ? null : caches.delete(k))));
      if (self.registration.navigationPreload) {
        try { await self.registration.navigationPreload.enable(); } catch {}
      }
      await self.clients.claim();
    })()
  );
});

/* ------------------------------ FETCH ------------------------------ */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.mode !== 'navigate') return;

  event.respondWith(
    (async () => {
      try {
        const preload = await event.preloadResponse;
        if (preload) return preload;
        const network = await fetch(request);
        return network;
      } catch {
        const cache = await caches.open(OFFLINE_CACHE);
        const cached = await cache.match(OFFLINE_URL);
        return cached || Response.error();
      }
    })()
  );
});

/* ----------------------- IndexedDB helpers ------------------------- */
const DB_NAME = 'pwa-entorno';
const STORE = 'reports';

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true });
        store.createIndex('by_createdAt', 'createdAt');
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function getPendingReports(db) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const store = tx.objectStore(STORE);
    const items = [];
    const cursorReq = store.openCursor();
    cursorReq.onsuccess = () => {
      const cur = cursorReq.result;
      if (cur) { if (cur.value?.isPending) items.push(cur.value); cur.continue(); }
      else resolve(items);
    };
    cursorReq.onerror = () => reject(cursorReq.error);
  });
}

async function markAsSynced(db, id) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    const store = tx.objectStore(STORE);
    const g = store.get(id);
    g.onsuccess = () => {
      const item = g.result;
      if (!item) return resolve();
      item.isPending = false;
      store.put(item).onsuccess = () => resolve();
    };
    g.onerror = () => reject(g.error);
  });
}

/* --------------------------- BACKGROUND SYNC ----------------------- */
self.addEventListener('sync', (event) => {
  if (event.tag !== 'sync-entries') return;

  event.waitUntil(
    (async () => {
      const db = await openDB();
      const pendings = await getPendingReports(db);
      for (const it of pendings) await markAsSynced(db, it.id);

      const pages = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      pages.forEach((c) => c.postMessage({ type: 'reports-synced', total: pendings.length }));

      try {
        await self.registration.showNotification('Sincronización completada', {
          body: pendings.length
            ? `${pendings.length} registro(s) sincronizado(s) localmente`
            : 'No había pendientes',
          icon: `${SCOPE_PATH}icon-192.png`,
          badge: `${SCOPE_PATH}icon-192.png`,
        });
      } catch {}
    })()
  );
});

/* ------------------------------ PUSH ------------------------------- */
self.addEventListener('push', (event) => {
  // Si en el futuro usas Web Push real, aquí llegará el payload
  let data = { title: 'Notificación', body: 'Mensaje de prueba (push).' };
  try {
    const maybe = event.data?.json?.();
    if (maybe) data = maybe;
  } catch {}
  event.waitUntil(
    self.registration.showNotification(data.title || 'Notificación', {
      body: data.body || 'Mensaje',
      icon: `${SCOPE_PATH}icon-192.png`,
      badge: `${SCOPE_PATH}icon-192.png`,
    })
  );
});

/* --------------- Mensaje desde la página (notificación local) ------ */
self.addEventListener('message', (event) => {
  if (event.data?.type === 'LOCAL_NOTIFY') {
    const { title, body } = event.data.payload || {};
    event.waitUntil(
      self.registration.showNotification(title || 'Notificación', {
        body: body || 'Prueba local desde la app',
        icon: `${SCOPE_PATH}icon-192.png`,
        badge: `${SCOPE_PATH}icon-192.png`,
      })
    );
  }
});
