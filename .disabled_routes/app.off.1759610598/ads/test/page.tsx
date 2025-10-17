import React from "react";

async function getAd(slot:string){
  const r = await fetch(\`http://127.0.0.1:3010/api/ads/request?placement=\${slot}&lang=en\`, { cache:"no-store" });
  return r.json();
}

export default async function AdsTestPage(){
  const infeed = await getAd("videos_infeed");
  const rewarded = await getAd("rewarded_wallet");
  const overlay = await getAd("game_overlay");
  async function AdBlock({res}:{res:any}){
    const ad = res?.ad;
    if(!ad) return <div style={{opacity:.6}}>No ad (cap/reason: {res?.reason||"none"})</div>;
    return (
      <div style={{background:"#111214",border:"1px solid #26272b",borderRadius:10,padding:12}}>
        <div style={{fontWeight:800}}>{ad.title}</div>
        <div style={{opacity:.8, fontSize:12}}>{ad.line}</div>
        <div style={{marginTop:8, display:"flex", gap:8}}>
          <form action="/api/ads/track" method="post">
            <input type="hidden" name="payload" value={JSON.stringify({impressionId:res.impressionId, event:"click"})} />
          </form>
          <a href="#" onClick={async(e)=>{e.preventDefault(); await fetch("/api/ads/track",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({impressionId:res.impressionId,event:"click"})}); alert("Tracked click");}} style={{background:"#22c55e",color:"#fff",padding:"6px 10px",borderRadius:8}}>
            Click
          </a>
          <a href="#" onClick={async(e)=>{e.preventDefault(); await fetch("/api/ads/track",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({impressionId:res.impressionId,event:"reward"})}); alert("Tracked reward");}} style={{background:"#4f46e5",color:"#fff",padding:"6px 10px",borderRadius:8}}>
            Reward
          </a>
          <a href="#" onClick={async(e)=>{e.preventDefault(); await fetch("/api/ads/track",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({impressionId:res.impressionId,event:"skip"})}); alert("Tracked skip");}} style={{background:"#3f3f46",color:"#fff",padding:"6px 10px",borderRadius:8}}>
            Skip
          </a>
        </div>
      </div>
    );
  }
  return (
    <main style={{padding:16,color:"#e5e7eb",background:"#0a0a0a",minHeight:"100vh"}}>
      <h1 style={{fontWeight:900,fontSize:22,marginBottom:12}}>Ads Test</h1>
      <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:12}}>
        <div><div style={{opacity:.8, marginBottom:6}}>videos_infeed</div><AdBlock res={infeed}/></div>
        <div><div style={{opacity:.8, marginBottom:6}}>rewarded_wallet</div><AdBlock res={rewarded}/></div>
        <div><div style={{opacity:.8, marginBottom:6}}>game_overlay</div><AdBlock res={overlay}/></div>
      </div>
    </main>
  );
}
