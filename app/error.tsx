'use client';

import * as React from 'react';

export default function GlobalError(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { error, reset } = props;

  React.useEffect(() => {
    try {
      // eslint-disable-next-line no-console
      console.error('[GlobalError]', error);
    } catch {}
  }, [error]);

  return (
    <html>
      <body style={{ padding: 24, fontFamily: 'system-ui, Segoe UI, Arial' }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, margin: '0 0 10px' }}>Application error</h1>
        <div style={{ opacity: 0.75, marginBottom: 12 }}>
          A client-side exception occurred. The details below are safe to copy/paste here.
        </div>

        <div style={{ display: 'grid', gap: 10, maxWidth: 1000 }}>
          <div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>Name</div>
            <div style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>{String(error?.name || 'Error')}</div>
          </div>

          <div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>Message</div>
            <div style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>{String(error?.message || '')}</div>
          </div>

          <div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>Digest</div>
            <div style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>{String((error as any)?.digest || '')}</div>
          </div>

          <div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>Stack</div>
            <pre
              style={{
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
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
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
              href="/"
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
              Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
