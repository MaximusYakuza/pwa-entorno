import React from 'react';
import { listReports } from '../../lib/db';
import type { Report } from '../../lib/db'; // <- solo tipo (verbatimModuleSyntax)

export default function ReportList({ refreshKey }: { refreshKey: number }) {
  const [items, setItems] = React.useState<Report[]>([]);

  React.useEffect(() => {
    let alive = true;
    listReports().then((rows) => {
      if (alive) setItems(rows);
    });
    return () => {
      alive = false;
    };
  }, [refreshKey]);

  if (!items.length) {
    return <p className="text-sm text-gray-600">Sin registros aún.</p>;
  }

  return (
    <ul className="space-y-2">
      {items.map((r) => (
        <li key={r.id} className="border rounded p-3">
          <div className="flex items-center justify-between">
            <strong>{r.title}</strong>
            <span className="text-xs text-gray-500">
              {new Date(r.createdAt).toLocaleString()}
            </span>
          </div>
          {r.description && <p className="text-sm mt-1">{r.description}</p>}
          {r.isPending && (
            <span className="text-xs text-amber-600">
              (Pendiente de sincronizar)
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
