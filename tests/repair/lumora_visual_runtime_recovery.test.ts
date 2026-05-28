import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("Lumora visual runtime recovery", () => {
  it("has recovered homepage, global css, visual css, nav, brand, and portal shell", () => {
    const required = [
      "app/page.tsx",
      "app/layout.tsx",
      "app/globals.css",
      "styles/system/lumora-visual-system.css",
      "components/startup/LumoraBrandMark.tsx",
      "components/navigation/LumoraTopNav.tsx",
      "components/portal/LumoraPortalPage.tsx",
      "lib/runtime/lumoraRuntimeSummary.ts",
      "app/api/runtime-summary/route.ts",
      "app/api/portal-runtime/route.ts",
      "app/api/launch-visual-state/route.ts"
    ];

    for (const file of required) {
      expect(fs.existsSync(file), file).toBe(true);
    }
  });

  it("homepage is not raw placeholder shell", () => {
    const page = fs.readFileSync("app/page.tsx", "utf8");
    expect(page).toContain("Lumora");
    expect(page).toContain("LumoraTopNav");
    expect(fs.readFileSync("components/startup/LumoraBrandMark.tsx", "utf8")).toContain("Lumora");
    expect(page).toContain("/live");
    expect(page).toContain("/gmar");
    expect(page).toContain("/nexa");
    expect(page).toContain("/cineverse");
    expect(page).toContain("/echo");
    expect(page).toContain("/zendoro");
    expect(page).toContain("/zenwallet");
    expect(page).toContain("/creator-hub");
  });

  it("layout imports global and visual css", () => {
    const layout = fs.readFileSync("app/layout.tsx", "utf8");
    expect(layout).toContain("./globals.css");
    expect(layout).toContain("@/styles/system/lumora-visual-system.css");
  });
});
