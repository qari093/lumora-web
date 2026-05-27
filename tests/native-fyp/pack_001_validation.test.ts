import { describe, expect, it } from "vitest";
import {
  assertNativeFypSourceAllowed,
  isNativeFypSourceAllowed,
  NATIVE_FYP_PROHIBITED_SOURCES,
} from "../../src/lib/native-fyp/policy";
import { validateNativeFypVideo } from "../../src/lib/native-fyp/schema";

describe("native fyp pack 001", () => {
  it("allows only native-safe sources", () => {
    expect(isNativeFypSourceAllowed("creator_upload")).toBe(true);
    expect(isNativeFypSourceAllowed("youtube_iframe")).toBe(false);
    expect(() => assertNativeFypSourceAllowed("youtube_iframe")).toThrow();
  });

  it("locks prohibited sources", () => {
    expect(NATIVE_FYP_PROHIBITED_SOURCES).toContain("youtube_iframe");
    expect(NATIVE_FYP_PROHIBITED_SOURCES).toContain("unknown_rights");
  });

  it("validates native video schema", () => {
    const result = validateNativeFypVideo({
      id: "v1",
      title: "Native clip",
      sourceType: "creator_upload",
      playbackUrl: "https://cdn.lumora.local/v1.mp4",
      posterUrl: "https://cdn.lumora.local/v1.jpg",
      durationSeconds: 20,
      createdAt: new Date().toISOString(),
    });

    expect(result.ok).toBe(true);
  });
});
