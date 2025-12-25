export default function VideoGenPage() {
  return (
    <main style={{ padding: 24, maxWidth: 980, margin: "0 auto", fontFamily: "system-ui, -apple-system, Segoe UI, Roboto" }}>
      <h1 style={{ marginBottom: 10 }}>Video Generation</h1>
      <p style={{ opacity: 0.9, lineHeight: 1.5 }}>
        Video Generation Engine is enabled for Private Live testing.
      </p>
      <div style={{ marginTop: 16, padding: 16, border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12 }}>
        <p style={{ margin: 0, opacity: 0.85 }}>
          Wire your generation UI/API endpoints here (engine runs LIVE + ASSISTED per canonical doctrine).
        </p>
      </div>
    </main>
  );
}
