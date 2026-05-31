import type { DeviceTier, SpaceHubDashboardState } from "./types";
import { createSpaceSphereState } from "./spaceSphere";
import { createOrbitEntities, sortOrbitEntitiesByGravity, summarizeOrbitPulse } from "./orbitEngine";
import { createLayoutProfile } from "./layoutEngine";
import { resolveGesture } from "./gestureEngine";
import { createLivingCardDock, openLivingCardPreview } from "./livingCardDock";
import { getSpaceHubTab, SPACEHUB_TABS } from "./navigation";

export function createSpaceHubDashboardState(input: {
  citizenId: string;
  deviceTier?: DeviceTier;
  reducedMotion?: boolean;
  highContrast?: boolean;
}): SpaceHubDashboardState {
  const deviceTier = input.deviceTier ?? "mid";
  const reducedMotion = input.reducedMotion === true;

  const orbitEntities = createOrbitEntities([
    { id: "community-founders", type: "community", title: "Founders", closeness: 92, activity: 85, trusted: true },
    { id: "mission-first-light", type: "mission", title: "First Light", closeness: 76, activity: 70, trusted: true },
    { id: "relationship-guide", type: "relationship", title: "Guide", closeness: 64, activity: 60, trusted: true },
    { id: "discovery-spark", type: "discovery_beacon", title: "Spark Gate", closeness: 36, activity: 55 },
    { id: "local-nebula", type: "local_nebula", title: "Local Nebula", closeness: 20, activity: 25 },
  ]);

  return {
    citizenId: input.citizenId,
    activeView: "orbit",
    spaceSphere: createSpaceSphereState({
      citizenId: input.citizenId,
      mood: "builder",
      contributionScore: 24,
      reducedMotion,
    }),
    orbitEntities: sortOrbitEntitiesByGravity(orbitEntities),
    pulseSummary: summarizeOrbitPulse(orbitEntities),
    focusMode: false,
    deviceTier,
    accessibility: {
      reducedMotion,
      highContrast: input.highContrast === true,
      soundEnabled: true,
      hapticsEnabled: !reducedMotion,
    },
  };
}

export function runSpaceHubMegaPack02Runtime() {
  const dashboard = createSpaceHubDashboardState({
    citizenId: "omega-citizen-002",
    deviceTier: "mid",
  });

  const layout = createLayoutProfile({ deviceTier: dashboard.deviceTier });
  const gesture = resolveGesture("orbit", "swipe_up");
  const dock = openLivingCardPreview(createLivingCardDock({ citizenId: dashboard.citizenId }));
  const activeTab = getSpaceHubTab(dashboard.activeView);

  return {
    ok:
      dashboard.activeView === "orbit" &&
      dashboard.orbitEntities.length >= 5 &&
      dashboard.pulseSummary.includes("active lights") &&
      layout.mode === "balanced" &&
      gesture.nextView === "pulse" &&
      dock.previewOpen &&
      activeTab.label === "Orbit" &&
      SPACEHUB_TABS.length === 4,
    dashboard,
    layout,
    gesture,
    dock,
    activeTab,
  };
}
