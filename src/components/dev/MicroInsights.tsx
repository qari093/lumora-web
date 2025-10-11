"use client";
import React from "react";
import { getSnapshot, subscribe } from "@/lib/metricsBus";
import { useTeamAura } from "@/hooks/useTeamAura";
import { useEnergy } from "@/hooks/useEnergy";

function useFps(){
  const [fps, setFps] = React.useState(0);
  React.useEffect(()=>{
    let last = performance.now();
    let frames = 0;
    let raf = 0;
    let tickTimer: any = null;

    const loop = () => {
      frames++;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const tick = () => {
      const now = performance.now();
      const dt = (now - last) / 1000;
      const cur = Math.round(frames / (dt || 1));
      setFps(cur);
      frames = 0; last = now;
      tickTimer = setTimeout(tick, 1000);
    };
    tick();

    return ()=>{ cancelAnimationFrame(raf); if(tickTimer) clearTimeout(tickTimer); };
  }, []);
  return fps;
}

function useMetrics(){
  const [snap, setSnap] = React.useState(getSnapshot());
  React.useEffect(()=> subscribe(()=> setSnap(getSnapshot())), []);
  // Units per minute = count in last 60s
  const now = Date.now();
  const upm = snap.unitsTimestamps.filter(t => t >= now - 60_000).length;
  return { upm, limiter: snap.limiter };
}

export default function MicroInsights(){
  const fps = useFps();
  const { upm, limiter } = useMetrics();
  const team = useTeamAura();
  const { event } = useEnergy();

  return (
    <div style={{
      position:"fixed", right:10, top:10, zIndex:9999, fontFamily:"ui-sans-serif, system-ui",
      background:"rgba(15,15,20,0.7)", color:"#e5e7eb", padding:"10px 12px", borderRadius:10,
      border:"1px solid rgba(255,255,255,0.15)", backdropFilter:"blur(6px)", fontSize:12,
      boxShadow:"0 10px 30px rgba(0,0,0,0.35)"
    }}>
      <div style={{ display:"flex", gap:12 }}>
        <span>FPS: <b>{fps}</b></span>
        <span>Units/min: <b>{upm}</b></span>
        <span>Team: <b>{team?.energy ?? 0}</b></span>
        <span>Event: <b>{event ? `×${event.multiplier}` : "—"}</b></span>
      </div>
      {Object.keys(limiter).length>0 && (
        <div style={{ marginTop:6, opacity:.9 }}>
          Limits: {Object.entries(limiter).map(([k,v])=>
            <span key={k} style={{ marginRight:8 }}>{k}:{v}</span>
          )}
        </div>
      )}
    </div>
  );
}
