export type RuntimeSignalCapture = {
  circleId: string;
  videoId: string;
  enabled: true;
  allowedSignals: readonly ["present", "stillness", "hold", "rewatch", "silent-ovation"];
};

export function activateRuntimeSignalCapture(input: {
  circleId: string;
  videoId: string;
}): RuntimeSignalCapture {
  return {
    circleId: input.circleId,
    videoId: input.videoId,
    enabled: true,
    allowedSignals: ["present", "stillness", "hold", "rewatch", "silent-ovation"],
  };
}
