import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("FYP video component signal bridge", () => {
  it("wires present hold and rewatch signals", () => {
    const file = fs.readFileSync("components/fyp/FypRuntimeVideoSignalBridge.tsx", "utf8");

    expect(file).toContain('"use client"');
    expect(file).toContain("pushClientSignal");
    expect(file).toContain('type: "present"');
    expect(file).toContain('type: "hold"');
    expect(file).toContain('type: "rewatch"');
    expect(file).toContain("setTimeout");
  });
});
