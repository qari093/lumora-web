import { describe, expect, it } from "vitest";
import {
  createRuntimeModuleChecks,
  createValidationPoolBridgeCertification,
  createVideoIngestionFinalAudit,
  createVideoIngestionFoundationCertification,
} from "@/src/core/video-ingestion";

describe("Video Ingestion Ω — Pack 10 Foundation Certification", () => {
  it("verifies all foundation runtime modules exist", () => {
    const checks = createRuntimeModuleChecks();

    expect(checks).toHaveLength(9);
    expect(checks.every((check) => check.status === "pass")).toBe(true);
  });

  it("creates foundation certification", () => {
    const certification = createVideoIngestionFoundationCertification();

    expect(certification.version).toBe("video-ingestion-foundation.v1");
    expect(certification.passed).toBe(true);
    expect(certification.score).toBe(1);
  });

  it("keeps FYP + LumaSpace bridge certification ready", () => {
    const bridge = createValidationPoolBridgeCertification();

    expect(bridge.ready).toBe(true);
    expect(bridge.poolSize).toBe(40);
    expect(bridge.failed).toBe(0);
  });

  it("passes final audit when prior locks exist", () => {
    const audit = createVideoIngestionFinalAudit();

    expect(audit.certification.passed).toBe(true);
    expect(audit.lockChecks.every((lock) => lock.exists)).toBe(true);
    expect(audit.passed).toBe(true);
  });
});
