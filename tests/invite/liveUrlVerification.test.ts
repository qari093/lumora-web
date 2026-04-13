import { describe, expect, it } from "vitest";
import { verifyLiveInviteUrls } from "@/src/lib/invite/liveUrlVerification";

describe("Lumora invite live URL verification", () => {
  it("passes valid live URLs", () => {
    const out = verifyLiveInviteUrls({
      canonicalUrl: "https://www.lumora.app",
      ogImageUrl: "https://www.lumora.app/lumora-invite.png",
      goUrl: "https://www.lumora.app/go",
    });

    expect(out.ok).toBe(true);
    if (out.ok) expect(out.verification.ready).toBe(true);
  });

  it("rejects missing canonical URL", () => {
    expect(
      verifyLiveInviteUrls({
        canonicalUrl: "",
        ogImageUrl: "https://www.lumora.app/lumora-invite.png",
        goUrl: "https://www.lumora.app/go",
      })
    ).toEqual({ ok: false, reason: "missing_canonical_url" });
  });

  it("rejects non-https image URL", () => {
    expect(
      verifyLiveInviteUrls({
        canonicalUrl: "https://www.lumora.app",
        ogImageUrl: "http://www.lumora.app/lumora-invite.png",
        goUrl: "https://www.lumora.app/go",
      })
    ).toEqual({ ok: false, reason: "invalid_og_image_url" });
  });
});
