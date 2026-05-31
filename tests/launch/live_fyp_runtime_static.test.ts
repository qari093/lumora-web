import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const requiredFiles = [
  "app/fyp/page.tsx",
  "app/live/page.tsx",
  "app/api/fyp/health/route.ts",
  "app/api/fyp/feed/route.ts",
  "app/api/fyp/native-feed/route.ts",
  "app/api/fyp/interact/route.ts",
  "app/api/live/health/route.ts",
  "app/api/live/rooms/route.ts",
  "app/api/live/room-state/route.ts",
  "app/api/live/events/route.ts",
  "app/api/live/publish/route.ts",
];

function read(file: string) {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
}

describe("Lumora Live + FYP runtime static validation", () => {
  it.each(requiredFiles)("has runtime file %s", (file) => {
    expect(fs.existsSync(path.join(process.cwd(), file))).toBe(true);
  });

  it("FYP route files expose handlers", () => {
    const combined = [
      "app/api/fyp/health/route.ts",
      "app/api/fyp/feed/route.ts",
      "app/api/fyp/native-feed/route.ts",
      "app/api/fyp/interact/route.ts",
    ].map(read).join("\n");

    expect(combined).toMatch(/export\s+async\s+function\s+(GET|POST)|export\s+function\s+(GET|POST)/);
  });

  it("Live route files expose handlers", () => {
    const combined = [
      "app/api/live/health/route.ts",
      "app/api/live/rooms/route.ts",
      "app/api/live/room-state/route.ts",
      "app/api/live/events/route.ts",
      "app/api/live/publish/route.ts",
    ].map(read).join("\n");

    expect(combined).toMatch(/export\s+async\s+function\s+(GET|POST)|export\s+function\s+(GET|POST)/);
  });

  it("FYP has feed vocabulary", () => {
    const combined = [
      "app/api/fyp/feed/route.ts",
      "app/api/fyp/native-feed/route.ts",
      "app/api/fyp/interact/route.ts",
    ].map(read).join("\n");

    expect(combined).toMatch(/feed|item|video|interact|event|rank|session/i);
  });

  it("Live has room/event vocabulary", () => {
    const combined = [
      "app/api/live/rooms/route.ts",
      "app/api/live/room-state/route.ts",
      "app/api/live/events/route.ts",
      "app/api/live/publish/route.ts",
    ].map(read).join("\n");

    expect(combined).toMatch(/room|event|publish|state|live/i);
  });
});
