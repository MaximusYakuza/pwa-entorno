import React from 'react';

export default function OfflineIndicator() {
  const [online, setOnline] = React.useState<boolean>(navigator.onLine);

  React.useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);

  if (online) return null;
  return (
    <div className="w-full bg-yellow-200 text-yellow-900 text-sm px-3 py-2">
      Estás sin conexión. Los registros se guardarán localmente y estarán visibles al recargar.
    </div>
  );
}
