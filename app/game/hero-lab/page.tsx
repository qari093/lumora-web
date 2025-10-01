import HeaderLogo from "./HeaderLogo";"use client";
import React from "react";
import GlbUpload from "@/components/rbn3d/GlbUpload";
import SampleBar from "@/components/rbn3d/SampleBar";
import HeroGallery from "@/components/game/hero/HeroGallery";

export default function HeroLabPage() {
  const [overrideUrl, setOverrideUrl] = React.useState<string | undefined>(undefined);
  const [autoRotate, setAutoRotate] = React.useState<boolean>(true);
  const [speed, setSpeed] = React.useState<number>(1.2);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tgt = e.target as HTMLElement | null;
      if (tgt && (tgt.tagName === "INPUT" || tgt.tagName === "TEXTAREA" || tgt.isContentEditable)) return;

      if (e.key === "r" || e.key === "R") {
        setAutoRotate(v => !v);
      } else if (e.key === "+" || e.key === "=") {
        setSpeed(v => Math.min(5, +(v + 0.2).toFixed(1)));
      } else if (e.key === "-") {
        setSpeed(v => Math.max(0, +(v - 0.2).toFixed(1)));
      } else if (e.key === "0") {
        setSpeed(1.2);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#0f0f10" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 16px" }}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
  <img
    src="/lumora-logo.png"
    onError={(e)=>{(e.currentTarget as HTMLImageElement).src="/lumora-logo.svg";}}
    alt="Lumora"
    width={140}
    height={38}
    style={{display:"block"}}
  />
  <span style={{opacity:.85,fontWeight:600,fontSize:18}}>Hero Lab</span>
</div>
        <p style={{ color: "#cfcfcf", marginBottom: 12 }}>
          یہاں سے ہیرو ماڈلز سلیکٹ کریں — GLB URL/فائل دیں یا نیچے سے Sample لوڈ کریں۔
        </p>

        <div style={{
          background:"#111", border:"1px solid #262626", color:"#e5e5e5",
          padding:"8px 10px", borderRadius:8, marginBottom:10, fontSize:12
        }}>
          <b>Shortcuts:</b> R = auto-rotate toggle, +/– = speed, 0 = reset
        </div>

        <div style={{display:"flex", gap:12, alignItems:"center", flexWrap:"wrap", marginBottom:10}}>
          <label style={{color:"#fff", display:"flex", alignItems:"center", gap:8}}>
            <input type="checkbox" checked={autoRotate} onChange={(e)=>setAutoRotate(e.target.checked)} />
            Auto-rotate
          </label>
          <div style={{color:"#fff", display:"flex", alignItems:"center", gap:8}}>
            <span>Speed</span>
            <input type="range" min={0} max={5} step={0.1} value={speed} onChange={(e)=>setSpeed(parseFloat(e.target.value))} />
            <span style={{opacity:0.7}}>{speed.toFixed(1)}</span>
          </div>
        </div>

        <GlbUpload onChange={setOverrideUrl} />
        <SampleBar onPick={(u)=>setOverrideUrl(u||undefined)} />
        <HeroGallery overrideModelUrl={overrideUrl} autoRotate={autoRotate} autoRotateSpeed={speed} />
      </div>
    </div>
  );
}
