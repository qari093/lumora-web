import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

describe("prod runtime smoke helper", () => {
  it("exists + executable", () => {
    const p = path.join(process.cwd(), "scripts", "guard", "prod_runtime_smoke.sh");
    expect(fs.existsSync(p)).toBe(true);
    const st = fs.statSync(p);
    expect((st.mode & 0o111) !== 0).toBe(true);
  });
});
