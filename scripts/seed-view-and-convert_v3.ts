import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const BASE = "http://127.0.0.1:3000";
const HIT = "/api/ads/convert";

async function postJSON(path: string, body: any) {
  try {
    const r = await fetch(BASE + path, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    let data: any = null;
    try { data = await r.json(); } catch {}
    return { status: r.status, data };
  } catch (e:any) {
    return { status: 0, data: { ok:false, error: String(e?.message || e) } };
  }
}

async function getBal() {
  const w = await prisma.wallet.findUnique({
    where: { ownerId_currency: { ownerId: "OWNER_A", currency: "EUR" } },
  });
  return w?.balanceCents ?? null;
}

(async () => {
  // 1) Ensure Campaign (matches your model Campaign)
  await prisma.campaign.upsert({
    where: { id: "TEST_CAMPAIGN_1" },
    update: {},
    create: {
      id: "TEST_CAMPAIGN_1",
      name: "Test Campaign",
      dailyBudgetCents: 10_000,         // €100.00
      targetingRadiusMiles: 31,         // ~50 km
      status: "active",                 // default anyway, explicit for clarity
    },
  });

  // 2) Seed CpvView (costCents required)
  const viewKey = `view-${Date.now()}-${Math.floor(Math.random()*100000)}`;
  await prisma.cpvView.create({
    data: {
      idempotencyKey: viewKey,
      campaignId: "TEST_CAMPAIGN_1",
      costCents: 5, // minimal CPV cost
    },
  });
  console.log("✅ Seeded CpvView:", viewKey);

  // Wallet before
  const before = await getBal();
  console.log("balance_before =", before);

  // 3) Convert (route expects: viewKey, eventType, optional userId, rewardCents)
  const payload = {
    viewKey,
    eventType: "PURCHASE",
    userId: "OWNER_A",
    rewardCents: 25,
  };
  const r1 = await postJSON(HIT, payload);
  console.log("→ POST", HIT, "→", r1.status, r1.data);
  if (!(r1.data && r1.data.ok === true)) {
    console.error("❌ Conversion failed. Error:", r1.data);
    process.exit(4);
  }

  const after = await getBal();
  console.log("balance_after =", after);

  // 4) Idempotency (same viewKey should not re-credit)
  const r2 = await postJSON(HIT, payload);
  console.log("→ retry", HIT, "→", r2.status, r2.data);

  const finalBal = await getBal();
  console.log("balance_final =", finalBal);

  await prisma.$disconnect();
})().catch(async (e) => {
  console.error("Test error:", e?.message || e);
  await prisma.$disconnect();
  process.exit(1);
});
