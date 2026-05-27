export type CivilizationMood =
  | "reflective"
  | "harmonic"
  | "turbulent"
  | "awe"
  | "mirror_hour";

export type GmarSkyState = {
  mood: CivilizationMood;
  activeConstellation: string;
  mirrorHour: boolean;
  foundingEchoesVisible: boolean;
};

export function createDefaultSkyState(): GmarSkyState {
  return {
    mood: "reflective",
    activeConstellation: "zen-flow",
    mirrorHour: false,
    foundingEchoesVisible: true,
  };
}
