import { describe, expect, it } from "vitest";
import { zencoinDoctrine, doctrineHealthy } from "../../src/core/zencoin/doctrine/coreDoctrine";

describe("Zencoin Pack 01 — Core Doctrine", () => {
  it("locks non crypto doctrine", () => {
    expect(zencoinDoctrine.nonCrypto).toBe(true);
  });

  it("locks safe launch scope", () => {
    expect(zencoinDoctrine.launchScope).toBe("echo-first");
  });

  it("validates doctrine health", () => {
    expect(doctrineHealthy()).toBe(true);
  });
});
