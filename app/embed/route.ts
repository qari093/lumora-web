import { NextResponse } from "next/server";

export function GET(req: Request) {
  const url = new URL(req.url);
  const origin = url.origin;
  const js = `(function(){
    function originOf(ref){
      try{ if(!ref) return null; var u=new URL(ref); return u.origin || (u.protocol+"//"+u.host); }catch(e){ return null; }
    }
    var s = document.currentScript;
    var owner = (s && (s.getAttribute("data-owner")||s.getAttribute("data-ownerid"))) || "OWNER_A";
    var pub = originOf(document.referrer); // may be null if first-party include
    var root = document.createElement("div");
    root.style.all = "initial";
    root.style.fontFamily = "system-ui, -apple-system, Segoe UI, Roboto";
    s && s.parentNode && s.parentNode.insertBefore(root, s);

    function el(tag, props, children){
      var e = document.createElement(tag);
      if (props) for (var k in props){ if (k==="style") Object.assign(e.style, props.style); else e[k]=props[k]; }
      (children||[]).forEach(function(c){ if (typeof c==="string") e.appendChild(document.createTextNode(c)); else e.appendChild(c); });
      return e;
    }

    function renderNoFill(reason, meta){
      root.innerHTML = "";
      var box = el("div", {style:{border:"1px solid #e5e7eb", borderRadius:"8px", padding:"10px", maxWidth:"360px", background:"#fff"}} , [
        el("div", {style:{fontWeight:"600", marginBottom:"4px"}}, ["No ad right now"]),
        el("div", {style:{color:"#6b7280"}}, [reason || "NO_FILL"])
      ]);
      root.appendChild(box);
    }

    function trackJSON(ad, ev){
      try {
        navigator.sendBeacon(origin + "/api/ads/track", JSON.stringify({ adId: ad.id, ownerId: ad.ownerId, event: ev, pub: pub }));
      } catch(e) {
        fetch(origin + "/api/ads/track", {method:"POST", headers:{ "content-type":"application/json" }, body: JSON.stringify({ adId: ad.id, ownerId: ad.ownerId, event: ev, pub: pub })});
      }
    }
    function trackPixel(ad){
      var img = new Image(1,1);
      img.decoding = "async";
      img.referrerPolicy = "no-referrer-when-downgrade";
      var u = origin + "/p.gif?adId=" + encodeURIComponent(ad.id) + "&ownerId=" + encodeURIComponent(ad.ownerId);
      if (pub) u += "&pub=" + encodeURIComponent(pub);
      img.src = u;
    }

    function renderAd(ad){
      root.innerHTML = "";
      var box = el("div", {style:{border:"1px solid #e5e7eb", borderRadius:"12px", padding:"12px", maxWidth:"360px", background:"#fff"}});
      var badge = el("div", {style:{fontSize:"11px", color:"#64748b", marginBottom:"8px"}}, ["Sponsored"]);
      var img = el("img", {src: ad.mediaUrl, alt: ad.title, style:{width:"100%", height:"auto", borderRadius:"8px", cursor:"pointer"}});
      var title = el("div", {style:{marginTop:"8px", fontWeight:"600"}}, [ad.title]);
      var btn = el("button", {style:{marginTop:"10px", border:"1px solid #93c5fd", background:"#eef2ff", padding:"8px 10px", borderRadius:"8px", cursor:"pointer", fontWeight:"600"}}, [ad.cta || "Learn more"]);
      function go(){
        var u = origin + "/r?adId=" + encodeURIComponent(ad.id) + "&ownerId=" + encodeURIComponent(ad.ownerId);
        if (pub) u += "&pub=" + encodeURIComponent(pub);
        window.open(u, "_blank", "noopener,noreferrer");
      }
      img.addEventListener("click", go); btn.addEventListener("click", go);
      box.appendChild(badge); box.appendChild(img); box.appendChild(title); box.appendChild(btn);
      root.appendChild(box);
      trackJSON(ad, "impression"); trackPixel(ad);
    }

    var qs = new URLSearchParams({ ownerId: owner });
    if (pub) qs.set("pub", pub);
    if (window.LUMORA_GEO && typeof LUMORA_GEO.lat==="number" && typeof LUMORA_GEO.lon==="number"){
      qs.set("lat", String(LUMORA_GEO.lat)); qs.set("lon", String(LUMORA_GEO.lon));
    }

    fetch(origin + "/api/ads/serve?" + qs.toString(), { mode:"cors", cache:"no-store" })
      .then(function(r){ return r.json(); })
      .then(function(j){ if (j && j.ad) renderAd(j.ad); else renderNoFill(j && j.reason, j && j.meta); })
      .catch(function(){ renderNoFill("NETWORK_ERROR"); });
  })();`;

  return new NextResponse(js, {
    status: 200,
    headers: {
      "content-type": "application/javascript; charset=utf-8",
      "cache-control": "public, max-age=60",
      "access-control-allow-origin": "*",
    },
  });
}

export const runtime = "edge";
