// src/lib/push.ts
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) throw new Error('Notifications no soportadas');
  const perm = await Notification.requestPermission();
  return perm;
}

export async function sendLocalNotification(
  payload: { title?: string; body?: string } = {}
) {
  if (!('serviceWorker' in navigator)) throw new Error('SW no disponible');
  if (Notification.permission !== 'granted') throw new Error('Permiso no concedido');

  const reg = await navigator.serviceWorker.ready;

  // 1) Mostrar SIEMPRE la notificación desde la ServiceWorkerRegistration
  await reg.showNotification(payload.title ?? 'Notificación', {
    body: payload.body ?? 'Prueba local',
    icon: `${new URL(reg.scope).pathname}icon-192.png`,
    badge: `${new URL(reg.scope).pathname}icon-192.png`,
  });

  // 2) (Opcional) también enviamos un mensaje al SW si existe controller
  //    para compatibilidad cuando tengas handler 'message' en el SW.
  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'LOCAL_NOTIFY',
      payload,
    });
  }
}

/* Mantengo esta función por si en el futuro usas VAPID/FCM,
   pero ya no la importamos en el componente. */
export async function getOrCreatePushSubscription(_vapidPublicKeyBase64?: string) {
  throw new Error('Suscripción Push deshabilitada en modo local.');
}
