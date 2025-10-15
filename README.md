# 🌐 PWA Entorno

**Tecnologías:** Vite + React + TypeScript  
**Características:** App Shell · Manifest (iconos any/maskable) · Service Worker con Workbox (offline + caché)  
**Configuración:** Optimizada para despliegue en GitHub Pages (HTTPS)

---

## 🚀 Descripción general

Esta aplicación es una **Progressive Web App (PWA)** diseñada como entorno de práctica académica para la materia **Aplicaciones Web Progresivas**.  
Implementa características clave del estándar PWA, garantizando funcionamiento **offline**, **sincronización en segundo plano** y **notificaciones push locales**.

---

## 🧩 Arquitectura principal

- **App Shell (React):** Estructura principal cargada al inicio para mejorar velocidad y experiencia del usuario.  
- **Service Worker:** Controla el caché, sincronización y envío de notificaciones.  
- **IndexedDB:** Base de datos local para almacenar registros offline.  
- **Cache Storage API:** Guarda recursos estáticos (HTML, JS, CSS, imágenes).  
- **Background Sync:** Envía datos pendientes cuando vuelve la conexión.  
- **Push API:** Maneja notificaciones locales en segundo plano.

---

## ⚙️ Instalación y uso

### Requisitos
- **Node.js:** versión 20.19.0 o superior  
- **Gestor de paquetes:** npm

### Comandos principales
```bash
# Instalar dependencias
npm i

# Modo desarrollo
npm run dev

# Compilar para producción
npm run build:pwa && npm run preview

# Desplegar en GitHub Pages
npm run deploy
```

---

## 🌐 Despliegue

- **Rama principal:** `week4` (integrada en `main`)  
- **Hosting:** GitHub Pages  
- **URL pública:**  
  🔗 [https://maximusyakuza.github.io/pwa-entorno/](https://maximusyakuza.github.io/pwa-entorno/)

---

## 🧪 Funcionalidades implementadas

| Función | Descripción |
|----------|--------------|
| 🧭 **Modo offline** | Permite registrar datos sin conexión. |
| 💾 **IndexedDB** | Almacena los registros de forma persistente. |
| 🔄 **Background Sync** | Sincroniza datos automáticamente al volver la red. |
| 🔔 **Push Notifications** | Envía notificaciones locales desde el Service Worker. |
| 🧱 **Cache Storage API** | Mantiene recursos estáticos disponibles offline. |
| 🧩 **App Shell** | Carga inmediata de la interfaz base. |

---

## 📊 Auditoría de rendimiento (Lighthouse)

Resultados obtenidos en la auditoría de **Google Lighthouse**:

| Métrica | Puntuación |
|----------|-------------|
| Performance | 98 |
| Accessibility | 82 |
| Best Practices | 96 |
| SEO | 90 |
