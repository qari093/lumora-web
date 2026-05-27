import { describe, expect, it } from "vitest";
import { convertEURToApproxLocal, getDCCWarning } from "@/src/core/zenwallet/fx/fxEngine";

describe("ZenWallet Pack 06", () => {
  it("converts EUR", () => {
    expect(convertEURToApproxLocal(10, 90)).toBe(900);
  });

  it("returns DCC warning", () => {
    expect(getDCCWarning()).toContain("EUR");
  });
});
