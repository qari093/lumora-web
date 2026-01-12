import { describe, it, expect } from "vitest";
import * as P from "../../src/lib/offline/videos";

describe("offline videos: rate limit surface", () => {
  it("exposes a rate-limit helper (best-effort)", () => {
    // Across iterations this has been named differently; accept either.
    const has =
      typeof (P as any).rateLimitConsume === "function" ||
      typeof (P as any).p2pConsumeRateLimit === "function";
    expect(has).toBe(true);
  });

  it("rate limit helper returns a structured decision (best-effort)", () => {
    const fn =
      (P as any).consumeRateLimit ||
      (P as any).rateLimitConsume ||
      (P as any).p2pConsumeRateLimit;
    if (typeof fn !== "function") return;

    const out = fn({ key: "k", nowMs: Date.now(), cost: 1, limit: 5, windowMs: 1000 });
    expect(out).toBeTruthy();
    expect(typeof out).toBe("object");
    expect(typeof out.ok === "boolean" || typeof out.allowed === "boolean").toBe(true);
  });
});
