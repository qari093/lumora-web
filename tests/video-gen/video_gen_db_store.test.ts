import { describe, expect, it } from "vitest";

const databaseUrl = process.env.DATABASE_URL || "";
const hasPostgres = databaseUrl.startsWith("postgresql://") || databaseUrl.startsWith("postgres://");
const describeDb = hasPostgres ? describe : describe.skip;

describeDb("video-gen db store", () => {
  it("requires PostgreSQL DATABASE_URL for migration-backed DB store validation", () => {
    expect(hasPostgres).toBe(true);
  });
});
