import { describe, expect, it } from "vitest";
import { invokeGET } from "../_helpers/next.routeInvoke";

describe("/api/ready (in-process)", () => {
  it("returns canonical readiness body", async () => {
    const result = await invokeGET("/api/ready");

    expect(result.status).toBe(200);
    expect(result.body).not.toBeNull();
    expect(typeof result.body).toBe("object");
    expect(Array.isArray(result.body)).toBe(false);
    expect(result.body.ok).toBe(true);
  });
});
