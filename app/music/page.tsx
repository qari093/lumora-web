export const dynamic = "force-dynamic";

export default function MusicPortalPage() {
  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>Lumora Music</h1>
      <p style={{ opacity: 0.85, marginBottom: 16 }}>
        Music portal is now active (minimal). Audio ingestion, playlists, and player activation come next.
      </p>

      <section style={{ padding: 16, border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>Status</h2>
        <ul style={{ lineHeight: 1.7 }}>
          <li>UI: active (placeholder)</li>
          <li>API health: <code>/api/music/health</code></li>
          <li>Playback + catalog: not yet enabled</li>
        </ul>
      </section>
    </main>
  );
}
