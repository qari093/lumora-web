import fs from "node:fs";

function mustContain(path: string, needle: string) {
  const s = fs.readFileSync(path, "utf8");
  expect(s.toLowerCase()).toContain(needle.toLowerCase());
}

describe("Portal shell pages smoke", () => {
  it("FYP page has heading", () => mustContain("app/fyp/page.tsx", "title=\"FYP\""));
  it("GMAR page has heading", () => mustContain("app/gmar/page.tsx", "title=\"GMAR\""));
  it("NEXA page has heading", () => mustContain("app/nexa/page.tsx", "title=\"NEXA\""));
  it("Live page has heading", () => mustContain("app/live/page.tsx", "title=\"Live\""));
  it("Videos page has heading", () => mustContain("app/videos/page.tsx", "title=\"Videos\""));
});
