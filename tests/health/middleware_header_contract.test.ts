import { describe, expect, it } from "vitest";
import { invokeGET } from "../_helpers/next.routeInvoke";

describe("middleware header contract (in-process)", () => {
  it("GET /api/_health returns JSON when present or 404 when retired", async () => {
    const result = await invokeGET("/api/_health");

    if (result.status === 404) {
      expect(result.body).toMatchObject({
        ok: false,
        error: "route_not_found",
      });
      return;
    }

    expect(result.status).toBe(200);
    expect(result.body).not.toBeNull();
    expect(typeof result.body).toBe("object");
    expect(Array.isArray(result.body)).toBe(false);
  });

  it("GET /api/health does not include x-middleware-rewrite header", async () => {
    const result = await invokeGET("/api/health");

    expect(result.status).toBe(200);
    expect(result.body).not.toBeNull();
    expect(typeof result.body).toBe("object");

    const headers = result.headers ?? {};
    expect(headers["x-middleware-rewrite"]).toBeUndefined();
  });
});
