import type { HomeBeaconState } from "./types";

export function nextHomeBeaconState(current: HomeBeaconState, event: "tap" | "close" | "disable" | "enable"): HomeBeaconState {
  if (event === "disable") return "disabled";
  if (event === "enable") return "idle";
  if (current === "disabled") return "disabled";
  if (event === "tap") return current === "expanded" ? "active" : "expanded";
  if (event === "close") return "idle";
  return current;
}
