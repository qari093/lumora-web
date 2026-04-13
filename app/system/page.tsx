import Link from "next/link";

const SYSTEM_ROUTES = [
  { key: "launch", href: "/launch", title: "Launch Snapshot", subtitle: "Canonical readiness view" },
  { key: "status", href: "/status", title: "System Status", subtitle: "Health and readiness status" },
  { key: "progress", href: "/progress", title: "Launch Progress", subtitle: "Execution progress tracker" },
  { key: "portals", href: "/portals", title: "Portal Registry", subtitle: "All active portal surfaces" },
];

export default function SystemPage() {
  return (
    <main style={{ minHeight: "100vh", padding: 24 }}>
      <section style={{ maxWidth: 1000, margin: "0 auto" }}>
        <p style={{ opacity: 0.7, marginBottom: 8 }}>Lumora System</p>
        <h1 style={{ fontSize: 36, marginBottom: 12 }}>System Index</h1>
        <p style={{ fontSize: 16, opacity: 0.85, marginBottom: 24 }}>
          Central access point for launch-control surfaces.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
          }}
        >
          {SYSTEM_ROUTES.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              data-system-index-key={item.key}
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
