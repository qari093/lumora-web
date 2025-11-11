import { GET as pingGET } from "../app/api/lumaspace/ping/route";

describe("LumaSpace /api/lumaspace/ping", () => {
  it("returns ok: true and metadata", async () => {
    const res = await pingGET();
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(json.service).toBe("LumaSpace");
    expect(typeof json.ts).toBe("string");
    expect(typeof json.unix).toBe("number");
  });
});
