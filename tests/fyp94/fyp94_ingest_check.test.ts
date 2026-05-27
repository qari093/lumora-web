import { describe, it, expect } from "vitest";
import fs from "node:fs";

describe("Ingestion result",()=>{
  it("has enough clips",()=>{
    const m=JSON.parse(fs.readFileSync("public/native-fyp/real-meta/manifest.json","utf8"));
    expect(m.length).toBeGreaterThan(100);
  });
});
