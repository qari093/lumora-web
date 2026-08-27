import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import {
  config,
  middleware,
} from "../../middleware";

describe("middleware health-route contract", () => {
  it("/api/health passes through middleware without rewrite", () => {
    const response = middleware(
      new NextRequest("http://localhost/api/health")
    );

    expect(
      response.headers.get("x-middleware-rewrite")
    ).toBeNull();

    expect(
      response.headers.get("x-lumora-middleware")
    ).toBe("1");
  });

  it("/api/healthz passes through middleware without rewrite", () => {
    const response = middleware(
      new NextRequest("http://localhost/api/healthz")
    );

    expect(
      response.headers.get("x-middleware-rewrite")
    ).toBeNull();

    expect(
      response.headers.get("x-lumora-middleware")
    ).toBe("1");
  });

  it("keeps the canonical matcher broad without legacy special case", () => {
    expect(Array.isArray((config as any).matcher)).toBe(true);
    expect((config as any).matcher).not.toContain("/api/_health");
    expect((config as any).matcher).toContain("/:path*");
  });
});
