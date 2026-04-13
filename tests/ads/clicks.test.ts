import { describe, expect, it } from "vitest";
import { createAdClick } from "@/lib/ads/clicks";

describe("ad click tracking", () => {
  const now = 1_700_000_000_000;

  it("creates a valid click", () => {
    const out = createAdClick(
      {
        adId: "ad_1",
        campaignId: "camp_1",
        userId: "user_1",
        placement: "fyp_slot_4",
        sessionId: "sess_1",
        targetUrl: "https://lumora.app/go/gmar",
        ts: now,
      },
      now
    );

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.click.adId).toBe("ad_1");
      expect(out.click.campaignId).toBe("camp_1");
      expect(out.click.targetUrl).toBe("https://lumora.app/go/gmar");
      expect(out.click.ts).toBe(now);
    }
  });

  it("rejects missing ad id", () => {
    const out = createAdClick({
      adId: "",
      campaignId: "camp_1",
      userId: "user_1",
      placement: "fyp_slot_4",
      sessionId: "sess_1",
      targetUrl: "https://lumora.app/go/gmar",
    });
    expect(out).toEqual({ ok: false, reason: "missing_ad_id" });
  });

  it("rejects missing target url", () => {
    const out = createAdClick({
      adId: "ad_1",
      campaignId: "camp_1",
      userId: "user_1",
      placement: "fyp_slot_4",
      sessionId: "sess_1",
      targetUrl: "",
    });
    expect(out).toEqual({ ok: false, reason: "missing_target_url" });
  });

  it("rejects invalid target url", () => {
    const out = createAdClick({
      adId: "ad_1",
      campaignId: "camp_1",
      userId: "user_1",
      placement: "fyp_slot_4",
      sessionId: "sess_1",
      targetUrl: "javascript:alert(1)",
    });
    expect(out).toEqual({ ok: false, reason: "invalid_target_url" });
  });

  it("rejects invalid timestamp", () => {
    const out = createAdClick({
      adId: "ad_1",
      campaignId: "camp_1",
      userId: "user_1",
      placement: "fyp_slot_4",
      sessionId: "sess_1",
      targetUrl: "https://lumora.app/go/gmar",
      ts: 0,
    });
    expect(out).toEqual({ ok: false, reason: "invalid_timestamp" });
  });
});
