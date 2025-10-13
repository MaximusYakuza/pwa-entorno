// src/components/PushTester.tsx
import React from 'react';
import { requestNotificationPermission, sendLocalNotification } from '../lib/push';

export default function PushTester() {
  const [perm, setPerm] = React.useState<NotificationPermission>(Notification.permission);

  const askPermission = async () => {
    const p = await requestNotificationPermission();
    setPerm(p);
  };

  const testLocal = async () => {
    await sendLocalNotification({
      title: 'PWA Entorno',
      body: 'Notificación de prueba enviada desde el Service Worker (local).',
    });
  };

  return (
    <div className="card" style={{ maxWidth: 720, margin: '16px auto' }}>
      <h3>Notificaciones push</h3>
      <p className="text-sm">
        Permiso actual: <strong>{perm}</strong>
      </p>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button
          className="bg-sky-600 text-white px-3 py-2 rounded"
          onClick={askPermission}
        >
          Solicitar permiso
        </button>

        <button
          className="bg-emerald-600 text-white px-3 py-2 rounded"
          onClick={testLocal}
          disabled={perm !== 'granted'}
        >
          Probar notificación local
        </button>
      </div>
    </div>
  );
}
