export const dynamic = "force-dynamic";

export default function NexaPortalPage() {
  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>NEXA</h1>
      <p style={{ opacity: 0.85, marginBottom: 16 }}>
        Portal is now active (minimal). GX engines activation comes next.
      </p>

      <section style={{ padding: 16, border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>Status</h2>
        <ul style={{ lineHeight: 1.7 }}>
          <li>UI: active (placeholder)</li>
          <li>API health: <code>/api/nexa/health</code></li>
          <li>GX engines: not yet enabled</li>
        </ul>
      </section>
    </main>
  );
}
