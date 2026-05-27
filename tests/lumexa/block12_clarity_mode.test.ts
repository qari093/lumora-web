import { describe, expect, it } from "vitest";

import { resolveClarityMode } from "../../src/core/lumexa/clarity/clarityMode";

describe("Lumexa Clarity Mode", () => {
  it("enables clarity mode", () => {
    const result = resolveClarityMode(true);

    expect(result.animations).toBe(false);
  });

  it("supports atmosphere mode", () => {
    const result = resolveClarityMode(false);

    expect(result.fog).toBe(true);
  });
});
