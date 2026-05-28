import { describe, expect, it } from "vitest";
import { createSocialMemoryObject } from "@/lib/social/socialMemoryObject";

describe("social memory", () => {
  it("creates permanent shared memory object", () => {
    const item = createSocialMemoryObject("squad-echo", 4);
    expect(item.permanent).toBe(true);
    expect(item.participants).toBe(4);
  });
});
