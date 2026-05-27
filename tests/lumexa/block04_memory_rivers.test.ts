import { describe, expect, it } from "vitest";

import { createDreamThread } from "../../src/core/lumexa/memory/dreamThreads";

describe("Lumexa Memory Rivers", () => {
  it("creates dream thread", () => {
    const result = createDreamThread(1);

    expect(result.shape).toBe("returning_spiral");
  });
});
