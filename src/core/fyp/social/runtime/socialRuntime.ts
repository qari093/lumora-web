import type { SocialSignal } from "../types";
import { amplifySocialSignal } from "./socialAmplifier";

export function runSocialRuntime(
  signals: SocialSignal[]
) {
  return {
    active: true,
    results: signals.map(
      amplifySocialSignal
    )
  };
}
