"use client";

import React from "react";

type AliveResult = {
  name: string;
  key: string;
  url: string;
  ok: boolean;
  enabled?: boolean;
  status?: number;
  ms?: number;
  error?: string;
};

const PORTAL_ALIVE_ENDPOINTS: Array<{ name: string; key: string; url: string }> = [
  { name: "Flow/FYP", key: "fyp", url: "/api/fyp/alive" },
  { name: "Videos", key: "video", url: "/api/video/alive" },
  { name: "Movies", key: "movies", url: "/api/movies/alive" },
  { name: "Live/Echo", key: "live", url: "/api/live/alive" },
  { name: "GMAR", key: "gmar", url: "/api/gmar/alive" },
  { name: "NEXA", key: "nexa", url: "/api/nexa/alive" },
  { name: "Celebrations", key: "celebrations", url: "/api/celebrations/alive" },
  { name: "Share", key: "share", url: "/api/share/alive" },
  { name: "LumaSpace", key: "lumaspace", url: "/api/lumaspace/alive" },
];

async function safeJson(res: Response): Promise<any> {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

async function fetchAlive(entry: { name: string; key: string; url: string }): Promise<AliveResult> {
  const started = Date.now();
  try {
    const res = await fetch(entry.url + "?debug=1", { cache: "no-store" });
    const body = await safeJson(res);
    const ms = Date.now() - started;
    return {
      name: entry.name,
      key: entry.key,
      url: entry.url,
      ok: !!(body && body.ok === true),
      enabled: body?.enabled === true,
      status: res.status,
      ms,
      error: body?.error ? String(body.error) : undefined,
    };
  } catch (e: any) {
    const ms = Date.now() - started;
    const msg = typeof e?.message === "string" ? e.message : "fetch_failed";
    return { name: entry.name, key: entry.key, url: entry.url, ok: false, status: 0, ms, error: msg };
  }
}

export default function PortalsAlivePanel() {
  const [loading, setLoading] = React.useState(false);
  const [results, setResults] = React.useState<AliveResult[] | null>(null);
  const [status, setStatus] = React.useState<any>(null);

  const run = React.useCallback(async () => {
    setLoading(true);
    setResults(null);
    setStatus(null);
    try {
      const st = await fetch("/api/portals/status?debug=1", { cache: "no-store" }).then(safeJson);
      setStatus(st);
    } catch {}
    const out = await Promise.all(PORTAL_ALIVE_ENDPOINTS.map(fetchAlive));
    setResults(out);
    setLoading(false);
  }, []);

  React.useEffect(() => {
    void run();
  }, [run]);

  const okCount = results ? results.filter((r) => r.ok).length : 0;

  return (
    <div style={{ padding: 16, display: "grid", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div>
          <div style={{ fontWeight: 700 }}>Alive Dashboard</div>
          <div style={{ opacity: 0.75, fontSize: 12 }}>
            Checks /api/portals/status + each portal /api/*/alive (debug=1)
          </div>
        </div>
        <button
          onClick={() => void run()}
          disabled={loading}
          style={{
            borderRadius: 10,
            padding: "8px 12px",
            border: "1px solid rgba(255,255,255,0.18)",
            background: "rgba(255,255,255,0.06)",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Checking…" : "Re-check"}
        </button>
      </div>

      {status && (
        <pre
          style={{
            margin: 0,
            padding: 12,
            borderRadius: 12,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.10)",
            fontSize: 12,
            overflowX: "auto",
            maxHeight: 220,
          }}
        >
          {JSON.stringify(status, null, 2)}
        </pre>
      )}

      <div style={{ opacity: 0.85, fontSize: 12 }}>
        {results ? (
          <span>
            OK: <b>{okCount}</b> / {results.length}
          </span>
        ) : (
          <span>Running checks…</span>
        )}
      </div>

      <div
        style={{
          display: "grid",
          gap: 10,
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        }}
      >
        {(results || PORTAL_ALIVE_ENDPOINTS.map((e) => ({ name: e.name, key: e.key, url: e.url, ok: false } as AliveResult))).map(
          (r) => (
            <a
              key={r.key}
              href={r.url}
              style={{
                textDecoration: "none",
                color: "inherit",
                borderRadius: 14,
                padding: 12,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.10)",
                display: "grid",
                gap: 6,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                <div style={{ fontWeight: 650 }}>{r.name}</div>
                <div style={{ fontSize: 12, opacity: 0.8 }}>
                  {typeof r.status === "number" ? `HTTP ${r.status}` : "—"}
                </div>
              </div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>{r.url}</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                <div style={{ fontSize: 12 }}>
                  ok: <b>{r.ok ? "true" : "false"}</b>
                  {"  "}
                  enabled: <b>{r.enabled === undefined ? "—" : r.enabled ? "true" : "false"}</b>
                </div>
                <div style={{ fontSize: 12, opacity: 0.85 }}>{typeof r.ms === "number" ? `${r.ms}ms` : ""}</div>
              </div>
              {r.error && (
                <div style={{ fontSize: 12, opacity: 0.85 }}>
                  error: <span style={{ opacity: 0.9 }}>{r.error}</span>
                </div>
              )}
            </a>
          )
        )}
      </div>
    </div>
  );
}

