import { describe, expect, test } from "vitest";
import { config, middleware } from "../../middleware";

type NextUrlLike = URL & { clone: () => URL };

type ReqLike = { nextUrl: NextUrlLike };

function mkNextUrl(pathname: string): NextUrlLike {
  const u = new URL(`http://localhost:8088${pathname}`) as NextUrlLike;
  u.clone = () => new URL(u.toString());
  return u;
}

function mkReq(pathname: string): ReqLike {
  return { nextUrl: mkNextUrl(pathname) };
}

describe("middleware rewrite unit (no network)", () => {
  test("config.matcher does not include /api/_health", () => {
    expect(Array.isArray((config as any).matcher)).toBe(true);
    // @ts-expect-error runtime shape
    expect((config as any).matcher).not.toContain("/api/_health");
  });

  test("/api/health does not rewrite", () => {
    const res = middleware(mkReq("/api/health") as any);
    const hdr = (res as any).headers?.get?.("x-middleware-rewrite") ?? null;
    expect(hdr).toBeNull();
  });

  test("/api/healthz does not rewrite", () => {
    const res = middleware(mkReq("/api/healthz") as any);
    const hdr = (res as any).headers?.get?.("x-middleware-rewrite") ?? null;
    expect(hdr).toBeNull();
  });
});
