import React from 'react';
import PortalsAlivePanel from '@/components/portals/PortalsAlivePanel';

export const dynamic = 'force-dynamic';

export default function AlivePage() {
  return (
    <main style={{ padding: 16, maxWidth: 920, margin: '0 auto' }}>
      <h1 style={{ fontSize: 18, fontWeight: 800, marginBottom: 10 }}>
        Lumora — User-Alive Dashboard
      </h1>
      <div style={{ opacity: 0.75, fontSize: 13, marginBottom: 12 }}>
        Live status view for portal activation. Safe in dev/test; never hard-500 UI.
      </div>
      <PortalsAlivePanel />
    </main>
  );
}
