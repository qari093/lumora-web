import fs from "node:fs";

const PORTALS = [
  { slug: "fyp", file: "app/fyp/page.tsx", marker: "LUMORA_PORTAL_ALIVE_FYP" },
  { slug: "gmar", file: "app/gmar/page.tsx", marker: "LUMORA_PORTAL_ALIVE_GMAR" },
  { slug: "videos", file: "app/videos/page.tsx", marker: "LUMORA_PORTAL_ALIVE_VIDEOS" },
  { slug: "nexa", file: "app/nexa/page.tsx", marker: "LUMORA_PORTAL_ALIVE_NEXA" },
  { slug: "movies", file: "app/movies/page.tsx", marker: "LUMORA_PORTAL_ALIVE_MOVIES" },
  { slug: "live", file: "app/live/page.tsx", marker: "LUMORA_PORTAL_ALIVE_LIVE" },
  { slug: "share", file: "app/share/page.tsx", marker: "LUMORA_PORTAL_ALIVE_SHARE" },
  { slug: "celebrations", file: "app/celebrations/page.tsx", marker: "LUMORA_PORTAL_ALIVE_CELEBRATIONS" },
];

describe("portal non-empty guards (file-level)", () => {
  for (const p of PORTALS) {
    test(`${p.slug}: page has marker + items.map`, () => {
      expect(fs.existsSync(p.file), `missing ${p.file}`).toBe(true);
      const s = fs.readFileSync(p.file, "utf8");
      expect(s.includes(p.marker), `missing marker ${p.marker} in ${p.file}`).toBe(true);
      expect(/items\s*=\s*\[/.test(s), `missing items array in ${p.file}`).toBe(true);
      expect(/items\.map/.test(s), `missing items.map in ${p.file}`).toBe(true);
    });
  }
});
