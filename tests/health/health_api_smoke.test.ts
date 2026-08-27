import { describe, expect, it } from "vitest";
import { invokeGET } from "../_helpers/next.routeInvoke";

describe("/api/health (in-process)", () => {
  it("returns canonical health body", async () => {
    const result = await invokeGET("/api/health");

    expect(result.status).toBe(200);
    expect(result.body).not.toBeNull();
    expect(typeof result.body).toBe("object");
    expect(Array.isArray(result.body)).toBe(false);
    expect(result.body.ok).toBe(true);
    expect(typeof result.body.service).toBe("string");
  });
});
