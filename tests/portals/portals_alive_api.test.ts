import { describe, it, expect } from "vitest";
import { invokeGET } from "../_helpers/next.routeInvoke";

describe("/api/portals/alive (in-process)", () => {
  it("returns ok=true and every portal has marker present", async () => {
    const res = await invokeGET("/api/portals/alive");
    expect(res.status).toBe(200);
    const body: any = res.body || {};
    expect(body.ok).toBe(true);
    expect(Array.isArray(body.portals)).toBe(true);
    for (const p of body.portals) {
      expect(p.ok).toBe(true);
      expect(p.dirExists).toBe(true);
      expect(p.pageExists).toBe(true);
      expect(p.hasMarker).toBe(true);
      expect(typeof p.marker).toBe("string");
      expect(typeof p.route).toBe("string");
    }
  });
});
