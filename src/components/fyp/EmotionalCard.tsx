"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useHaptics } from "@/hooks/useHaptics";
import { useAudioLevel } from "@/hooks/useAudioLevel";
import { useWatchTracker } from "@/hooks/useWatchTracker";
import { useActionToken } from "@/hooks/useActionToken";
import { useEnergy } from "@/hooks/useEnergy";
import { getPhaseFromHour, applyTimeOfDayTheme } from "@/lib/timeTheme";

type Props = { src: string; poster?: string; title?: string; videoId?: string; };

export default function EmotionalCard({ src, poster, title, videoId }: Props) {
  const vidRef = useRef<HTMLVideoElement>(null);
  const id = videoId || title || src;
  const [muted, setMuted] = useState(true);
  const { tap, success } = useHaptics();
  const level = useAudioLevel(vidRef);
  const token = useActionToken();
  const { me, pool, crew, event, earn, flash, joinDemo, leaveCrew, createInvite, joinByCode, invite } = useEnergy();

  useEffect(()=>{ applyTimeOfDayTheme(getPhaseFromHour(new Date().getHours())); }, []);

  // Watch → server conversion (units) with Bearer
  useWatchTracker({
    videoRef: vidRef,
    videoId: id,
    bearer: token || undefined,
    onUnitsSent: (_)=>{ /* server updates counters; UI will reflect via hooks */ }
  });

  // Parallax
  const wrapRef = useRef<HTMLDivElement>(null);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const el = wrapRef.current; if(!el) return;
    const onMove = (e: MouseEvent | TouchEvent) => {
      const r = el.getBoundingClientRect(); const cx=r.left+r.width/2; const cy=r.top+r.height/2;
      const calc = (x:number,y:number)=>({ x: ((x-cx)/r.width)*8, y: ((y-cy)/r.height)*8 });
      if (e instanceof TouchEvent){ const t=e.touches[0]||e.changedTouches[0]; setParallax(calc(t.clientX,t.clientY)); }
      else { const m=e as MouseEvent; setParallax(calc(m.clientX,m.clientY)); }
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("touchmove", onMove, { passive: true });
    return ()=>{ el.removeEventListener("mousemove", onMove); el.removeEventListener("touchmove", onMove); };
  }, []);

  // Audio-reactive ring
  const ring = useMemo(() => {
    const intensity = Math.min(1, level * 3.5);
    const px = 8 + intensity * 22;
    const opacity = 0.35 + intensity * 0.45;
    return { px, opacity };
  }, [level]);

  const toggleSound = () => {
    const v = vidRef.current; if(!v) return;
    const next = !muted; setMuted(next);
    try{ v.muted = next; if(!next) void v.play(); }catch{}
    tap();
  };

  // Actions (use PATCH/earn with Bearer)
  async function sendAction(type:"LIKE"|"COMMENT"|"SHARE"){
    if(!token) return;
    const r = await fetch("/api/energy/earn", {
      method:"PATCH",
      headers:{ "content-type":"application/json", "authorization":`Bearer ${token}` },
      body: JSON.stringify({ type, videoId: id })
    });
    if(r.ok){ /* counters updated server-side; hooks will refresh */ }
  }

  const onLike = async () => { success(); await sendAction("LIKE"); };
  const onComment = async () => { tap(); await sendAction("COMMENT"); };
  const onShare = async () => { tap(); await sendAction("SHARE"); };

  const teamBar = Math.min(100, (pool?.energy ?? 0) % 100);
  const crewBar = Math.min(100, (crew?.energy ?? 0) % 100);

  return (
    <div ref={wrapRef} style={{ position:"relative", width:"100%", height:"100dvh", overflow:"hidden",
      background:"linear-gradient(180deg, var(--fyp-bg-start), var(--fyp-bg-end))", touchAction:"manipulation" }}>
      <video ref={vidRef} src={src} poster={poster} autoPlay muted={muted} playsInline loop
        style={{ width:"100%", height:"100%", objectFit:"cover",
          transform:`translate3d(${parallax.x}px, ${parallax.y}px, 0)`,
          transition:"transform 120ms ease-out, opacity 240ms ease", willChange:"transform",
          filter:"brightness(0.96) contrast(1.02)" }} onPlay={() => tap()} />

      {title && (<div style={{ position:"absolute", left:12, bottom:120, color:"rgba(255,255,255,0.93)",
        fontWeight:700, fontSize:18, textShadow:"0 2px 12px rgba(0,0,0,0.55)", backdropFilter:"blur(2px)" }}>{title}</div>)}

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
        {/* Event badge if active */}
        {event && (
          <span style={{ marginLeft:6, padding:"6px 10px", borderRadius:999,
            background:"linear-gradient(90deg,#22c55e,#84cc16)", color:"#0b0f12", fontWeight:900 }}>
            ⚡ {event.name} ×{event.multiplier}
          </span>
        )}
      </div>

      {/* Right rail */}
      <div style={{ position:"absolute", right:12, bottom:100, display:"flex", flexDirection:"column", gap:14, alignItems:"center" }}>
        <button onClick={onLike} aria-label="Like" style={{
          position:"relative", width:52, height:52, borderRadius:"50%",
          border:"1px solid rgba(255,255,255,0.2)", background:"rgba(15,15,20,0.55)",
          backdropFilter:"blur(6px)", cursor:"pointer",
          boxShadow:`0 0 ${ring.px}px rgba(255,255,255,${ring.opacity})`,
          transition:"box-shadow 80ms linear, transform 80ms ease",
        }}><span style={{ fontSize:20, color:"white", userSelect:"none" }}>❤</span></button>
        <button onClick={onComment} aria-label="Comment" style={railBtnStyle}>💬</button>
        <button onClick={onShare} aria-label="Share" style={railBtnStyle}>↗️</button>
      </div>

      {/* Energy HUD */}
      <div style={{ position:"absolute", left:12, right:12, bottom:22, display:"flex", flexDirection:"column", gap:10 }}>
        <Bar label="Team" value={Math.min(100,(pool?.energy ?? 0)%100)} total={pool?.energy ?? 0} colorVar="var(--fyp-accent)"/>
        <Bar label="Crew" value={Math.min(100,(crew?.energy ?? 0)%100)} total={crew?.energy ?? 0} colorVar="#60a5fa"/>
        <Bar label="You"  value={Math.min(100,(me?.energy ?? 0)%100)}   total={me?.energy ?? 0}   colorVar="#f59e0b"/>
      </div>

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

const railBtnStyle: React.CSSProperties = {
  width: 48, height: 48,
  borderRadius: "50%",
  border: "1px solid rgba(255,255,255,0.2)",
  background: "rgba(15,15,20,0.55)",
  backdropFilter: "blur(6px)",
  cursor: "pointer",
  color: "white",
  fontSize: 18,
  display: "grid",
  placeItems: "center",
};
