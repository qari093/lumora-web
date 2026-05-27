import { describe, expect, it } from "vitest";

import { createWeeklyWhisper } from "../../src/core/lumexa/echoes/echoesRealm";

describe("Lumexa Echoes Realm", () => {
  it("creates whisper", () => {
    const result = createWeeklyWhisper(10);

    expect(result.visible).toBe(true);
  });
});
