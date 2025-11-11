import { GET as stateGET } from "../app/api/lumaspace/state/route";

describe("LumaSpace /api/lumaspace/state", () => {
  it("returns a valid state payload with schemaVersion", async () => {
    const res = await stateGET();
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(json.schemaVersion).toBe(1);
    expect(["demo", "beta", "live"]).toContain(json.mode);
    expect(Array.isArray(json.sections)).toBe(true);
    expect(json.sections.length).toBeGreaterThan(0);
  });
});
