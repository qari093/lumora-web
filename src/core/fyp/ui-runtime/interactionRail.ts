import type {
  FypInteractionRailItem
} from "./types";

export function createFypInteractionRail(input: {
  saved: boolean;
  shared: boolean;
  resonanceOpen: boolean;
}): FypInteractionRailItem[] {
  return [
    {
      id: "save",
      label: "Save",
      active: input.saved
    },
    {
      id: "share",
      label: "Share",
      active: input.shared
    },
    {
      id: "resonance",
      label: "Echo",
      active: input.resonanceOpen
    },
    {
      id: "pulse",
      label: "Pulse",
      active: false
    }
  ];
}
