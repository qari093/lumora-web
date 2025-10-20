import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const BASE = "http://127.0.0.1:3000";

async function getJSON(p: string) {
  const r = await fetch(BASE + p);
  let d: any = null; try { d = await r.json(); } catch {}
  return { s: r.status, d };
}
async function postJSON(p: string, b: any) {
  const r = await fetch(BASE + p, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(b),
  });
  let d: any = null; try { d = await r.json(); } catch {}
  return { s: r.status, d };
}
async function bal() {
  const w = await prisma.wallet.findUnique({
    where: { ownerId_currency: { ownerId: "OWNER_A", currency: "EUR" } },
  });
  return w?.balanceCents ?? null;
}

(async () => {
  const before = await bal();

  // Serve to get a viewKey (also seeds CpvView with costCents)
  const serve = await getJSON("/api/ads/serve?ownerId=OWNER_A");
  console.log("GET /api/ads/serve →", serve.s, serve.d);
  if (!(serve.d && serve.d.ok && serve.d.viewKey)) throw new Error("serve failed");
  const viewKey = String(serve.d.viewKey);

  // Record interactions
  for (const e of [
    { action: "view",  viewKey, userId: "OWNER_A", ms: 1200 },
    { action: "hover", viewKey, userId: "OWNER_A", ms: 800, mood: "curious" },
    { action: "click", viewKey, userId: "OWNER_A" },
  ]) {
    const r = await postJSON("/api/ads/event", e);
    console.log("POST /api/ads/event →", r.s, r.d);
    if (!r.d?.ok) throw new Error("event record failed");
  }

  // Convert (credit once)
  const conv = await postJSON("/api/ads/convert", { viewKey, userId: "OWNER_A", eventType: "PURCHASE", rewardCents: 25 });
  console.log("POST /api/ads/convert →", conv.s, conv.d);
  if (!conv.d?.ok) throw new Error("conversion failed");

  // Stats (last 60m)
  const stats = await getJSON("/api/ads/event/stats?minutes=60");
  console.log("GET /api/ads/event/stats →", stats.s, stats.d);
  if (!stats.d?.ok) throw new Error("stats failed");

  const after = await bal();
  console.log("Balance before/after:", before, "→", after);

  await prisma.$disconnect();
})().catch(async (e) => {
  console.error("Test error:", e?.message || e);
  await prisma.$disconnect();
  process.exit(1);
});
