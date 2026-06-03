export type LightSignal =
  | "echo"
  | "reflection"
  | "ripple"
  | "live"
  | "gmar"
  | "zendoro"
  | "grouped";

export function createSignal(type: LightSignal) {
  return {
    type,
    pulse: true,
    badgeFree: true
  };
}
