import { describe, expect, it } from "vitest";
import fs from "node:fs";
import {
  createAccessibilityQualityGates,
  createPerformanceQualityGates,
  createReliabilityQualityGates,
  createShareQualityCertification,
  summarizeShareQualityGates,
} from "@/src/core/share";

function read(path: string) {
  return fs.existsSync(path) && fs.statSync(path).isFile() ? fs.readFileSync(path, "utf8") : "";
}

describe("USL Visual Route Integration — Phase 05/06 Performance Accessibility Reliability", () => {
  it("locks performance quality gates", () => {
    const gates = createPerformanceQualityGates();
    const summary = summarizeShareQualityGates(gates);

    expect(gates).toHaveLength(5);
    expect(summary.ready).toBe(true);
    expect(summary.score).toBeGreaterThan(0.9);
    expect(gates.map((gate) => gate.id)).toContain("route_bundle_budget");
    expect(gates.map((gate) => gate.id)).toContain("interaction_latency");
  });

  it("locks accessibility quality gates", () => {
    const gates = createAccessibilityQualityGates();
    const summary = summarizeShareQualityGates(gates);

    expect(gates).toHaveLength(5);
    expect(summary.ready).toBe(true);
    expect(gates.map((gate) => gate.id)).toContain("button_semantics");
    expect(gates.map((gate) => gate.id)).toContain("focus_safe");
    expect(gates.map((gate) => gate.id)).toContain("mobile_safe_area");
  });

  it("locks reliability quality gates", () => {
    const gates = createReliabilityQualityGates();
    const summary = summarizeShareQualityGates(gates);

    expect(gates).toHaveLength(5);
    expect(summary.ready).toBe(true);
    expect(gates.map((gate) => gate.id)).toContain("retry_ready");
    expect(gates.map((gate) => gate.id)).toContain("offline_ready");
    expect(gates.map((gate) => gate.id)).toContain("route_resilience");
  });

  it("verifies route accessibility and fallback files exist", () => {
    const client = read("app/share/ShareDemoClient.tsx");
    const sheet = read("src/components/share/UniversalShareSheet.tsx");
    const loading = read("app/share/loading.tsx");
    const css = read("src/components/share/universal-share-sheet.css");

    expect(client).toContain('data-testid="usl-share-demo-page"');
    expect(sheet).toContain('type="button"');
    expect(sheet).toMatch(/aria-label|data-testid/);
    expect(loading.length).toBeGreaterThan(0);
    expect(css).toMatch(/100svh|safe-area|overflow|min-height/i);
  });

  it("certifies phase 05 quality after prior phase locks", () => {
    const cert = createShareQualityCertification();

    expect(cert.certified).toBe(true);
    expect(cert.summary.total).toBe(15);
    expect(cert.summary.byCategory.performance).toBe(5);
    expect(cert.summary.byCategory.accessibility).toBe(5);
    expect(cert.summary.byCategory.reliability).toBe(5);

    expect(fs.existsSync(".lumora_usl_visual_phase_01_lock")).toBe(true);
    expect(fs.existsSync(".lumora_usl_visual_phase_02_lock")).toBe(true);
    expect(fs.existsSync(".lumora_usl_visual_phase_03_lock")).toBe(true);
    expect(fs.existsSync(".lumora_usl_visual_phase_04_lock")).toBe(true);
  });
});
