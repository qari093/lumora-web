import { describe, expect, it } from "vitest";
import { createSocketRuntime } from "@/core/live/socket/socketOrchestrator";
import { createRoom } from "@/core/live/rooms/roomLifecycle";
import { syncPresence } from "@/core/live/presence/presenceRuntime";

describe("Live Packs 1-2", () => {
  it("validates realtime runtime", () => {
    expect(createSocketRuntime().healthy).toBe(true);
  });

  it("validates room lifecycle", () => {
    expect(createRoom("alpha").active).toBe(true);
  });

  it("validates synchronized presence", () => {
    expect(syncPresence(12).synchronized).toBe(true);
  });
});
