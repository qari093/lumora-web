export type SpaceHubView = "orbit" | "pulse" | "vault" | "profile";

export type GestureAction =
  | "tap_star"
  | "swipe_up"
  | "swipe_down"
  | "pinch_out"
  | "long_press_space"
  | "double_tap_card";

export type DeviceTier = "low" | "mid" | "high";

export type OrbitEntityType =
  | "community"
  | "relationship"
  | "mission"
  | "local_nebula"
  | "discovery_beacon";

export type OrbitEntity = {
  id: string;
  type: OrbitEntityType;
  title: string;
  closeness: number;
  activity: number;
  trusted: boolean;
  x: number;
  y: number;
  ring: "inner" | "middle" | "outer";
};

export type SpaceSphereState = {
  citizenId: string;
  mood: "calm" | "creative" | "focused" | "healing" | "builder";
  aura: string;
  glow: number;
  rotationSpeed: number;
  reducedMotion: boolean;
};

export type SpaceHubDashboardState = {
  citizenId: string;
  activeView: SpaceHubView;
  spaceSphere: SpaceSphereState;
  orbitEntities: OrbitEntity[];
  pulseSummary: string;
  focusMode: boolean;
  deviceTier: DeviceTier;
  accessibility: {
    reducedMotion: boolean;
    highContrast: boolean;
    soundEnabled: boolean;
    hapticsEnabled: boolean;
  };
};
