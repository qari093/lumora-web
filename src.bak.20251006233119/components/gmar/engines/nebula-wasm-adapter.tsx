"use client";
import React from "react";
export default function NebulaWasmAdapter(){
  const canvasRef = React.useRef<HTMLCanvasElement|null>(null);
  const [status,setStatus] = React.useState<"idle"|"ready"|"missing">("idle");

  React.useEffect(()=>{
    if (typeof window === "undefined") return;
    const s = document.createElement("script");
    s.src = "/nebula/nebula.js"; // served from public/
    s.async = true;
    s.onload = async () => {
      try {
        // @ts-ignore
        const factory = window.createNebulaModule;
        if (!factory) { setStatus("missing"); return; }
        await factory({ canvas: canvasRef.current });
        setStatus("ready");
      } catch {
        setStatus("missing");
      }
    };
    s.onerror = () => setStatus("missing");
    document.head.appendChild(s);
    return () => { try{ document.head.removeChild(s); }catch{} };
  },[]);

  return (
    <div style={{padding:12,border:"1px solid #333",borderRadius:8}}>
      <div style={{marginBottom:8}}>Nebula WASM: <strong>{status}</strong></div>
      <canvas ref={canvasRef} width={320} height={180} style={{background:"#000",borderRadius:6,width:"100%",height:180}} />
    </div>
  );
}
