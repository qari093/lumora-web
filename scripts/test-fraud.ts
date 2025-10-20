import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const BASE = "http://127.0.0.1:3000";

async function getJSON(path: string, headers: Record<string,string> = {}) {
  const r = await fetch(BASE + path, { headers });
  let d:any=null; try { d = await r.json(); } catch {}
  return { s: r.status, d };
}
async function postJSON(path: string, body:any, headers: Record<string,string> = {}) {
  const r = await fetch(BASE + path, { method: "POST", headers: { "content-type":"application/json", ...headers }, body: JSON.stringify(body) });
  let d:any=null; try { d = await r.json(); } catch {}
  return { s: r.status, d };
}

(async ()=>{
  // Use a distinct IP via header to simulate client
  const testIp = "203.0.113.50"; // TEST-NET-3 (RFC 5737)
  const H = { "x-test-ip": testIp };

  // 1) Burst serves to trip rate limit (limit 5/10s)
  for (let i=0;i<7;i++){
    const r = await getJSON("/api/ads/serve?ownerId=OWNER_A", H);
    console.log("serve#", i+1, "→", r.s, r.d);
  }

  // 2) Check fraud stats
  const f1 = await getJSON("/api/ads/fraud/stats?minutes=10");
  console.log("fraud-stats (after burst) →", f1.s, f1.d);

  // 3) Insert IP block and try again
  await prisma.ipBlock.upsert({
    where: { ip: testIp },
    update: { reason: "manual test block" },
    create: { ip: testIp, reason: "manual test block" },
  });
  const blocked = await getJSON("/api/ads/serve?ownerId=OWNER_A", H);
  console.log("serve after IP block →", blocked.s, blocked.d);

  // 4) Normal flow using localhost IP (should pass)
  const okServe = await getJSON("/api/ads/serve?ownerId=OWNER_A");
  const viewKey = okServe?.d?.viewKey;
  const e1 = await postJSON("/api/ads/event", { action:"view", viewKey }, {});
  const conv = await postJSON("/api/ads/convert", { viewKey, userId:"OWNER_A", eventType:"PURCHASE", rewardCents: 5 }, {});
  console.log("normal serve →", okServe.s, okServe.d);
  console.log("normal event →", e1.s, e1.d);
  console.log("normal convert →", conv.s, conv.d);

  const f2 = await getJSON("/api/ads/fraud/stats?minutes=10");
  console.log("fraud-stats (final) →", f2.s, f2.d);

  await prisma.();
})().catch(async (e)=>{
  console.error("Test error:", e?.message || e);
  await prisma.();
  process.exit(1);
});
