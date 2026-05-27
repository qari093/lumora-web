import { describe, expect, it } from "vitest";
import { createAtmosphereWidget } from "@/src/core/celebrations/widget/lockscreenAtmosphere";
import { createSilentHour } from "@/src/core/celebrations/silence/silentHour";

describe("Celebrations Mega Pack 07", () => {
  it("creates widget", () => {
    expect(createAtmosphereWidget().active).toBe(true);
  });

  it("creates silent hour", () => {
    expect(createSilentHour().enabled).toBe(true);
  });
});
