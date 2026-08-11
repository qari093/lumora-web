'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

type TesterRow = {
  testerId: string;
  events: number;
  lastOccurredAt?: string | null;
  pages?: Record<string, number>;
};

type SummaryPayload = {
  ok?: boolean;
  error?: string;
  totals?: {
    testers?: number;
    events?: number;
  };
  testers?: TesterRow[];
};

type RequestFailure = Error & {
  status?: number;
};

function toTimestamp(value?: string | null): number {
  if (!value) {
    return 0;
  }

  const parsed = Date.parse(value);

  return Number.isFinite(parsed) ? parsed : 0;
}

function formatDate(value?: string | null): string {
  const timestamp = toTimestamp(value);

  return timestamp ? new Date(timestamp).toLocaleString() : '—';
}

export default function TestersTable() {
  const [payload, setPayload] = useState<SummaryPayload>({
    totals: {
      testers: 0,
      events: 0,
    },
    testers: [],
  });

  const [error, setError] = useState<string | null>(null);

  const [authorizationFailure, setAuthorizationFailure] = useState(false);

  const [loading, setLoading] = useState(true);

  const [lastRefreshedAt, setLastRefreshedAt] = useState(0);

  const refreshIntervalMs = 10_000;

  const load = useCallback(async () => {
    try {
      setError(null);
      setAuthorizationFailure(false);

      const response = await fetch('/api/admin/testers/summary', {
        method: 'GET',
        credentials: 'same-origin',
        cache: 'no-store',
        headers: {
          accept: 'application/json',
        },
      });

      const raw = await response.text();

      let nextPayload: SummaryPayload;

      try {
        nextPayload = raw ? (JSON.parse(raw) as SummaryPayload) : {};
      } catch {
        nextPayload = {
          ok: false,
          error: 'invalid_json_response',
        };
      }

      if (!response.ok) {
        const failure = new Error(nextPayload.error || `http_${response.status}`) as RequestFailure;

        failure.status = response.status;

        throw failure;
      }

      const testers = Array.isArray(nextPayload.testers) ? [...nextPayload.testers] : [];

      testers.sort(
        (left, right) => toTimestamp(right.lastOccurredAt) - toTimestamp(left.lastOccurredAt),
      );

      setPayload({
        ...nextPayload,
        testers,
      });

      setLastRefreshedAt(Date.now());
    } catch (caught) {
      const failure = caught as RequestFailure;

      if (failure?.status === 401 || failure?.status === 403) {
        setAuthorizationFailure(true);
      }

      setError(caught instanceof Error ? caught.message : 'tester_summary_failed');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    const refresh = async () => {
      if (active) {
        await load();
      }
    };

    void refresh();

    const interval = window.setInterval(() => void refresh(), refreshIntervalMs);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [load]);

  const rows = payload.testers ?? [];

  const totals = {
    testers: payload.totals?.testers ?? rows.length,
    events: payload.totals?.events ?? rows.reduce((sum, row) => sum + row.events, 0),
  };

  const now = Date.now();

  const normalizedRows = useMemo(
    () =>
      rows.map((row) => {
        const lastTimestamp = toTimestamp(row.lastOccurredAt);

        const age = lastTimestamp ? now - lastTimestamp : Number.POSITIVE_INFINITY;

        return {
          ...row,
          routeViews: Object.values(row.pages ?? {}).reduce((sum, count) => sum + count, 0),
          status: age <= 30_000 ? 'just now' : age <= 5 * 60_000 ? 'active' : 'idle',
        };
      }),
    [now, rows],
  );

  return (
    <main
      style={{
        maxWidth: 1100,
        margin: '24px auto',
        padding: '0 16px 48px',
      }}
    >
      <p style={eyebrow}>Session-protected telemetry</p>

      <h1
        style={{
          fontSize: 28,
          margin: '4px 0 0',
        }}
      >
        Private Testers
      </h1>

      <p
        style={{
          marginTop: 8,
          opacity: 0.7,
        }}
      >
        {totals.testers} testers · {totals.events} events
      </p>

      <div
        style={{
          display: 'flex',
          gap: 10,
          alignItems: 'center',
          flexWrap: 'wrap',
          marginTop: 16,
        }}
      >
        <button type="button" onClick={() => void load()} style={button} disabled={loading}>
          {loading ? 'Refreshing…' : 'Refresh now'}
        </button>

        <span
          style={{
            fontSize: 12,
            opacity: 0.66,
          }}
        >
          Auto-refresh: {refreshIntervalMs / 1000}s · Last refresh:{' '}
          {lastRefreshedAt ? new Date(lastRefreshedAt).toLocaleTimeString() : '—'}
        </span>
      </div>

      {error ? (
        <div
          role="alert"
          style={{
            marginTop: 16,
            padding: 14,
            borderRadius: 10,
            border: '1px solid rgba(255,255,255,0.16)',
          }}
        >
          <strong>Tester summary unavailable</strong>

          <p style={{ marginBottom: 0 }}>{error}</p>

          {authorizationFailure ? (
            <a
              href="/login?callbackUrl=/admin/testers"
              style={{
                display: 'inline-block',
                marginTop: 8,
                color: 'inherit',
              }}
            >
              Sign in again
            </a>
          ) : null}
        </div>
      ) : null}

      <div
        style={{
          marginTop: 22,
          overflowX: 'auto',
        }}
      >
        <table
          style={{
            width: '100%',
            minWidth: 820,
            borderCollapse: 'collapse',
          }}
        >
          <thead>
            <tr>
              <th style={heading}>Tester ID</th>
              <th style={heading}>Events</th>
              <th style={heading}>Route views</th>
              <th style={heading}>Last event</th>
              <th style={heading}>Status</th>
            </tr>
          </thead>

          <tbody>
            {loading && normalizedRows.length === 0 ? (
              <tr>
                <td style={cell} colSpan={5}>
                  Loading tester telemetry…
                </td>
              </tr>
            ) : normalizedRows.length === 0 ? (
              <tr>
                <td style={cell} colSpan={5}>
                  No tester telemetry is available yet.
                </td>
              </tr>
            ) : (
              normalizedRows.map((row) => (
                <tr key={row.testerId}>
                  <td style={cell}>
                    <code>{row.testerId}</code>
                  </td>
                  <td style={cell}>{row.events}</td>
                  <td style={cell}>{row.routeViews}</td>
                  <td style={cell}>{formatDate(row.lastOccurredAt)}</td>
                  <td style={cell}>{row.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}

const eyebrow = {
  margin: 0,
  fontSize: 12,
  textTransform: 'uppercase',
  letterSpacing: '0.07em',
  opacity: 0.68,
} as const;

const heading = {
  textAlign: 'left',
  padding: '10px 8px',
  borderBottom: '1px solid rgba(255,255,255,0.16)',
  fontSize: 13,
} as const;

const cell = {
  padding: '10px 8px',
  borderBottom: '1px solid rgba(255,255,255,0.09)',
  fontSize: 14,
} as const;

const button = {
  padding: '8px 12px',
  borderRadius: 8,
  border: '1px solid rgba(255,255,255,0.18)',
  background: 'rgba(255,255,255,0.07)',
  color: 'inherit',
  cursor: 'pointer',
} as const;
