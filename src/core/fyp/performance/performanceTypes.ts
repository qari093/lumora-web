export interface FypPerformanceSample {
  timeToFirstFrameMs: number;
  network: "wifi" | "3g";
  memoryMb: number;
  cpuPercent: number;
  background: boolean;
  preloadSeconds: number;
  preloadItems: number;
}

export interface FypPerformanceResult {
  ok: boolean;
  failures: string[];
}
