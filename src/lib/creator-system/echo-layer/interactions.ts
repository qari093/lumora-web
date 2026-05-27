export type EchoInteraction = "silent-ovation";

export function isAllowedEchoInteraction(type: string): boolean {
  return type === "silent-ovation";
}
