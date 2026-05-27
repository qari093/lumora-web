import { describe, expect, it } from "vitest";
import { validateUpload } from "@/core/uploads/runtime";

describe("uploads runtime", () => {
  it("validates upload", () => {
    expect(validateUpload("video.mp4")).toBe(true);
  });
});
