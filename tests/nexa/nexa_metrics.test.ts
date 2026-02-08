import { describe, expect, it } from "vitest";
import { getNexaRuntimeMetrics } from "../../lib/nexa/metrics";

describe("NEXA runtime metrics", () => {
  it("returns a sane metrics snapshot", () => {
    const m = getNexaRuntimeMetrics();

    expect(m.ok).toBe(true);
    expect(typeof m.ts).toBe("number");
    expect(m.ts).toBeGreaterThan(0);

    expect(typeof m.uptimeMs).toBe("number");
    expect(m.uptimeMs).toBeGreaterThanOrEqual(0);

    expect(typeof m.node.version).toBe("string");
    expect(m.node.version.length).toBeGreaterThan(0);

    expect(typeof m.process.rssBytes).toBe("number");
    expect(m.process.rssBytes).toBeGreaterThan(0);

    expect(typeof m.process.heapTotalBytes).toBe("number");
    expect(m.process.heapTotalBytes).toBeGreaterThan(0);

    expect(typeof m.process.heapUsedBytes).toBe("number");
    expect(m.process.heapUsedBytes).toBeGreaterThan(0);

    expect(typeof m.system.hostname).toBe("string");
    expect(m.system.hostname.length).toBeGreaterThan(0);

    expect(typeof m.system.cpus).toBe("number");
    expect(m.system.cpus).toBeGreaterThan(0);

    expect(Array.isArray(m.system.loadavg)).toBe(true);
    expect(m.system.loadavg.length).toBe(3);

    expect(typeof m.system.totalMemBytes).toBe("number");
    expect(m.system.totalMemBytes).toBeGreaterThan(0);

    expect(typeof m.system.freeMemBytes).toBe("number");
    expect(m.system.freeMemBytes).toBeGreaterThanOrEqual(0);
    expect(m.system.freeMemBytes).toBeLessThanOrEqual(m.system.totalMemBytes);
  });
});
