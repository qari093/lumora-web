import { describe, expect, it } from "vitest";

import { calculateCreatorSplit } from "../../src/core/payout-ledger/splits";
import { createLumoraLink } from "../../src/core/link-runtime/create";
import { calculateTQ } from "../../src/core/tq-production/calculate";

describe("Creator + Share Runtime Validation", () => {
  it("calculates creator payouts", () => {
    expect(calculateCreatorSplit(1000)).toEqual({
      creatorCents: 900,
      platformCents: 100,
    });
  });

  it("creates stable Lumora links", () => {
    expect(
      createLumoraLink({
        kind: "creator",
        targetId: "creator-1",
      }).id
    ).toBe("creator-creator-1");
  });

  it("calculates transparent TQ", () => {
    expect(
      calculateTQ({
        pledgeFulfillment: 100,
        retention: 100,
        collaborationReliability: 100,
        moderationHealth: 100,
        consistency: 100,
      })
    ).toBe(100);
  });
});
