"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useBattery } from "@/hooks/useBattery";
import { useLowPower } from "@/hooks/useLowPower";

type Source = { src:string; type?:string; };
type Props = {
  sources: Source[];
  poster?: string;
  autoPlay?: boolean;
  defaultMode?: "performance"|"interactive";
  showControls?: boolean;
  className?: string;
};

export default function BatterySmartPlayer({
  sources, poster, autoPlay=true, defaultMode="interactive", showControls=false, className
}: Props){
  const videoRef = useRef<HTMLVideoElement|null>(null);
  const wrapperRef = useRef<HTMLDivElement|null>(null);
  const [interactiveOverlay, setInteractiveOverlay] = useState(false);
  const { level, saver } = useBattery();
  const { lowPower } = useLowPower();

  const prefersReducedMotion = useMemo(
    ()=> typeof window !== "undefined" ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false,
    []
  );

  const mode: "performance"|"interactive" = useMemo(()=>{
    if (lowPower) return "performance";          // ← Home override
    if (saver) return "performance";
    if (level <= 0.2) return "performance";
    if (prefersReducedMotion) return "performance";
    return defaultMode;
  }, [defaultMode, level, saver, prefersReducedMotion, lowPower]);

  useEffect(()=>{
    const v = videoRef.current; if(!v) return;
    const hlsSrc = sources.find(s=>/\.m3u8($|\?)/.test(s.src));
    const canNativeHls = v.canPlayType('application/vnd.apple.mpegURL') !== "";
    let Hls:any, hlsInst:any;
    (async ()=>{
      if (hlsSrc && !canNativeHls){
        try{
          // @ts-ignore
          Hls = (await import("hls.js")).default ?? (await import("hls.js"));
          if (Hls?.isSupported()){
            hlsInst = new Hls({ lowLatencyMode:true, enableWorker:true });
            hlsInst.loadSource(hlsSrc.src);
            hlsInst.attachMedia(v);
          } else {
            v.src = hlsSrc.src;
          }
        }catch{}
      } else if (hlsSrc && canNativeHls){
        v.src = hlsSrc.src;
      } else {
        const mp4 = sources.find(s=>/mp4/.test(s.type||"")) || sources[0];
        if (mp4) v.src = mp4.src;
      }
    })();
    v.setAttribute("playsinline","true");
    v.setAttribute("webkit-playsinline","true");
    v.preload = "metadata";
    if (autoPlay) v.muted = true;
    const vis=()=>{ if(document.hidden && !v.paused) v.pause(); };
    document.addEventListener("visibilitychange", vis);
    let io:IntersectionObserver|undefined;
    if ("IntersectionObserver" in window && wrapperRef.current){
      io = new IntersectionObserver(es=>{
        es.forEach(e=>{ if(!e.isIntersecting && !v.paused) v.pause(); });
      },{threshold:0.01});
      io.observe(wrapperRef.current);
    }
    return ()=>{ document.removeEventListener("visibilitychange",vis); io?.disconnect(); try{hlsInst?.destroy?.();}catch{} };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  const onTap = () => { if (mode==="interactive") setInteractiveOverlay(o=>!o); };

  return (
    <div ref={wrapperRef} className={className} style={{position:"relative", borderRadius:12, overflow:"hidden", background:"#000"}}>
      <video
        ref={videoRef}
        poster={poster}
        autoPlay={autoPlay}
        controls={mode==="performance" ? true : showControls}
        playsInline
        muted={autoPlay}
        style={{ width:"100%", height:"auto", display:"block" }}
        onClick={onTap}
      />
      {mode==="interactive" && interactiveOverlay && (
        <div style={{position:"absolute", inset:0, display:"flex", alignItems:"flex-end", justifyContent:"space-between", pointerEvents:"none"}}>
          <div style={{pointerEvents:"auto", margin:12, padding:"8px 10px", background:"rgba(0,0,0,.45)", borderRadius:10, color:"#e5e7eb", fontWeight:700}}>
            Lumora • Battery-Smart Player
          </div>
          <div style={{pointerEvents:"auto", margin:12, display:"flex", gap:8, flexDirection:"column"}}>
            <button onClick={()=>videoRef.current?.pause()} style={btn}>⏸ Pause</button>
            <button onClick={()=>{ const v=videoRef.current; if(!v) return; v.muted=!v.muted; }} style={btn}>🔊 Mute/Unmute</button>
            <button onClick={()=>videoRef.current?.requestPictureInPicture?.()} style={btn}>🖼 PiP</button>
          </div>
        </div>
      )}
      <div style={{position:"absolute", top:8, right:8, pointerEvents:"none",
        background:"rgba(0,0,0,.45)", color:"#e5e7eb", fontSize:12, padding:"4px 8px", borderRadius:999}}>
        {mode==="performance" ? "Performance Mode" : "Interactive Mode"}
      </div>
    </div>
  );
}
const btn:React.CSSProperties = { padding:"8px 10px", borderRadius:10, background:"rgba(0,0,0,.55)", color:"#e5e7eb", border:"1px solid #2a2a2a", cursor:"pointer" };
