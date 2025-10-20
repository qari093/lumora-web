const BASE = "http://127.0.0.1:3000";
async function get(p, h={}){const r=await fetch(BASE+p,{headers:h});let d=null;try{d=await r.json();}catch{} return {s:r.status,d};}
async function post(p,b,h={}){const r=await fetch(BASE+p,{method:"POST",headers:{ "content-type":"application/json",...h},body:JSON.stringify(b)});let d=null;try{d=await r.json();}catch{} return {s:r.status,d};}
(async()=>{
  const health = await get("/api/ads/health");
  console.log("health:", health.s, health.d);

  const serve = await get("/api/ads/serve?ownerId=OWNER_A", { "x-test-ip": "198.51.100.9" });
  console.log("serve:", serve.s, serve.d);
  const vk = serve?.d?.viewKey;

  const e1 = await post("/api/ads/event", { action:"view", viewKey: vk, userId:"OWNER_A", ms:250 }, { "x-test-ip": "198.51.100.9" });
  console.log("event:", e1.s, e1.d);

  const conv = await post("/api/ads/convert", { viewKey: vk, userId:"OWNER_A", eventType:"PURCHASE", rewardCents: 5 }, { "x-test-ip": "198.51.100.9" });
  console.log("convert:", conv.s, conv.d);

  const stats = await get("/api/ads/fraud/stats?minutes=15");
  console.log("fraud-stats:", stats.s, stats.d);
})().catch(e=>{ console.error("SMOKE ERROR:", e?.message||e); process.exit(1); });
