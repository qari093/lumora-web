import Link from "next/link";

const CONTROL_SURFACES = [
  { key: "dashboard", href: "/dashboard", title: "Dashboard", subtitle: "Unified launch metrics" },
  { key: "launch", href: "/launch", title: "Launch Snapshot", subtitle: "Canonical readiness view" },
  { key: "status", href: "/status", title: "System Status", subtitle: "Health and service status" },
  { key: "progress", href: "/progress", title: "Launch Progress", subtitle: "Execution tracker" },
  { key: "system", href: "/system", title: "System Index", subtitle: "System route registry" },
];

export default function ControlCenterPage() {
  return (
    <main style={{ minHeight: "100vh", padding: 24 }}>
      <section style={{ maxWidth: 1100, margin: "0 auto" }}>
        <p style={{ opacity: 0.7, marginBottom: 8 }}>Lumora Control</p>
        <h1 style={{ fontSize: 36, marginBottom: 12 }}>Control Center</h1>
        <p style={{ fontSize: 16, opacity: 0.85, marginBottom: 24 }}>
          Central control surface for launch operations.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 16,
          }}
        >
          {CONTROL_SURFACES.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              data-control-center-key={item.key}
              style={{
                display: "block",
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 18,
                padding: 18,
              }}
            >
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{item.title}</div>
              <div style={{ opacity: 0.75, marginBottom: 10 }}>{item.subtitle}</div>
              <div style={{ fontSize: 12, opacity: 0.65 }}>{item.href}</div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
