import { describe, expect, it } from "vitest";
import { saveMoment } from "@/core/memory/runtime";

describe("save moment runtime", () => {
  it("saves a moment", async () => {
    const result = await saveMoment("moment_1");
    expect(result.saved).toBe(true);
  });
});
