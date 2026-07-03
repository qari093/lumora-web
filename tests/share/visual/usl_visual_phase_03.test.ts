import { describe, expect, it } from "vitest";
import fs from "node:fs";
import {
  runExternalConnectivityJourney,
  runFypToLumaSpaceJourney,
  runLumaSpaceToLumaLinkJourney,
  summarizeShareJourneys,
} from "@/src/core/share";

describe("USL Visual Route Integration — Phase 03/06 End-to-End Share Journeys", () => {
  it("validates FYP to LumaSpace as a living memory journey", () => {
    const journey = runFypToLumaSpaceJourney();

    expect(journey.id).toBe("journey_fyp_to_lumaspace");
    expect(journey.source).toBe("fyp");
    expect(journey.destination).toBe("lumaspace");
    expect(journey.passed).toBe(true);
    expect(journey.steps.map((step) => step.id)).toContain("memory");
    expect(journey.steps.map((step) => step.id)).toContain("trust");
  });

  it("validates LumaSpace to LumaLink as a conversation journey", () => {
    const journey = runLumaSpaceToLumaLinkJourney();

    expect(journey.id).toBe("journey_lumaspace_to_lumalink");
    expect(journey.source).toBe("lumaspace");
    expect(journey.destination).toBe("lumalink");
    expect(journey.passed).toBe(true);
    expect(journey.steps.find((step) => step.id === "transformed")?.detail).toBe("conversation_card");
  });

  it("validates external connectivity journey with QR, embed, API, and federation", () => {
    const journey = runExternalConnectivityJourney("https://lumora.app");

    expect(journey.id).toBe("journey_external_connectivity");
    expect(journey.destination).toBe("external");
    expect(journey.passed).toBe(true);
    expect(journey.steps.map((step) => step.id)).toContain("qr");
    expect(journey.steps.map((step) => step.id)).toContain("federation");
  });

  it("summarizes all E2E journeys as ready", () => {
    const journeys = [
      runFypToLumaSpaceJourney(),
      runLumaSpaceToLumaLinkJourney(),
      runExternalConnectivityJourney("https://lumora.app"),
    ];

    const summary = summarizeShareJourneys(journeys);

    expect(summary.total).toBe(3);
    expect(summary.passed).toBe(3);
    expect(summary.ready).toBe(true);
    expect(summary.score).toBe(1);
  });

  it("verifies phase 01 and phase 02 locks exist before E2E certification", () => {
    expect(fs.existsSync(".lumora_usl_visual_phase_01_lock")).toBe(true);
    expect(fs.existsSync(".lumora_usl_visual_phase_02_lock")).toBe(true);
    expect(fs.existsSync(".lumora_usl_full_system_final_audit_lock")).toBe(true);
  });
});
