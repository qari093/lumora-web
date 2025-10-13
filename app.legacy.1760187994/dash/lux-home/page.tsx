export default function Page(){
  return (
    <div style={{minHeight:"100dvh", background:"#0b0f12", color:"#fff", padding:16}}>
      <h1 style={{marginBottom:8}}>Lumora LUX — Mounted under /dash ✅</h1>
      <p style={{opacity:.85}}>This proves routing is fine under an existing active segment.</p>
      <div style={{marginTop:16, display:"flex", gap:10}}>
        <a href="/creator" style={{padding:"10px 14px", borderRadius:12, border:"1px solid rgba(255,255,255,.15)", background:"rgba(255,255,255,.08)", color:"#fff", textDecoration:"none", fontWeight:800}}>Creator</a>
        <a href="/creator/analytics" style={{padding:"10px 14px", borderRadius:12, border:"1px solid rgba(255,255,255,.15)", background:"rgba(255,255,255,.08)", color:"#fff", textDecoration:"none", fontWeight:800}}>Analytics</a>
      </div>
    </div>
  );
}
