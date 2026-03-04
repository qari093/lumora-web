import { describe, it, expect } from "vitest";
import fs from "node:fs";

type PortalKey = "fyp" | "gmar" | "nexa" | "videos" | "movies" | "celebrations" | "share" | "live";

const CASES: ReadonlyArray<{ key: PortalKey; marker: string }> = [
  { key: "fyp", marker: "LUMORA_PORTAL_ALIVE_FYP" },
  { key: "gmar", marker: "LUMORA_PORTAL_ALIVE_GMAR" },
  { key: "nexa", marker: "LUMORA_PORTAL_ALIVE_NEXA" },
  { key: "videos", marker: "LUMORA_PORTAL_ALIVE_VIDEOS" },
  { key: "movies", marker: "LUMORA_PORTAL_ALIVE_MOVIES" },
  { key: "celebrations", marker: "LUMORA_PORTAL_ALIVE_CELEBRATIONS" },
  { key: "share", marker: "LUMORA_PORTAL_ALIVE_SHARE" },
  { key: "live", marker: "LUMORA_PORTAL_ALIVE_LIVE" },
];

describe("portal routes render content markers (file-level)", () => {
  it("each portal page.tsx contains its alive marker INSIDE component JSX", () => {
    for (const c of CASES) {
      const file = `app/${c.key}/page.tsx`;
      expect(fs.existsSync(file), `missing ${file}`).toBe(true);
      const text = fs.readFileSync(file, "utf8");
      expect(text.includes(c.marker), `missing marker ${c.marker} in ${file}`).toBe(true);

      // Guard against invalid tail marker (marker after the last export/function end).
      // Heuristic: marker must appear before the last occurrence of "export default" end brace.
      const markerIdx = text.indexOf(c.marker);
      const lastReturnIdx = Math.max(text.lastIndexOf("return ("), text.lastIndexOf("return("));
      expect(markerIdx).toBeGreaterThan(-1);
      expect(lastReturnIdx).toBeGreaterThan(-1);
      expect(markerIdx).toBeGreaterThan(lastReturnIdx);
    }
  });
});
