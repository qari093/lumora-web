import { getLaunchReadiness } from "@/lib/launch/getLaunchReadiness";
import { getPortalOverview } from "@/lib/portal/getPortalOverview";

export default function OperatorPage() {
  const readiness = getLaunchReadiness();
  const overview = getPortalOverview();

  const operatorChecks = [
    { key: "readiness", label: "Readiness", value: readiness.status },
    { key: "score", label: "Score", value: String(readiness.score) },
    { key: "active", label: "Active Portals", value: String(overview.active) },
    { key: "healthy", label: "Healthy Portals", value: String(overview.healthy) },
  ];

  return (
    <main style={{ minHeight: "100vh", padding: 24 }}>
      <section style={{ maxWidth: 1100, margin: "0 auto" }}>
        <p style={{ opacity: 0.7, marginBottom: 8 }}>Lumora Operator</p>
        <h1 style={{ fontSize: 36, marginBottom: 12 }}>Operator Console</h1>
        <p style={{ fontSize: 16, opacity: 0.85, marginBottom: 24 }}>
          Operational view for launch supervision and portal verification.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
            marginBottom: 24,
          }}
        >
          {operatorChecks.map((item) => (
            <article
              key={item.key}
              data-operator-card={item.key}
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
          <h2 style={{ marginTop: 0 }}>Portal Verification</h2>
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
                data-operator-portal={item.key}
                style={{
                  border: "1px solid rgba(255,255,255,0.10)",
                  borderRadius: 14,
                  padding: 14,
                }}
              >
                <div style={{ fontWeight: 700, marginBottom: 6 }}>{item.title}</div>
                <div style={{ opacity: 0.75, fontSize: 13 }}>{item.path}</div>
                <div style={{ opacity: 0.75, fontSize: 13 }}>Route Ready: {String(item.routeReady)}</div>
                <div style={{ opacity: 0.75, fontSize: 13 }}>API Ready: {String(item.apiReady)}</div>
                <div style={{ opacity: 0.75, fontSize: 13 }}>UI Ready: {String(item.uiReady)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
