"use client";
import { useState } from "react";
import HoloEmoji from "@/app/_client/holo/HoloEmoji";
import LightFlash from "@/app/_client/holo/LightFlash";

const EMOJIS = ["emo-joy","emo-calm","emo-lumen","emo-live","emo-link","emo-coin","emo-quantum","emo-echo"];
const ACTIONS = ["pulse","float","ripple","vibrate","rotate","bloom"] as const;
type Action = typeof ACTIONS[number];

export default function Page() {
  const [action, setAction] = useState<Action>("pulse");
  const [intensity, setIntensity] = useState(1);
  const [hue, setHue] = useState(0);
  const [light, setLight] = useState(0);

  return (
    <main style={{minHeight:"100dvh",display:"grid",placeItems:"center",padding:"24px"}}>
      <div style={{
        width:"min(1080px,96vw)",
        borderRadius:24,
        background:"rgba(255,255,255,.06)",
        border:"1px solid rgba(255,255,255,.14)",
        backdropFilter:"blur(18px) saturate(160%)",
        WebkitBackdropFilter:"blur(18px) saturate(160%)",
        boxShadow:"0 20px 60px rgba(0,0,0,.22)",
        padding:20
      }}>
        <h1 style={{textAlign:"center",margin:"0 0 8px"}}>Lumora — Holo Emoji Playground</h1>
        <p style={{textAlign:"center",opacity:.7,margin:"0 0 16px"}}>Actions for system + pic-to-emoji. Uses your <code>/sprite.svg</code>.</p>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:12,marginBottom:16}}>
          <label style={{display:"grid",gap:6}}>
            <span style={{fontSize:12,opacity:.7}}>Action</span>
            <select value={action} onChange={e=>setAction(e.target.value as Action)}
              style={{padding:"10px 12px",borderRadius:10,background:"rgba(0,0,0,.25)",border:"1px solid rgba(255,255,255,.18)",color:"#fff"}}>
              {ACTIONS.map(a=><option key={a} value={a}>{a}</option>)}
            </select>
          </label>

          <label style={{display:"grid",gap:6}}>
            <span style={{fontSize:12,opacity:.7}}>Intensity ({intensity.toFixed(2)})</span>
            <input type="range" min={0.5} max={2} step={0.01} value={intensity}
              onChange={e=>setIntensity(parseFloat(e.target.value))} />
          </label>

          <label style={{display:"grid",gap:6}}>
            <span style={{fontSize:12,opacity:.7}}>Hue shift ({Math.round(hue)}°)</span>
            <input type="range" min={0} max={360} step={1} value={hue}
              onChange={e=>setHue(parseFloat(e.target.value))} />
          </label>

          <button
            onClick={()=>{ setLight(1); setTimeout(()=>setLight(0), 1400); }}
            style={{
              alignSelf:"end", padding:"12px 14px", borderRadius:12,
              border:"1px solid rgba(255,255,255,.22)",
              background:"linear-gradient(180deg,rgba(255,255,255,.1),rgba(255,255,255,.02))",
              color:"#fff"
            }}>
            💡 Send /light flash
          </button>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(120px,1fr))",gap:12,justifyItems:"center"}}>
          {EMOJIS.map(id => (
            <div key={id} style={{display:"grid",placeItems:"center",gap:8,padding:"10px 6px"}}>
              <HoloEmoji id={id} action={action} intensity={intensity} hue={hue} />
              <div style={{fontSize:12,opacity:.85,fontWeight:600}}>{id}</div>
            </div>
          ))}
        </div>
      </div>

      <LightFlash show={light>0} />
      <style>{`@import "../_styles/holo.css";`}</style>
    </main>
  );
}
