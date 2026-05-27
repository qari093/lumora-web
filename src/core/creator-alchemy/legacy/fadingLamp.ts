import type { FadingLamp } from "./types";

export function buildFadingLamp(permanentExitRequested: boolean): FadingLamp {
  return {
    shown: permanentExitRequested,
    message: permanentExitRequested ? "Your light remains here, even if you do not." : "",
    blocksExit: false
  };
}
