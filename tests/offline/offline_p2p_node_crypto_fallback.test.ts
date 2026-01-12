import { describe, it, expect } from "vitest";
import { signFrame, verifyFrame } from "../../src/lib/offline/videos";

describe("offline videos: node crypto fallback smoke", () => {
  it("signFrame + verifyFrame works with implicit dev key fallback", async () => {
    const frame: any = { id: "f1", ts: Date.now(), payload: { a: 1 } };

    // Intentionally omit/empty key to exercise fallback behavior.
    const cfg: any = { key: "" };

    const signed = await signFrame(frame, cfg);
    expect(signed).toBeTruthy();

    // verifyFrame API shape varies; we only assert it doesn't throw and returns truthy-ish ok/valid.
    const out: any = await verifyFrame(signed, cfg, Date.now());
    if (typeof out === "boolean") {
      expect(out).toBe(true);
    } else {
      const ok = Boolean(out?.ok ?? out?.valid ?? out?.verified ?? out?.pass ?? false);
      expect(ok).toBe(true);
    }
  });
});
