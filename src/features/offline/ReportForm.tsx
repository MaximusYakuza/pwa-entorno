import React from 'react';
import { addReport, isOnline } from '../../lib/db';

export default function ReportForm({ onSaved }: { onSaved: () => void }) {
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [saving, setSaving] = React.useState(false);
  const online = isOnline();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    setSaving(true);
    try {
      // Guardar en IndexedDB (si no hay red, queda marcado como pendiente)
      await addReport({
        title: title.trim(),
        description: description.trim(),
        isPending: !online,
      });

      // Registrar Background Sync cuando no hay conexión
      if (!online && 'serviceWorker' in navigator) {
        try {
          const reg = await navigator.serviceWorker.ready;

          // Algunos d.ts no incluyen "sync" en ServiceWorkerRegistration
          const hasSync = 'SyncManager' in window;
          const syncMgr = (reg as unknown as {
            sync?: { register: (tag: string) => Promise<void> };
          }).sync;

          if (hasSync && syncMgr?.register) {
            await syncMgr.register('sync-entries');
            console.log('[BackgroundSync] Tarea "sync-entries" registrada');
          } else {
            console.warn('[BackgroundSync] No soportado en este navegador o tipos de TS');
          }
        } catch (err) {
          console.warn('[BackgroundSync] No se pudo registrar la sincronización:', err);
        }
      }

      // Reset del formulario
      setTitle('');
      setDescription('');
      onSaved();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 max-w-xl">
      <div>
        <label className="block text-sm font-medium">Título</label>
        <input
          className="border rounded w-full px-3 py-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ej. Reporte semanal"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Descripción</label>
        <textarea
          className="border rounded w-full px-3 py-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Notas o actividades…"
          rows={3}
        />
      </div>

      {!online && (
        <p className="text-xs text-gray-600">
          Sin conexión: el registro se guardará localmente y se sincronizará cuando vuelva la red.
        </p>
      )}

      <button
        type="submit"
        className="bg-sky-600 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={saving}
      >
        {saving ? 'Guardando…' : 'Guardar'}
      </button>
    </form>
  );
}
