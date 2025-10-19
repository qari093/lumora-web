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
  // Ensure minimal Campaign (if the schema enforces FK)
  const camp = await prisma.campaign?.upsert({
    where: { id: "TEST_CAMPAIGN_1" } as any,
    update: {},
    create: {
      id: "TEST_CAMPAIGN_1",
      ownerId: "OWNER_A",
      name: "Test Campaign",
      status: "ACTIVE",
      objective: "CONVERSIONS",
      // These fields are guessed to be nullable or defaulted; Prisma will error if they truly do not exist.
    } as any,
  } as any).catch(()=>null);

  // Ensure minimal AdCreative (if FK exists)
  const creative = await prisma.adCreative?.upsert({
    where: { id: "TEST_CREATIVE_1" } as any,
    update: {},
    create: {
      id: "TEST_CREATIVE_1",
      campaignId: "TEST_CAMPAIGN_1",
      format: "VIDEO",
      mediaUrl: "https://example.com/test.mp4",
    } as any,
  } as any).catch(()=>null);

  // Seed required CpvView with costCents
  const viewKey = `view-${Date.now()}-${Math.floor(Math.random()*100000)}`;
  const now = new Date();
  const view = await prisma.cpvView.create({
    data: {
      idempotencyKey: viewKey,
      campaignId: "TEST_CAMPAIGN_1",
      creativeId: "TEST_CREATIVE_1",
      // required according to your error:
      costCents: 5,
      // common optional fields—if they aren’t in your schema, Prisma will ignore TS but may error at runtime.
      // So only include clearly known ones; createdAt/updatedAt usually default in schema.
      // userId can be optional, so we skip unless needed.
    } as any,
  });
  console.log("✅ Seeded CpvView:", viewKey);

  const before = await getBal();
  console.log("balance_before =", before);

  // Perform conversion
  const payload = {
    viewKey,
    userId: "OWNER_A",
    eventType: "purchase",
    rewardCents: 25,
  };
  const r1 = await postJSON(HIT, payload);
  console.log("→ POST", HIT, "→", r1.status, r1.data);
  if (!(r1.data && r1.data.ok === true)) {
    console.error("❌ Conversion did not succeed. If error=VIEW_NOT_FOUND or FK issue, we must align seed with your exact schema.");
    process.exit(4);
  }

  const after = await getBal();
  console.log("balance_after =", after);

  // Idempotency check
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
