import { describe, expect, it } from "vitest";
import { progressionDatabaseHealthy } from "../../../src/core/gmar/progression-db/runtime";

describe("GMAR Pack 27 — Civilization Progression Database", () => {
  it("validates progression database", () => {
    const db = progressionDatabaseHealthy();

    expect(db.playerProgression).toBe(true);
    expect(db.squadProgression).toBe(true);
    expect(db.rollbackSafe).toBe(true);
  });
});
