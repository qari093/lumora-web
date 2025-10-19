import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const BASE = "http://127.0.0.1:3000";

async function get(p){ const r=await fetch(BASE+p); let d=null; try{d=await r.json();}catch{} return {s:r.status,d}; }
async function post(p,b){ const r=await fetch(BASE+p,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(b)}); let d=null; try{d=await r.json();}catch{} return {s:r.status,d}; }

try {
  // seed a little activity
  const serve = await get("/api/ads/serve?ownerId=OWNER_A");
  const vk = serve?.d?.viewKey;
  await post("/api/ads/event",{ action:"view",  viewKey:vk, userId:"OWNER_A", ms:700 });
  await post("/api/ads/event",{ action:"hover", viewKey:vk, userId:"OWNER_A", ms:300 });
  await post("/api/ads/event",{ action:"click", viewKey:vk, userId:"OWNER_A" });
  await post("/api/ads/convert",{ viewKey:vk, userId:"OWNER_A", eventType:"PURCHASE", rewardCents:15 });

  // summary (last 60m)
  const sum = await get("/api/ads/analytics/summary?minutes=60");
  console.log("SUMMARY:", sum.s, sum.d);

  // timeseries (30 points by minute)
  const ts = await get("/api/ads/analytics/timeseries?bucket=minute&points=10");
  console.log("TIMESERIES:", ts.s, ts.d?.series?.slice(-3)); // show last 3 buckets

  // rollup last 2 days
  const roll = await fetch(BASE+"/api/ads/analytics/rollup/run?days=2",{method:"POST"});
  const rollD = await roll.json().catch(()=>null);
  console.log("ROLLUP:", roll.status, rollD);

  // peek one daily row
  const anyRow = await prisma.adMetricDaily.findFirst({ orderBy: { day: "desc" } });
  console.log("DAILY ROW:", anyRow);

} catch(e) {
  console.error("Test error:", e?.message || e);
  process.exit(1);
} finally {
  await prisma.$disconnect();
}
