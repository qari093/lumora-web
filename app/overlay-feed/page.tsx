"use client";
import React from "react";
type V={id:string;url:string;title:string};

export default function OverlayFeed(){
  const [list,setList]=React.useState<V[]>([]);
  const [i,setI]=React.useState(0);
  const cur=list[i];

  React.useEffect(()=>{
    fetch("/api/feed").then(r=>r.json()).then((d:any)=>Array.isArray(d)&&setList(d)).catch(()=>{});
    navigator.serviceWorker?.controller?.postMessage("prefetch-feed");
  },[]);

  const next=()=>setI(n=>Math.min(n+1, Math.max(0,(list.length-1))));
  const prev=()=>setI(n=>Math.max(n-1,0));

  return (
    <main style={{padding:16,display:"grid",placeItems:"center",minHeight:"100dvh"}}>
      <div style={{width:"min(92vw,860px)",background:"rgba(255,255,255,.6)",backdropFilter:"blur(20px)",borderRadius:16,padding:14,boxShadow:"0 10px 30px rgba(0,0,0,.15)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <b style={{fontSize:16,letterSpacing:.2}}>Quick Watch</b>
          <a href="/overlay-demo" style={{fontSize:13,opacity:.75,textDecoration:"underline"}}>back</a>
        </div>
        {cur? (
          <div>
            <video key={cur.id} src={cur.url} controls playsInline preload="metadata" style={{width:"100%",borderRadius:12,background:"#000"}}/>
            <div style={{display:"flex",gap:8,marginTop:8}}>
              <button onClick={prev} disabled={i===0}>Prev</button>
              <button onClick={next} disabled={i===list.length-1}>Next</button>
              <a href="/feed" style={{marginLeft:"auto",fontSize:12,opacity:.8,textDecoration:"underline"}}>open full feed</a>
            </div>
            <div style={{marginTop:10,padding:10,borderRadius:12,background:"rgba(255,255,255,.75)"}}>
              <b>Sponsored</b>
              <div id="qf-ad" style={{marginTop:8}}/>
              <button id="qf-buy" style={{marginTop:8,padding:"8px 12px",borderRadius:10,border:0,fontWeight:800}}>Buy</button>
              <div id="qf-status" style={{fontSize:12,opacity:.8,marginTop:6}}/>
            </div>
          </div>
        ): <div style={{opacity:.7}}>Loading…</div>}
      </div>
      <script dangerouslySetInnerHTML={{__html:
        `(async function(){
          try{
            const ads = await fetch("/api/ads?slot=feed").then(r=>r.json()).catch(()=>[]);
            const ad = ads[0] || {title:"Demo Ad", cta:"Buy now", img:"/icon-192.png", price:9.99, id:"demo"};
            document.getElementById("qf-ad").innerHTML =
              "<div style=\"display:grid;grid-template-columns:52px 1fr auto;gap:10px;align-items:center\">"+
              "<img src=\""+ad.img+"\" width=\"52\" height=\"52\" style=\"border-radius:10\"/>"+
              "<div><div style=\"font-weight:800\">"+ad.title+"</div><div style=\"opacity:.7;font-size:12\">€"+(ad.price||0).toFixed(2)+"</div></div>"+
              "<div>"+ad.cta+"</div></div>";
            document.getElementById("qf-buy").onclick = async () => {
              const res = await fetch("/api/orders",{ method:"POST",
                headers:{"Content-Type":"application/json","Idempotency-Key":crypto.randomUUID()},
                body: JSON.stringify({ adId: ad.id, qty:1, price: ad.price||0 }) }).catch(()=> new Response(null,{status:0}));
              const el = document.getElementById("qf-status");
              el.textContent = (res.status===201) ? "✅ Ordered online" : (res.status===202) ? "⏳ Saved offline — will sync" : "⚠️ Failed";
              setTimeout(()=>{el.textContent="";},1800);
            };
          }catch(e){}
        })();`
      }} />
    </main>
  );
}
