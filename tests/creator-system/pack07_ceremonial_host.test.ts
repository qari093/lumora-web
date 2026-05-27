import { describe, expect, it } from "vitest";
import { createCeremonialHost } from "@/src/lib/creator-system/host/ceremonialHost";
import { getHostScript } from "@/src/lib/creator-system/host/hostScripts";
import { createPresentPulseFallback } from "@/src/lib/creator-system/host/presentPulseFallback";
import { selectNextHost, shouldRotateHost } from "@/src/lib/creator-system/host/hostRotation";
import { canHostAfterRest, filterRestedHosts } from "@/src/lib/creator-system/host/hostRestRule";

describe("Creator System Pack 07 — Ceremonial Host", () => {
  it("creates ceremonial host role", () => {
    const host = createCeremonialHost({ hostId: "h1", displayName: "Luma Host" });

    expect(host.role).toBe("ceremonial-host");
    expect(host.active).toBe(true);
  });

  it("provides host opening and closing scripts", () => {
    expect(getHostScript("opening")).toContain("witness");
    expect(getHostScript("closing")).toContain("dissolves");
  });

  it("creates automatic present pulse fallback", () => {
    const pulse = createPresentPulseFallback({ circleId: "c1", hostId: "h1" });

    expect(pulse.type).toBe("present");
    expect(pulse.automaticFallback).toBe(true);
  });

  it("rotates host after 7 days", () => {
    expect(shouldRotateHost("2026-05-01T00:00:00.000Z", "2026-05-08T00:00:00.000Z")).toBe(true);
    expect(shouldRotateHost("2026-05-01T00:00:00.000Z", "2026-05-05T00:00:00.000Z")).toBe(false);
    expect(selectNextHost(["h1", "h2", "h3"], "h1")).toBe("h2");
  });

  it("enforces 30-day host rest rule", () => {
    expect(canHostAfterRest("2026-05-01T00:00:00.000Z", "2026-05-31T00:00:00.000Z")).toBe(true);
    expect(canHostAfterRest("2026-05-01T00:00:00.000Z", "2026-05-10T00:00:00.000Z")).toBe(false);

    const rested = filterRestedHosts(
      [
        { hostId: "h1", lastHostedAt: "2026-05-01T00:00:00.000Z" },
        { hostId: "h2", lastHostedAt: "2026-05-25T00:00:00.000Z" },
      ],
      "2026-05-31T00:00:00.000Z",
    );

    expect(rested.map((host) => host.hostId)).toContain("h1");
    expect(rested.map((host) => host.hostId)).not.toContain("h2");
  });
});
