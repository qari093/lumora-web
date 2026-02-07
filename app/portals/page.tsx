import { getPortalRegistry } from "@/lib/portals/registry";

export default function PortalsHubPage() {
  const portals = getPortalRegistry();

  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>Lumora Portals</h1>
      <p style={{ opacity: 0.7, marginBottom: 24 }}>
        All portals are visible. Status reflects data readiness.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 16,
        }}
      >
        {portals.map((p) => {
          const isActive = p.status === "active";
          const isSeed = p.status === "seed";
          const isMock = p.status === "mock";

          const badge =
            isActive ? "ACTIVE" : isSeed ? "SEED" : isMock ? "MOCK" : "OFFLINE";

          const color =
            isActive
              ? "#22c55e"
              : isSeed
              ? "#38bdf8"
              : isMock
              ? "#f59e0b"
              : "#ef4444";

          return (
            <a
              key={p.id}
              href={p.href}
              style={{
                display: "block",
                borderRadius: 14,
                padding: 16,
                textDecoration: "none",
                background: "#0b1020",
                border: "1px solid #1f2937",
                boxShadow: "0 0 0 1px rgba(255,255,255,0.03)",
              }}
            >
              <div style={{ fontSize: 18, fontWeight: 600 }}>{p.title}</div>
              <div style={{ marginTop: 6, fontSize: 12, opacity: 0.75 }}>
                {p.href}
              </div>

              <div
                style={{
                  marginTop: 14,
                  display: "inline-block",
                  padding: "4px 10px",
                  borderRadius: 999,
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#020617",
                  background: color,
                }}
              >
                {badge}
              </div>
            </a>
          );
        })}
      </div>
    </main>
  );
}
