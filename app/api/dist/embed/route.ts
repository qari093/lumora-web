import { NextResponse } from "next/server";

/**
 * Usage (publisher site):
 * <script src="/api/dist/embed" data-owner="OWNER_A"></script>
 * Renders a minimal floating button and wires to existing serve/event/convert endpoints.
 */
export async function GET() {
  const js = `
(function(){
  try{
    var owner = (document.currentScript && document.currentScript.dataset.owner) || "OWNER_A";
    var base  = "";
    function post(p, body){ return fetch(base+p,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(body)}).then(r=>r.json()).catch(()=>null); }
    function get (p){ return fetch(base+p).then(r=>r.json()).catch(()=>null); }

    // create minimal button
    var btn = document.createElement("button");
    btn.textContent = "Try Offer";
    btn.style.cssText = "position:fixed;right:16px;bottom:16px;padding:10px 14px;border-radius:10px;border:1px solid #ddd;background:#fff;z-index:999999;cursor:pointer;box-shadow:0 2px 10px rgba(0,0,0,.1)";
    document.body.appendChild(btn);

    var viewKey = null;
    get("/api/ads/serve?ownerId="+encodeURIComponent(owner)).then(function(s){
      if (s && s.viewKey){ viewKey = s.viewKey; post("/api/ads/event",{ action:"view", viewKey:viewKey, userId: owner, ms: 500 }); }
    });

    btn.addEventListener("mouseover", function(){ if(viewKey) post("/api/ads/event",{ action:"hover", viewKey:viewKey, userId: owner, ms: 300, mood:"curious" }); });
    btn.addEventListener("click", function(){
      if(viewKey) post("/api/ads/event",{ action:"click", viewKey:viewKey, userId: owner });
      // Optional conversion demo after click (publisher could call manually too)
      setTimeout(function(){ if(viewKey) post("/api/ads/convert",{ viewKey:viewKey, userId: owner, eventType:"PURCHASE", rewardCents: 5 }); }, 400);
    });

    // Expose a tiny API
    window.LumoraEmbed = {
      version: "0.1",
      convert: function(cents){ if(viewKey) return post("/api/ads/convert",{ viewKey:viewKey, userId: owner, eventType:"PURCHASE", rewardCents: cents||0 }); }
    };
  }catch(e){}
})();
`.trim();

  return new NextResponse(js, {
    status: 200,
    headers: { "content-type": "application/javascript; charset=utf-8", "cache-control": "public, max-age=300" },
  });
}
