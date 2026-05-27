import { describe, expect, it } from "vitest";
import React from "react";

import ImmersiveFypViewport from "@/components/fyp/immersive/ImmersiveFypViewport";

import {
  createFypVisualTheme
} from "@/src/core/fyp/ui-runtime/visualTheme";

import {
  resolveGestureIntent
} from "@/src/core/fyp/ui-runtime/gestureIntent";

import {
  createFypInteractionRail
} from "@/src/core/fyp/ui-runtime/interactionRail";

describe("Lumora FYP Real UI + Immersive UX", () => {
  it("creates visual theme", () => {
    const theme = createFypVisualTheme("pulse");

    expect(theme.mode).toBe("pulse");
    expect(theme.motion).toBe("surge");
    expect(theme.intensity).toBe(95);
  });

  it("resolves gesture intent", () => {
    expect(
      resolveGestureIntent({
        axis: "y",
        direction: "up",
        force: 90
      })
    ).toBe("pulse");

    expect(
      resolveGestureIntent({
        axis: "x",
        direction: "right",
        force: 30
      })
    ).toBe("open-resonance");
  });

  it("creates interaction rail", () => {
    const rail = createFypInteractionRail({
      saved: true,
      shared: false,
      resonanceOpen: true
    });

    expect(rail).toHaveLength(4);
    expect(rail.find(item => item.id === "save")?.active).toBe(true);
    expect(rail.find(item => item.id === "resonance")?.active).toBe(true);
  });

  it("creates immersive viewport React element", () => {
    const element = (
      <ImmersiveFypViewport
        mode="chaos"
        title="Chaos Signal"
        creator="@creator"
      />
    );

    expect(element.type).toBe(ImmersiveFypViewport);
    expect(element.props.mode).toBe("chaos");
    expect(element.props.title).toBe("Chaos Signal");
  });
});
