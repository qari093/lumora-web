import { describe, it, expect } from "vitest";
import { attachAnchor, renderThread, tone, validate } from "@/src/lib/integration/witness-thread-ui";

describe("Pack16", () => {
  it("thread works", () => {
    const a = attachAnchor("early","2026-01-01");
    const b = attachAnchor("late","2026-01-02");
    const t = renderThread([b,a]);

    expect(t.anchors[0].id).toBe("early");
    expect(tone(1)).toBe("a first quiet presence");
    expect(tone(2)).toBe("has returned to your circle");
    expect(tone(5)).toBe("has been still with you often");
    expect(validate(t).ok).toBe(true);
  });
});
