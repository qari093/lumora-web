type PortalShellProps = {
  title: string;
  subtitle: string;
  portalKey: string;
};

export default function PortalShell({ title, subtitle, portalKey }: PortalShellProps) {
  const routePath = `/${portalKey}`;

  return (
    <main style={{ minHeight: "100vh", padding: 24 }}>
      <section style={{ maxWidth: 960, margin: "0 auto" }}>
        <p style={{ opacity: 0.7, marginBottom: 8 }}>Lumora Portal</p>
        <h1 style={{ fontSize: 32, marginBottom: 12 }}>{title}</h1>
        <p style={{ fontSize: 16, opacity: 0.85, marginBottom: 24 }}>{subtitle}</p>

        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            marginBottom: 18,
          }}
        >
          <span
            data-portal-badge="status"
            style={{
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 999,
              padding: "8px 12px",
            }}
          >
            Status: Active
          </span>
          <span
            data-portal-badge="route"
            style={{
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 999,
              padding: "8px 12px",
            }}
          >
            Route: {routePath}
          </span>
          <span
            data-portal-badge="key"
            style={{
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 999,
              padding: "8px 12px",
            }}
          >
            Key: {portalKey}
          </span>
        </div>

        <div
          data-portal-key={portalKey}
          style={{
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 16,
            padding: 20,
          }}
        >
          <strong>Status:</strong> Active shell loaded for <code>{portalKey}</code>
        </div>
      </section>
    </main>
  );
}
