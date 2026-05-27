import { describe, expect, it } from "vitest";

import {
  grantPhantomAccess,
  assertPhantomAccess
} from "@/src/core/fyp/phantom/access";

import {
  createPhantomFeedState
} from "@/src/core/fyp/phantom/feedState";

import {
  createPhantomBreadcrumb,
  qualifiesForPhantomHint
} from "@/src/core/fyp/phantom/breadcrumb";

import {
  createGatekeeperPass,
  redeemGatekeeperPass
} from "@/src/core/fyp/underground/gatekeeper";

import {
  calculateUndergroundReputation
} from "@/src/core/fyp/underground/reputation";

describe("Lumora FYP Phantom Feed + Underground Culture", () => {
  it("grants and validates phantom access", () => {
    const access = grantPhantomAccess({
      userId: "waqar",
      method: "breadcrumb",
      now: 100,
      durationMs: 1000
    });

    expect(assertPhantomAccess({ access, now: 200 })).toBe(true);
  });

  it("creates phantom feed state", () => {
    const access = grantPhantomAccess({
      userId: "waqar",
      method: "midnight_trigger",
      now: 100,
      durationMs: 1000
    });

    const state = createPhantomFeedState({
      access,
      now: 200
    });

    expect(state.active).toBe(true);
    expect(state.anonymousMode).toBe(true);
    expect(state.visibleMetrics).toBe(false);
  });

  it("qualifies user for phantom hint from breadcrumbs", () => {
    const breadcrumbs = [
      createPhantomBreadcrumb({ userId: "waqar", fragment: "neon", clueStrength: 40, now: 100 }),
      createPhantomBreadcrumb({ userId: "waqar", fragment: "drift", clueStrength: 40, now: 101 }),
      createPhantomBreadcrumb({ userId: "waqar", fragment: "ghost", clueStrength: 40, now: 102 })
    ];

    expect(qualifiesForPhantomHint(breadcrumbs)).toBe(true);
  });

  it("creates and redeems gatekeeper pass", () => {
    const pass = createGatekeeperPass({
      gatekeeperUserId: "gatekeeper_001",
      invitedUserId: "waqar",
      now: 100
    });

    const redeemed = redeemGatekeeperPass(pass);

    expect(redeemed.used).toBe(true);
    expect(redeemed.singleUse).toBe(true);
  });

  it("calculates underground reputation", () => {
    const rep = calculateUndergroundReputation({
      userId: "waqar",
      phantomVisits: 5,
      avantGardeEchoes: 7,
      gatekeeperPassesGranted: 2
    });

    expect(rep.reputationScore).toBe(70);
  });
});
