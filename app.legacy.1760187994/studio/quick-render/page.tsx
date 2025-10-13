"use client";
import { useState } from "react";

const DEMO = [
  ".data/render/cache/clip1.mp4",
  ".data/render/cache/clip2.mp4",
  ".data/render/cache/clip3.mp4",
];

export default function QuickRender() {
  const [clips, setClips] = useState(DEMO.join("\\n"));
  const [fps, setFps] = useState(30);
  const [preset, setPreset] = useState<"spectacle"|"asmr"|"transform"|"neutral">("transform");
  const [busy, setBusy] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [lastResp, setLastResp] = useState<any>(null);

  async function run() {
    setBusy(true);
    setPreviewUrl(null);
    setLastResp(null);
    try {
      const body = {
        clips: clips.split("\\n").map(s => s.trim()).filter(Boolean),
        voice: { file: ".data/render/cache/voice.wav", gainDb: 2 },
        music: { file: ".data/render/cache/music.wav", gainDb: -8, duck: { amountDb: -8 } },
        srt:   { path: ".data/render/cache/demo.srt" },
        out:   "out/videos/from-api.mp4",
        fps,
        preset,
      };
      const r = await fetch("/api/video/quick-render", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const j = await r.json();
      setLastResp(j);
      if (j.ok) {
        setPreviewUrl(`/media/${encodeURIComponent(j.out)}`);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={{maxWidth:880, margin:"40px auto", padding:"0 16px", fontFamily:"ui-sans-serif,system-ui"}}>
      <h1 style={{fontSize:28, fontWeight:800, marginBottom:4}}>Quick Render</h1>
      <p style={{color:"#444", marginBottom:16}}>Concatenate vertical clips, burn SRT, mix VO+music — now with <b>style presets</b>.</p>

      <section style={{display:"grid", gap:16, gridTemplateColumns:"1fr"}}>
        <label style={{display:"block"}}>
          <div style={{fontWeight:600, marginBottom:6}}>Clips (one per line)</div>
          <textarea value={clips} onChange={e=>setClips(e.target.value)}
            rows={5}
            style={{width:"100%", fontFamily:"ui-monospace, SFMono-Regular, Menlo, monospace", fontSize:12, padding:10, border:"1px solid #e5e7eb", borderRadius:8}}/>
        </label>

        <div style={{display:"flex", gap:16, alignItems:"center", flexWrap:"wrap"}}>
          <label>FPS&nbsp;
            <input type="number" min={24} max={60} value={fps}
              onChange={e=>setFps(parseInt(e.target.value||"30",10))}
              style={{width:80, padding:8, border:"1px solid #e5e7eb", borderRadius:8}}/>
          </label>

          <div style={{display:"flex", gap:10, alignItems:"center"}}>
            <span style={{fontWeight:600}}>Preset:</span>
            {(["transform","spectacle","asmr","neutral"] as const).map(p => (
              <label key={p} style={{display:"inline-flex", alignItems:"center", gap:6}}>
                <input type="radio" name="preset" value={p}
                  checked={preset===p} onChange={()=>setPreset(p)} />
                {p}
              </label>
            ))}
          </div>

          <button onClick={run} disabled={busy}
            style={{padding:"10px 14px", background:"#111827", color:"#fff", borderRadius:8, border:"1px solid #111827", fontWeight:700}}>
            {busy ? "Rendering…" : "Render"}
          </button>
        </div>
      </section>

      {lastResp && (
        <pre style={{marginTop:16, padding:12, background:"#0b1020", color:"#d1e4ff", borderRadius:8, overflow:"auto"}}>
{JSON.stringify(lastResp, null, 2)}
        </pre>
      )}

      {previewUrl && (
        <section style={{marginTop:16}}>
          <div style={{fontWeight:700, marginBottom:6}}>Preview</div>
          <video key={previewUrl} controls playsInline style={{width:360, height:640, background:"#000", borderRadius:8, border:"1px solid #e5e7eb"}} src={previewUrl}/>
          <div style={{ fontSize:12, marginTop:6, color:"#555" }}>
            If it doesn’t appear, open: <a href={previewUrl} target="_blank" rel="noreferrer">{previewUrl}</a>
          </div>
        </section>
      )}
    </main>
  );
}
