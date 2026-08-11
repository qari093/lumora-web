'use client';

import React from 'react';

type SessionPayload = {
  user?: {
    id?: string | null;
    name?: string | null;
    email?: string | null;
    role?: string | null;
  };
};

export default function RoleBar() {
  const [session, setSession] = React.useState<SessionPayload | null>(null);

  React.useEffect(() => {
    let mounted = true;

    async function loadSession() {
      try {
        const response = await fetch('/api/auth/session', {
          cache: 'no-store',
        });

        const payload = (await response.json()) as SessionPayload;

        if (mounted) {
          setSession(payload);
        }
      } catch {
        if (mounted) {
          setSession(null);
        }
      }
    }

    void loadSession();

    return () => {
      mounted = false;
    };
  }, []);

  const displayName = session?.user?.name || session?.user?.email || 'Guest';

  const role = session?.user?.role || 'guest';

  return (
    <div
      style={{
        display: 'flex',
        gap: 8,
        alignItems: 'center',
        padding: '8px 12px',
        borderBottom: '1px solid #222',
        background: '#0b0f12',
        color: '#e5e7eb',
      }}
    >
      <strong>
        {displayName} ({role})
      </strong>

      <span style={{ marginLeft: 'auto' }} />

      {session?.user?.id ? <a href="/api/auth/signout">Sign out</a> : <a href="/login">Sign in</a>}
    </div>
  );
}
