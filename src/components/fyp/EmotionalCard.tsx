"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useHaptics } from "@/hooks/useHaptics";
import { useAudioLevel } from "@/hooks/useAudioLevel";
import { useWatchTracker } from "@/hooks/useWatchTracker";
import { useActionToken } from "@/hooks/useActionToken";
import { useEnergy } from "@/hooks/useEnergy";
import { useTeamAura } from "@/hooks/useTeamAura";
import { getPhaseFromHour, applyTimeOfDayTheme } from "@/lib/timeTheme";

type Props = { src: string; poster?: string; title?: string; videoId?: string; };

export default function EmotionalCard({ src, poster, title, videoId }: Props) {
  const vidRef = useRef<HTMLVideoElement>(null);
  const id = videoId || title || src;

  // Local UI state
  const [muted, setMuted] = useState(true);
  const [videoEnergy, setVideoEnergy] = useState<number>(0);
  const [cooldown, setCooldown] = useState<string | null>(null); // shows on 429
  const [spark, setSpark] = useState<{txt:string,ts:number}|null>(null);

  const { tap, success } = useHaptics();
  const level = useAudioLevel(vidRef);
  const token = useActionToken();
  const { me, pool, crew, event, flash, joinDemo, leaveCrew, createInvite, joinByCode, invite } = useEnergy();
  const teamAura = useTeamAura();

  useEffect(()=>{ applyTimeOfDayTheme(getPhaseFromHour(new Date().getHours())); }, []);

  // Watch tracker (server-side conversion + quality factor handled API-side)
  useWatchTracker({ videoRef: vidRef, videoId: id, bearer: token || undefined });

  // Audio-reactive ring
  const ring = useMemo(() => {
    const intensity = Math.min(1, level * 3.5);
    return { px: 8 + intensity * 22, opacity: 0.35 + intensity * 0.45 };
  }, [level]);

  const toggleSound = () => {
    const v = vidRef.current; if(!v) return;
    const next = !muted; setMuted(next);
    try{ v.muted = next; if(!next) void v.play(); }catch{}
    tap();
  };

  // ---- Per-video energy binding (poll every 4s + small boot refresh) ----
  async function refreshVideoEnergy(){
    try{
      const r = await fetch(`/api/energy/video?id=${encodeURIComponent(id)}`, { cache:"no-store" });
      const j = await r.json();
      if(j?.ok) setVideoEnergy(j.stat.energy || 0);
    }catch{}
  }
  useEffect(()=>{ refreshVideoEnergy(); const t=setInterval(refreshVideoEnergy, 4000); return ()=>clearInterval(t); }, [id]);

  // Show a tiny spark when team energy moves (visual delight)
  useEffect(()=>{
    if(!teamAura) return;
    setSpark({ txt:"+", ts: Date.now() });
    const t = setTimeout(()=>setSpark(null), 700);
    return ()=>clearTimeout(t);
  }, [teamAura?.energy]);

  // Helper: handle actions; on 429 show cooldown hint
  async function sendAction(type:"LIKE"|"COMMENT"|"SHARE"){
    if(!token) return;
    const r = await fetch("/api/energy/earn", {
      method:"PATCH",
      headers:{ "content-type":"application/json", "authorization":`Bearer ${token}` },
      body: JSON.stringify({ type, videoId: id })
    });
    if(r.status === 429){
      setCooldown("You’re on a short cooldown ⏳");
      setTimeout(()=>setCooldown(null), 900);
      return;
    }
    if(r.ok){
      // server already updated counters; pull fresh per-video number once
      refreshVideoEnergy();
    }
  }

  async function assist(){
    if(!token) return;
    const r = await fetch("/api/energy/assist", {
      method:"POST",
      headers:{ "content-type":"application/json", "authorization":`Bearer ${token}` },
      body: JSON.stringify({ videoId: id })
    });
    if(r.status === 429){
      setCooldown("You’re on a short cooldown ⏳");
      setTimeout(()=>setCooldown(null), 900);
      return;
    }
    if(r.ok){ refreshVideoEnergy(); }
  }

  return (
    <div style={{ position:"relative", width:"100%", height:"100dvh", overflow:"hidden",
      background:"linear-gradient(180deg, var(--fyp-bg-start), var(--fyp-bg-end))", touchAction:"manipulation" }}>
      <style>{`
        @keyframes breathe { 0%{transform:scale(1);opacity:.85}50%{transform:scale(1.05);opacity:1}100%{transform:scale(1);opacity:.85} }
        @keyframes pop { 0%{transform:translateY(0) scale(.9);opacity:1} 100%{transform:translateY(-14px) scale(1.1);opacity:0} }
      `}</style>

      <video ref={vidRef} src={src} poster={poster} autoPlay muted={muted} playsInline loop
        style={{
          width:"100%", height:"100%", objectFit:"cover",
          transition:"transform 120ms ease-out, opacity 240ms ease", willChange:"transform",
          filter:"brightness(0.96) contrast(1.02)"
        }}
        onPlay={() => tap()} />

      {/* Title */}
      {title && (<div style={{ position:"absolute", left:12, bottom:140, color:"rgba(255,255,255,0.93)",
        fontWeight:700, fontSize:18, textShadow:"0 2px 12px rgba(0,0,0,0.55)", backdropFilter:"blur(2px)" }}>{title}</div>)}

      {/* Breathing Energy pill (now shows live number) */}
      <div style={{
        position:"absolute", left:"50%", bottom:110, transform:"translateX(-50%)",
        display:"flex", alignItems:"center", gap:10,
        padding:"8px 12px", borderRadius:999,
        border:"1px solid rgba(255,255,255,0.2)",
        background:`rgba(15,15,20,${0.45 + level*0.15})`,
        boxShadow:`0 0 18px rgba(255,255,255,${0.08 + level*0.12})`,
        backdropFilter:"blur(6px)", animation:"breathe 2.4s ease-in-out infinite",
      }}>
        <div style={{
          width:16, height:16, borderRadius:"50%",
          background:`radial-gradient(circle, var(--fyp-accent), rgba(255,255,255,0.6))`,
          boxShadow:`0 0 ${8+level*10}px var(--fyp-accent)`
        }}/>
        <div style={{ fontWeight:800, color:"#fff" }}>
          Energy {videoEnergy}
        </div>
        {spark && <div style={{ marginLeft:6, color:"#fef08a", fontWeight:900, animation:"pop .7s ease forwards" }}>+1</div>}
      </div>

      {/* Volume toggle */}
      <button onClick={toggleSound} aria-label="Toggle sound" style={{
        position:"absolute", top:14, right:12, width:44, height:44, borderRadius:"50%",
        border:"1px solid rgba(255,255,255,0.2)", background:"rgba(15,15,20,0.55)",
        backdropFilter:"blur(6px)", color:"white", cursor:"pointer", fontSize:16
      }}>{muted ? "🔇" : "🔊"}</button>

      {/* Top-left: Crew controls */}
      <div style={{ position:"absolute", top:14, left:12, display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
        {!crew ? (
          <button onClick={joinDemo} style={{
            padding:"8px 10px", borderRadius:10, border:"1px solid rgba(255,255,255,0.2)",
            background:"rgba(15,15,20,0.55)", color:"#fff", backdropFilter:"blur(6px)", cursor:"pointer", fontWeight:700
          }}>Join Demo Crew</button>
        ) : (
          <>
            <span style={{ color:"#fff", fontWeight:700, opacity:.95 }}>👥 {crew.name} ({crew.members})</span>
            <button onClick={leaveCrew} style={{ padding:"6px 8px", borderRadius:8, border:"1px solid rgba(255,255,255,0.2)",
              background:"rgba(15,15,20,0.55)", color:"#fff", cursor:"pointer" }}>Leave</button>
            {!invite ? (
              <button onClick={createInvite} style={{ padding:"6px 8px", borderRadius:8, border:"1px solid rgba(255,255,255,0.2)",
                background:"rgba(15,15,20,0.55)", color:"#fff", cursor:"pointer" }}>Invite Code</button>
            ) : (
              <span style={{ color:"#fef08a", fontWeight:800 }}>Code: {invite}</span>
            )}
          </>
        )}
        {event && (
          <span style={{ marginLeft:6, padding:"6px 10px", borderRadius:999,
            background:"linear-gradient(90deg,#22c55e,#84cc16)", color:"#0b0f12", fontWeight:900 }}>
            ⚡ {event.name} ×{event.multiplier}
          </span>
        )}
      </div>

      {/* Right rail */}
      <div style={{ position:"absolute", right:12, bottom:100, display:"flex", flexDirection:"column", gap:14, alignItems:"center" }}>
        <Circle onClick={()=>{ success(); sendAction("LIKE"); }} shadow={`${ring.px}px ${ring.opacity}`}>❤</Circle>
        <Circle onClick={()=>{ tap(); sendAction("COMMENT"); }}>💬</Circle>
        <Circle onClick={()=>{ tap(); sendAction("SHARE"); }}>↗️</Circle>
        <Circle onClick={()=>{ tap(); assist(); }} title="Assist (+1 to this video)">⚡</Circle>
      </div>

      {/* Energy HUD */}
      <div style={{ position:"absolute", left:12, right:12, bottom:22, display:"flex", flexDirection:"column", gap:10 }}>
        <Bar label="Team" value={Math.min(100,(pool?.energy ?? 0)%100)} total={pool?.energy ?? 0} colorVar="var(--fyp-accent)"/>
        <Bar label="Crew" value={Math.min(100,(crew?.energy ?? 0)%100)} total={crew?.energy ?? 0} colorVar="#60a5fa"/>
        <Bar label="You"  value={Math.min(100,(me?.energy ?? 0)%100)}   total={me?.energy ?? 0}   colorVar="#f59e0b"/>
      </div>

      {/* Cooldown toast (429) */}
      {cooldown && (
        <div style={{
          position:"absolute", left:"50%", bottom:70, transform:"translateX(-50%)",
          padding:"8px 12px", borderRadius:10, color:"#0b0f12",
          background:"#fde68a", fontWeight:800, boxShadow:"0 8px 30px rgba(0,0,0,0.35)"
        }}>{cooldown}</div>
      )}

      {/* Flash toast (from useEnergy) */}
      {flash && (
        <div style={{
          position:"absolute", left:"50%", bottom:70, transform:"translateX(-50%)",
          padding:"8px 12px", borderRadius:10, color:"#0b0f12",
          background:"#fef08a", fontWeight:800, boxShadow:"0 8px 30px rgba(0,0,0,0.35)"
        }}>{flash}</div>
      )}
    </div>
  );
}

function Bar({label, value, total, colorVar}:{label:string; value:number; total:number; colorVar:string}){
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
      <div style={{ width:70, color:"#fff", fontSize:12, opacity:.85 }}>{label}</div>
      <div style={{ flex:1, height:8, borderRadius:8, background:"rgba(255,255,255,0.08)", overflow:"hidden",
        boxShadow:"0 0 10px rgba(255,255,255,0.08) inset" }}>
        <div style={{
          width: `${value}%`, height:"100%",
          background:`linear-gradient(90deg, ${colorVar}, rgba(255,255,255,0.6))`,
          filter:"saturate(1.2)", transition:"width 300ms ease",
          boxShadow:`0 0 16px ${colorVar}`,
        }} />
      </div>
      <div style={{ color:"#fff", fontSize:12, opacity:.9, minWidth:40, textAlign:"right" }}>{total}</div>
    </div>
  );
}

function Circle({ children, onClick, title, shadow }:{ children:React.ReactNode; onClick:()=>void; title?:string; shadow?:string }){
  return (
    <button onClick={onClick} title={title} style={{
      position:"relative", width:52, height:52, borderRadius:"50%",
      border:"1px solid rgba(255,255,255,0.2)", background:"rgba(15,15,20,0.55)",
      backdropFilter:"blur(6px)", cursor:"pointer",
      boxShadow:`0 0 ${shadow || "10px rgba(255,255,255,.3)"}`,
      color:"#fff", fontSize:20
    }}>{children}</button>
  );
}
