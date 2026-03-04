/**
 * NEXA Runtime Metrics — canonical shape locked by tests.
 * Must be dependency-light and safe in Node + edge-ish contexts (fallbacks).
 */

export type NexaRuntimeMetrics = {
  ok: true;
  ts: number;
  uptimeMs: number;
  env: string;
  node: { version: string };
  process: { rssBytes: number; heapUsedBytes: number; heapTotalBytes: number };
  system: {
    hostname: string;
    platform: string;
    arch: string;
    cpus: number;
    cpuCount: number; // back-compat
    loadavg: number[]; // length=3
    memTotalBytes: number; // back-compat
    totalMemBytes: number;
    freeMemBytes: number;
  };
  // back-compat mirror (older tests / code may reference mem.*)
  mem: { rss: number; heapUsed: number; heapTotal: number };
};

function safeNow(): number {
  const t = Date.now();
  return Number.isFinite(t) ? t : 0;
}

function safeUptimeMs(): number {
  try {
    const u = process.uptime();
    return Number.isFinite(u) ? Math.max(0, Math.floor(u * 1000)) : 0;
  } catch {
    return 0;
  }
}

function safeNodeVersion(): string {
  try {
    return typeof process.version === "string" && process.version.length > 0 ? process.version : "unknown";
  } catch {
    return "unknown";
  }
}

function safeMem(): { rssBytes: number; heapUsedBytes: number; heapTotalBytes: number } {
  try {
    const m = process.memoryUsage();
    const rssBytes = Number.isFinite(m.rss) ? m.rss : 0;
    const heapUsedBytes = Number.isFinite(m.heapUsed) ? m.heapUsed : 0;
    const heapTotalBytes = Number.isFinite(m.heapTotal) ? m.heapTotal : 0;
    return { rssBytes, heapUsedBytes, heapTotalBytes };
  } catch {
    return { rssBytes: 0, heapUsedBytes: 0, heapTotalBytes: 0 };
  }
}

function safeOs() {
  // require inside to avoid bundler edge issues
  try {
    return require("os");
  } catch {
    return null;
  }
}

function safeHostname(osMod: any): string {
  try {
    const h = osMod?.hostname?.();
    return typeof h === "string" && h.length > 0 ? h : "unknown";
  } catch {
    return "unknown";
  }
}

function safePlatform(osMod: any): string {
  try {
    const p = osMod?.platform?.();
    return typeof p === "string" && p.length > 0 ? p : (typeof process.platform === "string" ? process.platform : "unknown");
  } catch {
    return typeof process.platform === "string" ? process.platform : "unknown";
  }
}

function safeArch(osMod: any): string {
  try {
    const a = osMod?.arch?.();
    return typeof a === "string" && a.length > 0 ? a : (typeof process.arch === "string" ? process.arch : "unknown");
  } catch {
    return typeof process.arch === "string" ? process.arch : "unknown";
  }
}

function safeCpuCount(osMod: any): number {
  try {
    const cpus = osMod?.cpus?.();
    const n = Array.isArray(cpus) ? cpus.length : 0;
    return Number.isFinite(n) && n > 0 ? n : 1;
  } catch {
    return 1;
  }
}

function safeLoadavg(osMod: any): number[] {
  try {
    const la = osMod?.loadavg?.();
    if (Array.isArray(la) && la.length === 3 && la.every((x: any) => typeof x === "number" && Number.isFinite(x))) return la;
    return [0, 0, 0];
  } catch {
    return [0, 0, 0];
  }
}

function safeTotalMem(osMod: any): number {
  try {
    const t = osMod?.totalmem?.();
    return typeof t === "number" && Number.isFinite(t) && t > 0 ? t : 1;
  } catch {
    return 1;
  }
}

function safeFreeMem(osMod: any, totalMemBytes: number): number {
  try {
    const f = osMod?.freemem?.();
    if (typeof f === "number" && Number.isFinite(f) && f >= 0) return Math.min(f, totalMemBytes);
    return 0;
  } catch {
    return 0;
  }
}

export function getNexaRuntimeMetrics(): NexaRuntimeMetrics {
  const osMod = safeOs();

  const ts = safeNow();
  const uptimeMs = safeUptimeMs();
  const env = (process.env.NODE_ENV || "dev") as string;

  const { rssBytes, heapUsedBytes, heapTotalBytes } = safeMem();

  const cpuCount = safeCpuCount(osMod);
  const loadavg = safeLoadavg(osMod);
  const totalMemBytes = safeTotalMem(osMod);
  const freeMemBytes = safeFreeMem(osMod, totalMemBytes);

  return {
    ok: true,
    ts,
    uptimeMs,
    env,
    node: { version: safeNodeVersion() },
    process: { rssBytes, heapUsedBytes, heapTotalBytes },
    system: {
      hostname: safeHostname(osMod),
      platform: safePlatform(osMod),
      arch: safeArch(osMod),
      cpus: cpuCount,
      cpuCount, // back-compat
      loadavg,
      memTotalBytes: totalMemBytes, // back-compat
      totalMemBytes,
      freeMemBytes,
    },
    mem: { rss: rssBytes, heapUsed: heapUsedBytes, heapTotal: heapTotalBytes },
  };
}

// Back-compat export used by older code/tests.
export const getNexaMetrics = getNexaRuntimeMetrics;
