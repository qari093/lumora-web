import fs from "fs/promises";
import path from "path";

async function listVideos() {
  const dir = path.join(process.cwd(), "out", "videos");
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files = entries
      .filter(e => e.isFile() && e.name.endsWith(".mp4"))
      .map(e => path.join(dir, e.name));
    const stats = await Promise.all(files.map(async f => ({ 
      file: f, 
      name: path.basename(f), 
      stat: await fs.stat(f) 
    })));
    // newest first
    stats.sort((a,b) => b.stat.mtimeMs - a.stat.mtimeMs);
    return stats;
  } catch {
    return [];
  }
}

function fmtBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024*1024) return `${(n/1024).toFixed(1)} KB`;
  return `${(n/1024/1024).toFixed(1)} MB`;
}

export default async function Gallery() {
  const vids = await listVideos();
  return (
    <main style={{maxWidth: 980, margin: "40px auto", padding: "0 16px", fontFamily:"ui-sans-serif,system-ui"}}>
      <h1 style={{fontSize:28, fontWeight:800, marginBottom:4}}>Gallery</h1>
      <p style={{color:"#444", marginBottom:20}}>
        All MP4s from <code>out/videos</code>. Click a card to play.
      </p>

      {vids.length === 0 && (
        <div style={{padding:16, border:"1px solid #eee", borderRadius:8, background:"#fafafa"}}>
          No videos yet. Try <a href="/studio/quick-render">Quick Render</a>.
        </div>
      )}

      <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(320px,1fr))", gap:16}}>
        {vids.map(v => {
          const mediaPath = `/media/out/videos/${encodeURIComponent(v.name)}`;
          return (
            <div key={v.name} style={{border:"1px solid #e5e7eb", borderRadius:10, background:"#fff", overflow:"hidden"}}>
              <div style={{padding:"10px 12px", borderBottom:"1px solid #eee", display:"flex", justifyContent:"space-between", alignItems:"baseline"}}>
                <div style={{fontWeight:700}}>{v.name}</div>
                <div style={{fontSize:12, color:"#555"}}>{fmtBytes(v.stat.size)}</div>
              </div>
              <div style={{padding:12}}>
                <video
                  controls
                  playsInline
                  preload="metadata"
                  style={{width:"100%", aspectRatio:"9 / 16", background:"#000", borderRadius:8}}
                  src={mediaPath}
                />
                <div style={{fontSize:12, marginTop:6, color:"#555"}}>
                  Direct link: <a href={mediaPath} target="_blank" rel="noreferrer">{mediaPath}</a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
