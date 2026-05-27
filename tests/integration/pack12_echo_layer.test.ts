import { describe, expect, it } from "vitest";
import { triggerEchoAfterCircleEnd } from "@/src/lib/integration/echo-layer/triggerEcho";
import { injectEchoIntoFeed } from "@/src/lib/integration/echo-layer/injectEchoIntoFeed";
import { removeEchoCountsComments } from "@/src/lib/integration/echo-layer/removeCountsComments";
import { allowEchoSilentOvationOnly } from "@/src/lib/integration/echo-layer/silentOvationOnly";
import { validateEcho24hExpiry } from "@/src/lib/integration/echo-layer/validateEchoExpiry";

describe("Integration Pack12 Echo Layer", () => {
  it("triggers echo after circle end", () => {
    const echo = triggerEchoAfterCircleEnd({ creatorId: "c1", circleId: "x", ended: true, nowMs: 0 });
    expect(echo.active).toBe(true);
    expect(echo.expiresAtMs).toBe(86400000);
  });

  it("injects echo into feed", () => {
    const echo = triggerEchoAfterCircleEnd({ creatorId: "c1", circleId: "x", ended: true, nowMs: 0 });
    const feed = injectEchoIntoFeed([{ id: "v1" }], echo);
    expect(feed[0].type).toBe("echo");
  });

  it("removes counts/comments", () => {
    const safe = removeEchoCountsComments({ id: "e1", counts: 9, comments: [], likes: 3 });
    expect(safe.countsHidden).toBe(true);
    expect(safe.commentsHidden).toBe(true);
    expect("counts" in safe).toBe(false);
  });

  it("allows silent ovation only", () => {
    expect(allowEchoSilentOvationOnly("silent-ovation").ok).toBe(true);
    expect(allowEchoSilentOvationOnly("like").ok).toBe(false);
  });

  it("validates 24h expiry", () => {
    expect(validateEcho24hExpiry({ nowMs: 1, expiresAtMs: 2 }).active).toBe(true);
    expect(validateEcho24hExpiry({ nowMs: 2, expiresAtMs: 2 }).expired).toBe(true);
  });
});
