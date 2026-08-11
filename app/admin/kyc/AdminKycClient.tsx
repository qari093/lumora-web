'use client';

import { useCallback, useEffect, useState } from 'react';

type KycSubmission = {
  id: string;
  ownerId: string;
  status: string;
  requestedTier?: string | null;
  createdAt: string;
};

type PendingPayload = {
  ok?: boolean;
  error?: string;
  count?: number;
  items?: KycSubmission[];
};

type Decision = 'APPROVED' | 'REJECTED';

type RequestFailure = Error & {
  status?: number;
};

async function parseResponse<T>(response: Response): Promise<T> {
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
}

export default function AdminKyc() {
  const [rows, setRows] = useState<KycSubmission[]>([]);

  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(true);

  const [mutationId, setMutationId] = useState<string | null>(null);

  const [authorizationFailure, setAuthorizationFailure] = useState(false);

  const handleFailure = useCallback((error: unknown) => {
    const failure = error as RequestFailure;

    if (failure?.status === 401 || failure?.status === 403) {
      setAuthorizationFailure(true);
      setMessage(
        failure.status === 401
          ? 'Your administrator session has expired.'
          : 'Administrator access is required.',
      );
      return;
    }

    setMessage(error instanceof Error ? error.message : String(error));
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setAuthorizationFailure(false);

    try {
      const response = await fetch('/api/admin/kyc/pending', {
        method: 'GET',
        credentials: 'same-origin',
        cache: 'no-store',
        headers: {
          accept: 'application/json',
        },
      });

      const payload = await parseResponse<PendingPayload>(response);

      if (!payload.ok) {
        throw new Error(payload.error || 'kyc_pending_load_failed');
      }

      setRows(Array.isArray(payload.items) ? payload.items : []);

      setMessage('');
    } catch (error) {
      setRows([]);
      handleFailure(error);
    } finally {
      setLoading(false);
    }
  }, [handleFailure]);

  useEffect(() => {
    void load();
  }, [load]);

  const decide = useCallback(
    async (requestId: string, decision: Decision) => {
      const reason =
        decision === 'REJECTED' ? (window.prompt('Reason for rejection?')?.trim() ?? '') : '';

      setMutationId(requestId);
      setAuthorizationFailure(false);
      setMessage(decision === 'APPROVED' ? 'Approving request…' : 'Rejecting request…');

      try {
        const response = await fetch('/api/admin/kyc/decision', {
          method: 'POST',
          credentials: 'same-origin',
          cache: 'no-store',
          headers: {
            accept: 'application/json',
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            requestId,
            decision,
            reason,
          }),
        });

        const payload = await parseResponse<{
          ok?: boolean;
          error?: string;
        }>(response);

        if (!payload.ok) {
          throw new Error(payload.error || 'kyc_decision_failed');
        }

        setMessage(decision === 'APPROVED' ? 'Request approved.' : 'Request rejected.');

        await load();
      } catch (error) {
        handleFailure(error);
      } finally {
        setMutationId(null);
      }
    },
    [handleFailure, load],
  );

  return (
    <main
      style={{
        maxWidth: 1050,
        margin: '24px auto',
        padding: '0 16px 48px',
      }}
    >
      <p style={eyebrow}>Session-protected operations</p>

      <h1
        style={{
          fontSize: 28,
          margin: '4px 0 0',
        }}
      >
        Admin · KYC Queue
      </h1>

      <div
        style={{
          display: 'flex',
          gap: 10,
          alignItems: 'center',
          flexWrap: 'wrap',
          marginTop: 16,
        }}
      >
        <button type="button" onClick={() => void load()} disabled={loading} style={button}>
          {loading ? 'Refreshing…' : 'Refresh queue'}
        </button>

        <span
          style={{
            fontSize: 13,
            opacity: 0.7,
          }}
        >
          {rows.length} pending request
          {rows.length === 1 ? '' : 's'}
        </span>
      </div>

      {message ? (
        <div
          role={authorizationFailure ? 'alert' : 'status'}
          style={{
            marginTop: 16,
            padding: 13,
            borderRadius: 10,
            border: '1px solid rgba(255,255,255,0.15)',
          }}
        >
          {message}

          {authorizationFailure ? (
            <div style={{ marginTop: 8 }}>
              <a href="/login?callbackUrl=/admin/kyc" style={{ color: 'inherit' }}>
                Sign in again
              </a>
            </div>
          ) : null}
        </div>
      ) : null}

      <div
        style={{
          marginTop: 20,
          overflowX: 'auto',
        }}
      >
        <table
          style={{
            width: '100%',
            minWidth: 760,
            borderCollapse: 'collapse',
          }}
        >
          <thead>
            <tr>
              <th style={heading}>Request</th>
              <th style={heading}>Owner</th>
              <th style={heading}>Tier</th>
              <th style={heading}>Created</th>
              <th style={heading}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading && rows.length === 0 ? (
              <tr>
                <td style={cell} colSpan={5}>
                  Loading KYC requests…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td style={cell} colSpan={5}>
                  No pending KYC requests.
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                const mutating = mutationId === row.id;

                return (
                  <tr key={row.id}>
                    <td style={cell}>
                      <code>{row.id}</code>
                    </td>

                    <td style={cell}>
                      <code>{row.ownerId}</code>
                    </td>

                    <td style={cell}>{row.requestedTier || 'TIER1'}</td>

                    <td style={cell}>{new Date(row.createdAt).toLocaleString()}</td>

                    <td style={cell}>
                      <div
                        style={{
                          display: 'flex',
                          gap: 8,
                        }}
                      >
                        <button
                          type="button"
                          disabled={mutating}
                          onClick={() => void decide(row.id, 'APPROVED')}
                          style={button}
                        >
                          Approve
                        </button>

                        <button
                          type="button"
                          disabled={mutating}
                          onClick={() => void decide(row.id, 'REJECTED')}
                          style={button}
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
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
  padding: '7px 11px',
  borderRadius: 8,
  border: '1px solid rgba(255,255,255,0.18)',
  background: 'rgba(255,255,255,0.07)',
  color: 'inherit',
  cursor: 'pointer',
} as const;
