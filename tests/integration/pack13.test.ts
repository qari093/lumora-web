import { describe, it, expect } from "vitest";
import { enableCreatorOnlyShare } from "@/src/lib/integration/share-memory/creatorOnlyShare";
import { enforceDelay, SHARE_DELAY } from "@/src/lib/integration/share-memory/delayGate";
import { createMemoryPage } from "@/src/lib/integration/share-memory/memoryPage";
import { attachPresentation } from "@/src/lib/integration/share-memory/presentation";
import { validatePage } from "@/src/lib/integration/share-memory/validate";

describe("Pack13", () => {
  it("creator only", () => {
    expect(enableCreatorOnlyShare({ requesterId:"c1", creatorId:"c1", memoryId:"m1"}).allowed).toBe(true);
  });

  it("delay", () => {
    expect(enforceDelay({ start:0, now:SHARE_DELAY }).allowed).toBe(true);
  });

  it("page", () => {
    const p = createMemoryPage("m1");
    expect(p.url).toBe("/memory/m1");
  });

  it("presentation", () => {
    const p = attachPresentation(createMemoryPage("m1"), ["a","a","b"]);
    expect(p.silhouettes.length).toBe(2);
  });

  it("validate", () => {
    expect(validatePage(createMemoryPage("m1")).ok).toBe(true);
  });
});
