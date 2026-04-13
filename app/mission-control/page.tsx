import { getLaunchReadiness } from "@/lib/launch/getLaunchReadiness";
import { getPortalOverview } from "@/lib/portal/getPortalOverview";

export default function MissionControlPage() {
  const readiness = getLaunchReadiness();
  const overview = getPortalOverview();

  const summary = [
    { key: "status", label: "Launch Status", value: readiness.status },
    { key: "score", label: "Readiness Score", value: String(readiness.score) },
    { key: "active", label: "Active Portals", value: String(overview.active) },
    { key: "healthy", label: "Healthy Portals", value: String(overview.healthy) },
  ];

  return (
    <main style={{ minHeight: "100vh", padding: 24 }}>
      <section style={{ maxWidth: 1100, margin: "0 auto" }}>
        <p style={{ opacity: 0.7, marginBottom: 8 }}>Lumora Mission</p>
        <h1 style={{ fontSize: 36, marginBottom: 12 }}>Mission Control</h1>
        <p style={{ fontSize: 16, opacity: 0.85, marginBottom: 24 }}>
          Final control surface for launch-state supervision.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
            marginBottom: 24,
          }}
        >
          {summary.map((item) => (
            <article
              key={item.key}
              data-mission-card={item.key}
              style={{
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 18,
                padding: 18,
              }}
            >
              <div style={{ opacity: 0.7, fontSize: 12, marginBottom: 8 }}>{item.label}</div>
              <div style={{ fontSize: 28, fontWeight: 800 }}>{item.value}</div>
            </article>
          ))}
        </div>

        <div
          style={{
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 18,
            padding: 18,
          }}
        >
          <h2 style={{ marginTop: 0 }}>Portal Command Grid</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 12,
            }}
          >
            {overview.items.map((item) => (
              <div
                key={item.key}
                data-mission-portal={item.key}
                style={{
                  border: "1px solid rgba(255,255,255,0.10)",
                  borderRadius: 14,
                  padding: 14,
                }}
              >
                <div style={{ fontWeight: 700, marginBottom: 6 }}>{item.title}</div>
                <div style={{ opacity: 0.75, fontSize: 13 }}>{item.path}</div>
                <div style={{ opacity: 0.75, fontSize: 13 }}>Healthy: {String(item.healthy)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
