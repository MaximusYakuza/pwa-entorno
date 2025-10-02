import type { PropsWithChildren } from 'react';

export default function AppShell({ children }: PropsWithChildren) {
  return (
    <div
      style={{ minHeight: '100vh', background: '#ffffff', color: '#0f172a' }}
    >
      <header
        style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0' }}
      >
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>
          PWA Entorno
        </h1>
      </header>

      <main style={{ padding: 16 }}>{children}</main>

      <footer
        style={{
          padding: '12px 16px',
          borderTop: '1px solid #e2e8f0',
          fontSize: 12,
          color: '#64748b',
        }}
      >
        Modo offline habilitado
      </footer>
    </div>
  );
}
