import { describe, expect, it } from "vitest";
import { validateRightsForNativeFyp, assertRightsForNativeFyp } from "../../src/lib/native-fyp/rights/guard";
import { appendRightsAuditEvent, createRightsAuditEvent } from "../../src/lib/native-fyp/rights/audit";
import { createLocalNativeFypStorage } from "../../src/lib/native-fyp/storage/local";
import { createR2LikeNativeFypStorage } from "../../src/lib/native-fyp/storage/r2";
import { buildNativeFypObjectKey } from "../../src/lib/native-fyp/storage/paths";

const validVideo = {
  id: "v1",
  title: "Native clip",
  sourceType: "creator_upload",
  rightsStatus: "verified",
  licenseType: "creator_grant",
  playbackUrl: "https://cdn.lumora.local/v1.mp4",
  posterUrl: "https://cdn.lumora.local/v1.jpg",
  durationSeconds: 20,
  createdAt: new Date().toISOString(),
} as const;

describe("native fyp pack 003", () => {
  it("allows only verified-rights content", () => {
    expect(validateRightsForNativeFyp(validVideo).allowed).toBe(true);
    expect(() => assertRightsForNativeFyp(validVideo)).not.toThrow();

    expect(validateRightsForNativeFyp({
      ...validVideo,
      rightsStatus: "unknown",
    }).allowed).toBe(false);
  });

  it("creates rights audit events", () => {
    const event = createRightsAuditEvent({
      videoId: "v1",
      action: "rights_verified",
    });

    const history = appendRightsAuditEvent([], event);
    expect(history).toHaveLength(1);
    expect(history[0].at).toBeTruthy();
  });

  it("supports local storage fallback", async () => {
    const storage = createLocalNativeFypStorage("tmp/native-fyp-test");
    const result = await storage.putObject({
      key: "clips/test.txt",
      body: "ok",
      contentType: "text/plain",
    });

    expect(result.publicUrl).toContain("/native-fyp/");
    expect((await storage.healthCheck()).ok).toBe(true);
  });

  it("supports r2-like adapter", async () => {
    const storage = createR2LikeNativeFypStorage({
      publicBaseUrl: "https://cdn.lumora.test",
    });

    expect(storage.getPublicUrl("clips/a.mp4")).toBe("https://cdn.lumora.test/clips/a.mp4");
    expect((await storage.healthCheck()).provider).toBe("r2-like");
  });

  it("builds safe upload object paths", () => {
    const key = buildNativeFypObjectKey({
      userId: "u/1",
      videoId: "v:1",
      filename: "clip one.mp4",
    });

    expect(key).toBe("uploads/u_1/v_1/clip_one.mp4");
  });
});
