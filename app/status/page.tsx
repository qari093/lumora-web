import { getLaunchReadiness } from "@/lib/launch/getLaunchReadiness";
import { getPortalOverview } from "@/lib/portal/getPortalOverview";

export default function StatusPage() {
  const readiness = getLaunchReadiness();
  const overview = getPortalOverview();

  return (
    <main style={{ minHeight: "100vh", padding: 24 }}>
      <section style={{ maxWidth: 960, margin: "0 auto" }}>
        <p style={{ opacity: 0.7, marginBottom: 8 }}>Lumora Status</p>
        <h1 style={{ fontSize: 36, marginBottom: 12 }}>System Status</h1>
        <p style={{ fontSize: 16, opacity: 0.85, marginBottom: 24 }}>
          Live readiness and portal health snapshot.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 12,
            marginBottom: 24,
          }}
        >
          <div style={{ border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16, padding: 16 }}>
            <div style={{ opacity: 0.7, fontSize: 12 }}>Launch Status</div>
            <div data-status-readiness style={{ fontSize: 24, fontWeight: 800 }}>{readiness.status}</div>
          </div>
          <div style={{ border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16, padding: 16 }}>
            <div style={{ opacity: 0.7, fontSize: 12 }}>Health</div>
            <div data-status-health style={{ fontSize: 24, fontWeight: 800 }}>
              {overview.healthy >= 7 ? "healthy" : "degraded"}
            </div>
          </div>
        </div>

        <div
          style={{
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 18,
            padding: 18,
          }}
        >
          <div data-status-total>Portals Total: {overview.total}</div>
          <div data-status-active>Portals Active: {overview.active}</div>
          <div data-status-healthy>Portals Healthy: {overview.healthy}</div>
          <div data-status-score>Readiness Score: {readiness.score}</div>
        </div>
      </section>
    </main>
  );
}
