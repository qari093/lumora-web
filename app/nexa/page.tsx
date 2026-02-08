export const dynamic = "force-dynamic";
export const revalidate = 0;

const rows = [
  { path: "/api/nexa", desc: "Index (routes list)" },
  { path: "/api/nexa/health", desc: "Health status (runtime)" },
  { path: "/api/nexa/metrics", desc: "Runtime metrics snapshot" },
  { path: "/api/nexa/diag", desc: "Diagnostics (health + metrics, partial-safe)" },
  { path: "/api/nexa/info", desc: "Environment + node version info" }
];

export default function NexaPage() {
  return (
    <main style={{ padding: 24, maxWidth: 980, margin: "0 auto", fontFamily: "ui-sans-serif, system-ui" }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>NEXA Runtime</h1>
      <p style={{ opacity: 0.8, marginTop: 0 }}>
        Operational endpoints for NEXA inside Lumora (health, metrics, diagnostics).
      </p>

      <section style={{ marginTop: 20 }}>
        <h2 style={{ fontSize: 18, marginBottom: 10 }}>Endpoints</h2>
        <div style={{ border: "1px solid rgba(255,255,255,0.12)", borderRadius: 14, overflow: "hidden" }}>
          {rows.map((r) => (
            <div
              key={r.path}
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                padding: "10px 14px",
                borderTop: "1px solid rgba(255,255,255,0.08)"
              }}
            >
              <a href={r.path} style={{ textDecoration: "none" }}>
                <code>{r.path}</code>
              </a>
              <span style={{ opacity: 0.75 }}>{r.desc}</span>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginTop: 22 }}>
        <h2 style={{ fontSize: 18, marginBottom: 10 }}>Notes</h2>
        <ul style={{ opacity: 0.85, lineHeight: 1.5 }}>
          <li>All endpoints are <code>no-store</code> and include soft rate-limit hint headers.</li>
          <li><code>/api/nexa/diag</code> is partial-safe and never returns 500 (it reports per-subsystem errors).</li>
          <li>For strict compatibility, keep contracts in <code>docs/nexa/contracts.v1.json</code> updated.</li>
        </ul>
      </section>
    </main>
  );
}
