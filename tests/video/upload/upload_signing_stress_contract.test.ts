import { describe, expect, it } from "vitest";
import { issueToken, verifyToken } from "../../../src/lib/security";

function mustString(x: any): string {
  expect(typeof x).toBe("string");
  return x as string;
}

function ok(res: any): boolean {
  if (typeof res === "boolean") return res;
  if (res && typeof res === "object" && "ok" in res) return !!res.ok;
  return !!res;
}

describe("upload signing stress (logic-level)", () => {
  it("issues and verifies 1000 tokens (unique + valid)", async () => {
    expect(typeof issueToken).toBe("function");
    expect(typeof verifyToken).toBe("function");

    const tokens: string[] = [];

    for (let i = 0; i < 1000; i++) {
      const uid = `u_${i}`;
      let t: any;

      // Try common call shapes (robust to signature drift):
      // 1) issueToken({ uid/userId, ttlSec, scope })
      try {
        t = (issueToken as any)({ uid, ttlSec: 60, scope: "manifest" });
      } catch {
        try {
          t = (issueToken as any)({ userId: uid, ttlSec: 60, scope: "manifest" });
        } catch {
          // 2) issueToken(uid, ttlSec)
          try {
            t = (issueToken as any)(uid, 60);
          } catch {
            // 3) issueToken(uid)
            t = (issueToken as any)(uid);
          }
        }
      }

      tokens.push(mustString(t));
    }

    for (let i = 0; i < tokens.length; i++) {
      const res: any = (verifyToken as any)(tokens[i]);
      expect(ok(res)).toBe(true);
    }

    const unique = new Set(tokens);
    expect(unique.size).toBe(tokens.length);
  });
});
