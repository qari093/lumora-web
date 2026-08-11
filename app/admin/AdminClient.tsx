'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

type Overview = {
  ok: boolean;
  windowMinutes: number;
  wallets: {
    count: number;
    totalCents: number;
  };
  campaigns: number;
  kycPending: number;
  activity: {
    eventsLastHr: number;
    convLastHr: number;
    fraudLastHr: number;
  };
  error?: string;
};

type ApiError = {
  ok?: false;
  error?: string;
};

type RequestFailure = Error & {
  status?: number;
};

const money = (cents: number) => `€${(cents / 100).toFixed(2)}`;

async function fetchJson<T>(
  url: string,
  options: {
    timeoutMs?: number;
    signal?: AbortSignal;
  } = {},
): Promise<T> {
  const { timeoutMs = 12_000, signal } = options;

  const timeoutController = new AbortController();

  const timeout = window.setTimeout(() => timeoutController.abort(), timeoutMs);

  const requestController = new AbortController();

  const abort = () => requestController.abort();

  signal?.addEventListener('abort', abort, { once: true });

  timeoutController.signal.addEventListener('abort', abort, { once: true });

  try {
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'same-origin',
      cache: 'no-store',
      signal: requestController.signal,
      headers: {
        accept: 'application/json',
      },
    });

    const raw = await response.text();

    let payload: unknown = null;

    try {
      payload = raw ? JSON.parse(raw) : null;
    } catch {
      payload = {
        ok: false,
        error: 'invalid_json_response',
      };
    }

    if (!response.ok) {
      const error = new Error(
        typeof payload === 'object' &&
          payload !== null &&
          'error' in payload &&
          typeof payload.error === 'string'
          ? payload.error
          : `http_${response.status}`,
      ) as RequestFailure;

      error.status = response.status;
      throw error;
    }

    return payload as T;
  } finally {
    window.clearTimeout(timeout);

    signal?.removeEventListener('abort', abort);
  }
}

export default function AdminHome() {
  const [overview, setOverview] = useState<Overview | null>(null);

  const [message, setMessage] = useState('');

  const [busy, setBusy] = useState(false);

  const [authorizationFailure, setAuthorizationFailure] = useState(false);

  const requestSequence = useRef(0);

  const handleFailure = useCallback((error: unknown) => {
    const failure = error as RequestFailure;

    if (failure?.status === 401 || failure?.status === 403) {
      setAuthorizationFailure(true);
      setOverview(null);
      setMessage(
        failure.status === 401
          ? 'Your administrator session has expired.'
          : 'Your account no longer has administrator access.',
      );
      return;
    }

    setOverview(null);
    setMessage(error instanceof Error ? error.message : String(error));
  }, []);

  const load = useCallback(async () => {
    const sequence = ++requestSequence.current;

    setBusy(true);
    setMessage('Loading administrator overview…');
    setAuthorizationFailure(false);

    try {
      const payload = await fetchJson<Overview>('/api/admin/overview', {
        timeoutMs: 15_000,
      });

      if (sequence !== requestSequence.current) {
        return;
      }

      if (!payload?.ok) {
        throw new Error(payload?.error || 'admin_overview_failed');
      }

      setOverview(payload);
      setMessage('');
    } catch (error) {
      if (sequence !== requestSequence.current) {
        return;
      }

      handleFailure(error);
    } finally {
      if (sequence === requestSequence.current) {
        setBusy(false);
      }
    }
  }, [handleFailure]);

  const health = useCallback(async () => {
    const sequence = ++requestSequence.current;

    setBusy(true);
    setMessage('Checking database health…');
    setAuthorizationFailure(false);

    try {
      const payload = await fetchJson<{
        ok: boolean;
        db?: string;
        error?: string;
      }>('/api/admin/health', {
        timeoutMs: 10_000,
      });

      if (sequence !== requestSequence.current) {
        return;
      }

      setMessage(
        payload.ok && payload.db === 'up'
          ? 'Database health check passed.'
          : payload.error || 'Database health check failed.',
      );
    } catch (error) {
      if (sequence !== requestSequence.current) {
        return;
      }

      handleFailure(error);
    } finally {
      if (sequence === requestSequence.current) {
        setBusy(false);
      }
    }
  }, [handleFailure]);

  useEffect(() => {
    void load();

    return () => {
      requestSequence.current += 1;
    };
  }, [load]);

  return (
    <main
      style={{
        maxWidth: 1100,
        margin: '24px auto',
        padding: '0 16px 48px',
        fontFamily: 'ui-sans-serif, system-ui, sans-serif',
      }}
    >
      <header>
        <p style={eyebrow}>Session-protected operations</p>

        <h1
          style={{
            fontSize: 30,
            fontWeight: 750,
            margin: '4px 0 0',
          }}
        >
          Lumora Admin
        </h1>

        <p
          style={{
            marginTop: 8,
            opacity: 0.72,
          }}
        >
          Administrator access is verified through your secure Lumora session.
        </p>
      </header>

      <nav
        aria-label="Administrator tools"
        style={{
          display: 'flex',
          gap: 10,
          flexWrap: 'wrap',
          marginTop: 18,
        }}
      >
        <button type="button" onClick={() => void load()} disabled={busy} style={button}>
          {busy ? 'Working…' : 'Reload'}
        </button>

        <button type="button" onClick={() => void health()} disabled={busy} style={button}>
          Health check
        </button>

        <Link href="/admin/kyc" style={linkButton}>
          KYC queue
        </Link>

        <Link href="/admin/testers" style={linkButton}>
          Tester telemetry
        </Link>

        <Link href="/admin/zendoro" style={linkButton}>
          Zendoro runtime
        </Link>

        <Link href="/zendoro/admin" style={linkButton}>
          Zendoro operations
        </Link>
      </nav>

      {message ? (
        <div
          role={authorizationFailure ? 'alert' : 'status'}
          style={{
            ...card,
            marginTop: 18,
          }}
        >
          <strong>{authorizationFailure ? 'Authorization required' : 'Status'}</strong>

          <p style={{ marginBottom: 0 }}>{message}</p>

          {authorizationFailure ? (
            <Link
              href="/login?callbackUrl=/admin"
              style={{
                ...linkButton,
                display: 'inline-block',
                marginTop: 10,
              }}
            >
              Sign in again
            </Link>
          ) : null}
        </div>
      ) : null}

      {overview ? (
        <>
          <section
            aria-label="Administrator overview"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: 12,
              marginTop: 20,
            }}
          >
            <Metric label="Wallets" value={overview.wallets.count} />

            <Metric label="Total balance" value={money(overview.wallets.totalCents)} />

            <Metric label="Campaigns" value={overview.campaigns} />

            <Metric label="KYC pending" value={overview.kycPending} />

            <Metric label="Events · 1h" value={overview.activity.eventsLastHr} />

            <Metric label="Conversions · 1h" value={overview.activity.convLastHr} />

            <Metric label="Fraud events · 1h" value={overview.activity.fraudLastHr} />
          </section>

          <p
            style={{
              marginTop: 14,
              fontSize: 13,
              opacity: 0.65,
            }}
          >
            Operational window: {overview.windowMinutes} minutes
          </p>
        </>
      ) : null}
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <article style={card}>
      <div style={eyebrow}>{label}</div>
      <div
        style={{
          fontSize: 24,
          fontWeight: 760,
          marginTop: 6,
        }}
      >
        {value}
      </div>
    </article>
  );
}

const card = {
  padding: '14px 16px',
  border: '1px solid rgba(255,255,255,0.14)',
  borderRadius: 12,
  background: 'rgba(255,255,255,0.045)',
} as const;

const eyebrow = {
  margin: 0,
  fontSize: 12,
  textTransform: 'uppercase',
  letterSpacing: '0.07em',
  opacity: 0.68,
} as const;

const button = {
  padding: '9px 13px',
  border: '1px solid rgba(255,255,255,0.18)',
  borderRadius: 9,
  background: 'rgba(255,255,255,0.07)',
  color: 'inherit',
  cursor: 'pointer',
} as const;

const linkButton = {
  ...button,
  textDecoration: 'none',
} as const;
