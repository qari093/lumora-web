import { describe, expect, it } from "vitest";
import fs from "node:fs";
import {
  enforceArchiveStorageCap,
  mapArchivePlaybackUrl,
  needsArchiveConversion,
  passesArchiveResolution,
  validateArchiveFastLoad,
} from "../../src/lib/fyp_archive/performance_storage";

describe("Phase 3 Pack 12 — Archive Performance + Storage", () => {
  it("detects non-mp4 conversion need", () => {
    expect(needsArchiveConversion({ archiveFile: "clip.mov" })).toBe(true);
    expect(needsArchiveConversion({ mp4Url: "clip.mp4" })).toBe(false);
  });

  it("maps local/CDN playback URL", () => {
    expect(mapArchivePlaybackUrl({ localUrl: "/native-fyp/archive/1.mp4" })).toContain(".mp4");
    expect(mapArchivePlaybackUrl({ localUrl: "/native-fyp/archive/1.mp4" }, "https://cdn.example.com")).toContain("cdn.example.com");
  });

  it("enforces storage cap", () => {
    const items = Array.from({ length: 600 }).map((_, i) => ({ id: i + 1 }));
    expect(enforceArchiveStorageCap(items, 500)).toHaveLength(500);
  });

  it("validates 720p resolution baseline", () => {
    expect(passesArchiveResolution({ width: 720, height: 1280 })).toBe(true);
    expect(passesArchiveResolution({ width: 1920, height: 1080 })).toBe(false);
  });

  it("validates fast load size", () => {
    expect(validateArchiveFastLoad({ sizeBytes: 5_000_000 })).toBe(true);
    expect(validateArchiveFastLoad({ sizeBytes: 30_000_000 })).toBe(false);
  });

  it("has conversion helper script", () => {
    expect(fs.existsSync("scripts/fyp_archive/convert_archive_mp4_hint.sh")).toBe(true);
  });
});
