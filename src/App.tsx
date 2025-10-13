import React from 'react';
import reactLogo from './assets/react.svg';
import './App.css';

// Componentes de la actividad (creados en el paso anterior)
import OfflineIndicator from './components/OfflineIndicator';
import ReportForm from './features/offline/ReportForm';
import ReportList from './features/offline/ReportList';

export default function App() {
  const [refreshKey, setRefreshKey] = React.useState(0);

  return (
    <>
      {/* Encabezado original del template (puedes quitarlo si lo deseas) */}
      <div>
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      {/* Indicador visible cuando no hay conexión */}
      <OfflineIndicator />

      {/* Contenido de la actividad */}
      <h1>PWA – Formulario Offline (IndexedDB)</h1>

      <div className="card" style={{ maxWidth: 720, margin: '0 auto' }}>
        <h2 style={{ marginBottom: 12 }}>Nuevo registro</h2>
        <ReportForm onSaved={() => setRefreshKey((v) => v + 1)} />
      </div>

      <div className="card" style={{ maxWidth: 720, margin: '16px auto' }}>
        <h2 style={{ marginBottom: 12 }}>Registros guardados (local)</h2>
        <ReportList refreshKey={refreshKey} />
      </div>

      <p className="read-the-docs">
        Esta vista guarda y lee datos desde <strong>IndexedDB</strong>, por lo que
        funciona incluso sin conexión. Luego podremos añadir sincronización en
        segundo plano y notificaciones desde el service worker, como pidió el profesor.
      </p>
    </>
  );
}
