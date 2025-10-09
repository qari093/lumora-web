import React from "react";

export default async function AdsAdmin(){
  const r = await fetch("http://127.0.0.1:3010/api/ads/report", { cache:"no-store" }).then(r=>r.json()).catch(()=>({ok:false}));
  return (
    <main style={{padding:16,color:"#e5e7eb",background:"#0a0a0a",minHeight:"100vh"}}>
      <h1 style={{fontWeight:900,fontSize:22,marginBottom:12}}>Ads Admin</h1>
      {!r?.ok && <div style={{color:"#ef4444"}}>Failed to load report.</div>}
      {r?.ok && (
        <>
          <div style={{margin:"12px 0"}}>
            <div style={{opacity:.8, fontSize:12}}>Recent Impressions</div>
            <div style={{fontFamily:"ui-monospace,monospace", fontSize:12, background:"#0b0b0f", padding:8, borderRadius:8, border:"1px solid #26272b", maxHeight:260, overflow:"auto"}}>
              <pre style={{margin:0}}>{JSON.stringify(r.impressions, null, 2)}</pre>
            </div>
          </div>
          <div style={{margin:"12px 0"}}>
            <div style={{opacity:.8, fontSize:12}}>Totals by Ad</div>
            <div style={{fontFamily:"ui-monospace,monospace", fontSize:12, background:"#0b0b0f", padding:8, borderRadius:8, border:"1px solid #26272b", maxHeight:260, overflow:"auto"}}>
              <pre style={{margin:0}}>{JSON.stringify(r.totals, null, 2)}</pre>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
