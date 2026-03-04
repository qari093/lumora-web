import { describe, expect, it } from "vitest";

describe("auth exports introspection", () => {
  it("prints available exports for manual verification", async () => {
    const mod = await import(process.env.LUMORA_AUTH_IMPORT as string);
    const keys = Object.keys(mod).sort();
    // Keep a minimal assertion so the test is meaningful
    expect(keys.length).toBeGreaterThan(0);
    // Print keys to stdout for diagnosis in CI logs
    // eslint-disable-next-line no-console
    console.log("LUMORA_AUTH_EXPORTS:", keys.join(","));
  });
});
