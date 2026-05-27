import { describe, expect, it } from "vitest";
import fs from "node:fs";
import { validateZendoroRemaining28FinalCertification } from "@/src/lib/zendoro/remaining28/finalCertification";

describe("Zendoro Remaining 28% Pack 9/9 — Final Certification", () => {
  it("confirms remaining 28 percent locks", () => {
    for (let i = 1; i <= 8; i++) {
      expect(fs.existsSync(`.zendoro_remaining28_pack0${i}_lock`)).toBe(true);
    }
  });

  it("validates final remaining 28 percent certification", () => {
    expect(validateZendoroRemaining28FinalCertification()).toBe(true);
  });
});
