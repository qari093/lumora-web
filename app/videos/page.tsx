import VideoPlayer from "@/components/VideoPlayer";

type Row = {
  id: string;
  cfUid: string | null;
  playbackId: string | null;
  status: "READY" | "FLAGGED" | "PENDING" | string;
  durationSec: number | null;
  sizeBytes: number | null;
  reason: string | null;
  createdAt: string;
};

async function getRows(): Promise<Row[]> {
  const r = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/videos/debug/list`, {
    cache: "no-store",
  }).catch(() => null as any);

  // Fallback to relative (works in browser/runtime)
  const r2 = r && r.ok ? r : await fetch("/api/videos/debug/list", { cache: "no-store" });
  const json = await r2.json();
  return json?.rows ?? [];
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function VideosPage() {
  const rows = await getRows();

  return (
    <main style={{maxWidth: 900, margin: "40px auto", padding: 16}}>
      <h1>Videos</h1>
      <p>
        <a href="/videos/upload" style={{textDecoration:"underline"}}>Upload a new video</a>
      </p>

      {!rows.length && <p>No videos yet.</p>}

      <div style={{display:"grid", gridTemplateColumns:"1fr", gap: 24}}>
        {rows.map(v => (
          <div key={v.id} style={{border:"1px solid #333", borderRadius:8, padding:16}}>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
              <strong>{v.cfUid ?? v.id}</strong>
              <span style={{fontSize:12, opacity:0.8}}>
                {v.status}{v.reason ? ` • ${v.reason}` : ""} • {(v.durationSec ?? 0)}s
              </span>
            </div>
            {v.status === "READY" && v.playbackId ? (
              <div style={{marginTop:12}}>
                <VideoPlayer playbackIdOrUrl={v.playbackId} />
              </div>
            ) : (
              <div style={{marginTop:12, fontSize:14, opacity:0.8}}>
                {v.status === "FLAGGED" ? "⛔ Flagged by policy (e.g., duration limit)" : "⏳ Processing…"}
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
