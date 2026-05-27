export interface FadingLampRuntime {
  visible: boolean;
  blocksExit: false;
  message: string;
}

export function buildFadingLampRuntime(permanentExitRequested: boolean): FadingLampRuntime {
  return {
    visible: permanentExitRequested,
    blocksExit: false,
    message: permanentExitRequested ? "Your light remains here, even if you do not." : ""
  };
}
