'use client';

import * as React from 'react';

export default function LiveRoomError(props: { error: Error & { digest?: string }; reset: () => void }) {
  const { error, reset } = props;

  React.useEffect(() => {
    try {
      // eslint-disable-next-line no-console
      console.error('[LiveRoomError]', error);
    } catch {}
  }, [error]);

  return (
    <main style={{ padding: 24, fontFamily: 'system-ui, Segoe UI, Arial' }}>
      <h1 style={{ fontSize: 22, fontWeight: 900, margin: '0 0 10px' }}>Live Room error</h1>
      <div style={{ opacity: 0.75, marginBottom: 10 }}>Copy/paste the details below.</div>

      <div style={{ fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 12, opacity: 0.9 }}>
        <div>message: {String(error?.message || '')}</div>
        <div>digest: {String((error as any)?.digest || '')}</div>
      </div>

      <pre
        style={{
          marginTop: 12,
          whiteSpace: 'pre-wrap',
          padding: 12,
          borderRadius: 12,
          border: '1px solid rgba(0,0,0,.15)',
          background: 'rgba(0,0,0,.03)',
          fontFamily: 'ui-monospace, Menlo, monospace',
          fontSize: 12,
        }}
      >
        {String(error?.stack || '')}
      </pre>

      <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
        <button
          type="button"
          onClick={() => reset()}
          style={{
            padding: '10px 14px',
            borderRadius: 12,
            border: '1px solid rgba(0,0,0,.2)',
            background: 'white',
            cursor: 'pointer',
            fontWeight: 700,
          }}
        >
          Retry
        </button>
        <a
          href="/live"
          style={{
            padding: '10px 14px',
            borderRadius: 12,
            border: '1px solid rgba(0,0,0,.2)',
            background: 'white',
            textDecoration: 'none',
            color: 'inherit',
            fontWeight: 700,
          }}
        >
          Back to Live
        </a>
      </div>
    </main>
  );
}
