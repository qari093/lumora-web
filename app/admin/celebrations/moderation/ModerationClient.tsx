'use client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import React, { useEffect, useState } from 'react';

import ShowsPanel from './ShowsPanel';
import ParticipantsPanel from './ParticipantsPanel';
import AutoRefresher from './AutoRefresher';
import AdminActions from './AdminActions';
type Audit = {
  ok: boolean;
  error?: string;
  celebration?: {
    status?: string;
    id?: string;
    slug?: string;
    startAt?: string;
    createdAt?: string;
  };
  totals?: { participants?: number; reactions?: number; rewards?: number };
};

const SLUG = 'first-celebration-soft-launch';

export default function ModerationPage() {
  const [audit, setAudit] = useState<Audit | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const url = `/api/celebrations/${SLUG}/admin/audit`;
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) {
          const body = await res.text().catch(() => '');
          throw new Error(`HTTP ${res.status} — ${body.slice(0, 180)}`);
        }
        const data: Audit = await res.json();
        if (!cancelled) {
          setAudit(data);
          setErr(null);
        }
      } catch (e: any) {
        if (!cancelled) {
          setAudit(null);
          setErr(String(e?.message ?? e));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const status = audit?.celebration?.status ?? 'UNKNOWN';

  return (
    <main style={{ padding: '28px 24px 80px' }}>
      <div
        style={{
          background: 'rgba(255,255,255,.06)',
          border: '1px solid rgba(255,255,255,.12)',
          borderRadius: 16,
          padding: 18,
          maxWidth: 880,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <h1 style={{ margin: 0 }}>Celebration Moderation</h1>
          <ShowsPanel slug={SLUG} apiBase="/api/celebrations" />
          <ParticipantsPanel auditUrl={'/api/celebrations/' + SLUG + '/admin/audit'} />
          <AutoRefresher intervalMs={5000} auditUrl={`/api/celebrations/${SLUG}/admin/audit`} />
          <span
            style={{
              padding: '6px 12px',
              borderRadius: 18,
              fontWeight: 900,
              fontSize: 12,
              background:
                status === 'LIVE' ? '#16a34a' : status === 'DRAFT' ? '#334155' : '#0ea5e9',
              color: '#001014',
            }}
          >
            {status}
          </span>
          <button
            onClick={() => location.reload()}
            style={{
              marginLeft: 'auto',
              padding: '6px 10px',
              borderRadius: 10,
              border: '1px solid rgba(255,255,255,.2)',
              background: 'transparent',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: 700,
            }}
          >
            Reload
          </button>
        </div>

        <div style={{ opacity: 0.85, marginTop: 8 }}>
          {loading ? 'Loading...' : err ? err : `/api/celebrations/${SLUG}/admin/audit`}
        </div>

        {audit?.ok && (
          <section
            style={{
              marginTop: 16,
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0,1fr))',
              gap: 12,
            }}
          >
            <Stat label="Participants" value={audit?.totals?.participants ?? 0} />
            <Stat label="Reactions" value={audit?.totals?.reactions ?? 0} />
            <Stat label="Rewards" value={audit?.totals?.rewards ?? 0} />
          </section>
        )}
      </div>
      {/* admin actions panel */}
      <AdminActions slug={SLUG} />
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div
      style={{
        padding: 14,
        borderRadius: 12,
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.12)',
      }}
    >
      <div style={{ opacity: 0.8, fontSize: 13 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 900, marginTop: 6 }}>{value}</div>
    </div>
  );
}
