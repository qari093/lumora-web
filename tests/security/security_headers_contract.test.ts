import { describe, it, expect } from "vitest";
import { invokeGET } from "../_helpers/next.routeInvoke";

function getHeader(res: any, name: string): string | undefined {
  const h = res?.headers || {};
  const key = Object.keys(h).find((k) => k.toLowerCase() === name.toLowerCase());
  return key ? String(h[key]) : undefined;
}

describe("security headers contract", () => {
  it("API route returns security headers", async () => {
    const res = await invokeGET("/api/health");
    expect(res.status).toBe(200);
    expect(getHeader(res, "x-content-type-options")).toBe("nosniff");
    expect(getHeader(res, "x-frame-options")).toBe("DENY");
    expect(getHeader(res, "referrer-policy")).toBe("strict-origin-when-cross-origin");
    const pp = getHeader(res, "permissions-policy") || "";
    expect(pp.includes("camera=()")).toBe(true);
  });

  it("Page route returns security headers", async () => {
    const res = await invokeGET("/alive");
    // /alive is a page route; in-process harness may return 200/404 depending on tree — accept >=200 <500.
    expect(res.status).toBeGreaterThanOrEqual(200);
    expect(res.status).toBeLessThan(500);
    expect(getHeader(res, "x-content-type-options")).toBe("nosniff");
    expect(getHeader(res, "x-frame-options")).toBe("DENY");
  });
});
