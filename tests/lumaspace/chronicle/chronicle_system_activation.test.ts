import { describe, expect, it } from "vitest";

import {
  validateChroniclePage,
  validateLifeChapter,
  validateChronicleRuntime
} from "@/src/core/lumaspace/chronicle/contracts/chronicleContract";

import {
  createChroniclePages
} from "@/src/core/lumaspace/chronicle/journal/chroniclePages";

import {
  createLifeChapter
} from "@/src/core/lumaspace/chronicle/runtime/lifeChapter";

import {
  runChronicleRuntime
} from "@/src/core/lumaspace/chronicle/runtime/chronicleRuntime";

describe("LumaSpace Chronicle System Activation", () => {
  it("creates chronicle pages", () => {
    const pages = createChroniclePages();

    expect(
      validateChroniclePage(pages[0])
    ).toBe(true);
  });

  it("creates life chapter", () => {
    const chapter = createLifeChapter();

    expect(
      validateLifeChapter(chapter)
    ).toBe(true);
  });

  it("runs chronicle runtime", () => {
    const runtime = runChronicleRuntime();

    expect(
      validateChronicleRuntime(runtime)
    ).toBe(true);

    expect(
      runtime.chapter.id
    ).toBe("chapter_001");
  });
});
