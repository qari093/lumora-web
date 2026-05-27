import { describe, expect, it } from "vitest";

describe("realtime runtime", () => {
  it("enables websocket runtime", async () => {
    const mod = await import("@/core/realtime/runtime");
    expect(mod.websocketRuntimeEnabled).toBe(true);
  });
});
