import { expect, test } from "@playwright/test";

const pageRoutes = [
  "/",
  "/login",
  "/signup",
  "/fyp",
  "/live",
  "/lumaspace",
  "/lumalink",
  "/zendoro",
  "/lumexa/shop",
  "/creator",
  "/dashboard",
] as const;

const apiRoutes = [
  "/api/healthz",
  "/api/fyp/health",
  "/api/live/health",
  "/api/lumaspace/ping",
  "/api/lumalink/health",
] as const;

test.describe("Pack 09 production browser smoke", () => {
  for (const route of pageRoutes) {
    test(`${route} renders without browser failure`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));

      const response = await page.goto(route, {
        waitUntil: "domcontentloaded",
        timeout: 30_000,
      });

      expect(response, `${route} did not return a document response`).not.toBeNull();
      expect(response?.status(), `${route} returned an HTTP failure`).toBeLessThan(500);
      await expect(page.locator("body")).not.toBeEmpty();
      expect(errors, `${route} raised uncaught browser errors`).toEqual([]);
    });
  }

  for (const route of apiRoutes) {
    test(`${route} returns a healthy HTTP response`, async ({ request }) => {
      const response = await request.get(route);
      expect(response.status(), `${route} returned an HTTP failure`).toBeLessThan(500);
      expect(await response.text()).not.toBe("");
    });
  }
});
