import { describe, expect, it } from "vitest";
import { createAdImpression } from "@/lib/ads/impressions";

describe("ad impression tracking", () => {
  const now = 1_700_000_000_000;

  it("creates a valid impression", () => {
    const out = createAdImpression(
      {
        adId: "ad_1",
        campaignId: "camp_1",
        userId: "user_1",
        placement: "fyp_slot_4",
        sessionId: "sess_1",
        ts: now,
      },
      now
    );

    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(out.impression.adId).toBe("ad_1");
      expect(out.impression.campaignId).toBe("camp_1");
      expect(out.impression.placement).toBe("fyp_slot_4");
      expect(out.impression.ts).toBe(now);
    }
  });

  it("rejects missing ad id", () => {
    const out = createAdImpression({
      adId: "",
      campaignId: "camp_1",
      userId: "user_1",
      placement: "fyp_slot_4",
      sessionId: "sess_1",
    });
    expect(out).toEqual({ ok: false, reason: "missing_ad_id" });
  });

  it("rejects missing campaign id", () => {
    const out = createAdImpression({
      adId: "ad_1",
      campaignId: "",
      userId: "user_1",
      placement: "fyp_slot_4",
      sessionId: "sess_1",
    });
    expect(out).toEqual({ ok: false, reason: "missing_campaign_id" });
  });

  it("rejects missing placement", () => {
    const out = createAdImpression({
      adId: "ad_1",
      campaignId: "camp_1",
      userId: "user_1",
      placement: "",
      sessionId: "sess_1",
    });
    expect(out).toEqual({ ok: false, reason: "missing_placement" });
  });

  it("rejects invalid timestamp", () => {
    const out = createAdImpression({
      adId: "ad_1",
      campaignId: "camp_1",
      userId: "user_1",
      placement: "fyp_slot_4",
      sessionId: "sess_1",
      ts: 0,
    });
    expect(out).toEqual({ ok: false, reason: "invalid_timestamp" });
  });
});
