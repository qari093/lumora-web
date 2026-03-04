import { describe, it, expect } from "vitest";
import { decideHotset, HOTSET_TTL_SEC } from "@/lib/video/edge/hotsetTrigger";

describe("hotset trigger (R2 hotset contract)", () => {
  it("never promotes when operator disallows", () => {
    const d = decideHotset({ velocity: 999, cacheHit: 0.1, egress: 0.99, operatorAllowPromote: false });
    expect(d.tier).toBe("NONE");
    expect(d.reason).toBe("operator_disallow");
  });

  it("promotes on high velocity when cache weak", () => {
    const d = decideHotset({ velocity: 500, cacheHit: 0.2, egress: 0.1, operatorAllowPromote: true });
    expect(d.tier).toBe("PROMOTE");
    expect(d.ttlSec).toBe(HOTSET_TTL_SEC);
  });

  it("promotes on egress critical when cache weak even if velocity moderate", () => {
    const d = decideHotset({ velocity: 40, cacheHit: 0.4, egress: 0.9, operatorAllowPromote: true });
    expect(d.tier).toBe("PROMOTE");
  });

  it("does not promote when cache already strong", () => {
    const d = decideHotset({ velocity: 500, cacheHit: 0.92, egress: 0.2, operatorAllowPromote: true });
    expect(d.tier).toBe("CANDIDATE");
  });

  it("stays none under thresholds", () => {
    const d = decideHotset({ velocity: 10, cacheHit: 0.5, egress: 0.1, operatorAllowPromote: true });
    expect(d.tier).toBe("NONE");
  });
});
