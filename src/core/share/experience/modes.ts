import type { UniversalShareDestination } from "./destinations";

export type UniversalShareMode = "instant" | "silent" | "echo" | "gift" | "scheduled" | "collaborative" | "temporary" | "external";

export type ShareModeDefinition = {
  id: UniversalShareMode;
  label: string;
  description: string;
  priority: number;
};

export const universalShareModes: ShareModeDefinition[] = [
  { id: "instant", label: "Instant", description: "Send immediately with normal delivery.", priority: 100 },
  { id: "silent", label: "Silent Share", description: "Arrives quietly without notification pressure.", priority: 92 },
  { id: "echo", label: "Echo Share", description: "Attach a personal echo note.", priority: 86 },
  { id: "gift", label: "Gift", description: "Wrap the share as a gentle digital gift.", priority: 78 },
  { id: "scheduled", label: "Schedule", description: "Deliver later as a time capsule.", priority: 72 },
  { id: "collaborative", label: "Collaborate", description: "Invite others to build on the shared object.", priority: 66 },
  { id: "temporary", label: "Temporary", description: "Share with an expiration window.", priority: 58 },
  { id: "external", label: "External", description: "Send outside Lumora.", priority: 42 }
];

export function supportsModeForDestination(mode: UniversalShareMode, destination: UniversalShareDestination): boolean {
  if (mode === "silent") return destination.supportsSilent;
  if (mode === "echo") return destination.supportsEcho;
  if (mode === "external") return destination.supportsExternal;
  return true;
}

export function getSupportedShareModes(destination: UniversalShareDestination): ShareModeDefinition[] {
  return universalShareModes.filter((mode) => supportsModeForDestination(mode.id, destination));
}
