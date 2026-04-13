import { getLaunchReadiness } from "@/lib/launch/getLaunchReadiness";
import { getPortalOverview } from "@/lib/portal/getPortalOverview";

export default function LaunchPage() {
  const readiness = getLaunchReadiness();
  const overview = getPortalOverview();

  return (
    <main style={{ minHeight: "100vh", padding: 24 }}>
      <section style={{ maxWidth: 1100, margin: "0 auto" }}>
        <p style={{ opacity: 0.7, marginBottom: 8 }}>Lumora Launch</p>
        <h1 style={{ fontSize: 36, marginBottom: 12 }}>Launch Snapshot</h1>
        <p style={{ fontSize: 16, opacity: 0.85, marginBottom: 24 }}>
          Canonical readiness snapshot for the current soft-launch state.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: 12,
            marginBottom: 24,
          }}
        >
          <div style={{ border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16, padding: 16 }}>
            <div style={{ opacity: 0.7, fontSize: 12 }}>Status</div>
            <div data-launch-status style={{ fontSize: 24, fontWeight: 800 }}>{readiness.status}</div>
          </div>
          <div style={{ border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16, padding: 16 }}>
            <div style={{ opacity: 0.7, fontSize: 12 }}>Passed</div>
            <div data-launch-passed style={{ fontSize: 24, fontWeight: 800 }}>{readiness.passed}</div>
          </div>
          <div style={{ border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16, padding: 16 }}>
            <div style={{ opacity: 0.7, fontSize: 12 }}>Total Checks</div>
            <div data-launch-total style={{ fontSize: 24, fontWeight: 800 }}>{readiness.total}</div>
          </div>
          <div style={{ border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16, padding: 16 }}>
            <div style={{ opacity: 0.7, fontSize: 12 }}>Score</div>
            <div data-launch-score style={{ fontSize: 24, fontWeight: 800 }}>{readiness.score}</div>
          </div>
        </div>

        <div
          style={{
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 18,
            padding: 18,
            marginBottom: 24,
          }}
        >
          <h2 style={{ marginTop: 0 }}>Portal Overview</h2>
          <div data-launch-overview-total>Total Portals: {overview.total}</div>
          <div data-launch-overview-active>Active Portals: {overview.active}</div>
          <div data-launch-overview-healthy>Healthy Portals: {overview.healthy}</div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
          }}
        >
          {overview.items.map((item) => (
            <article
              key={item.key}
              data-launch-portal-key={item.key}
              style={{
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 18,
                padding: 18,
              }}
            >
              <h3 style={{ marginTop: 0, marginBottom: 10 }}>{item.title}</h3>
              <div style={{ opacity: 0.8, marginBottom: 8 }}>{item.path}</div>
              <div data-launch-portal-health={item.key}>Healthy: {String(item.healthy)}</div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
