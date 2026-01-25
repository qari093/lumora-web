import { describe, it, expect } from "vitest";
import { getTranslationFlags } from "../../lib/lumalink/translate/featureFlag";
import { isTier1 } from "../../lib/lumalink/translate/languages";

describe("LumaLink translation flags", () => {
  it("disabled by default", () => {
    const f = getTranslationFlags({} as any);
    expect(f.enabled).toBe(false);
    expect(f.mode).toBe("off");
    expect(f.noStorage).toBe(true);
  });

  it("enables with safe mode coercion", () => {
    const f = getTranslationFlags({
      LUMALINK_TRANSLATE_V1: "1",
      LUMALINK_TRANSLATE_MODE: "dual-audio",
      LUMALINK_TRANSLATE_NOSTORE: "1",
    } as any);
    expect(f.enabled).toBe(true);
    expect(f.mode).toBe("dual-audio");
    expect(f.noStorage).toBe(true);
  });

  it("coerces invalid mode to off", () => {
    const f = getTranslationFlags({
      LUMALINK_TRANSLATE_V1: "1",
      LUMALINK_TRANSLATE_MODE: "weird",
    } as any);
    expect(f.enabled).toBe(true);
    expect(f.mode).toBe("off");
  });

  it("Urdu is Tier-1", () => {
    expect(isTier1("ur")).toBe(true);
  });
});
