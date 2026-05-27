import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("dashboard nav target", () => {
  it("does not route Dashboard nav to launch dashboard", () => {
    const files = ["app", "components", "src"]
      .filter((d) => fs.existsSync(d))
      .flatMap((d) => collect(d));

    const combined = files.map((f) => fs.readFileSync(f, "utf8")).join("\n");

    expect(combined).not.toContain('href="/dashboard"');
    expect(combined).toContain('href="/creator/dashboard"');
  });
});

function collect(dir: string): string[] {
  const out: string[] = [];
  for (const item of fs.readdirSync(dir)) {
    const path = `${dir}/${item}`;
    const stat = fs.statSync(path);
    if (stat.isDirectory()) out.push(...collect(path));
    else if (/\.(tsx|ts|jsx|js)$/.test(path)) out.push(path);
  }
  return out;
}
