import { PrismaClient } from "@prisma/client";
import fs from "fs";

const prisma = new PrismaClient();
const BASE = "http://127.0.0.1:3000";

// Read the discovered endpoint path from an env var (set by bash)
const HIT = process.env.HIT!;
if (!HIT || !HIT.startsWith("/api/")) {
  console.error("No valid HIT endpoint found in env.");
  process.exit(3);
}

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

  // Rich payload covering common schema variants (extra keys are harmless in most validators)
  const payload: any = {
    ownerId: "OWNER_A",
    campaignId: "TEST_CAMPAIGN_1",
    adId: "TEST_AD_1",
    userId: "TEST_USER_1",
    idempotencyKey: idemp,
    rewardCents: 25,
    eurCents: 25,             // alt key some schemas use
    amountCents: 25,          // alt
    reward: { cents: 25 },    // alt
    meta: { source: "test", note: "mock conversion" },
  };

  console.log("🔎 Reading OWNER_A/EUR balance (before) ...");
  const before = await getBalance();
  console.log("balanceCents_before =", before);

  const r1 = await postJSON(HIT, payload);
  console.log(`→ POST ${HIT} → HTTP ${r1.status}`, r1.data);

  if (!r1.data || r1.data.ok !== true) {
    console.error("❌ Endpoint did not return ok:true. If it says INVALID_INPUT, inspect your schema.");
    process.exit(4);
  }

  const after = await getBalance();
  console.log("balanceCents_after =", after);

  console.log("🛡  Re-sending same conversion (idempotency should prevent double-credit) ...");
  const r2 = await postJSON(HIT, payload); // same idempotencyKey
  console.log(`→ retry ${HIT} → HTTP ${r2.status}`, r2.data);

  const finalBal = await getBalance();
  console.log("balanceCents_final =", finalBal);

  await prisma.$disconnect();
})().catch(async (e) => {
  console.error("Test error:", e?.message || e);
  await prisma.$disconnect();
  process.exit(1);
});
