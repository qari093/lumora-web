import React, { useRef, useEffect } from "react";
/** Canvas engine scaffold; engine label is rendered OUTSIDE the canvas */
export default function EngineCore({
  width = 900,
  height = 520,
  engineName = "Unknown Engine",
}: { width?: number; height?: number; engineName?: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    c.width = width; c.height = height;
    const ctx = c.getContext("2d")!;
    const g = ctx.createLinearGradient(0,0,width,height);
    g.addColorStop(0, "#0b1020"); g.addColorStop(1, "#131a33");
    ctx.fillStyle = g; ctx.fillRect(0,0,width,height);
    ctx.fillStyle = "rgba(255,255,255,.25)";
    ctx.font = "bold 14px ui-sans-serif, system-ui, -apple-system";
    ctx.fillText("Canvas ready...", 16, 24);
  }, [width, height]);
  return (
    <div style={{ display:"grid", gap:10, fontFamily:"ui-sans-serif, system-ui, -apple-system" }}>
      <div style={{
        fontWeight:900, fontSize:18,
        background:"linear-gradient(90deg,#ffd700,#ffb100)", color:"#2b2100",
        padding:"8px 12px", borderRadius:10, boxShadow:"0 8px 18px rgba(0,0,0,.25)"
      }}>
        {engineName} Engine
      </div>
      <canvas ref={ref} style={{ borderRadius:12, outline:"1px solid rgba(255,255,255,.15)" }} />
    </div>
  );
}
