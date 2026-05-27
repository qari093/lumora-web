import { describe, expect, it } from "vitest";
import { createKeeperBackup } from "@/src/lib/creator-system/keeper/keeperRole";
import { buildHostPresenceCheck, isHostMissingBeforeCircle } from "@/src/lib/creator-system/keeper/missingHostDetection";
import { buildKeeperPing, shouldPingKeeper } from "@/src/lib/creator-system/keeper/keeperPing";
import { transferHostToKeeper } from "@/src/lib/creator-system/keeper/hostTransfer";
import { createCircleContinuityLog } from "@/src/lib/creator-system/keeper/continuityLog";

describe("Creator System Pack 08 — Keeper Backup", () => {
  it("creates keeper backup role", () => {
    const keeper = createKeeperBackup({
      keeperId: "k1",
      displayName: "Keeper",
      assignedCircleId: "c1",
    });

    expect(keeper.role).toBe("keeper-backup");
    expect(keeper.active).toBe(true);
  });

  it("detects missing host before circle", () => {
    const check = buildHostPresenceCheck({
      hostId: "h1",
      present: false,
      checkedAt: "2026-05-02T18:58:00.000Z",
    });

    expect(isHostMissingBeforeCircle(check)).toBe(true);
    expect(isHostMissingBeforeCircle({ hostId: "h1", present: true, checkedAt: "t" })).toBe(false);
  });

  it("pings keeper 60 seconds before start", () => {
    const ping = buildKeeperPing({
      circleId: "c1",
      keeperId: "k1",
      circleStartIso: "2026-05-02T19:00:00.000Z",
    });

    expect(ping.pingAtIso).toBe("2026-05-02T18:59:00.000Z");
    expect(shouldPingKeeper("2026-05-02T18:59:00.000Z", ping)).toBe(true);
  });

  it("transfers host role safely", () => {
    const result = transferHostToKeeper({
      circleId: "c1",
      previousHostId: "h1",
      hostMissing: true,
      keeperId: "k1",
    });

    expect(result.ok).toBe(true);
    expect(result.newHostId).toBe("k1");
    expect(result.reason).toBe("transferred_to_keeper");
  });

  it("logs circle continuity status", () => {
    const log = createCircleContinuityLog({
      circleId: "c1",
      status: "keeper-took-over",
      hostId: "h1",
      keeperId: "k1",
    });

    expect(log.status).toBe("keeper-took-over");
    expect(log.circleId).toBe("c1");
  });
});
