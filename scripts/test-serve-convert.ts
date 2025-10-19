import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const BASE = "http://127.0.0.1:3000";

async function getBal() {
  const w = await prisma.wallet.findUnique({
    where: { ownerId_currency: { ownerId: "OWNER_A", currency: "EUR" } },
  });
  return w?.balanceCents ?? null;
}
async function getJSON(path: string) {
  const r = await fetch(BASE + path);
  let data:any=null; try{ data = await r.json(); } catch {}
  return { status:r.status, data };
}
async function postJSON(path: string, body:any) {
  const r = await fetch(BASE + path, {
    method:"POST",
    headers:{ "content-type":"application/json" },
    body: JSON.stringify(body),
  });
  let data:any=null; try{ data = await r.json(); } catch {}
  return { status:r.status, data };
}

(async ()=>{
  const before = await getBal();
  console.log("balance_before =", before);

  // 1) Serve ad (should create CpvView and return viewKey)
  const serve = await getJSON("/api/ads/serve?ownerId=OWNER_A");
  console.log("GET /api/ads/serve →", serve.status, serve.data);
  if (!(serve.data && serve.data.ok && serve.data.viewKey)) {
    console.error("❌ Serve failed or missing viewKey.");
    process.exit(2);
  }

  // 2) Convert once using returned viewKey
  const payload = { viewKey: serve.data.viewKey, userId: "OWNER_A", eventType: "PURCHASE", rewardCents: 25 };
  const conv1 = await postJSON("/api/ads/convert", payload);
  console.log("POST /api/ads/convert →", conv1.status, conv1.data);

  // 3) Check balance increased by 25
  const after = await getBal();
  console.log("balance_after =", after);

  // 4) Re-try (idempotent)
  const conv2 = await postJSON("/api/ads/convert", payload);
  console.log("retry /api/ads/convert →", conv2.status, conv2.data);

  const finalBal = await getBal();
  console.log("balance_final =", finalBal);

  await prisma.$disconnect();
})().catch(async (e)=>{
  console.error("Test error:", e?.message || e);
  await prisma.$disconnect();
  process.exit(1);
});
