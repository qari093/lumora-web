import { describe, expect, it } from "vitest";
import { createLantern } from "@/src/core/celebrations/lanterns/whisperLanterns";
import { createAtmosphericBreath } from "@/src/core/celebrations/breath/breathConcerts";

describe("Celebrations Mega Pack 04", () => {
  it("creates lantern", () => {
    expect(createLantern().symbolic).toBe(true);
  });

  it("creates breath", () => {
    expect(createAtmosphericBreath().active).toBe(true);
  });
});
