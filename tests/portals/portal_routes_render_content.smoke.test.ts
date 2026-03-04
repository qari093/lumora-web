import fs from "node:fs";

const CASES = [
  { slug: "fyp", file: "app/fyp/page.tsx" },
  { slug: "gmar", file: "app/gmar/page.tsx" },
  { slug: "videos", file: "app/videos/page.tsx" },
  { slug: "nexa", file: "app/nexa/page.tsx" },
  { slug: "movies", file: "app/movies/page.tsx" },
  { slug: "live", file: "app/live/page.tsx" },
  { slug: "share", file: "app/share/page.tsx" },
  { slug: "celebrations", file: "app/celebrations/page.tsx" },
];

describe("portal routes render content (smoke; file-level)", () => {
  for (const c of CASES) {
    test(`${c.slug}: has h1 title attribute`, () => {
      expect(fs.existsSync(c.file), `missing ${c.file}`).toBe(true);
      const s = fs.readFileSync(c.file, "utf8").toLowerCase();
      expect(s).toContain(`title="${c.slug}"`);
    });
  }
});
