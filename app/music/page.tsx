export const dynamic = "force-dynamic";

type Track = {
  id: string;
  title: string;
  artist: string;
  album: string;
  year: number;
  durationSec: number;
  genres: string[];
  language: string;
};

async function getTracks(): Promise<{ ok: boolean; count: number; mode: string; items: Track[] }> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/music/catalog`, {
    cache: "no-store",
  });
  return res.json();
}

function fmtDur(sec: number) {
  const s = Math.max(0, Math.floor(sec));
  const mm = Math.floor(s / 60);
  const ss = String(s % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

export default async function MusicPage() {
  const data = await getTracks().catch(() => ({ ok: false, count: 0, mode: "error", items: [] as Track[] }));

  return (
    <main style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
      <h1 style={{ fontSize: 34, marginBottom: 8 }}>Lumora Echo</h1>
      <p style={{ opacity: 0.8, marginTop: 0 }}>
        Mode: <b>{data.mode}</b> • Items: <b>{data.count}</b> • (Seed catalog for identification — real library comes later)
      </p>

      {!data.ok ? (
        <div style={{ marginTop: 18, padding: 16, borderRadius: 14, border: "1px solid rgba(255,255,255,0.10)" }}>
          <b>Catalog unavailable</b>
          <div style={{ opacity: 0.8, marginTop: 6 }}>Check /api/music/catalog</div>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 10, marginTop: 18 }}>
          {data.items.slice(0, 240).map((t) => (
            <div
              key={t.id}
              style={{
                padding: 14,
                borderRadius: 16,
                border: "1px solid rgba(255,255,255,0.10)",
                background: "rgba(10,14,26,0.35)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{t.title}</div>
                <div style={{ opacity: 0.75, fontSize: 13 }}>
                  {t.artist} • {fmtDur(t.durationSec)} • {t.year} • {t.language.toUpperCase()}
                </div>
              </div>
              <div style={{ marginTop: 6, opacity: 0.85 }}>{t.album}</div>
              <div style={{ marginTop: 8, opacity: 0.75, fontSize: 13 }}>{t.genres.join(" • ")}</div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
