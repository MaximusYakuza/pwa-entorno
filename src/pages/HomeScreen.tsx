/* pages/HomeScreen.tsx */
import React from 'react';
import OfflineIndicator from '../components/OfflineIndicator';
import ReportForm from '../features/offline/ReportForm';
import ReportList from '../features/offline/ReportList';
import PushTester from '../components/PushTester';

export default function HomeScreen() {
  const [refreshKey, setRefreshKey] = React.useState(0);

  return (
    <>
      <h2>Home Screen</h2>
      <p>
        Bienvenido 👋. Esta vista es el contenido inicial del{' '}
        <strong>App Shell</strong>.
      </p>

      {/* Indicador cuando no hay conexión */}
      <OfflineIndicator />

      {/* Formulario offline (IndexedDB) */}
      <section className="card" style={{ maxWidth: 720, margin: '16px auto' }}>
        <h3 style={{ marginBottom: 12 }}>Nuevo registro</h3>
        <ReportForm onSaved={() => setRefreshKey((v) => v + 1)} />
      </section>

      {/* Listado de registros guardados localmente */}
      <section className="card" style={{ maxWidth: 720, margin: '16px auto' }}>
        <h3 style={{ marginBottom: 12 }}>Registros (local)</h3>
        <ReportList refreshKey={refreshKey} />
      </section>

      {/* Panel para pruebas de notificaciones (permiso, prueba local, suscripción opcional) */}
      <PushTester />
    </>
  );
}
