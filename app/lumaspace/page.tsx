import Link from "next/link";
import EmotionMirror from "../me/space/EmotionMirror";
import ZENPreview from "../me/space/ZENPreview";

export default function Page(){
  const card: React.CSSProperties = {
    border: "1px solid #ddd",
    borderRadius: 12,
    padding: "10px 12px",
    background: "rgba(255,255,255,.9)",
    textDecoration: "none",
    fontWeight: 800,
    display: "inline-block"
  };
  return (
    <main style={{padding:20}}>
      <h1 style={{fontWeight:900}}>LumaSpace</h1>
      <div style={{margin:"6px 0"}}>
        <a href={"/api/lumaspace/shadow/export?email="+encodeURIComponent("demo@lumora.local")} style={btnGhost}>Export CSV</a>
      </div>
      <EmotionMirror email="demo@lumora.local" />
      <ZENPreview email="demo@lumora.local" />
      <div style={{display:"flex", gap:12, flexWrap:"wrap", marginTop:12}}>
        <Link href="/lumaspace/shadow" style={card}>📝 Shadow Journal</Link>
        <Link href="/lumaspace/shadow/analytics" style={card}>📊 Shadow Analytics</Link>
        <Link href="/me/space" style={card}>⚡ Zen Preview</Link>
      </div>
    </main>
  );
}


const btnGhost: React.CSSProperties = { border:"1px solid #999", background:"transparent", color:"#111", borderRadius:8, padding:"8px 12px", fontWeight:900, cursor:"pointer", textDecoration:"none" };
