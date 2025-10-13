// src/lib/db.ts
import { openDB, type IDBPDatabase } from 'idb';

export type Report = {
  id?: number;            // autoincrement
  title: string;
  description: string;
  createdAt: number;      // Date.now()
  isPending?: boolean;    // para futuras sincronizaciones
};

const DB_NAME = 'pwa-entorno';
const DB_VERSION = 1;
const STORE = 'reports';

let _db: IDBPDatabase | null = null;

export async function getDB() {
  if (_db) return _db;
  _db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, {
          keyPath: 'id',
          autoIncrement: true,
        });
        store.createIndex('by_createdAt', 'createdAt');
      }
    },
  });
  return _db;
}

export async function addReport(r: Omit<Report, 'id' | 'createdAt'>) {
  const db = await getDB();
  const report: Report = { ...r, createdAt: Date.now() };
  const id = await db.add(STORE, report);
  return { ...report, id };
}

export async function listReports(): Promise<Report[]> {
  const db = await getDB();
  // Orden descendente por fecha usando el índice
  const tx = db.transaction(STORE, 'readonly');
  const index = tx.store.index('by_createdAt');
  const items: Report[] = [];
  let cursor = await index.openCursor(null, 'prev');
  while (cursor) {
    items.push(cursor.value as Report);
    cursor = await cursor.continue();
  }
  await tx.done;
  return items;
}

export function isOnline() {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
}
