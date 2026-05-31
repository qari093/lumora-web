import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const routes = [
  { name: "home", candidates: ["app/page.tsx", "app/page.jsx", "pages/index.tsx"] },
  { name: "fyp", candidates: ["app/fyp/page.tsx", "app/fyp/page.jsx", "pages/fyp.tsx"] },
  { name: "live", candidates: ["app/live/page.tsx", "app/live/page.jsx", "pages/live.tsx"] },
  { name: "gmar", candidates: ["app/gmar/page.tsx", "app/gmar/page.jsx", "pages/gmar.tsx"] },
  { name: "lumaspace", candidates: ["app/lumaspace/page.tsx", "app/lumaspace/page.jsx", "pages/lumaspace.tsx"] },
  { name: "zendoro", candidates: ["app/zendoro/page.tsx", "app/zendoro/page.jsx", "pages/zendoro.tsx"] },
  { name: "movies", candidates: ["app/movies/page.tsx", "app/cineverse/page.tsx", "pages/movies.tsx"] },
  { name: "music", candidates: ["app/music/page.tsx", "app/echo/page.tsx", "pages/music.tsx"] },
  { name: "creator", candidates: ["app/creator/page.tsx", "app/creator-hub/page.tsx", "pages/creator.tsx"] },
];

const apis = [
  "app/api/health/route.ts",
  "app/api/ready/route.ts",
  "app/api/fyp/health/route.ts",
  "app/api/live/health/route.ts",
  "app/api/gmar/health/route.ts",
  "app/api/lumaspace/runtime/route.ts",
  "app/api/zendoro/products/route.ts",
  "app/api/zendoro/checkout/route.ts",
  "app/api/wallet/balance/route.ts",
];

function existsAny(candidates: string[]) {
  return candidates.some((candidate) => fs.existsSync(path.join(process.cwd(), candidate)));
}

describe("Lumora main user journey static validation", () => {
  it.each(routes)("has route for $name", (route) => {
    expect(existsAny(route.candidates)).toBe(true);
  });

  it.each(apis)("has API contract %s", (api) => {
    expect(fs.existsSync(path.join(process.cwd(), api))).toBe(true);
  });
});
