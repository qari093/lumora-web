export type MusicTrack = {
  id: string;
  title: string;
  artist?: string;
  duration?: string;
};

const fallbackTracks: MusicTrack[] = [
  { id: "lumora-ambient-01", title: "First Signal", artist: "Lumora Echo", duration: "2:40" },
  { id: "lumora-ambient-02", title: "Blue Blade Drift", artist: "Lumora Echo", duration: "3:12" },
  { id: "lumora-ambient-03", title: "Sanctuary Pulse", artist: "NEXA Calm", duration: "2:58" }
];

export default function TrackList({ tracks = fallbackTracks }: { tracks?: MusicTrack[] }) {
  return (
    <section aria-label="Music tracks">
      <div style={{ display: "grid", gap: 12 }}>
        {tracks.map((track) => (
          <article
            key={track.id}
            style={{
              border: "1px solid rgba(255,255,255,0.14)",
              borderRadius: 16,
              padding: 14,
              background: "rgba(255,255,255,0.05)"
            }}
          >
            <strong>{track.title}</strong>
            <div style={{ opacity: 0.72, marginTop: 4 }}>
              {track.artist || "Lumora"} {track.duration ? `• ${track.duration}` : ""}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
