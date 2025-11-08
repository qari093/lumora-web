"use client";
import { useEffect, useRef, useState } from "react";

type State = { calm?: number; focus?: number; mode?: "online" | "offline"; updatedAt?: number };

function box(status: "ok" | "offline" | "idle"): React.CSSProperties {
  const bg = status === "ok" ? "rgba(50,120,220,0.75)" : status === "offline" ? "rgba(220,120,50,0.75)" : "rgba(40,40,55,0.70)";
  return { position:"fixed", right:14, bottom:210, zIndex:9998, background:bg, color:"#fff", padding:"10px 12px", borderRadius:10,
    font:"600 12px/1.2 system-ui", boxShadow:"0 6px 22px rgba(0,0,0,.35)", backdropFilter:"blur(6px)", minWidth:160 };
}

export default function EmotionBridge() {
  const [state, setState] = useState<State>({ calm: 90, focus: 82, mode: "online", updatedAt: Date.now() });
  const tick = useRef<number | null>(null);
  const merge = (next: Partial<State>) => setState((s) => ({ ...s, ...next, updatedAt: Date.now() }));

  useEffect(() => {
    let cancelled = false;
    try { const raw = localStorage.getItem("lumora_emotion_bridge"); if (raw) { const parsed = JSON.parse(raw) as State; if (!cancelled && parsed) merge(parsed); } } catch {}
    const onStorage = (e: StorageEvent) => { if (e.key === "lumora_emotion_bridge" && e.newValue) { try { merge(JSON.parse(e.newValue) as State); } catch {} } };
    window.addEventListener("storage", onStorage);
    const loop = () => {
      const online = navigator.onLine;
      if (!online) {
        merge({ mode:"offline",
          calm: Math.min(100, Math.round(((state.calm ?? 80) * 9 + 2) / 10)),
          focus: Math.max(20, Math.round(((state.focus ?? 70) * 9 + 60) / 10 - 3)),
        });
      } else { merge({ mode:"online" }); }
      tick.current = window.setTimeout(loop, 5000);
    };
    loop();
    return () => { cancelled = true; window.removeEventListener("storage", onStorage); if (tick.current) window.clearTimeout(tick.current); };
  }, []); // init once

  useEffect(() => { try { localStorage.setItem("lumora_emotion_bridge", JSON.stringify(state)); } catch {} }, [state]);
  const status: "ok" | "offline" | "idle" = state.mode === "offline" ? "offline" : "ok";

  return (
    <div style={box(status)} title="Emotion Bridge Overlay">
      <div style={{fontWeight:700, marginBottom:4}}>Emotion Bridge</div>
      <div>Calm: <b>{Math.round(state.calm ?? 0)}%</b></div>
      <div>Focus: <b>{Math.round(state.focus ?? 0)}%</b></div>
      <div>Mode: <b>{state.mode ?? "online"}</b></div>
      <div style={{opacity:.7, marginTop:6, fontSize:11}}>Updated: {new Date(state.updatedAt ?? Date.now()).toLocaleTimeString()}</div>
    </div>
  );
}
