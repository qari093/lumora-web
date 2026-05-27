import type { AtmosphereMode } from "../core/types";

const ADJACENT_MODES: Record<AtmosphereMode, AtmosphereMode[]> = {
  comfort: ["drift", "wonder", "focus"],
  drift: ["comfort", "deep", "wonder"],
  chaos: ["energy", "wonder", "drift"],
  deep: ["drift", "focus", "wonder"],
  energy: ["chaos", "focus", "wonder"],
  focus: ["deep", "comfort", "energy"],
  wonder: ["drift", "energy", "comfort"]
};

export function getSoftDissonanceModes(
  mode: AtmosphereMode
): AtmosphereMode[] {
  return ADJACENT_MODES[mode] ?? ["wonder"];
}

export function isSoftDissonanceAllowed(input: {
  from: AtmosphereMode;
  to: AtmosphereMode;
}): boolean {
  return getSoftDissonanceModes(input.from).includes(input.to);
}
