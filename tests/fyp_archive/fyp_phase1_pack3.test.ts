import { describe, expect, it } from "vitest";
import {
  ARCHIVE_BASE_QUERIES,
  ARCHIVE_RAW_KEYWORDS,
  ARCHIVE_DECADES,
  buildArchiveQueries,
  attachDecadeMetadata,
  buildEventQueries,
  buildFullArchiveQuerySet,
} from "../../src/lib/fyp_archive/query_engine";

describe("Phase 1 Pack 3 — Archive Query Engine", () => {
  it("has base queries", () => {
    expect(ARCHIVE_BASE_QUERIES.length).toBeGreaterThan(5);
  });

  it("expands with raw keywords", () => {
    const queries = buildArchiveQueries();
    expect(queries.some(q => q.includes("raw"))).toBe(true);
  });

  it("attaches decade metadata", () => {
    const q = attachDecadeMetadata("home movie");
    expect(q.decade).toBeTruthy();
  });

  it("builds event queries", () => {
    const events = buildEventQueries();
    expect(events.some(e => e.includes("crowd"))).toBe(true);
  });

  it("builds full query set with metadata", () => {
    const full = buildFullArchiveQuerySet();
    expect(full.length).toBeGreaterThan(10);
    expect(full[0]).toHaveProperty("query");
    expect(full[0]).toHaveProperty("decade");
  });
});
