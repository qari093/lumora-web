import { describe, expect, it } from "vitest";
import { createFyp94WaveEcho } from "../../src/lib/fyp94/echoes/create";
import { buildFyp94EchoSlots } from "../../src/lib/fyp94/echoes/slots";
import { applyFyp94EchoDecay, extendFyp94EchoLifetime } from "../../src/lib/fyp94/echoes/decay";
import { buildFyp94EchoPosterComposite } from "../../src/lib/fyp94/echoes/poster";

describe("FYP 9.4 Pack 015 — Wave Echoes", () => {
  it("creates echo artifact from wave participation", () => {
    const echo = createFyp94WaveEcho({
      waveId: "wave_1",
      anonymousUserId: "anon_1",
      posterIds: ["p1", "p2", "p3"],
      now: new Date("2026-01-01T00:00:00.000Z"),
      lifetimeDays: 14,
    });

    expect(echo.posterIds).toHaveLength(3);
    expect(echo.state).toBe("active");
  });

  it("builds collected and missed slots", () => {
    const slots = buildFyp94EchoSlots({
      participatedWaveIds: ["wave_1"],
      allWaveIds: ["wave_1", "wave_2"],
    });

    expect(slots[0].status).toBe("collected");
    expect(slots[1].status).toBe("missed");
  });

  it("applies decay and expiry", () => {
    const echo = createFyp94WaveEcho({
      waveId: "wave_1",
      anonymousUserId: "anon_1",
      posterIds: ["p1"],
      now: new Date("2026-01-01T00:00:00.000Z"),
      lifetimeDays: 1,
    });

    const expired = applyFyp94EchoDecay({
      echo,
      now: new Date("2026-01-03T00:00:00.000Z"),
    });

    expect(expired.state).toBe("expired");
  });

  it("extends echo lifetime via streak", () => {
    const echo = createFyp94WaveEcho({
      waveId: "wave_1",
      anonymousUserId: "anon_1",
      posterIds: ["p1"],
      now: new Date("2026-01-01T00:00:00.000Z"),
      lifetimeDays: 1,
    });

    const extended = extendFyp94EchoLifetime({ echo, extraDays: 3 });

    expect(new Date(extended.expiresAt).getTime()).toBeGreaterThan(new Date(echo.expiresAt).getTime());
  });

  it("builds poster composite reference", () => {
    const composite = buildFyp94EchoPosterComposite({
      posterIds: ["p1", "p2", "p3"],
    });

    expect(composite).toContain("echo_composite");
  });
});
