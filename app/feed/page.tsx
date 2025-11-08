"use client";
import React from "react";
type V = { id:string; url:string; title:string };

export default function FeedPage(){
  const [list,setList]=React.useState<V[]>([]);
  const [i,setI]=React.useState(0);
  const cur=list[i];

  React.useEffect(()=>{
    fetch("/api/feed").then(r=>r.json()).then(setList).catch(()=>setList([]));
    navigator.serviceWorker?.controller?.postMessage("prefetch-feed");
  },[]);

  const next=()=> setI(n=> Math.min(n+1, Math.max(0,(list.length-1))));
  const prev=()=> setI(n=> Math.max(n-1, 0));

  return (
    <main style={{padding:16,fontFamily:"system-ui,Segoe UI,Arial"}}>
      <h1 style={{margin:"6px 0 10px"}}>Feed (offline-capable)</h1>
      <p style={{margin:"0 0 12px",opacity:.7}}>
        Videos pre-cached on Wi-Fi; playable offline. Ads render; Buy queues orders offline.
      </p>

      {cur? (
        <div style={{display:"grid",gap:8,maxWidth:860}}>
          <video key={cur.id} src={cur.url} controls playsInline preload="metadata"
                 style={{width:"100%",borderRadius:12,background:"#000"}}/>
          <div style={{display:"flex",gap:8}}>
            <button onClick={prev} disabled={i===0}>Prev</button>
            <button onClick={next} disabled={i===list.length-1}>Next</button>
          </div>
          <div style={{marginTop:8,padding:10,borderRadius:12,background:"rgba(255,255,255,.6)"}}>
            <b>Sponsored</b>
            <div id="feed-ad" style={{marginTop:8}} />
            <button id="feed-buy" style={{marginTop:8,padding:"8px 12px",borderRadius:10,border:0,fontWeight:800}}>Buy</button>
            <div id="feed-status" style={{fontSize:12,opacity:.8,marginTop:6}} />
          </div>
        </div>
      ): <div>Loading…</div>}

      <script dangerouslySetInnerHTML={{__html:
        `(async function(){
          try {
            const ads = await fetch("/api/ads?slot=feed").then(r=>r.json()).catch(()=>[]);
            const ad = ads[0] || {title:"Demo Ad", cta:"Buy now", img:"/icon-192.png", price:9.99, id:"demo"};
            document.getElementById("feed-ad").innerHTML =
              "<div style=\"display:grid;grid-template-columns:52px 1fr auto;gap:10px;align-items:center\">"+
              "<img src=\""+ad.img+"\" width=\"52\" height=\"52\" style=\"border-radius:10\"/>"+
              "<div><div style=\"font-weight:800\">"+ad.title+"</div><div style=\"opacity:.7;font-size:12\">€"+(ad.price||0).toFixed(2)+"</div></div>"+
              "<div>"+ad.cta+"</div></div>";
            document.getElementById("feed-buy").onclick = async () => {
              const res = await fetch("/api/orders",{ method:"POST",
                headers:{"Content-Type":"application/json","Idempotency-Key":crypto.randomUUID()},
                body: JSON.stringify({ adId: ad.id, qty:1, price: ad.price||0 }) }).catch(()=> new Response(null,{status:0}));
              const el = document.getElementById("feed-status");
              if (res.status===201) el.textContent="✅ Ordered online";
              else if (res.status===202) el.textContent="⏳ Saved offline — will sync";
              else el.textContent="⚠️ Failed";
              setTimeout(()=>{el.textContent="";},1800);
            };
          } catch {}
        })();`
      }} />
    </main>
  );
}
