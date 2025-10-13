"use client";
import React, { useEffect, useRef, useState } from "react";

type Prog = {
  ok?: boolean;
  jobId: string;
  pct: number;
  stage: string;
  outPath?: string;
  error?: string;
};

export default function LiveRenderPage() {
  const [jobId, setJobId] = useState<string>("");
  const [payload, setPayload] = useState<string>("");
  const [prog, setProg] = useState<Prog | null>(null);
  const [apiResp, setApiResp] = useState<any>(null);
  const [apiErr, setApiErr] = useState<string>("");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // seed default payload once
  useEffect(() => {
    if (payload) return;
    setPayload(JSON.stringify({
      outPath: "out/videos/from-api-ducked.mp4",
      width: 1080,
      height: 1920,
      fps: 30,
      color: { saturation: 1.06 },
      clips: [
        { file: ".data/render/cache/clip1.mp4" },
        { file: ".data/render/cache/clip2.mp4" },
        { file: ".data/render/cache/clip3.mp4" }
      ],
      voice: { file: ".data/render/cache/voice.wav", gainDb: 2 },
      music: { file: ".data/render/cache/music.wav", gainDb: -8 },
      subtitles: { srtPath: ".data/render/cache/demo.srt", outlinePx: 3, bottomPct: 12 }
    }, null, 2));
  }, [payload]);

  const stopPolling = () => {
    if (pollRef.current) clearInterval(pollRef.current!);
    pollRef.current = null;
  };

  const startRender = async () => {
    setApiErr("");
    setApiResp(null);
    setProg(null);
    setIsRunning(true);

    const j = crypto.randomUUID();
    setJobId(j);

    let body: any = {};
    try { body = payload ? JSON.parse(payload) : {}; }
    catch { setIsRunning(false); setApiErr("Payload is not valid JSON."); return; }

    try {
      const r = await fetch(`/api/video/quick-render?jobId=${j}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body)
      });
      const js = await r.json().catch(() => ({ ok:false, error:"Bad JSON from API" }));
      setApiResp(js);
      if (!js.ok) { setApiErr(js.error || "Render API returned an error."); setIsRunning(false); return; }
    } catch (e:any) {
      setApiErr(String(e?.message ?? e) || "Network error calling API.");
      setIsRunning(false);
      return;
    }

    // start polling
    pollRef.current = setInterval(async () => {
      try {
        const p = await fetch(`/api/video/progress?jobId=${j}`).then(r=>r.json());
        if (p && p.ok !== undefined) {
          setProg(p);
          const pct = Number(p.pct || 0);
          const done = (pct >= 100) && (p.ok === true);
          const failed = (pct >= 100) && (p.ok === false);
          if (done || failed) { stopPolling(); setIsRunning(false); }
        }
      } catch {/* ignore transient errors */}
    }, 600);
  };

  useEffect(() => () => stopPolling(), []);

  const pct = Math.max(0, Math.min(100, prog?.pct ?? 0));
  const doneOk = !!(prog && prog.ok === true && pct >= 100 && !prog.error);

  return (
    <div style={{maxWidth:820, margin:"40px auto", fontFamily:"ui-sans-serif, system-ui"}}>
      <h1>Live Render</h1>
      <div style={{margin:"16px 0", fontSize:14, opacity:0.85}}>
        Paste/adjust payload and press <b>Start</b>. Progress updates every ~600ms.
      </div>

      {(apiErr || prog?.error) && (
        <div style={{background:"#fdecec", color:"#9a1c1c", border:"1px solid #f4b4b4", padding:"10px 12px", borderRadius:8, margin:"12px 0"}}>
          <b>Error:</b> {apiErr || String(prog?.error)}
        </div>
      )}

      <textarea
        value={payload}
        onChange={e=>setPayload(e.target.value)}
        rows={14}
        style={{width:"100%", fontFamily:"ui-monospace, SFMono-Regular, Menlo, monospace", fontSize:12, padding:12, border:"1px solid #ddd", borderRadius:8}}
      />

      <div style={{marginTop:12, display:"flex", gap:12, alignItems:"center"}}>
        <button
          onClick={startRender}
          disabled={isRunning}
          style={{padding:"10px 14px", borderRadius:8, border:"1px solid #111", background: isRunning ? "#999" : "#111", color:"#fff"}}
          title={isRunning ? "A render is already running…" : "Start render"}
        >
          {isRunning ? "Running…" : "Start"}
        </button>
        <input readOnly value={jobId} placeholder="jobId" style={{flex:1, padding:"10px 12px", borderRadius:8, border:"1px solid #ddd"}} />
      </div>

      <div style={{marginTop:24}}>
        <div style={{display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:6}}>
          <span>Stage: <b>{prog?.stage ?? (isRunning ? "starting…" : "—")}</b></span>
          <span>{pct}%</span>
        </div>
        <div style={{height:10, background:"#eee", borderRadius:6, overflow:"hidden"}}>
          <div style={{height:"100%", width:`${pct}%`, background:"#000", transition:"width .3s linear"}} />
        </div>

        {doneOk && prog?.outPath && (
          <div style={{marginTop:12, fontSize:14}}>
            ✅ Done — <a href={`/${prog.outPath}`} target="_blank" rel="noreferrer">open video</a>
          </div>
        )}
      </div>

      <div style={{marginTop:24, fontSize:12, opacity:0.7}}>
        API: {apiResp ? JSON.stringify(apiResp) : "—"}
      </div>
    </div>
  );
}
