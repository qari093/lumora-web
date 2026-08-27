import { describe, expect, it } from "vitest";
import { invokeGET } from "../_helpers/next.routeInvoke";

describe("/api/version (in-process)", () => {
  it("returns canonical version metadata", async () => {
    const result = await invokeGET("/api/version");

    expect(result.status).toBe(200);
    expect(result.body).not.toBeNull();
    expect(typeof result.body).toBe("object");
    expect(Array.isArray(result.body)).toBe(false);
    expect(result.body.ok).toBe(true);
    expect(typeof result.body.service).toBe("string");
    expect(typeof result.body.version).toBe("string");
    expect(typeof result.body.checkedAt).toBe("string");
  });
});
