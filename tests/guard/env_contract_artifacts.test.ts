import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

describe("deploy env contract artifacts", () => {
  it("env_contract.json exists + shape ok", () => {
    const p = path.join(process.cwd(), "artifacts", "deploy", "env_contract.json");
    expect(fs.existsSync(p)).toBe(true);
    const j = JSON.parse(fs.readFileSync(p, "utf8"));
    expect(j).toHaveProperty("ok", true);
    expect(Array.isArray(j.required)).toBe(true);
    expect(Array.isArray(j.optional)).toBe(true);
    expect(typeof j.ts).toBe("number");
  });

  it("env_required.txt exists (even if empty)", () => {
    const p = path.join(process.cwd(), "artifacts", "deploy", "env_required.txt");
    expect(fs.existsSync(p)).toBe(true);
  });
});
