import { describe, expect, it } from "vitest";
import {
  calculateUploadBond,
  canAcceptUpload,
  createIngestionStartPayload,
  requiresProofOfWork,
  validateUploadCandidate,
} from "@/src/content-engine/ingestion";

const validFile = {
  fileName: "clip.mp4",
  mimeType: "video/mp4",
  sizeBytes: 50 * 1024 * 1024,
  durationSec: 30,
  width: 1280,
  height: 720,
  codec: "h264",
  hasAudio: true,
};

describe("Content Engine Pack02 — Ingestion Gate + Upload Bond", () => {
  it("accepts valid client-side upload candidate", () => {
    const result = validateUploadCandidate(validFile);

    expect(result.ok).toBe(true);
    expect(result.idealDuration).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("rejects unsafe or non-compliant upload candidates", () => {
    const result = validateUploadCandidate({
      ...validFile,
      hasAudio: false,
      durationSec: 120,
      codec: "vp9",
    });

    expect(result.ok).toBe(false);
    expect(result.errors).toContain("audio_required");
    expect(result.errors).toContain("duration_out_of_bounds");
    expect(result.errors).toContain("unsupported_codec");
  });

  it("requires proof of work after abuse threshold", () => {
    expect(requiresProofOfWork({
      deviceId: "d1",
      failedAttempts: 3,
      uploadsToday: 1,
      holdRate: 0,
      skipRate: 1,
    })).toBe(true);

    expect(requiresProofOfWork({
      deviceId: "d1",
      failedAttempts: 0,
      uploadsToday: 5,
      holdRate: 0,
      skipRate: 1,
    })).toBe(true);
  });

  it("calculates upload bond from creator quality signals", () => {
    const bond = calculateUploadBond({
      deviceId: "d1",
      failedAttempts: 0,
      uploadsToday: 2,
      holdRate: 0.6,
      skipRate: 0.2,
    });

    expect(bond.trusted).toBe(true);
    expect(bond.dailyLimit).toBe(10);
    expect(bond.uploadsRemaining).toBe(8);
  });

  it("creates ingestion start payload after validation", () => {
    const acceptance = canAcceptUpload({
      deviceId: "d1",
      failedAttempts: 0,
      uploadsToday: 1,
      holdRate: 0.5,
      skipRate: 0.2,
    });

    const payload = createIngestionStartPayload({
      contentId: "content1",
      deviceId: "d1",
      file: validFile,
    });

    expect(acceptance.ok).toBe(true);
    expect(payload.status).toBe("client-validated");
    expect(payload.hasAudio).toBe(true);
  });
});
