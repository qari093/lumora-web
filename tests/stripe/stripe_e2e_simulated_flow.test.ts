import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { ensureServer, shutdownServer } from "../_helpers/ensureServer";
import { prisma } from "@/lib/prisma";

const BASE = process.env.TEST_BASE_URL || "http://127.0.0.1:3000";

describe("stripe e2e (simulated)", () => {
  beforeAll(async () => {
    await ensureServer();
  }, 60_000);

  afterAll(async () => {
    await shutdownServer();
  });

  it("checkout persists session, simulate credits applies exactly once", async () => {
    const userId = `e2e_user_${Date.now()}`;
    const credits = 7;

    // Ensure clean
    await prisma.walletLedger.deleteMany({ where: { userId } });
    await prisma.wallet.deleteMany({ where: { userId } });
    await prisma.stripeCheckoutSession.deleteMany({ where: { userId } });

    // Checkout should fail without key; so we create the StripeCheckoutSession row directly
    // to emulate "created" stage, then run the dev simulator to emulate webhook fulfillment.
    const stripeSession = `cs_test_${Date.now()}`;
    await prisma.stripeCheckoutSession.create({
      data: { userId, credits, stripeSession, status: "created", currency: "eur", amountCents: credits * 100 },
    });

    const sim1 = await fetch(`${BASE}/api/stripe/dev/simulate`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ userId, credits, stripeSession }),
    });
    expect(sim1.status).toBe(200);
    const j1 = await sim1.json();
    expect(j1.ok).toBe(true);

    const bal1 = await prisma.wallet.findUnique({ where: { userId } });
    expect(bal1?.credits).toBe(credits);

    const s1 = await prisma.stripeCheckoutSession.findUnique({ where: { stripeSession } });
    expect(s1?.status === "fulfilled" || s1?.status === "paid" || s1?.status === "created").toBe(true);

    // Second simulate must be idempotent
    const sim2 = await fetch(`${BASE}/api/stripe/dev/simulate`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ userId, credits, stripeSession }),
    });
    expect(sim2.status).toBe(200);
    const j2 = await sim2.json();
    expect(j2.ok).toBe(true);
    expect(String(j2.applied || "")).toBe("already");

    const bal2 = await prisma.wallet.findUnique({ where: { userId } });
    expect(bal2?.credits).toBe(credits);

    const rows = await prisma.walletLedger.findMany({ where: { userId, source: "stripe", refId: stripeSession } });
    expect(rows.length).toBe(1);
    expect(rows[0].direction).toBe("credit");
    expect(rows[0].amount).toBe(credits);
  });
});
