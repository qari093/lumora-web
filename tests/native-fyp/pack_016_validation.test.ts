import { describe, expect, it } from "vitest";
import { buildApiResponse } from "../../src/lib/native-fyp/runtime/apiShape";
import { validateResponse } from "../../src/lib/native-fyp/runtime/validateResponse";
import { ensureFeedContract } from "../../src/lib/native-fyp/runtime/contracts";

const base = {
  sourceType: "lumora_generated",
  rightsStatus: "verified",
  licenseType: "lumora_generated",
  playbackUrl: "/v.mp4",
  posterUrl: "/v.jpg",
  durationSeconds: 10,
  createdAt: new Date().toISOString(),
};

describe("native fyp pack 016", () => {
  it("builds response", () => {
    const items = [{ ...base, id: "1", title: "a" }];
    const res = buildApiResponse(items);
    expect(res.count).toBe(1);
  });

  it("validates response", () => {
    const items = [{ ...base, id: "1", title: "a" }];
    const res = buildApiResponse(items);
    expect(validateResponse(res)).toBe(true);
  });

  it("ensures contract", () => {
    const obj = { ok: true, source: "native_fyp", items: [] };
    expect(ensureFeedContract(obj)).toBe(true);
  });
});
