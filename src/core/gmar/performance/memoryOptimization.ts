export function memoryPressure(heapMb: number) {
  if (heapMb > 1024) return "critical";

  if (heapMb > 512) return "high";

  return "stable";
}
