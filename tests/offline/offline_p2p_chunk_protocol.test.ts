import { describe, it, expect } from "vitest";
import * as P from "../../src/lib/offline/videos/p2p_chunk_protocol";

function hasFn(name: string) {
  return typeof (P as any)[name] === "function";
}

describe("offline videos: p2p_chunk_protocol exports", () => {
  it("exports signFrame + verifyFrame", () => {
    expect(hasFn("signFrame")).toBe(true);
    expect(hasFn("verifyFrame")).toBe(true);
  });

  it("signFrame/verifyFrame roundtrip works for a trivial frame (best-effort)", async () => {
    if (!hasFn("signFrame") || !hasFn("verifyFrame")) return;

    // The implementation supports multiple cfg shapes across earlier steps.
    // Use a permissive cfg that should work with current code (or gracefully fail with a known error).
    const frame: any = { t: "ping", n: 1, ts: Date.now() };
    const cfg: any = {
      kid: "test-kid",
      // allow internal implementation to derive keying; keep secrets stable
      secret: "test-secret",
      replayWindowSec: 60,
    };

    const signed = await (P as any).signFrame(frame, cfg);
    expect(signed).toBeTruthy();

    const now = Date.now();
    const verified = await (P as any).verifyFrame(signed, cfg, now);
    expect(verified).toBeTruthy();
  });
});
