import { describe, expect, it } from "vitest";

import {
  validateMediaAsset,
  validateStreamSession,
  validateMediaRuntime
} from "@/src/core/lumaspace-production/media/contracts/mediaContract";

import {
  createMediaAsset
} from "@/src/core/lumaspace-production/media/storage/mediaStorage";

import {
  createStreamSession
} from "@/src/core/lumaspace-production/media/streaming/streamSession";

import {
  runMediaRuntime
} from "@/src/core/lumaspace-production/media/runtime/mediaRuntime";

describe("LumaSpace Production Pack 06 Media & LumaLens Infrastructure", () => {
  it("creates media asset", () => {
    expect(validateMediaAsset(createMediaAsset("video"))).toBe(true);
  });

  it("creates stream session", () => {
    expect(validateStreamSession(createStreamSession())).toBe(true);
  });

  it("runs media runtime", () => {
    expect(validateMediaRuntime(runMediaRuntime())).toBe(true);
  });
});
