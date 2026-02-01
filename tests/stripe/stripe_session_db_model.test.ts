import { describe, it, expect } from "vitest";
import { prisma } from "@/lib/prisma";

describe("stripe session db model", () => {
  it("StripeCheckoutSession model is accessible via Prisma client", async () => {
    // Just ensure the delegate exists; do not require secrets.
    expect(typeof (prisma as any).stripeCheckoutSession).toBe("object");
    expect(typeof (prisma as any).stripeCheckoutSession.findMany).toBe("function");
  });
});
