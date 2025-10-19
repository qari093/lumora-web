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
  // 1) Seed a CpvView the route expects
  const viewKey = `view-${Date.now()}-${Math.floor(Math.random()*100000)}`;

  // Try to create a minimal CpvView. If your schema requires extra fields, we set reasonable defaults.
  const now = new Date();
  let view: any;
  try {
    view = await prisma.cpvView.create({
      data: {
        idempotencyKey: viewKey,
        campaignId: "TEST_CAMPAIGN_1",   // if your schema has FKs, these should exist; otherwise simple strings are fine
        creativeId: "TEST_CREATIVE_1",
        // add best-guess optional fields that commonly exist; Prisma will ignore unknowns if not in schema
        // @ts-ignore
        userId: "TEST_USER_1",
        // @ts-ignore
        createdAt: now as any,
        // @ts-ignore
        updatedAt: now as any,
      } as any,
    });
  } catch (e:any) {
    console.error("❌ Failed to create CpvView. Schema likely needs extra fields or FK rows.", e?.message || e);
    throw e;
  }
  console.log("✅ Seeded CpvView with viewKey:", viewKey);

  const before = await getBal();
  console.log("balance_before =", before);

  // 2) First conversion — should credit once
  const payload = {
    viewKey,
    userId: "OWNER_A",
    eventType: "purchase",
    rewardCents: 25,
  };
  const r1 = await postJSON(HIT, payload);
  console.log("→ POST", HIT, "→", r1.status, r1.data);

  if (!(r1.data && r1.data.ok === true)) {
    console.error("❌ Conversion did not succeed. Check error above (e.g., VIEW_NOT_FOUND means CpvView schema differs).");
    process.exit(4);
  }

  const after = await getBal();
  console.log("balance_after =", after);

  // 3) Idempotency — same viewKey again should NOT credit again
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
