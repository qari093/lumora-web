import { describe, expect, it } from "vitest";
import fs from "node:fs";
import {
  getFyp94VimeoDirectMp4,
  isFyp94AllowedVimeoLicense,
  normalizeFyp94VimeoCandidate,
  validateFyp94VimeoCandidate,
} from "../../src/lib/fyp94/vimeo/gate";

describe("FYP94 Pack 12 — Vimeo CC Strict Gate", () => {
  it("allows only cc-by license", () => {
    expect(isFyp94AllowedVimeoLicense("cc-by")).toBe(true);
    expect(isFyp94AllowedVimeoLicense("cc-by-nc")).toBe(false);
    expect(isFyp94AllowedVimeoLicense("unknown")).toBe(false);
  });

  it("requires direct mp4 URL", () => {
    expect(
      getFyp94VimeoDirectMp4({
        download: [{ link: "https://example.com/video.mp4", type: "video/mp4" }],
      }),
    ).toContain(".mp4");

    expect(getFyp94VimeoDirectMp4({ download: [] })).toBe(null);
  });

  it("rejects unsafe candidates automatically", () => {
    expect(
      validateFyp94VimeoCandidate({
        id: "1",
        license: "cc-by-nc",
        download: [{ link: "https://example.com/video.mp4", type: "video/mp4" }],
      }).ok,
    ).toBe(false);

    expect(
      validateFyp94VimeoCandidate({
        id: "1",
        license: "cc-by",
        download: [],
      }).ok,
    ).toBe(false);
  });

  it("normalizes valid Vimeo CC candidate", () => {
    const out = normalizeFyp94VimeoCandidate({
      id: "v1",
      name: "Open Clip",
      link: "https://vimeo.com/1",
      license: "cc-by",
      download: [{ link: "https://example.com/open.mp4", type: "video/mp4" }],
    });

    expect(out.source).toBe("vimeo");
    expect(out.license).toBe("cc-by");
    expect(out.mp4Url).toContain(".mp4");
  });

  it("has Vimeo docs and manifest merge stub", () => {
    expect(fs.existsSync("scripts/fyp94/vimeo_cc_ingest_stub.mjs")).toBe(true);

    const doc = fs.readFileSync("docs/fyp94/VIMEO_CC_STRICT_GATE.md", "utf8");
    expect(doc).toContain("Only license `cc-by` is allowed");
    expect(doc).toContain("Direct MP4 URL is required");
  });
});
