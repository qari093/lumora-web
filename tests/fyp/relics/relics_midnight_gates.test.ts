import { describe, expect, it } from "vitest";

import {
  createPhantomRelic,
  isRelicActive
} from "@/src/core/fyp/relics/relicEngine";

import {
  claimPhantomRelic
} from "@/src/core/fyp/relics/relicClaim";

import {
  createRelicInventory
} from "@/src/core/fyp/relics/relicInventory";

import {
  createMidnightGate,
  canEnterMidnightGate
} from "@/src/core/fyp/midnight/midnightGate";

import {
  createHiddenUnlock
} from "@/src/core/fyp/midnight/hiddenUnlock";

describe("Lumora FYP Relics + Midnight Gates", () => {
  it("creates active phantom relic", () => {
    const relic = createPhantomRelic({
      relicId: "relic_001",
      mode: "drift",
      rarity: "phantom",
      title: "Neon Drift Fragment",
      claimLimit: 10,
      startsAt: 100,
      expiresAt: 200
    });

    expect(isRelicActive({ relic, now: 150 })).toBe(true);
    expect(relic.oneTimeOnly).toBe(true);
  });

  it("claims phantom relic once", () => {
    const relic = createPhantomRelic({
      relicId: "relic_001",
      mode: "drift",
      rarity: "phantom",
      title: "Neon Drift Fragment",
      claimLimit: 10,
      startsAt: 100,
      expiresAt: 200
    });

    const result = claimPhantomRelic({
      relic,
      userId: "waqar",
      now: 150
    });

    expect(result.claim.valid).toBe(true);
    expect(result.relic.claimedCount).toBe(1);
  });

  it("creates relic inventory", () => {
    const relic = createPhantomRelic({
      relicId: "relic_001",
      mode: "drift",
      rarity: "phantom",
      title: "Neon Drift Fragment",
      claimLimit: 10,
      startsAt: 100,
      expiresAt: 200
    });

    const result = claimPhantomRelic({
      relic,
      userId: "waqar",
      now: 150
    });

    const inventory = createRelicInventory({
      userId: "waqar",
      claims: [result.claim]
    });

    expect(inventory.totalRelics).toBe(1);
  });

  it("opens midnight gate with correct trigger", () => {
    const gate = createMidnightGate({
      gateId: "midnight_001",
      mode: "deep",
      secretTrigger: "neon.drift.ghost"
    });

    expect(
      canEnterMidnightGate({
        gate,
        localHour: 2,
        trigger: "neon.drift.ghost"
      })
    ).toBe(true);
  });

  it("creates hidden unlock", () => {
    const unlock = createHiddenUnlock({
      userId: "waqar",
      mode: "deep",
      rewardType: "phantom_hint",
      now: 100
    });

    expect(unlock.rewardType).toBe("phantom_hint");
  });
});
