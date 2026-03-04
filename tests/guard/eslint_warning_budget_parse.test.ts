import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";

function parseWarnings(all: string) {
  const lines = all.split(/\r?\n/);
  const hits: Array<{ file: string; line: number; col: number; rule: string; message: string }> = [];
  let currentFile = "";
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (l.startsWith("./") || l.startsWith("app/") || l.startsWith("components/") || l.startsWith("lib/") || l.startsWith("src/")) {
      if (/\.(ts|tsx|js|jsx)$/.test(l.trim())) currentFile = l.trim().replace(/^\.\//, "");
      continue;
    }
    const m = l.match(/^(\d+):(\d+)\s+Warning:\s+(.*)\s+([@\w/-]+)$/);
    if (m && currentFile) {
      hits.push({
        file: currentFile,
        line: Number(m[1]),
        col: Number(m[2]),
        message: m[3].trim(),
        rule: m[4].trim(),
      });
    }
  }
  return hits;
}

describe("eslint warning parser", () => {
  test("parses Next.js warning blocks", () => {
    const sample = [
      "./app/(diag)/offline-diagnostics/page.tsx",
      "102:3  Warning: The 'refresh' function makes the dependencies of useEffect Hook (at line 168) change on every render. To fix this, wrap the definition of 'refresh' in its own useCallback() Hook.  react-hooks/exhaustive-deps",
      "",
      "./app/api/portals/alive/route.ts",
      "56:11  Warning: 'ok' is assigned a value but never used. Allowed unused vars must match /^_/u.  @typescript-eslint/no-unused-vars",
      "",
    ].join("\n");
    const hits = parseWarnings(sample);
    expect(hits.length).toBe(2);
    expect(hits[0].file).toContain("app/(diag)/offline-diagnostics/page.tsx");
    expect(hits[0].line).toBe(102);
    expect(hits[0].rule).toBe("react-hooks/exhaustive-deps");
    expect(hits[1].rule).toBe("@typescript-eslint/no-unused-vars");
  });
});
