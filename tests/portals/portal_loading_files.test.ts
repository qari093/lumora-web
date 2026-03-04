import fs from "node:fs";

const SLUGS = ["fyp","gmar","videos","nexa","movies","live","share","celebrations"];

describe("portal loading states (files)", () => {
  test("each portal route has loading.tsx", () => {
    for (const slug of SLUGS) {
      const f = `app/${slug}/loading.tsx`;
      expect(fs.existsSync(f), `missing ${f}`).toBe(true);
    }
  });
});
