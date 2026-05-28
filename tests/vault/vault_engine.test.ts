import { describe, expect, it } from "vitest";
import { createVault, addMoment } from "@/lib/vault/vaultEngine";

describe("vault engine", () => {
  it("stores moments", () => {
    const vault = createVault();

    const next = addMoment(vault, {
      id: "1",
      title: "Moment",
      lane: "cosmic",
      savedAt: Date.now()
    });

    expect(next.moments.length).toBe(1);
  });
});
