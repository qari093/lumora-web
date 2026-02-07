export const dynamic = "force-dynamic";

type Movie = {
  id: string;
  title: string;
  year: number;
  runtimeSec: number;
  rating: string;
  genres: string[];
  language: string;
  synopsis: string;
};

async function getMovies(): Promise<{ ok: boolean; count: number; mode: string; items: Movie[] }> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/movies/catalog`, {
    cache: "no-store",
  });
  return res.json();
}

function fmtRuntime(sec: number) {
  const m = Math.max(0, Math.floor(sec / 60));
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return h > 0 ? `${h}h ${mm}m` : `${mm}m`;
}

export default async function MoviesPage() {
  const data = await getMovies().catch(() => ({ ok: false, count: 0, mode: "error", items: [] as Movie[] }));

  return (
    <main style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
      <h1 style={{ fontSize: 34, marginBottom: 8 }}>CineVerse Movies</h1>
      <p style={{ opacity: 0.8, marginTop: 0 }}>
        Mode: <b>{data.mode}</b> • Items: <b>{data.count}</b> • (Seed catalog for identification — ingestion replaces this later)
      </p>

      {!data.ok ? (
        <div style={{ marginTop: 18, padding: 16, borderRadius: 14, border: "1px solid rgba(255,255,255,0.10)" }}>
          <b>Catalog unavailable</b>
          <div style={{ opacity: 0.8, marginTop: 6 }}>Check /api/movies/catalog</div>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 12, marginTop: 18 }}>
          {data.items.slice(0, 120).map((m) => (
            <div
              key={m.id}
              style={{
                padding: 14,
                borderRadius: 16,
                border: "1px solid rgba(255,255,255,0.10)",
                background: "rgba(10,14,26,0.35)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{m.title}</div>
                <div style={{ opacity: 0.75, fontSize: 13 }}>
                  {m.year} • {fmtRuntime(m.runtimeSec)} • {m.rating} • {m.language.toUpperCase()}
                </div>
              </div>
              <div style={{ marginTop: 6, opacity: 0.85 }}>{m.synopsis}</div>
              <div style={{ marginTop: 8, opacity: 0.75, fontSize: 13 }}>{m.genres.join(" • ")}</div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
