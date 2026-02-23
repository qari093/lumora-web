export type CpuSample = {
  cpuMs: number
  durationMs: number
}

export async function measureCpu<T>(fn: () => Promise<T>): Promise<{ result: T; sample: CpuSample }> {
  // Node-only CPU usage; in Workers this becomes duration-only (still useful)
  const hasProcess = typeof process !== "undefined" && typeof (process as any).cpuUsage === "function"
  const startWall = performance.now()
  const startCpu = hasProcess ? (process as any).cpuUsage() : null

  const result = await fn()

  const durationMs = performance.now() - startWall
  let cpuMs = durationMs
  if (startCpu) {
    const diff = (process as any).cpuUsage(startCpu)
    cpuMs = (diff.user + diff.system) / 1000
  }
  return { result, sample: { cpuMs, durationMs } }
}
