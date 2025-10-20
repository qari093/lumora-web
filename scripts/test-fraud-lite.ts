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
  const H = { "x-test-ip": "203.0.113.50" }; // test ip

  // Burst serves to trip rate limit 5/10s
  const burst = [];
  for (let i=0;i<7;i++) {
    // eslint-disable-next-line no-await-in-loop
    const r = await getJSON("/api/ads/serve?ownerId=OWNER_A", H);
    burst.push(r.s);
  }
  console.log("serve burst statuses:", burst);

  // Add IP block then try again
  await prisma.ipBlock.upsert({ where: { ip: H["x-test-ip"] }, update: { reason: "manual test block" }, create: { ip: H["x-test-ip"], reason: "manual test block" } });
  const blocked = await getJSON("/api/ads/serve?ownerId=OWNER_A", H);
  console.log("serve after block:", blocked.s, blocked.d);

  // Normal path (no test IP): serve → event → convert
  const okServe = await getJSON("/api/ads/serve?ownerId=OWNER_A");
  const viewKey = okServe?.d?.viewKey;
  const e1 = await postJSON("/api/ads/event", { action:"view", viewKey, userId:"OWNER_A", ms:500 });
  const conv = await postJSON("/api/ads/convert", { viewKey, userId:"OWNER_A", eventType:"PURCHASE", rewardCents: 5 });
  console.log("normal serve:", okServe.s);
  console.log("normal event:", e1.s);
  console.log("normal convert:", conv.s);

  // Fraud stats window
  const stats = await getJSON("/api/ads/fraud/stats?minutes=15");
  console.log("fraud stats:", stats.s, stats.d);

  await prisma.();
})().catch(async (e)=>{
  console.error("Test error:", e?.message || e);
  await prisma.();
  process.exit(1);
});
