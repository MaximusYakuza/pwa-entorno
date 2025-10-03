/* AppShell.tsx */
import type { PropsWithChildren } from 'react';

export default function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="app">
      <header className="app-header">
        <div className="container">
          <h1>PWA Entorno</h1>
        </div>
      </header>

      <main className="container">
        <div className="card">{children}</div>
      </main>

      <footer className="app-footer">
        <div className="container">
          <small>Modo offline habilitado</small>
        </div>
      </footer>
    </div>
  );
}
