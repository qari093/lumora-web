import { describe, expect, it } from "vitest";

import {
  createResonanceRow,
  getTopResonanceRowItems
} from "@/src/core/fyp/resonance-row/resonanceRow";

import {
  createImmersiveOverlay
} from "@/src/core/fyp/immersion/overlay";

import {
  createAtmosphereStack,
  pushAtmosphereStack,
  getCurrentAtmosphere
} from "@/src/core/fyp/immersion/atmosphereStack";

import {
  createAtmosphereDeepLink
} from "@/src/core/fyp/immersion/deepLink";

describe("Lumora FYP Resonance Row + Immersion", () => {
  const rowItems = [
    {
      itemId: "live_1",
      surface: "live_room" as const,
      title: "Drift Room",
      mode: "drift" as const,
      priority: 70,
      deepLink: "/live/drift"
    },
    {
      itemId: "gmar_1",
      surface: "gmar" as const,
      title: "GMAR Origin Surge",
      mode: "energy" as const,
      priority: 90,
      deepLink: "/gmar"
    },
    {
      itemId: "music_1",
      surface: "music" as const,
      title: "Night Drive Audio",
      mode: "deep" as const,
      priority: 60,
      deepLink: "/music/night-drive"
    }
  ];

  it("creates sorted resonance row", () => {
    const row = createResonanceRow({
      contentId: "vid_1",
      mode: "drift",
      items: rowItems
    });

    expect(row.items[0].surface).toBe("gmar");
    expect(getTopResonanceRowItems(row, 2)).toHaveLength(2);
  });

  it("creates immersive overlay", () => {
    const overlay = createImmersiveOverlay({
      overlayId: "overlay_1",
      mode: "drift",
      depth: 75
    });

    expect(overlay.active).toBe(true);
    expect(overlay.transition).toBe("soft");
  });

  it("pushes atmosphere stack entries", () => {
    const stack = createAtmosphereStack("waqar");

    const updated = pushAtmosphereStack(stack, {
      mode: "drift",
      source: "row",
      enteredAt: 100
    });

    expect(getCurrentAtmosphere(updated)?.mode).toBe("drift");
  });

  it("creates app-relative deep link", () => {
    const link = createAtmosphereDeepLink(rowItems[0]);

    expect(link).toContain("/fyp/atmosphere");
    expect(link).toContain("live_room");
  });
});
