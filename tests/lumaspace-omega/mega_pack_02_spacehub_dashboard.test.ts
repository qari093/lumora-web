import { describe, expect, it } from "vitest";
import { createSpaceSphereState, updateSpaceSphereMood } from "@/src/core/lumaspace/omega/spacehub/spaceSphere";
import { createOrbitEntities, sortOrbitEntitiesByGravity, summarizeOrbitPulse } from "@/src/core/lumaspace/omega/spacehub/orbitEngine";
import { resolveGesture } from "@/src/core/lumaspace/omega/spacehub/gestureEngine";
import { SPACEHUB_TABS, getSpaceHubTab, nextSpaceHubView } from "@/src/core/lumaspace/omega/spacehub/navigation";
import { createLayoutProfile } from "@/src/core/lumaspace/omega/spacehub/layoutEngine";
import { createLivingCardDock, openLivingCardPreview, closeLivingCardPreview } from "@/src/core/lumaspace/omega/spacehub/livingCardDock";
import { createSpaceHubDashboardState, runSpaceHubMegaPack02Runtime } from "@/src/core/lumaspace/omega/spacehub/spaceHubRuntime";

describe("LumaSpace Ω∞ Mega Pack 02 — SpaceHub Dashboard + Orbit UI Runtime", () => {
  it("creates a mood-aware space sphere", () => {
    const sphere = createSpaceSphereState({
      citizenId: "c1",
      mood: "creative",
      contributionScore: 30,
    });

    expect(sphere.aura).toBe("violet_amber");
    expect(sphere.glow).toBeGreaterThan(20);
    expect(updateSpaceSphereMood(sphere, "focused").aura).toBe("silver_blue");
  });

  it("creates orbit entities with rings and gravity order", () => {
    const entities = createOrbitEntities([
      { id: "a", type: "community", title: "A", closeness: 90, activity: 80, trusted: true },
      { id: "b", type: "mission", title: "B", closeness: 20, activity: 20 },
      { id: "c", type: "relationship", title: "C", closeness: 55, activity: 70 },
    ]);

    expect(entities[0].ring).toBe("inner");
    expect(entities[1].ring).toBe("outer");
    expect(sortOrbitEntitiesByGravity(entities)[0].id).toBe("a");
    expect(summarizeOrbitPulse(entities)).toContain("active lights");
  });

  it("resolves universal gesture language", () => {
    expect(resolveGesture("orbit", "swipe_up").nextView).toBe("pulse");
    expect(resolveGesture("pulse", "swipe_down").nextView).toBe("orbit");
    expect(resolveGesture("orbit", "double_tap_card").intent).toBe("send_light");
    expect(resolveGesture("orbit", "long_press_space").nextView).toBe("profile");
  });

  it("creates navigation tabs", () => {
    expect(SPACEHUB_TABS).toHaveLength(4);
    expect(getSpaceHubTab("vault").label).toBe("Vault");
    expect(nextSpaceHubView("orbit")).toBe("pulse");
  });

  it("creates adaptive layout profiles", () => {
    expect(createLayoutProfile({ deviceTier: "low" }).mode).toBe("lite");
    expect(createLayoutProfile({ deviceTier: "mid" }).shaderLevel).toBe("soft");
    expect(createLayoutProfile({ deviceTier: "high" }).targetFps).toBe(60);
  });

  it("creates living card dock state", () => {
    const dock = createLivingCardDock({ citizenId: "c2", activeProfileMode: "video" });
    expect(dock.supportsVideoProfile).toBe(true);
    expect(openLivingCardPreview(dock).previewOpen).toBe(true);
    expect(closeLivingCardPreview(openLivingCardPreview(dock)).previewOpen).toBe(false);
  });

  it("creates complete dashboard state", () => {
    const dashboard = createSpaceHubDashboardState({
      citizenId: "c3",
      deviceTier: "mid",
    });

    expect(dashboard.activeView).toBe("orbit");
    expect(dashboard.spaceSphere.aura).toBe("gold_copper");
    expect(dashboard.orbitEntities.length).toBeGreaterThanOrEqual(5);
    expect(dashboard.accessibility.hapticsEnabled).toBe(true);
  });

  it("runs full mega pack runtime", () => {
    const runtime = runSpaceHubMegaPack02Runtime();
    expect(runtime.ok).toBe(true);
    expect(runtime.layout.mode).toBe("balanced");
    expect(runtime.gesture.nextView).toBe("pulse");
    expect(runtime.dock.previewOpen).toBe(true);
  });
});
