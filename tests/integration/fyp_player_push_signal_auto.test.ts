import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("FYP player auto signal capture", () => {
  it("creates runtime signal API and polling dashboard bridge", () => {
    expect(fs.existsSync("app/api/runtime/signals/route.ts")).toBe(true);
    expect(fs.existsSync("app/api/runtime/state/route.ts")).toBe(true);

    const stateHook = fs.readFileSync("components/creator-dashboard/useRuntimeState.ts", "utf8");
    const client = fs.readFileSync("src/runtime/clientSignal.ts", "utf8");

    expect(stateHook).toContain("/api/runtime/state");
    expect(stateHook).toContain("setInterval");
    expect(client).toContain("/api/runtime/signals");
    expect(client).toContain("POST");
  });
});
