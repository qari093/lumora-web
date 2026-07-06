import { describe, expect, it } from "vitest";
import fs from "node:fs";
import {
  createNexaGuidance,
  getNexaWhisper,
  isNexaHumanFirst,
  nexaWhispers
} from "@/src/core/lumaspace/nexa/runtime";

describe("LumaSpace Ω∞ Mega Pack 06 — NEXA Conscious Companion", () => {
  it("locks NEXA whispers as gentle guidance", () => {
    expect(nexaWhispers.length).toBeGreaterThanOrEqual(5);
    expect(getNexaWhisper("homecoming", "wonder").message).toContain("Welcome home");
    expect(getNexaWhisper("mask", "shadow").gentle).toBe(true);
  });

  it("locks mood-aware guidance", () => {
    const guidance = createNexaGuidance("healing");
    expect(guidance.gardenHint).toContain("blossoms");
    expect(guidance.echoHint).toContain("Echo");
  });

  it("keeps NEXA human-first and non-toxic", () => {
    expect(isNexaHumanFirst("Your story grows one star at a time.")).toBe(true);
    expect(isNexaHumanFirst("You have 10k followers and viral rank.")).toBe(false);
  });

  it("creates and mounts canonical NEXA companion surface", () => {
    expect(fs.existsSync("src/core/lumaspace/nexa/runtime.ts")).toBe(true);
    expect(fs.existsSync("src/components/lumaspace/nexa/NexaCompanion.tsx")).toBe(true);
    const page = fs.readFileSync("app/lumaspace/page.tsx", "utf8");
    expect(page).toContain("LivingUniverseRuntime");
  });
});
