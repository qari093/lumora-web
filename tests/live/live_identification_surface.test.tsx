import { describe, it, expect } from "vitest";
import fs from "node:fs";

describe("Live identification surface (locked)", () => {
  it("has /live page and alive marker", () => {
    expect(fs.existsSync("app/live/page.tsx")).toBe(true);
    const s = fs.readFileSync("components/live/RoomList.tsx", "utf8");
    expect(s).toContain("LUMORA_LIVE_ROOMS_ALIVE");
    expect(s).toContain('data-testid="live-room-row"');
  });

  it("has /live/room page and alive marker", () => {
    expect(fs.existsSync("app/live/room/page.tsx")).toBe(true);
    const s = fs.readFileSync("app/live/room/page.tsx", "utf8");
    expect(s).toContain("LUMORA_LIVE_ROOM_ALIVE");
    expect(s).toContain('data-testid="live-room-shell"');
  });

  it("API routes exist", () => {
    expect(fs.existsSync("app/api/live/rooms/route.ts")).toBe(true);
    expect(fs.existsSync("app/api/live/room/route.ts")).toBe(true);
  });

  it("seed rooms count is >= 5", async () => {
    const mod = await import("../../lib/live/rooms");
    expect(Array.isArray(mod.SEED_LIVE_ROOMS)).toBe(true);
    expect(mod.SEED_LIVE_ROOMS.length).toBeGreaterThanOrEqual(5);
  });
});
