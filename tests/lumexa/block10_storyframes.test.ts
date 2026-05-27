import { describe, expect, it } from "vitest";

import { resolveStoryframe } from "../../src/core/lumexa/storyframes/storyframeEngine";

describe("Lumexa Storyframes", () => {
  it("creates quiet storyframe", () => {
    const result = resolveStoryframe(0.1);

    expect(result.arc).toBe("quiet_day");
  });

  it("creates energetic storyframe", () => {
    const result = resolveStoryframe(0.9);

    expect(result.arc).toBe("rising_wave");
  });
});
