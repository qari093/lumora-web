"use client";

import * as React from "react";

type TesterRow = {
  testerId: string;
  shareOpens: number;
  events: number;
  firstSeen?: string | null;
  lastSeen?: string | null;
};

type Summary = {
  totals?: { testers?: number; events?: number };
  rows?: TesterRow[];
};

function toMs(iso?: string | null): number {
  if (!iso) return 0;
  const t = Date.parse(iso);
  return Number.isFinite(t) ? t : 0;
}

function fmt(iso?: string | null): string {
  if (!iso) return "—";
  const t = toMs(iso);
  if (!t) return "—";
  try {
    return new Date(t).toLocaleString();
  } catch {
    return iso;
  }
}

export default function TestersTable() {
  const [data, setData] = React.useState<Summary>({ totals: { testers: 0, events: 0 }, rows: [] });
  const [err, setErr] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [lastRefreshedAt, setLastRefreshedAt] = React.useState<number>(0);

  const refreshMs = 7000; // 7s feels "live" without being noisy

  const load = React.useCallback(async () => {
    try {
      setErr(null);
      const r = await fetch("/api/admin/testers/summary", { cache: "no-store" });
      if (!r.ok) {
        const txt = await r.text().catch(() => "");
        throw new Error(`HTTP ${r.status}${txt ? ` — ${txt.slice(0, 160)}` : ""}`);
      }
      const j = (await r.json()) as Summary;
      const rows = Array.isArray(j.rows) ? j.rows : [];
      rows.sort((a, b) => toMs(b.lastSeen) - toMs(a.lastSeen));

      setData({
        totals: {
          testers: j.totals?.testers ?? rows.length,
          events: j.totals?.events ?? rows.reduce((acc, x) => acc + (x.events || 0), 0),
        },
        rows,
      });
      setLastRefreshedAt(Date.now());
    } catch (e: any) {
      setErr(e?.message ? String(e.message) : "Failed to load tester summary");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    let alive = true;
    const tick = async () => {
      if (!alive) return;
      await load();
    };
    tick();
    const id = setInterval(tick, refreshMs);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [load]);

  const rows = data.rows || [];
  const totals = data.totals || { testers: rows.length, events: 0 };
  const now = Date.now();

  const isActive = (lastSeen?: string | null) => {
    const t = toMs(lastSeen);
    if (!t) return false;
    return now - t <= 5 * 60 * 1000; // 5 minutes
  };

  const isVeryRecent = (lastSeen?: string | null) => {
    const t = toMs(lastSeen);
    if (!t) return false;
    return now - t <= 30 * 1000; // 30 seconds
  };

  return (
    <main className="min-h-screen bg-white text-black p-10">
      <div className="flex items-start justify-between gap-6 flex-wrap">
        <div>
          <h1 className="text-3xl font-semibold">Testers</h1>
          <p className="mt-2 text-sm text-neutral-600">
            Totals: <span className="font-medium">{totals.testers ?? 0}</span> testers,{" "}
            <span className="font-medium">{totals.events ?? 0}</span> events
          </p>
          <p className="mt-1 text-xs text-neutral-500">
            Auto-refresh: {Math.round(refreshMs / 1000)}s • Last refresh:{" "}
            {lastRefreshedAt ? new Date(lastRefreshedAt).toLocaleTimeString() : "—"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => load()}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm hover:bg-neutral-50"
            type="button"
          >
            Refresh now
          </button>
          <span className="text-xs text-neutral-500">
            Sorted by <span className="font-medium">lastSeen</span> (desc)
          </span>
        </div>
      </div>

      {err ? (
        <div className="mt-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <div className="font-medium">Admin summary error</div>
          <div className="mt-1">{err}</div>
        </div>
      ) : null}

      <div className="mt-8 overflow-x-auto">
        <table className="min-w-[860px] w-full border-collapse">
          <thead>
            <tr className="text-left text-sm border-b border-neutral-200">
              <th className="py-2 pr-4">testerId</th>
              <th className="py-2 pr-4">shareOpens</th>
              <th className="py-2 pr-4">events</th>
              <th className="py-2 pr-4">firstSeen</th>
              <th className="py-2 pr-4">lastSeen</th>
              <th className="py-2 pr-4">status</th>
            </tr>
          </thead>
          <tbody>
            {loading && rows.length === 0 ? (
              <tr>
                <td className="py-6 text-sm text-neutral-500" colSpan={6}>
                  Loading…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td className="py-6 text-sm text-neutral-500" colSpan={6}>
                  No tester data yet. Open <span className="font-mono">/share</span> in a browser to generate events.
                </td>
              </tr>
            ) : (
              rows.map((r) => {
                const active = isActive(r.lastSeen);
                const veryRecent = isVeryRecent(r.lastSeen);

                // simple "highlight" without custom colors: use subtle background via neutral classes only
                const rowClass =
                  veryRecent
                    ? "bg-neutral-50"
                    : active
                    ? "bg-white"
                    : "bg-white";

                const status = veryRecent ? "just now" : active ? "active" : "idle";

                return (
                  <tr key={r.testerId} className={`${rowClass} border-b border-neutral-100 text-sm`}>
                    <td className="py-3 pr-4 font-mono">{r.testerId}</td>
                    <td className="py-3 pr-4">{r.shareOpens ?? 0}</td>
                    <td className="py-3 pr-4">{r.events ?? 0}</td>
                    <td className="py-3 pr-4">{fmt(r.firstSeen)}</td>
                    <td className="py-3 pr-4">{fmt(r.lastSeen)}</td>
                    <td className="py-3 pr-4">
                      <span className="inline-flex items-center gap-2">
                        <span className="inline-block h-2 w-2 rounded-full border border-neutral-400" />
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-6 text-xs text-neutral-500">
        Tip: Keep this page open while you test <span className="font-mono">/share</span> and <span className="font-mono">/fyp</span>.
        You should see lastSeen update and events increase.
      </p>
    </main>
  );
}
