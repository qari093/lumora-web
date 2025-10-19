import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const BASE = "http://127.0.0.1:3000";
const endpoints = [
  "/api/ads/convert",
  "/api/ads/conversion",
  "/api/ads/track-conversion",
  "/api/ads/record-conversion",
];

async function getBalance() {
  const w = await prisma.wallet.findUnique({
    where: { ownerId_currency: { ownerId: "OWNER_A", currency: "EUR" } },
  });
  return w?.balanceCents ?? null;
}

async function postJSON(path: string, body: any) {
  try {
    const res = await fetch(BASE + path, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    let data: any = null;
    try { data = await res.json(); } catch { /* ignore non-JSON */ }
    return { status: res.status, data };
  } catch (e:any) {
    return { status: 0, data: { ok:false, error: String(e?.message || e) } };
  }
}

(async () => {
  const idemp = `conv-${Date.now()}-${Math.floor(Math.random()*100000)}`;
  const payload = {
    ownerId: "OWNER_A",
    campaignId: "TEST_CAMPAIGN_1",
    adId: "TEST_AD_1",
    userId: "TEST_USER_1",
    idempotencyKey: idemp,
    rewardCents: 25,
    meta: { source: "test", note: "mock conversion" },
  };

  console.log("🔎 Reading OWNER_A/EUR balance (before) ...");
  const before = await getBalance();
  console.log("balanceCents_before =", before);

  // Try endpoints until one returns ok:true
  let hit: string | null = null;
  for (const p of endpoints) {
    const r = await postJSON(p, payload);
    console.log(`→ ${p} → HTTP ${r.status}`, r.data);
    if (r.data && r.data.ok === true) { hit = p; break; }
  }
  if (!hit) {
    console.error("❌ No conversion endpoint responded with ok:true. Confirm your route path (e.g., app/api/ads/<route>/route.ts).");
    process.exit(2);
  }
  console.log("✅ Success on", hit);

  // Check increment
  const after = await getBalance();
  console.log("balanceCents_after =", after);

  // Idempotency: resend same idempotencyKey
  console.log("🛡  Re-sending same conversion (idempotency should prevent double-credit) ...");
  const retry = await postJSON(hit, payload);
  console.log(`→ retry ${hit} → HTTP ${retry.status}`, retry.data);

  const finalBal = await getBalance();
  console.log("balanceCents_final =", finalBal);

  await prisma.$disconnect();
})().catch(async (e) => {
  console.error("Test error:", e?.message || e);
  await prisma.$disconnect();
  process.exit(1);
});
