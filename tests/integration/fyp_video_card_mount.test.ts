import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("FYP video card mount", () => {
  it("mounts signal bridge inside video card", () => {
    const file = fs.readFileSync("components/fyp/FypVideoCard.tsx", "utf8");

    expect(file).toContain("FypRuntimeVideoSignalBridge");
    expect(file).toContain("currentTimeMs");
    expect(file).toContain("videoRef");
    expect(file).toContain("timeupdate");
  });
});
