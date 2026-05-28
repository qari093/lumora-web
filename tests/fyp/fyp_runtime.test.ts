import { describe, it, expect } from "vitest";
import { buildFeed } from "@/lib/fyp/runtime/feedRuntime";

describe("fyp runtime", () => {
  it("sorts feed by score", () => {
    const result = buildFeed([
      { id: "1", lane: "A", emotion: "wonder", score: 1 },
      { id: "2", lane: "B", emotion: "calm", score: 9 }
    ]);

    expect(result[0].id).toBe("2");
  });
});
