import React from "react";

export default async function AdsPlacementPage({ params }:{ params:{ slot:string } }){
  const { slot } = params;
  const r = await fetch(\`http://127.0.0.1:3010/api/ads/request?placement=\${slot}&lang=en\`, { cache:"no-store" }).then(r=>r.json()).catch(()=>({}));
  const ad = r?.ad;
  return (
    <main style={{padding:16,color:"#e5e7eb",background:"#0a0a0a",minHeight:"100vh"}}>
      <h1 style={{fontWeight:900,fontSize:22,marginBottom:12}}>Placement: {slot}</h1>
      {!ad && <div style={{opacity:.7}}>No ad available (cap or none)</div>}
      {ad && (
        <div style={{background:"#111214",border:"1px solid #26272b", borderRadius:10, padding:12, maxWidth:540}}>
          <div style={{display:"flex", gap:12}}>
            <div style={{width:80, height:80, borderRadius:8, background:"#0b0b0f", border:"1px solid #26272b"}} />
            <div>
              <div style={{fontWeight:800}}>{ad.title}</div>
              <div style={{opacity:.8, fontSize:12}}>{ad.line}</div>
              <div style={{marginTop:8, display:"flex", gap:8}}>
                <a href="#" onClick={async(e)=>{e.preventDefault(); await fetch("/api/ads/track",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({impressionId:r.impressionId,event:"click"})}); alert("Clicked");}} style={{background:"#22c55e",color:"#fff",padding:"6px 10px",borderRadius:8}}>Click</a>
                <a href="#" onClick={async(e)=>{e.preventDefault(); await fetch("/api/ads/track",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({impressionId:r.impressionId,event:"reward"})}); alert("Rewarded");}} style={{background:"#4f46e5",color:"#fff",padding:"6px 10px",borderRadius:8}}>Reward</a>
                <a href="#" onClick={async(e)=>{e.preventDefault(); await fetch("/api/ads/track",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({impressionId:r.impressionId,event:"skip"})}); alert("Skipped");}} style={{background:"#3f3f46",color:"#fff",padding:"6px 10px",borderRadius:8}}>Skip</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
